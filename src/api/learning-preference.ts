import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type LearningPreference,
  type LearningPreferenceCreateInput,
  type LearningPreferenceUpdateInput,
} from "@/model/learning-preference";

const client = generateClient<Schema>();

/**
 * Check if mock learning preference adapter is active
 */
function isMockAdapterActive(): boolean {
  return typeof window !== "undefined" && !!(window as any).__STUDAI_LEARNING_PREFERENCE_ADAPTER__;
}

/**
 * Get the mock adapter if available
 */
function getMockAdapter() {
  if (typeof window === "undefined") return null;
  return (window as any).__STUDAI_LEARNING_PREFERENCE_ADAPTER__;
}

/**
 * Gets the current user's learning preference (first record)
 */
export const getMyLearningPreference =
  async (): Promise<LearningPreference | null> => {
    // Use mock adapter if available
    if (isMockAdapterActive()) {
      const adapter = getMockAdapter();
      console.log("🎭 Using mock adapter for getMyLearningPreference");
      return await adapter.get();
    }
    
    // Otherwise use real Amplify client
    const result = await client.models.LearningPreference.list();
    return result.data?.[0] ?? null;
  };

/**
 * Creates a learning preference
 */
export const createLearningPreference = async (
  input: LearningPreferenceCreateInput,
): Promise<LearningPreference> => {
  // Use mock adapter if available
  if (isMockAdapterActive()) {
    const adapter = getMockAdapter();
    console.log("🎭 Using mock adapter for createLearningPreference");
    return await adapter.create(input);
  }
  
  // Otherwise use real Amplify client
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
  // Use mock adapter if available
  if (isMockAdapterActive()) {
    const adapter = getMockAdapter();
    console.log("🎭 Using mock adapter for updateLearningPreference");
    return await adapter.update(input);
  }
  
  // Otherwise use real Amplify client
  const result = await client.models.LearningPreference.update(input);
  if (!result.data) throw new Error("Failed to update learning preference");
  return result.data;
};
