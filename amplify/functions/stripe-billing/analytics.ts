/**
 * Server-side analytics helper — runs inside the stripe-billing Lambda.
 *
 * Writes backend-authoritative events to the AnalyticsEvents DynamoDB table.
 * These events are the source of truth for activation, conversion, and retention.
 *
 * PRIVACY RULES:
 * - Never store raw AI prompts, private study content, card data, or secrets.
 * - metadata is sanitized before write.
 * - userId and plan are always derived from the authenticated session.
 */

import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getUserPlan } from "./entitlements";

const dynamo = new DynamoDBClient({});
const ANALYTICS_TABLE = process.env.ANALYTICS_TABLE!;

// ─── Blocked metadata keys ────────────────────────────────────────────────────
const BLOCKED_KEYS = new Set([
  "password", "token", "secret", "key", "card", "cvv",
  "ssn", "stripe_secret", "authorization", "prompt",
  "ai_message", "message_content",
]);

const MAX_METADATA_BYTES = 2048;

function sanitizeMetadata(raw: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (BLOCKED_KEYS.has(k.toLowerCase())) continue;
    if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      clean[k] = typeof v === "string" ? v.slice(0, 200) : v;
    }
  }
  if (JSON.stringify(clean).length > MAX_METADATA_BYTES) return { _truncated: true };
  return clean;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Core track functions ─────────────────────────────────────────────────────

/**
 * Track a backend-authoritative event for an authenticated user.
 * userId and plan are derived server-side — never from client input.
 */
export async function trackEvent(
  userId: string,
  eventName: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (!ANALYTICS_TABLE) return; // Graceful no-op if table not configured

  try {
    const plan = await getUserPlan(userId);
    const clean = sanitizeMetadata({ ...metadata, plan, userId });

    await dynamo.send(
      new PutItemCommand({
        TableName: ANALYTICS_TABLE,
        Item: marshall({
          id: generateId(),
          userId,
          eventName,
          plan,
          source: "backend",
          metadata: clean,
          createdAt: new Date().toISOString(),
        }),
      }),
    );
  } catch (err) {
    // Analytics must never break the main flow
    console.error(`[analytics] Failed to track event ${eventName}:`, err);
  }
}

/**
 * Track a system-level event (no user context).
 */
export async function trackSystemEvent(
  eventName: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (!ANALYTICS_TABLE) return;

  try {
    const clean = sanitizeMetadata(metadata);
    await dynamo.send(
      new PutItemCommand({
        TableName: ANALYTICS_TABLE,
        Item: marshall({
          id: generateId(),
          eventName,
          plan: "system",
          source: "system",
          metadata: clean,
          createdAt: new Date().toISOString(),
        }),
      }),
    );
  } catch (err) {
    console.error(`[analytics] Failed to track system event ${eventName}:`, err);
  }
}

/**
 * Track a subscription lifecycle event (from Stripe webhook).
 */
export async function trackSubscriptionEvent(
  userId: string,
  eventName: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (!ANALYTICS_TABLE) return;

  try {
    const plan = await getUserPlan(userId);
    const clean = sanitizeMetadata({ ...metadata, userId });

    await dynamo.send(
      new PutItemCommand({
        TableName: ANALYTICS_TABLE,
        Item: marshall({
          id: generateId(),
          userId,
          eventName,
          plan,
          source: "webhook",
          metadata: clean,
          createdAt: new Date().toISOString(),
        }),
      }),
    );
  } catch (err) {
    console.error(`[analytics] Failed to track subscription event ${eventName}:`, err);
  }
}

// ─── Admin metrics queries ────────────────────────────────────────────────────

/**
 * Count events by name within a time range.
 * Used for admin metrics aggregation.
 */
export async function countEventsByName(
  eventName: string,
  since: string, // ISO timestamp
): Promise<number> {
  if (!ANALYTICS_TABLE) return 0;

  try {
    // Scan with filter — acceptable for low-volume admin queries
    // In production, add a GSI on eventName+createdAt for efficiency
    const result = await dynamo.send(
      new QueryCommand({
        TableName: ANALYTICS_TABLE,
        IndexName: "eventName-createdAt-index",
        KeyConditionExpression: "eventName = :name AND createdAt >= :since",
        ExpressionAttributeValues: marshall({
          ":name": eventName,
          ":since": since,
        }),
        Select: "COUNT",
      }),
    );
    return result.Count ?? 0;
  } catch {
    return 0;
  }
}
