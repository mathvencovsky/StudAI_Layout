/**
 * Stripe Billing Lambda Handler
 *
 * Handles all Stripe billing operations:
 * - POST /billing/create-checkout-session
 * - POST /billing/create-portal-session
 * - GET  /billing/subscription
 * - POST /stripe/webhook
 *
 * Deployed as an Amplify Function behind API Gateway (HTTP API).
 * The webhook route uses raw body parsing for signature verification.
 */

import Stripe from "stripe";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  getUserEntitlements,
  assertUsageAllowed,
  incrementUsage,
  requirePro,
  type EntitlementError,
} from "./entitlements";
import {
  trackEvent,
  trackSubscriptionEvent,
} from "./analytics";
import { EVENTS } from "../../../src/lib/analytics-events";

// ─── Stripe client ────────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// ─── DynamoDB client ──────────────────────────────────────────────────────────
const dynamo = new DynamoDBClient({});

// ─── Table names (injected via env) ──────────────────────────────────────────
const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE!;
const STRIPE_EVENTS_TABLE = process.env.STRIPE_EVENTS_TABLE!;
const USER_USAGE_TABLE = process.env.USER_USAGE_TABLE!; // eslint-disable-line @typescript-eslint/no-unused-vars

// ─── Env vars ─────────────────────────────────────────────────────────────────
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY!;
const STRIPE_PRICE_PRO_ANNUAL = process.env.STRIPE_PRICE_PRO_ANNUAL!;
const APP_URL = process.env.APP_URL;
if (!APP_URL) {
  throw new Error(
    "APP_URL environment variable is not set. " +
    "Set it to the staging or production domain (e.g. https://staging.d3c8vwdhq21nu3.amplifyapp.com). " +
    "A localhost fallback is not permitted in deployed environments.",
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface APIGatewayEvent {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  body: string | null;
  isBase64Encoded?: boolean;
  requestContext?: {
    authorizer?: {
      claims?: {
        sub?: string;
        email?: string;
      };
    };
  };
}

interface APIGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function json(statusCode: number, body: unknown): APIGatewayResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": APP_URL,
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(body),
  };
}

function getUserId(event: APIGatewayEvent): string | null {
  return event.requestContext?.authorizer?.claims?.sub ?? null;
}

/** Map Stripe subscription status to our internal status */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status,
): "active" | "cancelled" | "expired" | "trial" | "past_due" | "incomplete" {
  switch (stripeStatus) {
    case "active":
      return "active";
    case "trialing":
      return "trial";
    case "canceled":
      return "cancelled";
    case "incomplete_expired":
      return "expired";
    case "past_due":
      return "past_due";
    case "incomplete":
    case "unpaid":
      return "incomplete";
    default:
      return "expired";
  }
}

/** Determine if a subscription status grants Pro access */
function isProActive(status: string): boolean {
  return status === "active" || status === "trial";
}

