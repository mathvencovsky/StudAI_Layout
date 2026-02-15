import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * Delete content by identifier
 */
export const deleteContent = async (
  input: Schema["Content"]["deleteType"],
): Promise<Schema["Content"]["type"]> => {
  const result = await client.models.Content.delete(input);

  if (!result.data) {
    console.error("Failed to delete content:", result.errors);
    throw new Error("Failed to delete content");
  }

  return result.data;
};
