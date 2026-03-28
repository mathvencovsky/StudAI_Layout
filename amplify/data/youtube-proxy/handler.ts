import type { SharedHandler } from "../../utils/types";
import type { Schema } from "../resource";
import { getVideoById } from "./youtube-helpers";
import { getFullPlaylistMetadata } from "./youtube-composite";

type YouTubeProxyHandler = SharedHandler<
  | Schema["getYouTubeVideo"]["functionHandler"]
  | Schema["getYouTubePlaylistFull"]["functionHandler"]
>;

/**
 * Shared handler for YouTube proxy custom queries.
 * Routes based on event.fieldName to the appropriate YouTube API helper.
 */
export const handler: YouTubeProxyHandler = async (event) => {
  const fieldName = event.fieldName || event.info.fieldName;
  switch (fieldName) {
    case "getYouTubeVideo":
      return await getVideoById(event.arguments.id);

    case "getYouTubePlaylistFull":
      return await getFullPlaylistMetadata(event.arguments.id);

    default:
      throw new Error(`Unknown query: ${event.fieldName}`);
  }
};
