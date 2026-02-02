import {
  type ConversationTurnEvent,
  handleConversationTurnEvent,
} from "@aws-amplify/backend-ai/conversation/runtime";
import { getUserGroups } from "../groups/get-group";

export const handler = async (event: ConversationTurnEvent) => {
  const userGroups = getUserGroups(event);

  if (!userGroups.includes("Admin")) {
    throw new Error("Unauthorized: Admin group membership required");
  }

  await handleConversationTurnEvent(event);
};
