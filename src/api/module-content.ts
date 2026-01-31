import { generateClient, type SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { type Content } from "@/model/content";

const client = generateClient<Schema>();

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

export type ModuleContentWithContentType = SelectionSet<
  Schema["ModuleContent"]["type"],
  typeof moduleContentSelectionSet
>;

export interface GetModuleContentsParams {
  moduleId?: string;
  type?: Schema["Content"]["type"]["type"] | "all";
}

/**
 * Get all contents for a module with optional type filtering
 */
export const getModuleContents = async (
  params: GetModuleContentsParams,
): Promise<ModuleContentWithContentType[]> => {
  if (!params.moduleId) {
    return [];
  }

  const result = await client.models.ModuleContent.list({
    filter: { moduleId: { eq: params.moduleId } },
    selectionSet: moduleContentSelectionSet,
  });

  if (!result.data) {
    console.error("Failed to get module contents:", result.errors);
    return [];
  }

  let filteredContents = result.data.filter(
    (moduleContent): moduleContent is ModuleContentWithContentType =>
      moduleContent.content !== null,
  );

  if (params.type && params.type !== "all") {
    filteredContents = filteredContents.filter(
      (moduleContent) => moduleContent.content.type === params.type,
    );
  }

  filteredContents.sort((a, b) => a.position - b.position);

  return filteredContents;
};

/**
 * Get available content items for selection
 */
export const getAvailableContent = async (): Promise<Content[]> => {
  const result = await client.models.Content.list();
  if (!result.data) {
    console.error("Failed to get available content:", result.errors);
    return [];
  }

  return result.data;
};
