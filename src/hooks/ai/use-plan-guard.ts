import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  checkPlanLimit,
  getUserPlan,
  getTodayUsage,
  getFeatureUsageSummary,
  isProUser,
} from "@/lib/ai/plan-guard";
import type { FeatureType } from "../../../amplify/data/config/plan-limits";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Get current user ID from auth session
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
 * Hook to check if user can use a feature
 */
export const checkPlanLimitQueryOptions = (feature: FeatureType) =>
  queryOptions({
    queryKey: ["plan-guard", "check", feature],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      return await checkPlanLimit(userId, feature);
    },
    staleTime: 30 * 1000, // 30 seconds
  });

export const useCheckPlanLimit = (feature: FeatureType) =>
  useQuery(checkPlanLimitQueryOptions(feature));

/**
 * Hook to get user's current plan
 */
export const getUserPlanQueryOptions = () =>
  queryOptions({
    queryKey: ["plan-guard", "user-plan"],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      return await getUserPlan(userId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useGetUserPlan = () => useQuery(getUserPlanQueryOptions());

/**
 * Hook to get today's usage
 */
export const getTodayUsageQueryOptions = () =>
  queryOptions({
    queryKey: ["plan-guard", "today-usage"],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      return await getTodayUsage(userId);
    },
    staleTime: 60 * 1000, // 1 minute
  });

export const useGetTodayUsage = () => useQuery(getTodayUsageQueryOptions());

/**
 * Hook to get usage summary for a feature
 */
export const getFeatureUsageSummaryQueryOptions = (feature: FeatureType) =>
  queryOptions({
    queryKey: ["plan-guard", "feature-usage", feature],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      return await getFeatureUsageSummary(userId, feature);
    },
    staleTime: 60 * 1000, // 1 minute
  });

export const useGetFeatureUsageSummary = (feature: FeatureType) =>
  useQuery(getFeatureUsageSummaryQueryOptions(feature));

/**
 * Hook to check if user is Pro
 */
export const isProUserQueryOptions = () =>
  queryOptions({
    queryKey: ["plan-guard", "is-pro"],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      return await isProUser(userId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useIsProUser = () => useQuery(isProUserQueryOptions());

/**
 * Hook to check multiple features at once
 */
export const useCheckMultipleFeatures = (features: FeatureType[]) => {
  const results = features.map((feature) => useCheckPlanLimit(feature));

  return {
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    data: results.map((r) => r.data),
    allAllowed: results.every((r) => r.data?.allowed),
  };
};
