/**
 * Centralized entitlement service — runs inside the stripe-billing Lambda.
 *
 * All plan checks are performed here against DynamoDB (the authoritative
 * subscription store updated by Stripe webhooks). Never trust client-supplied
 * plan information.
 *
 * Usage tracking for AI study sessions uses a dedicated USER_USAGE_TABLE with
 * conditional writes to prevent race conditions.
 */

import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({});

const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE!;
const USER_USAGE_TABLE = process.env.USER_USAGE_TABLE!;

// ─── Constants ────────────────────────────────────────────────────────────────

export const FREE_AI_SESSION_LIMIT = 5;

// Features that require Pro
const PRO_ONLY_FEATURES = new Set([
  "advancedFlashcards",
  "advancedQuizzes",
  "personalizedLearningPlans",
  "progressAnalytics",
  "exportMaterials",
  "fasterAiResponses",
  "prioritySupport",
]);

// ─── Types ────────────────────────────────────────────────────────────────────

export type Plan = "free" | "pro";

export interface FeatureAccess {
  enabled: boolean;
  requiresPro?: true;
  limit?: number | null;
  period?: string | null;
  used?: number | null;
  remaining?: number | null;
  unlimited?: true;
  formats?: string[];
}

export interface Entitlements {
  plan: Plan;
  isPro: boolean;
  features: {
    aiStudySessions: FeatureAccess;
    basicFlashcards: FeatureAccess;
    basicQuizzes: FeatureAccess;
    advancedFlashcards: FeatureAccess;
    advancedQuizzes: FeatureAccess;
    learningTracks: FeatureAccess;
    personalizedLearningPlans: FeatureAccess;
    progressAnalytics: FeatureAccess;
    exportMaterials: FeatureAccess;
    fasterAiResponses: FeatureAccess;
    prioritySupport: FeatureAccess;
  };
}

