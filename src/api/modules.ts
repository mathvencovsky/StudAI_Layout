import { z } from "zod";

// TODO: migrate to amplify - define proper module types
export interface Module {
  id: string;
  title: string;
  description: string;
}

// TODO: migrate to amplify - define proper module content types
export interface ModuleContent {
  moduleId: string;
  contentId: string;
  position: number;
}

// TODO: migrate to amplify - define proper user module progress types
export interface UserModuleProgress {
  id: string;
  uid: string;
  moduleId: string;
  startDate: string;
  completionDate?: string;
}

/* ========================== Zod Schemas & Types ========================== */

export const ModuleStatusEnum = z.enum([
  "not_started",
  "in_progress",
  "completed",
]);
export type ModuleStatus = z.infer<typeof ModuleStatusEnum>;

export const CreateModuleInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentIds: z.array(z.string()).optional().default([]),
});
export type CreateModuleInput = z.infer<typeof CreateModuleInputSchema>;

export const UpdateModuleInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentIds: z.array(z.string()).optional().default([]),
});
export type UpdateModuleInput = z.infer<typeof UpdateModuleInputSchema>;

export const GetModulesParamsSchema = z.object({
  q: z.string().optional(),
  status: z.union([ModuleStatusEnum, z.literal("all")]).optional(),
  uid: z.string().optional(),
});
export type GetModulesParams = z.infer<typeof GetModulesParamsSchema>;

export const GetModulesResponseSchema = z.object({
  items: z.array(z.any()),
});
export type GetModulesResponse = z.infer<typeof GetModulesResponseSchema>;

export const GetModuleSuggestionsResponseSchema = z.object({
  suggestions: z.array(z.string()),
});
export type GetModuleSuggestionsResponse = z.infer<
  typeof GetModuleSuggestionsResponseSchema
>;

/* ========================== API: getModules ========================== */

/**
 * Get modules with optional filtering by text search and status
 * @param params - Query parameters including optional search text, status filter, and uid
 * @returns List of modules matching the criteria
 */
export const getModules = async (
  params: GetModulesParams,
): Promise<GetModulesResponse> => {
  // TODO: migrate to amplify
  return {} as GetModulesResponse;
};

/* ====================== API: getModuleSuggestions ======================= */

/**
 * Get module title suggestions based on search text
 * @param qText - Search query text
 * @returns List of unique module titles matching the query
 */
export const getModuleSuggestions = async (
  qText: string,
): Promise<GetModuleSuggestionsResponse> => {
  // TODO: migrate to amplify
  return {} as GetModuleSuggestionsResponse;
};

/* ========================== Module Creation & Editing Functions ========================== */

/**
 * Create a new module with optional content associations
 * @param input - Module creation data including title, description, and optional content IDs
 * @returns The created module
 */
export const createModule = async (
  input: CreateModuleInput,
): Promise<Module> => {
  // TODO: migrate to amplify
  return {} as Module;
};

/**
 * Update an existing module and its content associations
 * @param input - Module update data including ID, title, description, and optional content IDs
 * @returns The updated module
 */
export const updateModule = async (
  input: UpdateModuleInput,
): Promise<Module> => {
  // TODO: migrate to amplify
  return {} as Module;
};

/**
 * Get a single module by ID
 * @param moduleId - The module ID
 * @returns The module or null if not found
 */
export const getModule = async (moduleId: string): Promise<Module | null> => {
  // TODO: migrate to amplify
  return {} as Module | null;
};
