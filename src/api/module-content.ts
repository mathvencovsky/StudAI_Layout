import { generateClient, SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

// Use selectionSet to define which fields to load for ModuleContent with related Content
const moduleContentSelectionSet = [
  "id",
  "moduleId",
  "contentId",
  "position",
  "isRequired",
  "content.id",
  "content.title",
  "content.description",
  "content.type",
  "content.durationInSeconds",
  "content.link",
  "content.category",
  "content.level",
  "content.createdAt",
  "content.updatedAt",
] as const;

type ModuleContentWithContent = SelectionSet<
  Schema["ModuleContent"]["type"],
  typeof moduleContentSelectionSet
>;

// Infer types from schema instead of creating custom interfaces
export type ModuleContentWithContentType = ModuleContentWithContent;

export type GetModuleContentsParams = {
  moduleId?: string;
  type?: Schema["Content"]["type"]["type"] | "all";
};

export type GetModuleContentsResponse = {
  items: ModuleContentWithContentType[];
};

/**
 * Get all contents for a module with optional type filtering
 * @param params - Query parameters including moduleId and optional type filter
 * @returns List of contents in the module with their position and metadata
 */
export const getModuleContents = async (
  params: GetModuleContentsParams,
): Promise<GetModuleContentsResponse> => {
  if (!params.moduleId) {
    return { items: [] };
  }

  const result = await client.models.ModuleContent.list({
    filter: { moduleId: { eq: params.moduleId } },
    selectionSet: moduleContentSelectionSet,
  });

  if (!result.data) {
    console.error("Failed to get module contents:", result.errors);
    return { items: [] };
  }

  let filteredContents = result.data.filter(
    (moduleContent): moduleContent is ModuleContentWithContent =>
      moduleContent.content !== null,
  );

  if (params.type && params.type !== "all") {
    filteredContents = filteredContents.filter(
      (moduleContent) => moduleContent.content.type === params.type,
    );
  }

  filteredContents.sort((a, b) => a.position - b.position);

  return { items: filteredContents };
};

/**
 * Get available content items for selection
 * @returns List of all available content items
 */
export const getAvailableContent = async (): Promise<
  Schema["Content"]["type"][]
> => {
  const result = await client.models.Content.list();
  if (!result.data) {
    console.error("Failed to get available content:", result.errors);
    return [];
  }

  return result.data;
};
