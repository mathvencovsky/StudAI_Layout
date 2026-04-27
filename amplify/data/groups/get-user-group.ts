/**
 * getUserGroups — extracts Cognito groups from a ConversationTurnEvent.
 *
 * SECURITY: The ConversationTurnEvent only exposes request.headers.
 * The Amplify conversation handler Lambda is invoked directly by AppSync
 * after AppSync has already verified the Cognito JWT via its userPool
 * authorizer. AppSync passes the verified identity in the Authorization
 * header that it forwards to the Lambda.
 *
 * We use jwtVerify (not decodeJwt) to cryptographically verify the token
 * signature against the Cognito JWKS endpoint before trusting any claims.
 * This prevents forged tokens with injected group claims from bypassing
 * the group check.
 *
 * Required environment variables:
 *   COGNITO_USER_POOL_ID  — e.g. "us-east-1_nJ5zFKNVU"
 *   COGNITO_REGION        — e.g. "us-east-1" (defaults to AWS_REGION)
 */

import type { ConversationTurnEvent } from "@aws-amplify/backend-ai/conversation/runtime";
import { createRemoteJWKSet, jwtVerify } from "jose";

// ─── JWKS endpoint ────────────────────────────────────────────────────────────

function getJwksUri(): URL {
  const region =
    process.env.COGNITO_REGION ??
    process.env.AWS_REGION ??
    "us-east-1";
  const userPoolId = process.env.COGNITO_USER_POOL_ID;

  if (!userPoolId) {
    throw new Error(
      "COGNITO_USER_POOL_ID environment variable is required for JWT verification",
    );
  }

  return new URL(
    `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
  );
}

// Cache the JWKS set for the lifetime of the Lambda container
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  if (!_jwks) {
    _jwks = createRemoteJWKSet(getJwksUri());
  }
  return _jwks;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Extracts and cryptographically verifies the Cognito JWT from the event,
 * then returns the user's Cognito groups.
 *
 * Returns an empty array if:
 * - No Authorization header is present
 * - The token fails signature verification
 * - The token is expired
 * - The token has an unexpected issuer
 *
 * Never throws — callers should treat an empty array as "no groups".
 */
export async function getUserGroups(
  event: ConversationTurnEvent,
): Promise<string[]> {
  const h = event?.request?.headers ?? {};
  const auth =
    h["authorization"] ?? h["Authorization"] ?? h["AUTHORIZATION"];

  if (!auth) return [];

  const token = auth.startsWith("Bearer ")
    ? auth.slice(7).trim()
    : auth.trim();

  if (!token) return [];

  try {
    const region =
      process.env.COGNITO_REGION ??
      process.env.AWS_REGION ??
      "us-east-1";
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    if (!userPoolId) {
      console.error("[chat-auth] COGNITO_USER_POOL_ID not set");
      return [];
    }

    const expectedIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: expectedIssuer,
      // token_use: "id" is the Cognito ID token (contains groups)
      // We do not restrict to a specific audience here because the
      // Amplify conversation handler receives the ID token forwarded
      // by AppSync, and the audience is the Cognito User Pool Client ID
      // which varies per environment.
    });

    // Validate token_use — must be "id" (ID token contains group claims)
    if (payload["token_use"] !== "id") {
      console.error("[chat-auth] Unexpected token_use:", payload["token_use"]);
      return [];
    }

    const groups = payload["cognito:groups"];
    return Array.isArray(groups)
      ? groups.filter((x): x is string => typeof x === "string")
      : [];
  } catch (err) {
    // Log the error type but never expose token internals
    const name = err instanceof Error ? err.name : "UnknownError";
    console.error(`[chat-auth] JWT verification failed: ${name}`);
    return [];
  }
}
