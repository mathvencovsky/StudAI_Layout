import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * Get weekly ranking
 */
export const getWeeklyRanking = async (): Promise<Schema["RankingEntry"]["type"][]> => {
  const result = await client.models.RankingEntry.list();
  if (!result.data) {
    console.error("Failed to get ranking:", result.errors);
    return [];
  }
  
  // Sort by position
  return result.data.sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
};
