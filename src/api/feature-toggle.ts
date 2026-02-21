import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * List all feature toggles
 */
export const listFeatureToggles = async (): Promise<Schema["FeatureToggle"]["type"][]> => {
  const result = await client.models.FeatureToggle.list();
  if (!result.data) {
    console.error("Failed to list feature toggles:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Update feature toggle
 */
export const updateFeatureToggle = async (
  input: Schema["FeatureToggle"]["updateType"],
): Promise<Schema["FeatureToggle"]["type"]> => {
  const result = await client.models.FeatureToggle.update(input);
  if (!result.data) {
    console.error("Failed to update feature toggle:", result.errors);
    throw new Error("Failed to update feature toggle");
  }
  return result.data;
};
