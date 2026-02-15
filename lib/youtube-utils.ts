/**
 * Extracts the video ID from various YouTube URL formats.
 * Supports youtube.com/watch, youtu.be, youtube.com/embed, and m.youtube.com URLs.
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    // Handle youtu.be short URLs
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    // Handle youtube.com URLs
    if (urlObj.hostname.includes("youtube.com")) {
      // Check for /watch?v= format
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return videoId;
      }

      // Check for /embed/ format
      const embedMatch = urlObj.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) {
        return embedMatch[1];
      }
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Checks if a URL is a valid YouTube URL.
 */
export const isYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};
