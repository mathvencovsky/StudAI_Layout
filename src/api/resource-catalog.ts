import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateResourceCatalogInput =
  Schema["ResourceCatalog"]["createType"];
export type UpdateResourceCatalogInput =
  Schema["ResourceCatalog"]["updateType"];

/**
 * List all resources from catalog
 */
export const listResourceCatalog = async (): Promise<
  Schema["ResourceCatalog"]["type"][]
> => {
  const result = await client.models.ResourceCatalog.list();
  if (!result.data) {
    console.error("Failed to list resource catalog:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get resource by ID
 */
export const getResourceCatalog = async (
  identifier: Schema["ResourceCatalog"]["identifier"],
): Promise<Schema["ResourceCatalog"]["type"] | null> => {
  const result = await client.models.ResourceCatalog.get(identifier);
  if (!result.data) {
    console.error("Failed to get resource:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create resource in catalog
 */
export const createResourceCatalog = async (
  input: CreateResourceCatalogInput,
): Promise<Schema["ResourceCatalog"]["type"]> => {
  const result = await client.models.ResourceCatalog.create(input);

  if (!result.data) {
    console.error("Failed to create resource:", result.errors);
    throw new Error("Failed to create resource");
  }

  return result.data;
};

/**
 * Update resource in catalog
 */
export const updateResourceCatalog = async (
  input: UpdateResourceCatalogInput,
): Promise<Schema["ResourceCatalog"]["type"]> => {
  const result = await client.models.ResourceCatalog.update(input);

  if (!result.data) {
    console.error("Failed to update resource:", result.errors);
    throw new Error("Failed to update resource");
  }

  return result.data;
};

/**
 * Delete resource from catalog
 */
export const deleteResourceCatalog = async (
  identifier: Schema["ResourceCatalog"]["identifier"],
): Promise<void> => {
  const result = await client.models.ResourceCatalog.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete resource:", result.errors);
    throw new Error("Failed to delete resource");
  }
};
