/**
 * Creator Catalog API
 * 
 * Manages creators/sources (YouTube channels, official sites, etc.)
 * that provide educational resources.
 */

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreatorCatalogType = Schema["CreatorCatalog"]["type"];
export type CreateCreatorCatalogInput = Omit<
  Schema["CreatorCatalog"]["type"],
  "id" | "createdAt" | "updatedAt" | "resources"
>;

/**
 * Create a new creator in the catalog
 */
export const createCreatorCatalog = async (
  input: CreateCreatorCatalogInput
): Promise<CreatorCatalogType> => {
  const result = await client.models.CreatorCatalog.create(input);
  if (!result.data) {
    throw new Error("Failed to create creator");
  }
  return result.data;
};

/**
 * Get creator by ID
 */
export const getCreatorCatalog = async (
  id: string
): Promise<CreatorCatalogType | null> => {
  const result = await client.models.CreatorCatalog.get({ id });
  return result.data || null;
};

/**
 * List all creators
 */
export const listCreatorCatalog = async (): Promise<CreatorCatalogType[]> => {
  const result = await client.models.CreatorCatalog.list();
  return result.data || [];
};

/**
 * Update creator
 */
export const updateCreatorCatalog = async (
  id: string,
  input: Partial<CreateCreatorCatalogInput>
): Promise<CreatorCatalogType> => {
  const result = await client.models.CreatorCatalog.update({
    id,
    ...input,
  });
  if (!result.data) {
    throw new Error("Failed to update creator");
  }
  return result.data;
};

/**
 * Delete creator
 */
export const deleteCreatorCatalog = async (id: string): Promise<void> => {
  await client.models.CreatorCatalog.delete({ id });
};

/**
 * Search creators by name
 */
export const searchCreatorsByName = async (
  name: string
): Promise<CreatorCatalogType[]> => {
  const result = await client.models.CreatorCatalog.list({
    filter: {
      name: { contains: name },
    },
  });
  return result.data || [];
};

/**
 * Get creators by area
 */
export const getCreatorsByArea = async (
  area: string
): Promise<CreatorCatalogType[]> => {
  const allCreators = await listCreatorCatalog();
  return allCreators.filter((creator) =>
    creator.areas?.some((a) => a && a.toLowerCase().includes(area.toLowerCase()))
  );
};

/**
 * Get verified creators only
 */
export const getVerifiedCreators = async (): Promise<CreatorCatalogType[]> => {
  const result = await client.models.CreatorCatalog.list({
    filter: {
      verified: { eq: true },
    },
  });
  return result.data || [];
};

/**
 * Get creators by language
 */
export const getCreatorsByLanguage = async (
  language: string
): Promise<CreatorCatalogType[]> => {
  const allCreators = await listCreatorCatalog();
  return allCreators.filter((creator) =>
    creator.languages?.includes(language)
  );
};

/**
 * Get TeoMeWhy creator
 */
export const getTeoMeWhyCreator = async (): Promise<CreatorCatalogType | null> => {
  const creators = await searchCreatorsByName("TeoMeWhy");
  return creators[0] || null;
};