/** Get or create Stripe customer for a user */
async function getOrCreateStripeCustomer(
  userId: string,
  email?: string,
): Promise<string> {
  // Check if we already have a customer ID stored
  const existing = await dynamo.send(
    new GetItemCommand({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: marshall({ userId }),
    }),
  );

  if (existing.Item) {
    const item = unmarshall(existing.Item);
    if (item.stripeCustomerId) return item.stripeCustomerId as string;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  // Upsert the customer ID
  await dynamo.send(
    new UpdateItemCommand({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: marshall({ userId }),
      UpdateExpression: "SET stripeCustomerId = :cid, updatedAt = :now",
      ExpressionAttributeValues: marshall({
        ":cid": customer.id,
        ":now": new Date().toISOString(),
      }),
    }),
  );

  return customer.id;
}

/** Upsert subscription record from Stripe subscription object */
async function upsertSubscription(
  userId: string,
  sub: Stripe.Subscription,
): Promise<void> {
  const priceId = sub.items.data[0]?.price.id ?? "";
  const interval = sub.items.data[0]?.price.recurring?.interval;
  const billingInterval: "monthly" | "annual" =
    interval === "year" ? "annual" : "monthly";
  const status = mapStripeStatus(sub.status);

  await dynamo.send(
    new UpdateItemCommand({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: marshall({ userId }),
      UpdateExpression: `SET
        stripeSubscriptionId = :sid,
        stripeCustomerId = :cid,
        stripePriceId = :pid,
        plan = :plan,
        billingInterval = :interval,
        #status = :status,
        isPro = :isPro,
        currentPeriodStart = :start,
        currentPeriodEnd = :end,
        cancelAtPeriodEnd = :cancel,
        canceledAt = :canceledAt,
        trialStart = :trialStart,
        trialEnd = :trialEnd,
        updatedAt = :now`,
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: marshall({
        ":sid": sub.id,
        ":cid": sub.customer as string,
        ":pid": priceId,
        ":plan": "pro",
        ":interval": billingInterval,
        ":status": status,
        ":isPro": isProActive(status),
        ":start": new Date(sub.current_period_start * 1000).toISOString(),
        ":end": new Date(sub.current_period_end * 1000).toISOString(),
        ":cancel": sub.cancel_at_period_end,
        ":canceledAt": sub.canceled_at
          ? new Date(sub.canceled_at * 1000).toISOString()
          : null,
        ":trialStart": sub.trial_start
          ? new Date(sub.trial_start * 1000).toISOString()
          : null,
        ":trialEnd": sub.trial_end
          ? new Date(sub.trial_end * 1000).toISOString()
          : null,
        ":now": new Date().toISOString(),
      }),
    }),
  );
}

/** Check idempotency — returns true if event was already processed */
async function isEventProcessed(eventId: string): Promise<boolean> {
  const result = await dynamo.send(
    new GetItemCommand({
      TableName: STRIPE_EVENTS_TABLE,
      Key: marshall({ stripeEventId: eventId }),
    }),
  );
  return !!result.Item;
}

/** Mark event as processed */
async function markEventProcessed(
  eventId: string,
  type: string,
): Promise<void> {
  await dynamo.send(
    new PutItemCommand({
      TableName: STRIPE_EVENTS_TABLE,
      Item: marshall({
        stripeEventId: eventId,
        type,
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }),
      ConditionExpression: "attribute_not_exists(stripeEventId)",
    }),
  );
}

// ─── Route handlers ───────────────────────────────────────────────────────────

async function handleCreateCheckoutSession(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const userId = getUserId(event);
  if (!userId) return json(401, { error: "Unauthorized" });

  let body: { plan?: string; email?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  const { plan, email } = body;

  // Validate plan — never trust client-submitted price IDs
  if (plan !== "monthly" && plan !== "annual") {
    return json(400, { error: "Invalid plan. Must be 'monthly' or 'annual'." });
  }

  const priceId =
    plan === "annual" ? STRIPE_PRICE_PRO_ANNUAL : STRIPE_PRICE_PRO_MONTHLY;

  if (!priceId) {
    console.error(`Missing Stripe price ID for plan: ${plan}`);
    return json(500, { error: "Billing configuration error" });
  }

  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/billing/cancel`,
    allow_promotion_codes: true,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  return json(200, { url: session.url });
}

async function handleCreatePortalSession(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const userId = getUserId(event);
  if (!userId) return json(401, { error: "Unauthorized" });

  const existing = await dynamo.send(
    new GetItemCommand({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: marshall({ userId }),
    }),
  );

  if (!existing.Item) {
    return json(404, { error: "No billing account found" });
  }

  const item = unmarshall(existing.Item);
  const customerId = item.stripeCustomerId as string | undefined;

  if (!customerId) {
    return json(404, { error: "No Stripe customer found" });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/settings?tab=billing`,
  });

  return json(200, { url: session.url });
}

async function handleGetSubscription(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const userId = getUserId(event);
  if (!userId) return json(401, { error: "Unauthorized" });

  const result = await dynamo.send(
    new GetItemCommand({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: marshall({ userId }),
    }),
  );

  if (!result.Item) {
    // No subscription record — free user
    return json(200, {
      isPro: false,
      plan: "free",
      status: "active",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      billingInterval: null,
      hasStripeCustomer: false,
      canManageBilling: false,
      hasPaymentIssue: false,
      canResubscribe: false,
    });
  }

  const sub = unmarshall(result.Item);
  const status = (sub.status as string) ?? "expired";
  const isPro = isProActive(status);
  const hasPaymentIssue = status === "past_due" || status === "incomplete";
  const canResubscribe =
    !isPro && !hasPaymentIssue && status !== "active" && status !== "trial";

  return json(200, {
    isPro,
    plan: isPro ? "pro" : "free",
    status,
    currentPeriodEnd: sub.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
    billingInterval: sub.billingInterval ?? null,
    hasStripeCustomer: !!sub.stripeCustomerId,
    canManageBilling: !!sub.stripeCustomerId,
    hasPaymentIssue,
    canResubscribe,
  });
}

