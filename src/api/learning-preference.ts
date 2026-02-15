import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type LearningPreference,
  type LearningPreferenceCreateInput,
  type LearningPreferenceUpdateInput,
} from "@/model/learning-preference";

const client = generateClient<Schema>();

/**
 * Gets the current user's learning preference (first record)
 */
export const getMyLearningPreference =
  async (): Promise<LearningPreference | null> => {
    const result = await client.models.LearningPreference.list();
    return result.data?.[0] ?? null;
  };

/**
 * Creates a learning preference
 */
export const createLearningPreference = async (
  input: LearningPreferenceCreateInput,
): Promise<LearningPreference> => {
  const result = await client.models.LearningPreference.create(input);
  if (!result.data) throw new Error("Failed to create learning preference");
  return result.data;
};

/**
 * Updates a learning preference
 */
export const updateLearningPreference = async (
  input: LearningPreferenceUpdateInput,
): Promise<LearningPreference> => {
  const result = await client.models.LearningPreference.update(input);
  if (!result.data) throw new Error("Failed to update learning preference");
  return result.data;
};
