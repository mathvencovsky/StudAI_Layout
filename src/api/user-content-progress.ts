import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

export interface GetUserContentProgressResponse {
  items: Schema["UserContentProgress"]["type"][];
}

/**
 * Toggle content completion status for the current user
 * Creates or updates entry in userContentProgress collection
 */
export const toggleContentCompletion = async (input: {
  moduleId: string;
  contentId: string;
  isCompleted: boolean;
}): Promise<Schema["UserContentProgress"]["type"]> => {
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
    const updateInput: Schema["UserContentProgress"]["updateType"] = {
      id: existing.id,
      isCompleted: input.isCompleted,
      completionDate: input.isCompleted ? Date.now() : undefined,
      updatedAt: Date.now(),
    };

    const result = await client.models.UserContentProgress.update(updateInput);

    if (!result.data) {
      console.error("Failed to update content progress:", result.errors);
      throw new Error("Failed to update content progress");
    }

    return result.data;
  } else {
    const createInput: Schema["UserContentProgress"]["createType"] = {
      moduleId: input.moduleId,
      contentId: input.contentId,
      isCompleted: input.isCompleted,
      completionDate: input.isCompleted ? Date.now() : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
): Promise<GetUserContentProgressResponse> => {
  await getCurrentUserId();

  const result = await client.models.UserContentProgress.list({
    filter: { moduleId: { eq: moduleId } },
  });

  if (!result.data) {
    console.error("Failed to get user content progress:", result.errors);
    return { items: [] };
  }

  return { items: result.data };
};
