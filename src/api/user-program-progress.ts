import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * List user's program progress records
 */
export const listUserProgramProgress = async (): Promise<
  Schema["UserProgramProgress"]["type"][]
> => {
  if (!client.models.UserProgramProgress) return [];
  const result = await client.models.UserProgramProgress.list();
  if (!result.data) {
    console.error("Failed to list user program progress:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Create user program progress
 */
export const createUserProgramProgress = async (
  input: Schema["UserProgramProgress"]["createType"],
): Promise<Schema["UserProgramProgress"]["type"]> => {
  const result = await client.models.UserProgramProgress.create(input);
  if (!result.data) {
    console.error("Failed to create user program progress:", result.errors);
    throw new Error("Failed to create user program progress");
  }
  return result.data;
};

/**
 * Update user program progress
 */
export const updateUserProgramProgress = async (
  input: Schema["UserProgramProgress"]["updateType"],
): Promise<Schema["UserProgramProgress"]["type"]> => {
  const result = await client.models.UserProgramProgress.update(input);
  if (!result.data) {
    console.error("Failed to update user program progress:", result.errors);
    throw new Error("Failed to update user program progress");
  }
  return result.data;
};
