import {
  type ConversationTurnEvent,
  handleConversationTurnEvent,
} from "@aws-amplify/backend-ai/conversation/runtime";

export const handler = async (event: ConversationTurnEvent) => {
  await handleConversationTurnEvent(event, {
    // Later you can add:
    // tools: [ ... ],
    // onBeforeInvokeModel: async (...) => {},
    // onAfterInvokeModel: async (...) => {},
  });
};
