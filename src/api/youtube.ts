import { type ExtractedMetadata } from "./metadata";
import { Duration } from "luxon";
import { getYouTubeVideo, getYouTubePlaylistFull } from "./youtube-proxy";

export interface PlaylistData {
  title: string;
  description: string;
  videoUrls: string[];
}

/**
 * Extracts the playlist ID from a YouTube playlist URL.
 */
export function getYouTubePlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Fetches video metadata from the YouTube proxy Lambda and transforms it into ExtractedMetadata.
 */
export async function fetchVideoMetadata(
  url: string,
  videoId: string,
): Promise<ExtractedMetadata | null> {
  try {
    const data = (await getYouTubeVideo(videoId)) as {
      items?: {
        snippet?: {
          title?: string;
          description?: string;
          thumbnails?: {
            maxres?: { url: string };
            standard?: { url: string };
            high?: { url: string };
            medium?: { url: string };
            default?: { url: string };
          };
          channelTitle?: string;
          publishedAt?: string;
          defaultLanguage?: string;
        };
        contentDetails?: { duration?: string };
      }[];
    };

    const item = data?.items?.[0];
    if (!item?.snippet) {
      console.error("YouTube proxy: no items/snippet in response");
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

    return {
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
  } catch (error) {
    console.error(`Error fetching YouTube metadata for ${url}:`, error);
    return null;
  }
}

/**
 * Extracts metadata from a YouTube video using the Lambda proxy.
 */
export async function extractYouTubeMetadata(
  url: string,
  videoId: string,
): Promise<ExtractedMetadata | null> {
  try {
    return await fetchVideoMetadata(url, videoId);
  } catch (error) {
    console.error(`Error extracting YouTube metadata for ${url}:`, error);
    return null;
  }
}

/**
 * Fetches playlist metadata and all video URLs from a YouTube playlist via the Lambda proxy.
 */
export async function fetchPlaylistData(
  playlistId: string,
): Promise<PlaylistData> {
  try {
    const data = (await getYouTubePlaylistFull(playlistId)) as {
      playlist?: {
        items?: {
          snippet?: { title?: string; description?: string };
        }[];
      };
      items?: {
        snippet?: { resourceId?: { videoId?: string } };
      }[];
    };

    const snippet = data?.playlist?.items?.[0]?.snippet;
    const videoUrls: string[] = [];

    for (const item of data?.items ?? []) {
      const videoId = item?.snippet?.resourceId?.videoId;
      if (videoId) {
        videoUrls.push(`https://www.youtube.com/watch?v=${videoId}`);
      }
    }

    return {
      title: snippet?.title ?? "",
      description: snippet?.description ?? "",
      videoUrls,
    };
  } catch (error) {
    console.error(`Error fetching playlist data for ${playlistId}:`, error);
    return { title: "", description: "", videoUrls: [] };
  }
}
