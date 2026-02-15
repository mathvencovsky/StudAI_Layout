import { getYouTubeVideoId, extractYouTubeMetadata } from "./youtube.js";
import { type ExtractedMetadata } from "./types.js";

export { type ExtractedMetadata } from "./types.js";

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

    const metadata: ExtractedMetadata = {
      title: data.data.title || data.data.publisher || "",
      description: data.data.description || "",
      image: data.data.image?.url || data.data.logo?.url,
      favicon: data.data.logo?.url,
      url: data.data.url || url,
      durationInSeconds: 0,
    };

    return metadata;
  } catch (error) {
    console.error(`Error extracting metadata from ${url}:`, error);
    return null;
  }
};
