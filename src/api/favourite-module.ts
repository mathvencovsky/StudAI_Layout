import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type FavouriteModule,
  type FavouriteModuleCreateInput,
  type FavouriteModuleDeleteInput,
} from "@/model/favourite-module";

const client = generateClient<Schema>();

/**
 * Lists all favourite modules for the current user
 */
export const listFavouriteModules = async (): Promise<FavouriteModule[]> => {
  const result = await client.models.FavouriteModule.list();
  return result.data ?? [];
};

/**
 * Gets a favourite module by module ID
 */
export const getFavouriteModule = async (
  moduleId: string,
): Promise<FavouriteModule | null> => {
  const result = await client.models.FavouriteModule.list({
    filter: { moduleId: { eq: moduleId } },
  });
  return result.data?.[0] ?? null;
};

/**
 * Creates a new favourite module
 */
export const createFavouriteModule = async (
  input: FavouriteModuleCreateInput,
): Promise<FavouriteModule> => {
  const result = await client.models.FavouriteModule.create(input);
  if (!result.data) {
    throw new Error("Failed to create favourite module");
  }
  return result.data;
};

/**
 * Deletes a favourite module
 */
export const deleteFavouriteModule = async (
  input: FavouriteModuleDeleteInput,
): Promise<void> => {
  await client.models.FavouriteModule.delete(input);
};
