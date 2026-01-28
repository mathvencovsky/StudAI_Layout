import { useQuery, queryOptions } from "@tanstack/react-query";
import { extractMetadataFromUrl, type ExtractedMetadata } from "@/api/metadata";

/**
 * Creates query options for extracting metadata from a URL.
 * Caches results to avoid repeated requests for the same URL.
 *
 * @param url - The URL to extract metadata from
 * @returns Query options configured for metadata extraction
 */
export const extractMetadataQueryOptions = (
  url: string,
  enabled: boolean = true
) =>
  queryOptions<ExtractedMetadata | null>({
    queryKey: ["metadata", url],
    queryFn: () => extractMetadataFromUrl(url),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: enabled && !!url,
  });

/**
 * Hook for extracting and caching metadata from a URL.
 * Handles loading and error states, with automatic caching to avoid repeated requests.
 *
 * @param url - The URL to extract metadata from
 * @returns Query result with metadata, loading state, and error state
 */
export const useExtractMetadata = (url: string, enabled: boolean) =>
  useQuery(extractMetadataQueryOptions(url, enabled));
