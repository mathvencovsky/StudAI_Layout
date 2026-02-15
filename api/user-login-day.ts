import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

/**
 * Record today's login if not already recorded
 */
export const recordLoginDay = async (): Promise<void> => {
  await getCurrentUserId();

  const today = new Date().toISOString().split("T")[0];

  const existing = await client.models.UserLoginDay.list({
    filter: { date: { eq: today } },
  });

  if (!existing.data || existing.data.length === 0) {
    await client.models.UserLoginDay.create({ date: today });
  }
};

/**
 * Get total count of unique login days
 */
export const getLoginDaysCount = async (): Promise<number> => {
  await getCurrentUserId();

  const result = await client.models.UserLoginDay.list();
  return result.data?.length ?? 0;
};
