/**
 * API Layer for ContentEnginePrompt
 * Manages versioned prompts for the AI Content Engine
 */

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type ContentEnginePrompt = Schema["ContentEnginePrompt"]["type"];
export type CreateContentEnginePromptInput = Omit<
  ContentEnginePrompt,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateContentEnginePromptInput = Partial<CreateContentEnginePromptInput> & {
  id: string;
};

/**
 * Create a new prompt version
 */
export const createContentEnginePrompt = async (
  input: CreateContentEnginePromptInput
): Promise<ContentEnginePrompt> => {
  const result = await client.models.ContentEnginePrompt.create(input);
  if (!result.data) {
    throw new Error("Failed to create content engine prompt");
  }
  return result.data;
};

/**
 * Get a specific prompt by ID
 */
export const getContentEnginePrompt = async (
  id: string
): Promise<ContentEnginePrompt | null> => {
  const result = await client.models.ContentEnginePrompt.get({ id });
  return result.data || null;
};

/**
 * List all prompts
 */
export const listContentEnginePrompts = async (): Promise<ContentEnginePrompt[]> => {
  const result = await client.models.ContentEnginePrompt.list();
  return result.data || [];
};

/**
 * Update a prompt
 */
export const updateContentEnginePrompt = async (
  input: UpdateContentEnginePromptInput
): Promise<ContentEnginePrompt> => {
  const result = await client.models.ContentEnginePrompt.update(input);
  if (!result.data) {
    throw new Error("Failed to update content engine prompt");
  }
  return result.data;
};

/**
 * Delete a prompt
 */
export const deleteContentEnginePrompt = async (id: string): Promise<void> => {
  await client.models.ContentEnginePrompt.delete({ id });
};

/**
 * Get active prompt by type
 */
export const getActivePromptByType = async (
  promptType: "system" | "course_builder" | "coach" | "recommendations"
): Promise<ContentEnginePrompt | null> => {
  const result = await client.models.ContentEnginePrompt.list({
    filter: {
      promptType: { eq: promptType },
      isActive: { eq: true },
    },
  });

  const prompts = result.data || [];
  
  // Return the most recent active prompt
  if (prompts.length === 0) return null;
  
  return prompts.sort((a, b) => {
    const versionA = a.version || "0.0.0";
    const versionB = b.version || "0.0.0";
    return versionB.localeCompare(versionA);
  })[0];
};

/**
 * Get all versions of a prompt by name
 */
export const getPromptVersions = async (
  name: string
): Promise<ContentEnginePrompt[]> => {
  const result = await client.models.ContentEnginePrompt.list({
    filter: {
      name: { eq: name },
    },
  });

  const prompts = result.data || [];
  
  // Sort by version descending
  return prompts.sort((a, b) => {
    const versionA = a.version || "0.0.0";
    const versionB = b.version || "0.0.0";
    return versionB.localeCompare(versionA);
  });
};

/**
 * Activate a specific prompt version (deactivates others of same type)
 */
export const activatePromptVersion = async (
  id: string
): Promise<ContentEnginePrompt> => {
  // Get the prompt to activate
  const prompt = await getContentEnginePrompt(id);
  if (!prompt) {
    throw new Error("Prompt not found");
  }

  // Deactivate all other prompts of the same type
  if (prompt.promptType) {
    const allPrompts = await client.models.ContentEnginePrompt.list({
      filter: {
        promptType: { eq: prompt.promptType },
        isActive: { eq: true },
      },
    });

    const deactivatePromises = (allPrompts.data || [])
      .filter((p) => p.id !== id)
      .map((p) =>
        client.models.ContentEnginePrompt.update({
          id: p.id,
          isActive: false,
        })
      );

    await Promise.all(deactivatePromises);
  }

  // Activate the target prompt
  const result = await client.models.ContentEnginePrompt.update({
    id,
    isActive: true,
  });

  if (!result.data) {
    throw new Error("Failed to activate prompt");
  }

  return result.data;
};
