import { youtubeGet, youtubeGetAllPages } from "./youtube-client";

const VIDEO_PARTS =
  "snippet,contentDetails,statistics,status,topicDetails,recordingDetails,liveStreamingDetails,localizations";
const PLAYLIST_ITEM_PARTS = "snippet,contentDetails,status,id";

export function getVideoById(id: string) {
  return youtubeGet("/videos", { part: VIDEO_PARTS, id });
}

export function getVideosByIds(ids: string[]) {
  return youtubeGet("/videos", { part: VIDEO_PARTS, id: ids.join(",") });
}

export function getChannelById(id: string) {
  return youtubeGet("/channels", {
    part: "snippet,contentDetails,statistics,status,brandingSettings",
    id,
  });
}

export function getChannelByHandle(forHandle: string) {
  return youtubeGet("/channels", {
    part: "snippet,contentDetails,statistics,status,brandingSettings",
    forHandle,
  });
}

export function getPlaylistById(id: string) {
  return youtubeGet("/playlists", {
    part: "snippet,contentDetails,status,id",
    id,
  });
}

export function getPlaylistItems(
  playlistId: string,
  maxResults = 50,
  pageToken?: string,
) {
  return youtubeGet("/playlistItems", {
    part: PLAYLIST_ITEM_PARTS,
    playlistId,
    maxResults,
    pageToken,
  });
}

export function getAllPlaylistItems(playlistId: string) {
  return youtubeGetAllPages("/playlistItems", {
    part: PLAYLIST_ITEM_PARTS,
    playlistId,
    maxResults: 50,
  });
}

export function searchYouTube(
  q: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
) {
  return youtubeGet("/search", { part: "snippet", q, ...params });
}

export function getCommentThreadsByVideoId(videoId: string) {
  return youtubeGet("/commentThreads", {
    part: "snippet,replies",
    videoId,
  });
}

export function getActivitiesByChannelId(channelId: string) {
  return youtubeGet("/activities", {
    part: "snippet,contentDetails",
    channelId,
    maxResults: 50,
  });
}

export function getI18nLanguages() {
  return youtubeGet("/i18nLanguages", { part: "snippet" });
}

export function getI18nRegions() {
  return youtubeGet("/i18nRegions", { part: "snippet" });
}

export function getVideoCategories(regionCode = "US") {
  return youtubeGet("/videoCategories", { part: "snippet", regionCode });
}