export interface EntitlementError {
  code: string;
  message: string;
  feature: string;
  limit?: number;
  period?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** UTC date string YYYY-MM-DD */
function todayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

/** Determine if a stored subscription status grants Pro access */
function isProStatus(status: string, cancelAtPeriodEnd: boolean, currentPeriodEnd: string | null): boolean {
  if (status === "active" || status === "trial") {
    // If cancelling but still within period, keep Pro
    if (cancelAtPeriodEnd && currentPeriodEnd) {
      return new Date() < new Date(currentPeriodEnd);
    }
    return true;
  }
  return false;
}

// ─── Core entitlement functions ───────────────────────────────────────────────

/**
 * Get the user's current plan from the authoritative DynamoDB subscriptions table.
 * Falls back to "free" if no record exists.
 */
export async function getUserPlan(userId: string): Promise<Plan> {
  const result = await dynamo.send(
    new GetItemCommand({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: marshall({ userId }),
    }),
  );

  if (!result.Item) return "free";

  const sub = unmarshall(result.Item);
  const status = (sub.status as string) ?? "expired";
  const cancelAtPeriodEnd = (sub.cancelAtPeriodEnd as boolean) ?? false;
  const currentPeriodEnd = (sub.currentPeriodEnd as string) ?? null;

  return isProStatus(status, cancelAtPeriodEnd, currentPeriodEnd) ? "pro" : "free";
}

/**
 * Get today's AI session usage count for a user from DynamoDB.
 */
async function getAiSessionUsageToday(userId: string): Promise<number> {
  const today = todayUTC();

  try {
    const result = await dynamo.send(
      new GetItemCommand({
        TableName: USER_USAGE_TABLE,
        Key: marshall({ userId, featureKey: `ai_session#${today}` }),
      }),
    );

    if (!result.Item) return 0;
    const item = unmarshall(result.Item);
    return (item.usageCount as number) ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Build the full entitlement object for a user.
 */
export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const plan = await getUserPlan(userId);
  const isPro = plan === "pro";

  if (isPro) {
    return {
      plan: "pro",
      isPro: true,
      features: {
        aiStudySessions: { enabled: true, limit: null, period: null, used: null, remaining: null, unlimited: true },
        basicFlashcards: { enabled: true },
        basicQuizzes: { enabled: true },
        advancedFlashcards: { enabled: true },
        advancedQuizzes: { enabled: true },
        learningTracks: { enabled: true },
        personalizedLearningPlans: { enabled: true },
        progressAnalytics: { enabled: true },
        exportMaterials: { enabled: true, formats: ["pdf", "csv"] },
        fasterAiResponses: { enabled: true },
        prioritySupport: { enabled: true },
      },
    };
  }

  // Free plan — fetch usage
  const used = await getAiSessionUsageToday(userId);
  const remaining = Math.max(0, FREE_AI_SESSION_LIMIT - used);

  return {
    plan: "free",
    isPro: false,
    features: {
      aiStudySessions: {
        enabled: true,
        limit: FREE_AI_SESSION_LIMIT,
        period: "day",
        used,
        remaining,
      },
      basicFlashcards: { enabled: true },
      basicQuizzes: { enabled: true },
      advancedFlashcards: { enabled: false, requiresPro: true },
      advancedQuizzes: { enabled: false, requiresPro: true },
      learningTracks: { enabled: true },
      personalizedLearningPlans: { enabled: false, requiresPro: true },
      progressAnalytics: { enabled: false, requiresPro: true },
      exportMaterials: { enabled: false, requiresPro: true, formats: [] },
      fasterAiResponses: { enabled: false, requiresPro: true },
      prioritySupport: { enabled: false, requiresPro: true },
    },
  };
}

/**
 * Assert that a user has Pro access. Throws an EntitlementError if not.
 */
export async function requirePro(userId: string, featureKey: string): Promise<void> {
  const plan = await getUserPlan(userId);
  if (plan !== "pro") {
    throw {
      code: "PRO_REQUIRED",
      message: "This feature requires StudAI Pro.",
      feature: featureKey,
    } satisfies EntitlementError;
  }
}

/**
 * Assert that a usage-limited action is allowed.
 * For Free users: checks daily AI session count.
 * For Pro users: always allowed for unlimited features.
 * Throws an EntitlementError if the limit is reached.
 */
export async function assertUsageAllowed(
  userId: string,
  featureKey: string,
): Promise<void> {
  if (PRO_ONLY_FEATURES.has(featureKey)) {
    return requirePro(userId, featureKey);
  }

  if (featureKey === "aiStudySessions") {
    const plan = await getUserPlan(userId);
    if (plan === "pro") return; // Unlimited

    const used = await getAiSessionUsageToday(userId);
    if (used >= FREE_AI_SESSION_LIMIT) {
      throw {
        code: "FREE_DAILY_LIMIT_REACHED",
        message: "You have used your 5 free AI study sessions for today. Upgrade to Pro for unlimited sessions.",
        feature: "aiStudySessions",
        limit: FREE_AI_SESSION_LIMIT,
        period: "day",
      } satisfies EntitlementError;
    }
  }
}

/**
 * Atomically increment the AI session usage counter for a Free user.
 * Uses a conditional DynamoDB update to prevent race conditions.
 * Pro users are not tracked (unlimited).
 *
 * Returns the new usage count, or throws if the limit was already reached
 * (concurrent request race condition guard).
 */
export async function incrementUsage(
  userId: string,
  featureKey: string,
): Promise<number> {
  const plan = await getUserPlan(userId);
  if (plan === "pro") return 0; // Pro users don't consume quota

  if (featureKey !== "aiStudySessions") return 0;

  const today = todayUTC();
  const pk = { userId, featureKey: `ai_session#${today}` };

  try {
    // Atomic conditional increment: only succeeds if usageCount < limit
    const result = await dynamo.send(
      new UpdateItemCommand({
        TableName: USER_USAGE_TABLE,
        Key: marshall(pk),
        UpdateExpression:
          "SET usageCount = if_not_exists(usageCount, :zero) + :one, " +
          "periodStart = if_not_exists(periodStart, :today), " +
          "periodEnd = :today, " +
          "updatedAt = :now",
        ConditionExpression:
          "attribute_not_exists(usageCount) OR usageCount < :limit",
        ExpressionAttributeValues: marshall({
          ":zero": 0,
          ":one": 1,
          ":limit": FREE_AI_SESSION_LIMIT,
          ":today": today,
          ":now": new Date().toISOString(),
        }),
        ReturnValues: "ALL_NEW",
      }),
    );

    const updated = result.Attributes ? unmarshall(result.Attributes) : {};
    return (updated.usageCount as number) ?? 1;
  } catch (err: unknown) {
    // ConditionalCheckFailedException means limit was reached
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "ConditionalCheckFailedException"
    ) {
      throw {
        code: "FREE_DAILY_LIMIT_REACHED",
        message: "You have used your 5 free AI study sessions for today. Upgrade to Pro for unlimited sessions.",
        feature: "aiStudySessions",
        limit: FREE_AI_SESSION_LIMIT,
        period: "day",
      } satisfies EntitlementError;
    }
    throw err;
  }
}
