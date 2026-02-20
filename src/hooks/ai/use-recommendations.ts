import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  generateRecommendations,
  getTopicRecommendations,
  getNextBestAction,
  type RecommendationInput,
} from "@/lib/ai/recommendations";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Get current user ID
 */
async function getCurrentUserId(): Promise<string> {
  const session = await fetchAuthSession();
  const userId = session.userSub;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}

/**
 * Hook to get personalized recommendations
 */
export const generateRecommendationsQueryOptions = (
  context?: string,
  limit?: number
) =>
  queryOptions({
    queryKey: ["recommendations", "personalized", context, limit],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      const input: RecommendationInput = {
        userId,
        context,
        limit,
      };
      return await generateRecommendations(input);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useGenerateRecommendations = (context?: string, limit?: number) =>
  useQuery(generateRecommendationsQueryOptions(context, limit));

/**
 * Hook to get recommendations for a specific topic
 */
export const getTopicRecommendationsQueryOptions = (
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  language: "pt" | "en" = "pt",
  limit: number = 5
) =>
  queryOptions({
    queryKey: ["recommendations", "topic", topic, level, language, limit],
    queryFn: async () => {
      return await getTopicRecommendations(topic, level, language, limit);
    },
    enabled: topic.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

export const useGetTopicRecommendations = (
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  language: "pt" | "en" = "pt",
  limit: number = 5
) => useQuery(getTopicRecommendationsQueryOptions(topic, level, language, limit));

/**
 * Hook to get next best action
 * Used in dashboard
 */
export const getNextBestActionQueryOptions = () =>
  queryOptions({
    queryKey: ["recommendations", "next-action"],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      return await getNextBestAction(userId);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

export const useGetNextBestAction = () =>
  useQuery(getNextBestActionQueryOptions());
