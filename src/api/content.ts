import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateContentInput = Schema["Content"]["createType"];

/**
 * List all content
 */
export const listContent = async (): Promise<Schema["Content"]["type"][]> => {
  const result = await client.models.Content.list();
  if (!result.data) {
    console.error("Failed to list content:", result.errors);
    return [];
  }

  return result.data;
};

/**
 * Get single content by identifier
 */
export const getContent = async (
  identifier: Schema["Content"]["identifier"],
): Promise<Schema["Content"]["type"] | null> => {
  console.log("getContent called with identifier:", identifier);
  const result = await client.models.Content.get(identifier);
  console.log("getContent result:", { data: result.data, errors: result.errors });
  if (!result.data) {
    console.error("Failed to get content:", result.errors);
    return null;
  }

  return result.data;
};

/**
 * Create content
 */
export const createContent = async (
  input: CreateContentInput,
): Promise<Schema["Content"]["type"]> => {
  const result = await client.models.Content.create(input);

  if (!result.data) {
    console.error("Failed to create content:", JSON.stringify(result.errors, null, 2));
    throw new Error("Failed to create content");
  }

  return result.data;
};

/**
 * Update content
 */
export const updateContent = async (
  input: Schema["Content"]["updateType"],
): Promise<Schema["Content"]["type"]> => {
  const result = await client.models.Content.update(input);

  if (!result.data) {
    console.error("Failed to update content:", result.errors);
    throw new Error("Failed to update content");
  }

  return result.data;
};
