import { type ExtractedMetadata } from "@/api/metadata/types";
import { getYouTubeVideoId } from "./youtube";
import { extractYouTubeMetadata } from "../youtube";

/**
 * Fetches YouTube metadata for a given URL
 */
export const fetchYouTubeMetadata = async (
  url: string,
): Promise<ExtractedMetadata | null> => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return extractYouTubeMetadata(url, videoId);
};
