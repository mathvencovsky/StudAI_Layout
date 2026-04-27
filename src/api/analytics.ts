/**
 * Analytics API — client-side event tracking.
 *
 * Frontend events are written directly to AppSync (owner-auth).
 * Backend-authoritative events are written by the Lambda — never from here.
 *
 * PRIVACY: Never pass sensitive content, AI prompts, card data, or secrets
 * as metadata. The backend validates and sanitizes all metadata.
 */

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  ALLOWED_EVENTS,
  BACKEND_ONLY_EVENTS,
  BLOCKED_METADATA_KEYS,
  MAX_METADATA_BYTES,
  type EventName,
} from "@/lib/analytics-events";

const client = generateClient<Schema>();

export type AnalyticsMetadata = Record<string, string | number | boolean | null>;

/**
 * Sanitize metadata before storing:
 * - Remove blocked keys (secrets, prompts, card data)
 * - Truncate to MAX_METADATA_BYTES
 * - Only allow primitive values
 */
function sanitizeMetadata(raw: AnalyticsMetadata): AnalyticsMetadata {
  const clean: AnalyticsMetadata = {};
  for (const [k, v] of Object.entries(raw)) {
    const lk = k.toLowerCase();
    if (BLOCKED_METADATA_KEYS.has(lk)) continue;
    if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      clean[k] = typeof v === "string" ? v.slice(0, 200) : v;
    }
  }
  const serialized = JSON.stringify(clean);
  if (serialized.length > MAX_METADATA_BYTES) {
    // Return empty rather than truncated JSON that might be malformed
    return { _truncated: true };
  }
  return clean;
}

/**
 * Track a frontend UI event.
 *
 * - Validates event name against the allowed registry.
 * - Rejects backend-only events (they must come from the Lambda).
 * - Sanitizes metadata.
 * - Writes to AppSync with owner-auth (user_id derived from Cognito session).
 * - Fails silently — analytics must never break the user experience.
 */
export async function trackClientEvent(
  eventName: EventName,
  metadata: AnalyticsMetadata = {},
  sessionId?: string,
): Promise<void> {
  try {
    // Validate event name
    if (!ALLOWED_EVENTS.has(eventName)) return;
    // Reject backend-only events from the client
    if (BACKEND_ONLY_EVENTS.has(eventName)) return;

    const clean = sanitizeMetadata(metadata);

    await client.models.AnalyticsEvent.create({
      eventName,
      source: "frontend",
      metadata: clean,
      sessionId: sessionId ?? null,
    });
  } catch {
    // Silently fail — analytics must never break UX
  }
}
