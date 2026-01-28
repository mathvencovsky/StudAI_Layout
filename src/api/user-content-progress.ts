import { z } from "zod";

// TODO: migrate to amplify - define proper user content progress types
export interface UserContentProgress {
  id: string;
  uid: string;
  moduleId: string;
  contentId: string;
  isCompleted: boolean;
  completionDate?: string;
}

export const ToggleContentCompletionInputSchema = z.object({
  moduleId: z.string(),
  contentId: z.string(),
  isCompleted: z.boolean(),
});
export type ToggleContentCompletionInput = z.infer<
  typeof ToggleContentCompletionInputSchema
>;

export type GetUserContentProgressResponse = {
  items: UserContentProgress[];
};

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
 * Toggle content completion status for the current user
 * Creates or updates entry in userContentProgress collection
 */
export const toggleContentCompletion = async (
  input: ToggleContentCompletionInput,
): Promise<UserContentProgress> => {
  // TODO: migrate to amplify
  return {} as UserContentProgress;
};

/**
 * Get all content completion status for a module for the current user
 * Returns array of UserContentProgress records
 */
export const getUserContentProgress = async (
  moduleId: string,
): Promise<GetUserContentProgressResponse> => {
  // TODO: migrate to amplify
  return {} as GetUserContentProgressResponse;
};
