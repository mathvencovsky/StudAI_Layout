import type { Schema } from "../resource";
import {
  getActivitiesByChannelId,
  getChannelById,
  getChannelByHandle,
  getCommentThreadsByVideoId,
  getI18nLanguages,
  getI18nRegions,
  getPlaylistById,
  getPlaylistItems,
  getVideoById,
  getVideoCategories,
  getVideosByIds,
  searchYouTube,
} from "./youtube-helpers";
import {
  getFullChannelMetadata,
  getFullPlaylistMetadata,
  getFullVideoMetadata,
} from "./youtube-composite";

type YouTubeQueryHandler = Schema["getYouTubeVideo"]["functionHandler"];

/**
 * Shared handler for all YouTube proxy custom queries.
 * Routes based on event.fieldName to the appropriate YouTube API helper.
 */
export const handler: YouTubeQueryHandler = async (event) => {
  const args = event.arguments;
  const field = event.fieldName;

  switch (field) {
    case "getYouTubeVideo":
      return await getVideoById(args.id);

    case "getYouTubeVideos":
      return await getVideosByIds(args.ids.split(","));

    case "getYouTubeVideoFull":
      return await getFullVideoMetadata(args.id);

    case "getYouTubeChannel":
      if (args.id) return await getChannelById(args.id);
      if (args.forHandle) return await getChannelByHandle(args.forHandle);
      throw new Error("Missing required argument: id or forHandle");

    case "getYouTubeChannelFull":
      return await getFullChannelMetadata(args.id);

    case "getYouTubePlaylist":
      return await getPlaylistById(args.id);

    case "getYouTubePlaylistFull":
      return await getFullPlaylistMetadata(args.id);

    case "getYouTubePlaylistItems":
      return await getPlaylistItems(
        args.playlistId,
        args.maxResults ?? undefined,
        args.pageToken ?? undefined,
      );

    case "searchYouTube":
      return await searchYouTube(args.q, {
        type: args.type ?? undefined,
        maxResults: args.maxResults ?? undefined,
        pageToken: args.pageToken ?? undefined,
      });

    case "getYouTubeComments":
      return await getCommentThreadsByVideoId(args.videoId);

    case "getYouTubeActivities":
      return await getActivitiesByChannelId(args.channelId);

    case "getYouTubeI18nLanguages":
      return await getI18nLanguages(args.hl ?? undefined);

    case "getYouTubeI18nRegions":
      return await getI18nRegions(args.hl ?? undefined);

    case "getYouTubeVideoCategories":
      return await getVideoCategories(
        args.regionCode ?? undefined,
        args.hl ?? undefined,
      );

    default:
      throw new Error(`Unknown query: ${field}`);
  }
};
