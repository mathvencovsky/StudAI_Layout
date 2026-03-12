import { useQuery, useMutation, queryOptions } from "@tanstack/react-query";
import {
  verifyUrl,
  verifyUrls,
  getVerifiedResource,
} from "@/api/resource-catalog-search";

/**
 * Hook to verify a single URL
 */
export const verifyUrlQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ["url-verification", url],
    queryFn: async () => {
      try {
        return await verifyUrl(url);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: url.length > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

export const useVerifyUrl = (url: string) =>
  useQuery(verifyUrlQueryOptions(url));

/**
 * Hook to verify multiple URLs
 */
export const useVerifyUrls = () => {
  return useMutation({
    mutationFn: async (urls: string[]) => {
      return await verifyUrls(urls);
    },
  });
};

/**
 * Hook to get a verified resource by ID
 */
export const getVerifiedResourceQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["resource-catalog", "verified", id],
    queryFn: async () => {
      try {
        return await getVerifiedResource(id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: id.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

export const useGetVerifiedResource = (id: string) =>
  useQuery(getVerifiedResourceQueryOptions(id));
