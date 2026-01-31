import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type Module,
  type ModuleIdentifier,
  type ModuleCreateInput,
  type ModuleUpdateInput,
} from "@/model/module";

const client = generateClient<Schema>();

export type ModuleStatus = "not_started" | "in_progress" | "completed";

export interface GetModulesParams {
  q?: string;
  status?: ModuleStatus | "all";
  uid?: string;
}

/**
 * Get modules with optional filtering by text search and status
 */
export const getModules = async (params: GetModulesParams): Promise<Module[]> => {
  const result = await client.models.Module.list();

  if (!result.data) {
    console.error("Failed to get modules:", result.errors);
    return [];
  }

  let modules = result.data;

  if (params.q) {
    const searchTerm = params.q.toLowerCase();
    modules = modules.filter(
      (module) =>
        module.title.toLowerCase().includes(searchTerm) ||
        module.description.toLowerCase().includes(searchTerm),
    );
  }

  return modules;
};

/**
 * Get module title suggestions based on search text
 */
export const getModuleSuggestions = async (qText: string): Promise<string[]> => {
  const result = await client.models.Module.list();

  if (!result.data) {
    console.error("Failed to get module suggestions:", result.errors);
    return [];
  }

  const searchTerm = qText.toLowerCase();
  const suggestions = result.data
    .filter((module) => module.title.toLowerCase().includes(searchTerm))
    .map((module) => module.title)
    .slice(0, 10);

  return suggestions;
};

/**
 * Create a new module with optional content associations
 */
export const createModule = async (input: {
  title: string;
  description: string;
  contentIds?: string[];
}): Promise<Module> => {
  const moduleInput: ModuleCreateInput = {
    title: input.title,
    description: input.description,
    upvoteCount: 0,
    downvoteCount: 0,
  };

  const result = await client.models.Module.create(moduleInput);

  if (!result.data) {
    console.error("Failed to create module:", result.errors);
    throw new Error("Failed to create module");
  }

  const module = result.data;

  if (input.contentIds && input.contentIds.length > 0) {
    const moduleContentPromises = input.contentIds.map(
      (contentId: string, index: number) =>
        client.models.ModuleContent.create({
          moduleId: module.id,
          contentId,
          position: index + 1,
          isRequired: true,
        }),
    );

    await Promise.all(moduleContentPromises);
  }

  return module;
};

/**
 * Update an existing module and its content associations
 */
export const updateModule = async (input: {
  id: string;
  title?: string;
  description?: string;
  contentIds?: string[];
}): Promise<Module> => {
  const updateInput: ModuleUpdateInput = {
    id: input.id,
    title: input.title,
    description: input.description,
  };

  const result = await client.models.Module.update(updateInput);

  if (!result.data) {
    console.error("Failed to update module:", result.errors);
    throw new Error("Failed to update module");
  }

  if (input.contentIds) {
    const existingContents = await client.models.ModuleContent.list({
      filter: { moduleId: { eq: input.id } },
    });

    if (existingContents.data) {
      const deletePromises = existingContents.data.map((content) =>
        client.models.ModuleContent.delete({ id: content.id }),
      );
      await Promise.all(deletePromises);
    }

    const moduleContentPromises = input.contentIds.map(
      (contentId: string, index: number) =>
        client.models.ModuleContent.create({
          moduleId: input.id,
          contentId,
          position: index + 1,
          isRequired: true,
        }),
    );

    await Promise.all(moduleContentPromises);
  }

  return result.data;
};

/**
 * Get a single module by ID
 */
export const getModule = async (
  identifier: ModuleIdentifier,
): Promise<Module | null> => {
  const result = await client.models.Module.get(identifier);

  if (!result.data) {
    console.error("Failed to get module:", result.errors);
    return null;
  }

  return result.data;
};
