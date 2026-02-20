/**
 * React Query hooks for CreatorCatalog
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCreatorCatalog,
  getCreatorCatalog,
  listCreatorCatalog,
  updateCreatorCatalog,
  deleteCreatorCatalog,
  searchCreatorsByName,
  getCreatorsByArea,
  getVerifiedCreators,
  getCreatorsByLanguage,
  getTeoMeWhyCreator,
  type CreateCreatorCatalogInput,
} from "@/api/creator-catalog";

const QUERY_KEY = "creatorCatalog";

/**
 * Get creator by ID
 */
export const useGetCreatorCatalog = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getCreatorCatalog(id),
    enabled: !!id,
  });
};

/**
 * List all creators
 */
export const useListCreatorCatalog = () => {
  return useQuery({
    queryKey: [QUERY_KEY, "list"],
    queryFn: listCreatorCatalog,
  });
};

/**
 * Search creators by name
 */
export const useSearchCreatorsByName = (name: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, "search", name],
    queryFn: () => searchCreatorsByName(name),
    enabled: !!name && name.length > 0,
  });
};

/**
 * Get creators by area
 */
export const useGetCreatorsByArea = (area: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, "area", area],
    queryFn: () => getCreatorsByArea(area),
    enabled: !!area,
  });
};

/**
 * Get verified creators
 */
export const useGetVerifiedCreators = () => {
  return useQuery({
    queryKey: [QUERY_KEY, "verified"],
    queryFn: getVerifiedCreators,
  });
};

/**
 * Get creators by language
 */
export const useGetCreatorsByLanguage = (language: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, "language", language],
    queryFn: () => getCreatorsByLanguage(language),
    enabled: !!language,
  });
};

/**
 * Get TeoMeWhy creator
 */
export const useGetTeoMeWhyCreator = () => {
  return useQuery({
    queryKey: [QUERY_KEY, "teomewhy"],
    queryFn: getTeoMeWhyCreator,
  });
};

/**
 * Create creator
 */
export const useCreateCreatorCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCreatorCatalogInput) =>
      createCreatorCatalog(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Update creator
 */
export const useUpdateCreatorCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateCreatorCatalogInput>;
    }) => updateCreatorCatalog(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Delete creator
 */
export const useDeleteCreatorCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCreatorCatalog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
