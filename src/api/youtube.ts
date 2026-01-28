import { type ExtractedMetadata } from "./metadata";

/**
 * Extracts metadata from a YouTube video using the Microlink API with the video ID.
 *
 * @param url - The original YouTube URL
 * @param videoId - The extracted YouTube video ID
 * @returns Extracted metadata object, or null if extraction fails
 */
export async function extractYouTubeMetadata(
  url: string,
  videoId: string,
): Promise<ExtractedMetadata | null> {
  // TODO: migrate to amplify - implement YouTube metadata extraction
  return {} as ExtractedMetadata | null;
}
