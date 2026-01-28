import { extractYouTubeVideoId } from "@/lib/youtube-utils";
import { ExternalLink } from "./external-link";

export interface YouTubeEmbedProps {
  url: string;
}

/**
 * Renders an embedded YouTube video player.
 * Falls back to external link if video ID extraction fails.
 */
export const YouTubeEmbed = ({ url }: YouTubeEmbedProps) => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return <ExternalLink url={url} label="Watch on YouTube" />;
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: "40.25%" }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};
