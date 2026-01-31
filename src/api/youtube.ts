import { type ExtractedMetadata } from "./metadata";
import { Duration } from "luxon";

const MATTW_YT_API_BASE = "/ytapi/v3/videos";

/**
 * Call Microlink API (primary source).
 */
async function fetchFromMicrolink(
  url: string,
  videoId: string,
): Promise<ExtractedMetadata | null> {
  try {
    const response = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`,
      )}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.data) {
      return null;
    }

    const metadata: ExtractedMetadata = {
      title: data.data.title || "YouTube Video",
      description: data.data.description || "",
      image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      favicon: data.data.logo?.url,
      url,
      durationInSeconds: 0,
    };

    return metadata;
  } catch (error) {
    console.error(`Error calling Microlink for ${url}:`, error);
    return null;
  }
}

/**
 * Call the Mattw YouTube API (fallback source).
 *
 * Expects a response shaped like:
 * {
 *   kind: "youtube#videoListResponse",
 *   items: [
 *     {
 *       id: "...",
 *       snippet: {
 *         title: "...",
 *         description: "...",
 *         thumbnails: { maxres?: { url }, high?: { url }, ... }
 *       },
 *       ...
 *     }
 *   ]
 * }
 */
export async function fetchFromMattwApi(
  url: string,
  videoId: string,
): Promise<ExtractedMetadata | null> {
  try {
    const apiKey = "foo1";
    const quotaUser = "OahQi27TmlgO0nFFARoJ7z16muvV1SGXjJdeQFJZ";

    const params = new URLSearchParams({
      key: apiKey,
      quotaUser,
      part: "snippet,statistics,recordingDetails,status,liveStreamingDetails,localizations,contentDetails,paidProductPlacementDetails,player,topicDetails",
      id: videoId,
    });

    const response = await fetch(`${MATTW_YT_API_BASE}?${params.toString()}`);

    if (!response.ok) {
      console.error(
        `Mattw YouTube API returned non-OK status: ${response.status}`,
      );
      return null;
    }

    const data = await response.json();

    const item = data?.items?.[0];
    if (!item || !item.snippet) {
      console.error("Mattw YouTube API: no items/snippet in response");
      return null;
    }

    const { snippet, contentDetails } = item;
    const thumbnails = snippet.thumbnails ?? {};
    const duration = contentDetails?.duration ?? "PT0S";

    const thumbnail =
      thumbnails.maxres?.url ??
      thumbnails.standard?.url ??
      thumbnails.high?.url ??
      thumbnails.medium?.url ??
      thumbnails.default?.url ??
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const metadata: ExtractedMetadata = {
      title: snippet.title || "YouTube Video",
      description: snippet.description || "",
      image: thumbnail,
      favicon: undefined,
      durationInSeconds: Duration.fromISO(duration).as("seconds"),
      url,
      author: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      language: snippet.defaultLanguage,
    };

    return metadata;
  } catch (error) {
    console.error(`Error calling Mattw YouTube API for ${url}:`, error);
    return null;
  }
}

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
  try {
    const mattwResult = await fetchFromMattwApi(url, videoId);
    if (mattwResult) {
      return mattwResult;
    }

    const microlinkResult = await fetchFromMicrolink(url, videoId);
    if (microlinkResult) {
      return microlinkResult;
    }

    console.error(
      `Failed to extract YouTube metadata from both Microlink and Mattw for ${url}`,
    );
    return null;
  } catch (error) {
    console.error(`Error extracting YouTube metadata for ${url}:`, error);
    return null;
  }
}
