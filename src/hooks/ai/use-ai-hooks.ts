import { generateClient } from "aws-amplify/data";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { type Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const { useAIConversation } = createAIHooks(client);
