import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  searchResources,
  searchResourcesByKeyword,
  getResourcesByTags,
  getResourcesForTopic,
  getTeoMeWhyResources,
  type ResourceSearchParams,
} from "@/api/resource-catalog-search";

/**
 * Hook to search resources with filters
 */
export const searchResourcesQueryOptions = (params: ResourceSearchParams) =>
  queryOptions({
    queryKey: ["resource-catalog", "search", params],
    queryFn: async () => {
      try {
        return await searchResources(params);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useSearchResources = (params: ResourceSearchParams) =>
  useQuery(searchResourcesQueryOptions(params));

/**
 * Hook to search resources by keyword
 */
export const searchResourcesByKeywordQueryOptions = (
  keyword: string,
  language: "pt" | "en" = "pt"
) =>
  queryOptions({
    queryKey: ["resource-catalog", "keyword", keyword, language],
    queryFn: async () => {
      try {
        return await searchResourcesByKeyword(keyword, language);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: keyword.length > 0,
    staleTime: 5 * 60 * 1000,
  });

export const useSearchResourcesByKeyword = (
  keyword: string,
  language: "pt" | "en" = "pt"
) => useQuery(searchResourcesByKeywordQueryOptions(keyword, language));

/**
 * Hook to get resources by tags
 */
export const getResourcesByTagsQueryOptions = (
  tags: string[],
  language: "pt" | "en" = "pt"
) =>
  queryOptions({
    queryKey: ["resource-catalog", "tags", tags, language],
    queryFn: async () => {
      try {
        return await getResourcesByTags(tags, language);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: tags.length > 0,
    staleTime: 5 * 60 * 1000,
  });

export const useGetResourcesByTags = (
  tags: string[],
  language: "pt" | "en" = "pt"
) => useQuery(getResourcesByTagsQueryOptions(tags, language));

/**
 * Hook to get resources for a specific topic and level
 */
export const getResourcesForTopicQueryOptions = (
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  language: "pt" | "en" = "pt",
  limit: number = 10
) =>
  queryOptions({
    queryKey: ["resource-catalog", "topic", topic, level, language, limit],
    queryFn: async () => {
      try {
        return await getResourcesForTopic(topic, level, language, limit);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: topic.length > 0,
    staleTime: 5 * 60 * 1000,
  });

export const useGetResourcesForTopic = (
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  language: "pt" | "en" = "pt",
  limit: number = 10
) =>
  useQuery(getResourcesForTopicQueryOptions(topic, level, language, limit));

/**
 * Hook to get TeoMeWhy resources
 */
export const getTeoMeWhyResourcesQueryOptions = (topic?: string) =>
  queryOptions({
    queryKey: ["resource-catalog", "teomewhy", topic],
    queryFn: async () => {
      try {
        return await getTeoMeWhyResources(topic);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

export const useGetTeoMeWhyResources = (topic?: string) =>
  useQuery(getTeoMeWhyResourcesQueryOptions(topic));
