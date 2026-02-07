import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import { type AiWaitlist } from "@/model/ai-waitlist";

const client = generateClient<Schema>();

/**
 * Creates an AI waitlist entry for the current user
 */
export const createAiWaitlist = async (): Promise<AiWaitlist | null> => {
  const result = await client.models.AiWaitlist.create({
    requestedAt: Date.now(),
  });
  return result.data;
};
