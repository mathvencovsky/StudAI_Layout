import { type Schema } from "../../amplify/data/resource";

export type ResourceCatalog = Schema["ResourceCatalog"]["type"];
export type ResourceCatalogIdentifier = Schema["ResourceCatalog"]["identifier"];
export type ResourceCatalogCreateInput = Schema["ResourceCatalog"]["createType"];
export type ResourceCatalogUpdateInput = Schema["ResourceCatalog"]["updateType"];
export type ResourceCatalogDeleteInput = Schema["ResourceCatalog"]["deleteType"];
export type ResourceLanguage = NonNullable<ResourceCatalog["language"]>;
export type ResourceType = NonNullable<ResourceCatalog["type"]>;
export type ResourceLevel = NonNullable<ResourceCatalog["level"]>;

export const RESOURCE_LANGUAGES: ResourceLanguage[] = ["pt", "en"];
export const RESOURCE_TYPES: ResourceType[] = [
  "video",
  "article",
  "docs",
  "repo",
  "playlist",
  "course",
];
export const RESOURCE_LEVELS: ResourceLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];
