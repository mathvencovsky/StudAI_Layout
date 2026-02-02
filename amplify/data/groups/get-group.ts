import type { ConversationTurnEvent } from "@aws-amplify/backend-ai/conversation/runtime";
import { decodeJwt } from "jose"; // npm i jose

export function getUserGroups(event: ConversationTurnEvent): string[] {
  const h = event?.request?.headers ?? {};
  const auth = h["authorization"] ?? h["Authorization"] ?? h["AUTHORIZATION"];

  if (!auth) return [];

  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim();

  const claims = decodeJwt(token);

  console.log("jwt claims", claims);

  const groups = (claims["cognito:groups"] ??
    claims["groups"] ??
    claims["custom:groups"]) as unknown;

  return Array.isArray(groups)
    ? groups.filter((g): g is string => typeof g === "string")
    : typeof groups === "string"
      ? groups
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
}