async function handleWebhook(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const sig = event.headers["stripe-signature"];
  if (!sig) return json(400, { error: "Missing stripe-signature header" });

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body ?? "", "base64").toString("utf8")
    : (event.body ?? "");

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed");
    return json(400, { error: "Invalid webhook signature" });
  }

  // Idempotency check
  const alreadyProcessed = await isEventProcessed(stripeEvent.id);
  if (alreadyProcessed) {
    return json(200, { received: true, duplicate: true });
  }

  try {
    await processWebhookEvent(stripeEvent);
    await markEventProcessed(stripeEvent.id, stripeEvent.type);
  } catch (err) {
    // Log but don't expose details
    console.error(`Webhook processing error for event type ${stripeEvent.type}`);
    return json(500, { error: "Webhook processing failed" });
  }

  return json(200, { received: true });
}

async function processWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      const userId = session.metadata?.userId;
      if (!userId) break;
      const subId = session.subscription as string;
      const sub = await stripe.subscriptions.retrieve(subId);
      await upsertSubscription(userId, sub);
      void trackSubscriptionEvent(userId, EVENTS.CHECKOUT_COMPLETED, {
        billingInterval: sub.items.data[0]?.price.recurring?.interval === "year" ? "annual" : "monthly",
        source: "stripe_webhook",
      });
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;
      await upsertSubscription(userId, sub);
      const interval = sub.items.data[0]?.price.recurring?.interval === "year" ? "annual" : "monthly";
      if (sub.status === "active" || sub.status === "trialing") {
        void trackSubscriptionEvent(userId, EVENTS.SUBSCRIPTION_ACTIVATED, {
          status: sub.status,
          billingInterval: interval,
          source: "stripe_webhook",
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
        if (sub.cancel_at_period_end) {
          void trackSubscriptionEvent(userId, EVENTS.SUBSCRIPTION_CANCEL_AT_PERIOD_END, {
            billingInterval: interval,
            source: "stripe_webhook",
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;
      await upsertSubscription(userId, sub);
      void trackSubscriptionEvent(userId, EVENTS.SUBSCRIPTION_CANCELED, {
        source: "stripe_webhook",
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = (invoice as { subscription?: string }).subscription;
      if (!subId) break;
      const sub = await stripe.subscriptions.retrieve(subId);
      const userId = sub.metadata?.userId;
      if (!userId) break;
      await upsertSubscription(userId, sub);
      void trackSubscriptionEvent(userId, EVENTS.SUBSCRIPTION_RENEWED, {
        source: "stripe_webhook",
        billingInterval: sub.items.data[0]?.price.recurring?.interval === "year" ? "annual" : "monthly",
      });
      break;
    }

    case "invoice.payment_failed":
    case "invoice.payment_action_required": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = (invoice as { subscription?: string }).subscription;
      if (!subId) break;
      const sub = await stripe.subscriptions.retrieve(subId);
      const userId = sub.metadata?.userId;
      if (!userId) break;
      await upsertSubscription(userId, sub);
      void trackSubscriptionEvent(userId, EVENTS.SUBSCRIPTION_PAYMENT_FAILED, {
        source: "stripe_webhook",
      });
      break;
    }

    case "customer.subscription.trial_will_end": {
      // No action needed
      break;
    }

    default:
      // Unhandled event type — safe to ignore
      break;
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

// ─── Entitlement handlers ─────────────────────────────────────────────────────

async function handleGetEntitlements(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const userId = getUserId(event);
  if (!userId) return json(401, { error: "Unauthorized" });

  try {
    const entitlements = await getUserEntitlements(userId);
    return json(200, entitlements);
  } catch (err) {
    console.error("Error fetching entitlements:", err);
    return json(500, { error: "Failed to fetch entitlements" });
  }
}

async function handleStartAiSession(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const userId = getUserId(event);
  if (!userId) return json(401, { error: "Unauthorized" });

  try {
    await assertUsageAllowed(userId, "aiStudySessions");
    const newCount = await incrementUsage(userId, "aiStudySessions");

    // Track server-side — backend-authoritative
    const isFirst = newCount === 1;
    void trackEvent(userId, isFirst ? EVENTS.FIRST_AI_STUDY_SESSION_CREATED : EVENTS.AI_STUDY_SESSION_CREATED, {
      usageCount: newCount,
      isFirstSession: isFirst,
    });

    return json(200, { allowed: true, usageCount: newCount });
  } catch (err) {
    const e = err as EntitlementError;
    if (e.code === "FREE_DAILY_LIMIT_REACHED") {
      // Track limit reached — backend-authoritative
      void trackEvent(userId, EVENTS.FREE_DAILY_LIMIT_REACHED, {
        feature: "aiStudySessions",
        limit: 5,
      });
      return json(429, { error: { code: e.code, message: e.message, feature: e.feature, limit: e.limit, period: e.period } });
    }
    if (e.code === "PRO_REQUIRED") {
      return json(403, { error: { code: e.code, message: e.message, feature: e.feature } });
    }
    console.error("Unexpected error in handleStartAiSession:", err);
    return json(500, { error: "Internal server error" });
  }
}

// ─── Allowed feature keys for /me/entitlements/check ─────────────────────────
// Clients may only check these known feature keys. Any other value is rejected.
const ALLOWED_FEATURE_KEYS = new Set([
  "aiStudySessions",
  "basicFlashcards",
  "basicQuizzes",
  "advancedFlashcards",
  "advancedQuizzes",
  "learningTracks",
  "personalizedLearningPlans",
  "progressAnalytics",
  "exportMaterials",
  "fasterAiResponses",
  "prioritySupport",
]);

async function handleCheckFeature(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  const userId = getUserId(event);
  if (!userId) return json(401, { error: "Unauthorized" });

  let body: { feature?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  const { feature } = body;
  if (!feature || typeof feature !== "string") {
    return json(400, { error: "Missing or invalid 'feature' field" });
  }

  // Validate against allowlist — never pass arbitrary strings to entitlement logic
  if (!ALLOWED_FEATURE_KEYS.has(feature)) {
    return json(400, { error: "Unknown feature key" });
  }

  try {
    await assertUsageAllowed(userId, feature);
    return json(200, { allowed: true, feature });
  } catch (err) {
    const e = err as EntitlementError;
    if (e.code === "FREE_DAILY_LIMIT_REACHED") {
      return json(429, { error: e });
    }
    if (e.code === "PRO_REQUIRED") {
      return json(403, { error: e });
    }
    console.error("Unexpected error in handleCheckFeature:", err);
    return json(500, { error: "Internal server error" });
  }
}

// ─── Admin metrics handler ────────────────────────────────────────────────────

/**
 * GET /api/admin/metrics/overview
 * Requires Admin Cognito group (checked via JWT claims).
 * Returns aggregate metrics — no PII, no payment details.
 */
async function handleAdminMetricsOverview(
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> {
  // Check admin group from JWT
  const groups: string[] = (event.requestContext?.authorizer?.claims?.["cognito:groups"] as string[] | undefined) ?? [];
  if (!groups.includes("Admin")) {
    return json(403, { error: "Admin access required" });
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const weekStart = new Date(now);
  weekStart.setUTCDate(weekStart.getUTCDate() - 7);
  const monthStart = new Date(now);
  monthStart.setUTCDate(monthStart.getUTCDate() - 30);

  // Count events from analytics table
  const [
    aiSessionsToday,
    aiSessionsWeek,
    checkoutsStartedWeek,
    checkoutsCompletedWeek,
    upgradePromptsWeek,
    upgradeClicksWeek,
    limitReachedWeek,
    subscriptionCancelsWeek,
    paymentFailuresWeek,
  ] = await Promise.all([
    countAnalyticsEvents(EVENTS.AI_STUDY_SESSION_CREATED, todayStart.toISOString()),
    countAnalyticsEvents(EVENTS.AI_STUDY_SESSION_CREATED, weekStart.toISOString()),
    countAnalyticsEvents(EVENTS.CHECKOUT_STARTED, weekStart.toISOString()),
    countAnalyticsEvents(EVENTS.CHECKOUT_COMPLETED, weekStart.toISOString()),
    countAnalyticsEvents(EVENTS.UPGRADE_PROMPT_VIEWED, weekStart.toISOString()),
    countAnalyticsEvents(EVENTS.UPGRADE_PROMPT_CLICKED, weekStart.toISOString()),
    countAnalyticsEvents(EVENTS.FREE_DAILY_LIMIT_REACHED, weekStart.toISOString()),
    countAnalyticsEvents(EVENTS.SUBSCRIPTION_CANCELED, monthStart.toISOString()),
    countAnalyticsEvents(EVENTS.SUBSCRIPTION_PAYMENT_FAILED, monthStart.toISOString()),
  ]);

  const checkoutConversionRate = checkoutsStartedWeek > 0
    ? Math.round((checkoutsCompletedWeek / checkoutsStartedWeek) * 100)
    : 0;

  const upgradeClickThroughRate = upgradePromptsWeek > 0
    ? Math.round((upgradeClicksWeek / upgradePromptsWeek) * 100)
    : 0;

  return json(200, {
    generatedAt: now.toISOString(),
    periods: {
      today: todayStart.toISOString(),
      week: weekStart.toISOString(),
      month: monthStart.toISOString(),
    },
    featureUsage: {
      aiSessionsToday,
      aiSessionsThisWeek: aiSessionsWeek,
    },
    conversion: {
      checkoutsStartedThisWeek: checkoutsStartedWeek,
      checkoutsCompletedThisWeek: checkoutsCompletedWeek,
      checkoutConversionRatePct: checkoutConversionRate,
      upgradePromptsViewedThisWeek: upgradePromptsWeek,
      upgradePromptsClickedThisWeek: upgradeClicksWeek,
      upgradeClickThroughRatePct: upgradeClickThroughRate,
      freeLimitReachedThisWeek: limitReachedWeek,
    },
    subscriptionHealth: {
      cancellationsThisMonth: subscriptionCancelsWeek,
      paymentFailuresThisMonth: paymentFailuresWeek,
    },
  });
}

async function countAnalyticsEvents(eventName: string, since: string): Promise<number> {
  const ANALYTICS_TABLE = process.env.ANALYTICS_TABLE;
  if (!ANALYTICS_TABLE) return 0;
  try {
    const { QueryCommand: QC } = await import("@aws-sdk/client-dynamodb");
    const result = await dynamo.send(
      new QC({
        TableName: ANALYTICS_TABLE,
        IndexName: "eventName-createdAt-index",
        KeyConditionExpression: "eventName = :name AND createdAt >= :since",
        ExpressionAttributeValues: marshall({ ":name": eventName, ":since": since }),
        Select: "COUNT",
      }),
    );
    return result.Count ?? 0;
  } catch {
    return 0;
  }
}

// ─── Main handler (routing) ───────────────────────────────────────────────────

export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayResponse> => {
  const method = event.httpMethod?.toUpperCase();
  const path = event.path;

  // CORS preflight
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": APP_URL,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,Authorization,stripe-signature",
        "Access-Control-Allow-Credentials": "true",
      },
      body: "",
    };
  }

  try {
    if (method === "POST" && path.endsWith("/billing/create-checkout-session")) {
      return await handleCreateCheckoutSession(event);
    }
    if (method === "POST" && path.endsWith("/billing/create-portal-session")) {
      return await handleCreatePortalSession(event);
    }
    if (method === "GET" && path.endsWith("/billing/subscription")) {
      return await handleGetSubscription(event);
    }
    if (method === "POST" && path.endsWith("/stripe/webhook")) {
      return await handleWebhook(event);
    }
    // Entitlement routes
    if (method === "GET" && path.endsWith("/me/entitlements")) {
      return await handleGetEntitlements(event);
    }
    if (method === "POST" && path.endsWith("/me/ai-session/start")) {
      return await handleStartAiSession(event);
    }
    if (method === "POST" && path.endsWith("/me/entitlements/check")) {
      return await handleCheckFeature(event);
    }
    // Admin metrics routes
    if (method === "GET" && path.endsWith("/admin/metrics/overview")) {
      return await handleAdminMetricsOverview(event);
    }

    return json(404, { error: "Not found" });
  } catch (err) {
    console.error("Unhandled error in billing handler");
    return json(500, { error: "Internal server error" });
  }
};
