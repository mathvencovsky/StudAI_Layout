import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateReviewItemInput = Schema["ReviewItem"]["createType"];
export type UpdateReviewItemInput = Schema["ReviewItem"]["updateType"];

/**
 * List user's review items
 */
export const listReviewItems = async (): Promise<Schema["ReviewItem"]["type"][]> => {
  const result = await client.models.ReviewItem.list();
  if (!result.data) {
    console.error("Failed to list review items:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Create review item
 */
export const createReviewItem = async (
  input: CreateReviewItemInput,
): Promise<Schema["ReviewItem"]["type"]> => {
  const result = await client.models.ReviewItem.create(input);

  if (!result.data) {
    console.error("Failed to create review item:", result.errors);
    throw new Error("Failed to create review item");
  }

  return result.data;
};

/**
 * Update review item
 */
export const updateReviewItem = async (
  input: UpdateReviewItemInput,
): Promise<Schema["ReviewItem"]["type"]> => {
  const result = await client.models.ReviewItem.update(input);

  if (!result.data) {
    console.error("Failed to update review item:", result.errors);
    throw new Error("Failed to update review item");
  }

  return result.data;
};
