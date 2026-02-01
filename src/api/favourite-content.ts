import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type FavouriteContent,
  type FavouriteContentCreateInput,
  type FavouriteContentDeleteInput,
} from "@/model/favourite-content";

const client = generateClient<Schema>();

/**
 * Lists all favourite contents for the current user
 */
export const listFavouriteContents = async (): Promise<FavouriteContent[]> => {
  const result = await client.models.FavouriteContent.list();
  return result.data ?? [];
};

/**
 * Gets a favourite content by content ID
 */
export const getFavouriteContent = async (
  contentId: string,
): Promise<FavouriteContent | null> => {
  const result = await client.models.FavouriteContent.list({
    filter: { contentId: { eq: contentId } },
  });
  return result.data?.[0] ?? null;
};

/**
 * Creates a new favourite content
 */
export const createFavouriteContent = async (
  input: FavouriteContentCreateInput,
): Promise<FavouriteContent> => {
  const result = await client.models.FavouriteContent.create(input);
  if (!result.data) {
    throw new Error("Failed to create favourite content");
  }
  return result.data;
};

/**
 * Deletes a favourite content
 */
export const deleteFavouriteContent = async (
  input: FavouriteContentDeleteInput,
): Promise<void> => {
  await client.models.FavouriteContent.delete(input);
};
