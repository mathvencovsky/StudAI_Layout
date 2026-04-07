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

/**
 * Mark a module as completed for the current user
 */
export const completeModule = async (
  moduleId: string,
): Promise<UserModuleProgress> => {
  await getCurrentUserId();

  const result = await client.models.UserModuleProgress.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("Module progress not found");
  }

  const updateResult = await client.models.UserModuleProgress.update({
    id: result.data[0].id,
    completionDate: Date.now(),
  });

  if (!updateResult.data) {
    console.error("Failed to complete module:", updateResult.errors);
    throw new Error("Failed to complete module");
  }

  return updateResult.data;
};

/**
 * List all module progress records for the current user
 */
export const listUserModuleProgress = async (): Promise<UserModuleProgress[]> => {
  if (!client.models.UserModuleProgress) return [];
  try {
    const result = await client.models.UserModuleProgress.list();
    if (!result.data) return [];
    return result.data;
  } catch (e) {
    console.warn("listUserModuleProgress failed:", e);
    return [];
  }
};

/**
 * Mark a module as incomplete for the current user
 */
export const uncompleteModule = async (
  moduleId: string,
): Promise<UserModuleProgress> => {
  await getCurrentUserId();

  const result = await client.models.UserModuleProgress.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("Module progress not found");
  }

  const updateResult = await client.models.UserModuleProgress.update({
    id: result.data[0].id,
    completionDate: null,
  });

  if (!updateResult.data) {
    console.error("Failed to uncomplete module:", updateResult.errors);
    throw new Error("Failed to uncomplete module");
  }

  return updateResult.data;
};
