/**
 * React Query hooks for ContentEnginePrompt
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContentEnginePrompt,
  getContentEnginePrompt,
  listContentEnginePrompts,
  updateContentEnginePrompt,
  deleteContentEnginePrompt,
  getActivePromptByType,
  getPromptVersions,
  activatePromptVersion,
  type CreateContentEnginePromptInput,
  type UpdateContentEnginePromptInput,
} from "@/api/content-engine-prompt";

// Query keys
const QUERY_KEYS = {
  all: ["contentEnginePrompts"] as const,
  lists: () => [...QUERY_KEYS.all, "list"] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  activeByType: (type: string) => [...QUERY_KEYS.all, "active", type] as const,
  versions: (name: string) => [...QUERY_KEYS.all, "versions", name] as const,
};

/**
 * Get a specific prompt by ID
 */
export const useGetContentEnginePrompt = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => getContentEnginePrompt(id),
    enabled: !!id,
  });
};

/**
 * List all prompts
 */
export const useListContentEnginePrompts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: listContentEnginePrompts,
  });
};

/**
 * Get active prompt by type
 */
export const useGetActivePromptByType = (
  promptType: "system" | "course_builder" | "coach" | "recommendations"
) => {
  return useQuery({
    queryKey: QUERY_KEYS.activeByType(promptType),
    queryFn: () => getActivePromptByType(promptType),
    enabled: !!promptType,
  });
};

/**
 * Get all versions of a prompt by name
 */
export const useGetPromptVersions = (name: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.versions(name),
    queryFn: () => getPromptVersions(name),
    enabled: !!name,
  });
};

/**
 * Create a new prompt
 */
export const useCreateContentEnginePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateContentEnginePromptInput) =>
      createContentEnginePrompt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
    },
  });
};

/**
 * Update a prompt
 */
export const useUpdateContentEnginePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateContentEnginePromptInput) =>
      updateContentEnginePrompt(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(data.id) });
      if (data.promptType) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.activeByType(data.promptType),
        });
      }
    },
  });
};

/**
 * Delete a prompt
 */
export const useDeleteContentEnginePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContentEnginePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
    },
  });
};

/**
 * Activate a specific prompt version
 */
export const useActivatePromptVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activatePromptVersion(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(data.id) });
      if (data.promptType) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.activeByType(data.promptType),
        });
      }
    },
  });
};
