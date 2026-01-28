import { getYouTubeVideoId, extractYouTubeMetadata } from "./youtube.js";
import { ExtractedMetadataSchema, type ExtractedMetadata } from "./types.js";

export { ExtractedMetadataSchema, type ExtractedMetadata } from "./types.js";

/**
 * Extracts metadata from a given URL.
 * For YouTube videos, uses YouTube-specific extraction.
 * For other URLs, uses the Microlink API.
 *
 * @param url - The URL to extract metadata from
 * @returns Extracted metadata object, or null if extraction fails
 */
export const extractMetadataFromUrl = async (
  url: string,
): Promise<ExtractedMetadata | null> => {
  try {
    new URL(url);

    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return extractYouTubeMetadata(url, videoId);
    }

    const response = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}`,
    );

    if (!response.ok) {
      console.error(`Failed to fetch metadata for: ${url}`);
      return null;
    }

    const data = await response.json();

    if (!data.data) {
      return null;
    }

    const metadata = {
      title: data.data.title || data.data.publisher || "",
      description: data.data.description || "",
      image: data.data.image?.url || data.data.logo?.url,
      favicon: data.data.logo?.url,
      url: data.data.url || url,
    };

    const parsed = ExtractedMetadataSchema.safeParse(metadata);
    if (!parsed.success) {
      console.error("Metadata validation failed:", parsed.error);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error(`Error extracting metadata from ${url}:`, error);
    return null;
  }
};
