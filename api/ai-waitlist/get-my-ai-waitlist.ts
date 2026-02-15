import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import { type AiWaitlist } from "@/model/ai-waitlist";

const client = generateClient<Schema>();

/**
 * Gets the current user's AI waitlist entry
 */
export const getMyAiWaitlist = async (): Promise<AiWaitlist | null> => {
  const result = await client.models.AiWaitlist.list();
  return result.data?.[0] ?? null;
};
