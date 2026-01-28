import { z } from "zod";

// TODO: migrate to amplify - define proper user module progress types
export interface UserModuleProgress {
  id: string;
  uid: string;
  moduleId: string;
  startDate: string;
  completionDate?: string;
}

export const StartModuleInputSchema = z.object({
  moduleId: z.string(),
});
export type StartModuleInput = z.infer<typeof StartModuleInputSchema>;

/* ========================== Utilities ========================== */

/**
 * Get the current user ID from Firebase auth
 * @throws Error if user is not authenticated
 */
const getCurrentUserId = (): string => {
  // TODO: migrate to amplify - get current user ID
  throw new Error("User not authenticated");
};

/* ========================== API Functions ========================== */

/**
 * Start a module for the current user
 * Creates a new entry in userModuleProgress collection with current timestamp
 */
export const startModule = async (
  input: StartModuleInput,
): Promise<UserModuleProgress> => {
  // TODO: migrate to amplify
  return {} as UserModuleProgress;
};

/**
 * Get the current user's progress for a specific module
 * Returns null if user hasn't started the module
 */
export const getUserModuleProgress = async (
  moduleId: string,
): Promise<UserModuleProgress | null> => {
  // TODO: migrate to amplify
  return {} as UserModuleProgress | null;
};

/**
 * Get the current user's most recently started module
 * Returns null if user hasn't started any modules
 */
export const getLastStartedModule =
  async (): Promise<UserModuleProgress | null> => {
    // TODO: migrate to amplify
    return {} as UserModuleProgress | null;
  };
