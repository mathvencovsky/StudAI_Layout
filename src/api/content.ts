import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateContentInput = Omit<
  Schema["Content"]["createType"],
  "createdAt" | "updatedAt"
>;

/** API: list all content */
export const listContent = async (): Promise<Schema["Content"]["type"][]> => {
  const result = await client.models.Content.list();
  if (!result.data) {
    console.error("Failed to list content:", result.errors);
    return [];
  }

  return result.data;
};

/** API: get single content */
export const getContent = async (
  identifier: Schema["Content"]["identifier"],
): Promise<Schema["Content"]["type"] | null> => {
  const result = await client.models.Content.get(identifier);
  if (!result.data) {
    console.error("Failed to get content:", result.errors);
    return null;
  }

  return result.data;
};

/** API: create content (stores all strings exactly as provided; no trimming/validation here) */
export const createContent = async (
  input: CreateContentInput,
): Promise<Schema["Content"]["type"]> => {
  const now = Date.now();
  const result = await client.models.Content.create({
    ...input,
    createdAt: now,
    updatedAt: now,
  });

  if (!result.data) {
    console.error("Failed to create content:", result.errors);
    throw new Error("Failed to create content");
  }

  return result.data;
};

/** API: update content (preserves createdAt, only updates updatedAt) */
export const updateContent = async (
  input: Schema["Content"]["updateType"],
): Promise<Schema["Content"]["type"]> => {
  const result = await client.models.Content.update({
    ...input,
    updatedAt: Date.now(),
  });

  if (!result.data) {
    console.error("Failed to update content:", result.errors);
    throw new Error("Failed to update content");
  }

  return result.data;
};
