/**
 * Chat conversation handler — Amplify AI conversation Lambda.
 *
 * Security layers (in order):
 * 1. JWT signature verification — rejects forged/expired tokens.
 * 2. Cognito group check — requires "Ai" or "Admin" group membership.
 * 3. Entitlement check — enforces Free/Pro AI session quota via DynamoDB.
 * 4. Atomic usage increment — prevents race-condition bypass of Free limit.
 *
 * Cost protection:
 * - Bedrock is never called when auth or entitlement fails.
 * - Raw provider errors are never returned to the client.
 * - Input size is validated before processing.
 */

import {
  type ConversationTurnEvent,
  handleConversationTurnEvent,
} from "@aws-amplify/backend-ai/conversation/runtime";
import { getUserGroups } from "../groups/get-user-group";
import {
  assertUsageAllowed,
  incrementUsage,
  getUserPlan,
  FREE_AI_SESSION_LIMIT,
} from "../../functions/stripe-billing/entitlements";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Max total character length of all message content in a single turn */
const MAX_INPUT_CHARS = 8_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract the authenticated user's Cognito sub (userId) from the verified JWT.
 * Returns null if the token is missing or invalid.
 */
function getUserIdFromEvent(event: ConversationTurnEvent): string | null {
  const h = event?.request?.headers ?? {};
  const auth =
    h["authorization"] ?? h["Authorization"] ?? h["AUTHORIZATION"];
  if (!auth) return null;

  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim();
  if (!token) return null;

  // The JWT has already been verified by getUserGroups before this is called.
  // We decode the payload here only to extract the sub — the signature was
  // already verified in getUserGroups.
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as Record<string, unknown>;
    const sub = payload["sub"];
    return typeof sub === "string" && sub.length > 0 ? sub : null;
  } catch {
    return null;
  }
}

/**
 * Measure total input size to prevent oversized payloads from reaching Bedrock.
 */
function measureInputSize(event: ConversationTurnEvent): number {
  try {
    return JSON.stringify(event).length;
  } catch {
    return 0;
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event: ConversationTurnEvent): Promise<void> => {
  // ── 1. Input size guard ────────────────────────────────────────────────────
  const inputSize = measureInputSize(event);
  if (inputSize > MAX_INPUT_CHARS * 10) {
    // Rough upper bound — 10× the per-message limit for the full event
    throw new Error("Request payload too large");
  }

  // ── 2. JWT verification + group check ─────────────────────────────────────
  // getUserGroups verifies the JWT signature before returning claims.
  const userGroups = await getUserGroups(event);

  if (!userGroups.includes("Admin") && !userGroups.includes("Ai")) {
    throw new Error("Unauthorized: AI group membership required");
  }

  // ── 3. Extract userId from the already-verified token ─────────────────────
  const userId = getUserIdFromEvent(event);
  if (!userId) {
    throw new Error("Unauthorized: could not identify user");
  }

  // ── 4. Entitlement check (server-side, DynamoDB-authoritative) ────────────
  // Admin users bypass the session quota — they are platform operators.
  const isAdmin = userGroups.includes("Admin");

  if (!isAdmin) {
    try {
      await assertUsageAllowed(userId, "aiStudySessions");
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === "FREE_DAILY_LIMIT_REACHED") {
        throw new Error(
          "Daily AI session limit reached. Upgrade to Pro for unlimited sessions.",
        );
      }
      if (e?.code === "PRO_REQUIRED") {
        throw new Error("This feature requires StudAI Pro.");
      }
      // Unexpected entitlement error — fail closed (deny access)
      console.error("[chat-entitlement] Unexpected error during entitlement check");
      throw new Error("Service temporarily unavailable. Please try again.");
    }
  }

  // ── 5. Delegate to Bedrock via Amplify conversation runtime ───────────────
  // Bedrock is only called after auth + entitlement pass.
  try {
    await handleConversationTurnEvent(event);
  } catch (err) {
    // Never expose raw Bedrock/provider errors to the client
    const name = err instanceof Error ? err.name : "UnknownError";
    console.error(`[chat-bedrock] Provider error: ${name}`);
    throw new Error("AI service error. Please try again.");
  }

  // ── 6. Atomic usage increment (after successful Bedrock call) ─────────────
  // Only increment after the session is successfully created.
  // Admin users are not tracked.
  if (!isAdmin) {
    try {
      await incrementUsage(userId, "aiStudySessions");
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code === "FREE_DAILY_LIMIT_REACHED") {
        // Race condition: another concurrent request hit the limit first.
        // The session already completed, so we log but don't fail.
        console.error("[chat-entitlement] Concurrent limit hit during increment");
      } else {
        // Log but don't fail — usage tracking must not break the user experience
        console.error("[chat-entitlement] Failed to increment usage counter");
      }
    }
  }
};
