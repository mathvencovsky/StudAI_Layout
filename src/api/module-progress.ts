import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type UserModuleProgress,
  type UserModuleProgressCreateInput,
} from "@/model/user-module-progress";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

/**
 * Start a module for the current user
 * Creates a new entry in userModuleProgress collection with current timestamp
 */
export const startModule = async (input: {
  moduleId: string;
}): Promise<UserModuleProgress> => {
  await getCurrentUserId();

  const createInput: UserModuleProgressCreateInput = {
    moduleId: input.moduleId,
    startDate: Date.now(),
  };

  const result = await client.models.UserModuleProgress.create(createInput);

  if (!result.data) {
    console.error("Failed to start module:", result.errors);
    throw new Error("Failed to start module");
  }

  return result.data;
};

/**
 * Get the current user's progress for a specific module
 * Returns null if user hasn't started the module
 */
export const getUserModuleProgress = async (
  moduleId: string,
): Promise<UserModuleProgress | null> => {
  await getCurrentUserId();

  const result = await client.models.UserModuleProgress.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!result.data || result.data.length === 0) {
    return null;
  }

  return result.data[0];
};

/**
 * Get the current user's most recently started module
 * Returns null if user hasn't started any modules
 */
export const getLastStartedModule = async (): Promise<UserModuleProgress | null> => {
  await getCurrentUserId();

  const result = await client.models.UserModuleProgress.list();

  if (!result.data || result.data.length === 0) {
    return null;
  }

  const sortedProgress = result.data.sort((a, b) => b.startDate - a.startDate);

  return sortedProgress[0];
};
