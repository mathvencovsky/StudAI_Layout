import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * List user's saved items
 */
export const listSavedItems = async (): Promise<Schema["SavedItem"]["type"][]> => {
  const result = await client.models.SavedItem.list();
  if (!result.data) {
    console.error("Failed to list saved items:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Create saved item
 */
export const createSavedItem = async (
  input: Schema["SavedItem"]["createType"],
): Promise<Schema["SavedItem"]["type"]> => {
  const result = await client.models.SavedItem.create(input);
  if (!result.data) {
    console.error("Failed to create saved item:", result.errors);
    throw new Error("Failed to create saved item");
  }
  return result.data;
};

/**
 * Delete saved item
 */
export const deleteSavedItem = async (
  identifier: Schema["SavedItem"]["identifier"],
): Promise<void> => {
  const result = await client.models.SavedItem.delete(identifier);
  if (!result.data) {
    console.error("Failed to delete saved item:", result.errors);
    throw new Error("Failed to delete saved item");
  }
};
