import { z } from "zod";

// TODO: migrate to amplify - define proper module content types
export interface ModuleContent {
  moduleId: string;
  contentId: string;
  position: number;
}

// TODO: migrate to amplify - define proper content types
export const ContentTypeEnum = z.enum(["video", "article", "tutorial"]);

export interface Content {
  id: string;
  type: z.infer<typeof ContentTypeEnum>;
  category: string;
  level: string;
  title: string;
  description: string;
  link: string;
  durationInSeconds: number;
  createdAt: string;
  updatedAt: string;
}

/* ========================== Zod Schemas & Types ========================== */

export type ContentInModuleView = Content & {
  moduleId: string;
  position: number;
};

export const GetModuleContentsParamsSchema = z.object({
  moduleId: z.string().optional(),
  type: z.union([ContentTypeEnum, z.literal("all")]).optional(),
});
export type GetModuleContentsParams = z.infer<
  typeof GetModuleContentsParamsSchema
>;

export type GetModuleContentsResponse = {
  items: ContentInModuleView[];
};

/* ====================== API: getModuleContents ======================= */

/**
 * Get all contents for a module with optional type filtering
 * @param params - Query parameters including moduleId and optional type filter
 * @returns List of contents in the module with their position and metadata
 */
export const getModuleContents = async (
  params: GetModuleContentsParams,
): Promise<GetModuleContentsResponse> => {
  // TODO: migrate to amplify
  return {} as GetModuleContentsResponse;
};

/**
 * Get available content items for selection
 * @returns List of all available content items
 */
export const getAvailableContent = async (): Promise<Content[]> => {
  // TODO: migrate to amplify
  return {} as Content[];
};
