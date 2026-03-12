import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateUserPlanInput = Schema["UserPlan"]["createType"];
export type UpdateUserPlanInput = Schema["UserPlan"]["updateType"];

/**
 * Get current user's plan
 */
export const getMyPlan = async (): Promise<Schema["UserPlan"]["type"] | null> => {
  const result = await client.models.UserPlan.list();
  if (!result.data || result.data.length === 0) {
    return null;
  }
  return result.data[0];
};

/**
 * Create user plan
 */
export const createUserPlan = async (
  input: CreateUserPlanInput,
): Promise<Schema["UserPlan"]["type"]> => {
  const result = await client.models.UserPlan.create(input);

  if (!result.data) {
    console.error("Failed to create user plan:", result.errors);
    throw new Error("Failed to create user plan");
  }

  return result.data;
};

/**
 * Update user plan
 */
export const updateUserPlan = async (
  input: UpdateUserPlanInput,
): Promise<Schema["UserPlan"]["type"]> => {
  const result = await client.models.UserPlan.update(input);

  if (!result.data) {
    console.error("Failed to update user plan:", result.errors);
    throw new Error("Failed to update user plan");
  }

  return result.data;
};
