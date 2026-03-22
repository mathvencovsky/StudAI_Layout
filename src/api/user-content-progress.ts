import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type UserContentProgress,
  type UserContentProgressCreateInput,
  type UserContentProgressUpdateInput,
  type UserContentProgressWithContent,
  progressWithContentSelectionSet,
} from "@/model/user-content-progress";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

/**
 * List all content progress records for the current user
 */
export const listAllUserContentProgress = async (): Promise<UserContentProgress[]> => {
  const result = await client.models.UserContentProgress.list();
  if (!result.data) {
    console.error("Failed to list user content progress:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Toggle content completion status for the current user
 * Creates or updates entry in userContentProgress collection
 */
export const toggleContentCompletion = async (input: {
  moduleId: string;
  contentId: string;
  isCompleted: boolean;
}): Promise<UserContentProgress> => {
  await getCurrentUserId();

  const existingResult = await client.models.UserContentProgress.list({
    filter: {
      and: [
        { moduleId: { eq: input.moduleId } },
        { contentId: { eq: input.contentId } },
      ],
    },
  });

  if (existingResult.data && existingResult.data.length > 0) {
    const existing = existingResult.data[0];
    const updateInput: UserContentProgressUpdateInput = {
      id: existing.id,
      isCompleted: input.isCompleted,
      completionDate: input.isCompleted ? Math.floor(Date.now() / 1000) : undefined,
    };

    const result = await client.models.UserContentProgress.update(updateInput);

    if (!result.data) {
      console.error("Failed to update content progress:", result.errors);
      throw new Error("Failed to update content progress");
    }

    return result.data;
  } else {
    const createInput: UserContentProgressCreateInput = {
      moduleId: input.moduleId,
      contentId: input.contentId,
      isCompleted: input.isCompleted,
      completionDate: input.isCompleted ? Math.floor(Date.now() / 1000) : undefined,
    };

    const result = await client.models.UserContentProgress.create(createInput);

    if (!result.data) {
      console.error("Failed to create content progress:", result.errors);
      throw new Error("Failed to create content progress");
    }

    return result.data;
  }
};

/**
 * Get all content completion status for a module for the current user
 * Returns array of UserContentProgress records
 */
export const getUserContentProgress = async (
  moduleId: string,
): Promise<UserContentProgress[]> => {
  await getCurrentUserId();

  const result = await client.models.UserContentProgress.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!result.data) {
    console.error("Failed to get user content progress:", result.errors);
    return [];
  }

  return result.data;
};

/**
 * Lists all user content progress with related content data
 */
export const listAllUserContentProgressWithContent = async (): Promise<UserContentProgressWithContent[]> => {
  const result = await client.models.UserContentProgress.list({
    selectionSet: progressWithContentSelectionSet,
  });
  if (!result.data) {
    console.error("Failed to list user content progress with content:", result.errors);
    return [];
  }
  return result.data;
};
