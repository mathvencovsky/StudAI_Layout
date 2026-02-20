/**
 * Plan Guard - Middleware para verificação de limites por plano
 * 
 * Este módulo implementa o enforcement SERVER-SIDE de limites por plano.
 * Deve ser usado em todos os endpoints de IA.
 */

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import {
  getPlanLimits,
  getDailyLimit,
  createPlanLimitError,
  getResetTime,
  getPeriodDay,
  PLAN_LIMIT_ERRORS,
  type PlanType,
  type FeatureType,
  type PlanLimitError,
} from "../../../amplify/data/config/plan-limits";

const client = generateClient<Schema>();

export interface PlanGuardResult {
  allowed: boolean;
  error?: PlanLimitError;
  usage?: Schema["AiUsage"]["type"];
  plan: PlanType;
  limit: number;
  used: number;
}

/**
 * Check if user can use a specific AI feature
 * Returns detailed information about usage and limits
 * Includes improved error handling and fallback behavior
 */
export async function checkPlanLimit(
  userId: string,
  feature: FeatureType
): Promise<PlanGuardResult> {
  try {
    // 1. Get user's subscription with timeout
    const subscriptions = await Promise.race([
      client.models.Subscription.list({
        filter: { owner: { eq: userId } },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Subscription query timeout")), 5000)
      ),
    ]);

    const activeSub = subscriptions.data?.find(
      (s) => s.status === "active" || s.status === "trial"
    );

    const plan: PlanType = activeSub?.plan || "free";
    const limits = getPlanLimits(plan);
    const dailyLimit = getDailyLimit(plan, feature);

    // 2. Get today's usage with timeout
    const today = getPeriodDay();
    const usageRecords = await Promise.race([
      client.models.AiUsage.list({
        filter: {
          owner: { eq: userId },
          periodDay: { eq: today },
          feature: { eq: feature },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Usage query timeout")), 5000)
      ),
    ]);

    const todayUsage = usageRecords.data?.[0];
    const currentCount = todayUsage?.requestsCount || 0;

    // 3. Check if limit exceeded
    if (currentCount >= dailyLimit) {
      return {
        allowed: false,
        error: createPlanLimitError(
          PLAN_LIMIT_ERRORS.LIMIT_REACHED,
          feature,
          plan,
          currentCount,
          getResetTime()
        ),
        usage: todayUsage || undefined,
        plan,
        limit: dailyLimit,
        used: currentCount,
      };
    }

    // 4. Check rate limit (requests per minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentRequests = await Promise.race([
      client.models.AiUsage.list({
        filter: {
          owner: { eq: userId },
          updatedAt: { ge: oneMinuteAgo.toISOString() },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Rate limit query timeout")), 3000)
      ),
    ]);

    const recentCount = recentRequests.data?.length || 0;
    if (recentCount >= limits.requestsPerMinute) {
      return {
        allowed: false,
        error: createPlanLimitError(
          PLAN_LIMIT_ERRORS.RATE_LIMIT_EXCEEDED,
          feature,
          plan,
          recentCount,
          new Date(Date.now() + 60 * 1000) // Reset in 1 minute
        ),
        usage: todayUsage || undefined,
        plan,
        limit: dailyLimit,
        used: currentCount,
      };
    }

    return {
      allowed: true,
      usage: todayUsage || undefined,
      plan,
      limit: dailyLimit,
      used: currentCount,
    };
  } catch (error) {
    console.error("Error checking plan limit:", error);
    
    // On error, allow the request but log it
    // This prevents blocking users due to infrastructure issues
    return {
      allowed: true,
      plan: "free",
      limit: 10,
      used: 0,
      error: {
        code: PLAN_LIMIT_ERRORS.INVALID_PLAN,
        message: "Erro ao verificar limites. Prosseguindo com cautela.",
        feature: feature,
        currentPlan: "free",
        limit: 10,
        used: 0,
        resetAt: getResetTime().toISOString(),
        upgradeCta: false,
      },
    };
  }
}

/**
 * Increment usage counter for a feature
 * Should be called after successful AI request
 * Includes retry logic for reliability
 */
export async function incrementUsage(
  userId: string,
  feature: FeatureType,
  tokensIn: number,
  tokensOut: number
): Promise<void> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const today = getPeriodDay();

      // Get subscription
      const subscriptions = await client.models.Subscription.list({
        filter: { owner: { eq: userId } },
      });

      const activeSub = subscriptions.data?.find(
        (s) => s.status === "active" || s.status === "trial"
      );

      const plan: PlanType = activeSub?.plan || "free";

      // Get or create usage record
      const usageRecords = await client.models.AiUsage.list({
        filter: {
          owner: { eq: userId },
          periodDay: { eq: today },
          feature: { eq: feature },
        },
      });

      const existing = usageRecords.data?.[0];

      if (existing) {
        // Update existing record
        await client.models.AiUsage.update({
          id: existing.id,
          requestsCount: (existing.requestsCount || 0) + 1,
          tokensIn: (existing.tokensIn || 0) + tokensIn,
          tokensOut: (existing.tokensOut || 0) + tokensOut,
        });
      } else {
        // Create new record
        await client.models.AiUsage.create({
          plan,
          periodDay: today,
          requestsCount: 1,
          tokensIn,
          tokensOut,
          feature,
        });
      }

      // Success - exit retry loop
      return;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} to increment usage failed:`, error);

      if (attempt < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If all retries failed, log but don't throw
  // This prevents blocking the user's AI request due to usage tracking issues
  console.error("Failed to increment usage after all retries:", lastError);
}

/**
 * Get user's current plan
 */
export async function getUserPlan(userId: string): Promise<PlanType> {
  try {
    const subscriptions = await client.models.Subscription.list({
      filter: { owner: { eq: userId } },
    });

    const activeSub = subscriptions.data?.find(
      (s) => s.status === "active" || s.status === "trial"
    );

    return activeSub?.plan || "free";
  } catch (error) {
    console.error("Error getting user plan:", error);
    return "free";
  }
}

/**
 * Get user's usage statistics for today
 */
export async function getTodayUsage(
  userId: string
): Promise<Schema["AiUsage"]["type"][]> {
  try {
    const today = getPeriodDay();
    const usageRecords = await client.models.AiUsage.list({
      filter: {
        owner: { eq: userId },
        periodDay: { eq: today },
      },
    });

    return usageRecords.data || [];
  } catch (error) {
    console.error("Error getting today usage:", error);
    return [];
  }
}

/**
 * Get usage summary for a specific feature
 */
export async function getFeatureUsageSummary(
  userId: string,
  feature: FeatureType
): Promise<{
  plan: PlanType;
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
}> {
  try {
    const plan = await getUserPlan(userId);
    const limit = getDailyLimit(plan, feature);
    const today = getPeriodDay();

    const usageRecords = await client.models.AiUsage.list({
      filter: {
        owner: { eq: userId },
        periodDay: { eq: today },
        feature: { eq: feature },
      },
    });

    const used = usageRecords.data?.[0]?.requestsCount || 0;
    const remaining = Math.max(0, limit - used);

    return {
      plan,
      limit,
      used,
      remaining,
      resetAt: getResetTime().toISOString(),
    };
  } catch (error) {
    console.error("Error getting feature usage summary:", error);
    throw error;
  }
}

/**
 * Check if user has Pro plan
 */
export async function isProUser(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "pro";
}

/**
 * Create a default free subscription for a user
 * Should be called during user registration
 */
export async function createDefaultSubscription(
  userId: string
): Promise<void> {
  try {
    const existing = await client.models.Subscription.list({
      filter: { owner: { eq: userId } },
    });

    if (existing.data && existing.data.length > 0) {
      console.log("User already has a subscription");
      return;
    }

    await client.models.Subscription.create({
      plan: "free",
      status: "active",
      startDate: Date.now(),
      autoRenew: false,
    });

    console.log("Created default free subscription for user");
  } catch (error) {
    console.error("Error creating default subscription:", error);
    throw error;
  }
}
