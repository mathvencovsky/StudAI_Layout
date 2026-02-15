import type { ConversationTurnEvent } from "@aws-amplify/backend-ai/conversation/runtime";
import { decodeJwt } from "jose";

export function getUserGroups(event: ConversationTurnEvent): string[] {
  const h = event?.request?.headers ?? {};
  const auth = h["authorization"] ?? h["Authorization"] ?? h["AUTHORIZATION"];
  if (!auth) return [];

  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim();
  const claims = decodeJwt(token);

  return Array.isArray(claims["cognito:groups"])
    ? claims["cognito:groups"].filter((x) => typeof x === "string")
    : [];
}
