import { z } from "zod";
import { type ExtractedMetadata, ExtractedMetadataSchema } from "./types";

const YouTubeOEmbedSchema = z.object({
  title: z.string(),
  author_name: z.string().optional(),
  thumbnail_url: z.string().optional(),
});

/**
 * Extracts the video ID from a YouTube URL.
 */
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
/**
 * Extracts metadata from a YouTube video using the YouTube oEmbed API.
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
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const parsed = YouTubeOEmbedSchema.safeParse(data);
    if (!parsed.success) {
      console.error("YouTube oEmbed validation failed:", parsed.error);
      return null;
    }

    const metadata: ExtractedMetadata = {
      title: parsed.data.title,
      description: parsed.data.author_name || "",
      image: parsed.data.thumbnail_url,
      favicon:
        "https://www.youtube.com/s/desktop/2731d6a3/img/favicon_144x144.png",
      url,
      durationInSeconds: 0,
    };

    const metadataValidation = ExtractedMetadataSchema.safeParse(metadata);
    if (!metadataValidation.success) {
      console.error("Metadata validation failed:", metadataValidation.error);
      return null;
    }

    return metadataValidation.data;
  } catch (error) {
    console.error(`Error extracting YouTube metadata for ${url}:`, error);
    return null;
  }
}
