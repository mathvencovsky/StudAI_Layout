import type { Schema } from "../resource";
import { youtubeGet, youtubeGetAllPages } from "./youtube-client";

type YouTubeVideoListResponse = Schema["YouTubeVideoListResponse"]["type"];
type YouTubePlaylistListResponse =
  Schema["YouTubePlaylistListResponse"]["type"];
type YouTubePlaylistItemEntry = Schema["YouTubePlaylistItemEntry"]["type"];

const VIDEO_PARTS =
  "snippet,contentDetails,statistics,status,topicDetails,recordingDetails,liveStreamingDetails,localizations";
const PLAYLIST_ITEM_PARTS = "snippet,contentDetails,status,id";

/**
 * Fetches a single video by ID from the YouTube Data API.
 */
export function getVideoById(id: string) {
  return youtubeGet<YouTubeVideoListResponse>("/videos", {
    part: VIDEO_PARTS,
    id,
  });
}

/**
 * Fetches a single playlist by ID from the YouTube Data API.
 */
export function getPlaylistById(id: string) {
  return youtubeGet<YouTubePlaylistListResponse>("/playlists", {
    part: "snippet,contentDetails,status,id",
    id,
  });
}

/**
 * Fetches all items in a playlist, auto-paginating through results.
 */
export function getAllPlaylistItems(playlistId: string) {
  return youtubeGetAllPages<YouTubePlaylistItemEntry>("/playlistItems", {
    part: PLAYLIST_ITEM_PARTS,
    playlistId,
    maxResults: 50,
  });
}
