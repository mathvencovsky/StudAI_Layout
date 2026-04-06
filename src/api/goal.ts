import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateGoalInput = Schema["Goal"]["createType"];
export type UpdateGoalInput = Schema["Goal"]["updateType"];

/**
 * List user's goals
 */
export const listGoals = async (): Promise<Schema["Goal"]["type"][]> => {
  if (!client.models.Goal) return [];
  const result = await client.models.Goal.list();
  if (!result.data) {
    console.error("Failed to list goals:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get goal by ID
 */
export const getGoal = async (
  identifier: Schema["Goal"]["identifier"],
): Promise<Schema["Goal"]["type"] | null> => {
  const result = await client.models.Goal.get(identifier);
  if (!result.data) {
    console.error("Failed to get goal:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create goal
 */
export const createGoal = async (
  input: CreateGoalInput,
): Promise<Schema["Goal"]["type"]> => {
  const result = await client.models.Goal.create(input);

  if (!result.data) {
    console.error("Failed to create goal:", result.errors);
    throw new Error("Failed to create goal");
  }

  return result.data;
};

/**
 * Update goal
 */
export const updateGoal = async (
  input: UpdateGoalInput,
): Promise<Schema["Goal"]["type"]> => {
  const result = await client.models.Goal.update(input);

  if (!result.data) {
    console.error("Failed to update goal:", result.errors);
    throw new Error("Failed to update goal");
  }

  return result.data;
};

/**
 * Delete goal
 */
export const deleteGoal = async (
  identifier: Schema["Goal"]["identifier"],
): Promise<void> => {
  const result = await client.models.Goal.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete goal:", result.errors);
    throw new Error("Failed to delete goal");
  }
};
