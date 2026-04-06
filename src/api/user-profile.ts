import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateUserProfileInput = Schema["UserProfile"]["createType"];
export type UpdateUserProfileInput = Schema["UserProfile"]["updateType"];

/**
 * Get current user's profile
 */
export const getMyProfile = async (): Promise<Schema["UserProfile"]["type"] | null> => {
  if (!client.models.UserProfile) return null;
  const result = await client.models.UserProfile.list();
  if (!result.data || result.data.length === 0) {
    return null;
  }
  return result.data[0];
};

/**
 * Create user profile
 */
export const createUserProfile = async (
  input: CreateUserProfileInput,
): Promise<Schema["UserProfile"]["type"]> => {
  const result = await client.models.UserProfile.create(input);

  if (!result.data) {
    console.error("Failed to create user profile:", result.errors);
    throw new Error("Failed to create user profile");
  }

  return result.data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  input: UpdateUserProfileInput,
): Promise<Schema["UserProfile"]["type"]> => {
  const result = await client.models.UserProfile.update(input);

  if (!result.data) {
    console.error("Failed to update user profile:", result.errors);
    throw new Error("Failed to update user profile");
  }

  return result.data;
};
