import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateAiUsageInput = Schema["AiUsage"]["createType"];
export type UpdateAiUsageInput = Schema["AiUsage"]["updateType"];

/**
 * List user's AI usage records
 */
export const listAiUsage = async (): Promise<Schema["AiUsage"]["type"][]> => {
  if (!client.models.AiUsage) return [];
  const result = await client.models.AiUsage.list();
  if (!result.data) {
    console.error("Failed to list AI usage:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get AI usage by ID
 */
export const getAiUsage = async (
  identifier: Schema["AiUsage"]["identifier"],
): Promise<Schema["AiUsage"]["type"] | null> => {
  const result = await client.models.AiUsage.get(identifier);
  if (!result.data) {
    console.error("Failed to get AI usage:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create AI usage record
 */
export const createAiUsage = async (
  input: CreateAiUsageInput,
): Promise<Schema["AiUsage"]["type"]> => {
  const result = await client.models.AiUsage.create(input);

  if (!result.data) {
    console.error("Failed to create AI usage:", result.errors);
    throw new Error("Failed to create AI usage");
  }

  return result.data;
};

/**
 * Update AI usage record
 */
export const updateAiUsage = async (
  input: UpdateAiUsageInput,
): Promise<Schema["AiUsage"]["type"]> => {
  const result = await client.models.AiUsage.update(input);

  if (!result.data) {
    console.error("Failed to update AI usage:", result.errors);
    throw new Error("Failed to update AI usage");
  }

  return result.data;
};

/**
 * Delete AI usage record
 */
export const deleteAiUsage = async (
  identifier: Schema["AiUsage"]["identifier"],
): Promise<void> => {
  const result = await client.models.AiUsage.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete AI usage:", result.errors);
    throw new Error("Failed to delete AI usage");
  }
};
