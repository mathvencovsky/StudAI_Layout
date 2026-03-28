import {
  getAllPlaylistItems,
  getChannelById,
  getPlaylistById,
  getVideoById,
} from "./youtube-helpers";

/**
 * Returns full video metadata for a single video.
 */
export async function getFullVideoMetadata(videoId: string) {
  return getVideoById(videoId);
}

/**
 * Returns playlist metadata together with all its items (auto-paginated).
 */
export async function getFullPlaylistMetadata(playlistId: string) {
  const [playlist, items] = await Promise.all([
    getPlaylistById(playlistId),
    getAllPlaylistItems(playlistId),
  ]);
  return { playlist, items };
}

/**
 * Returns channel metadata together with all uploads (auto-paginated).
 */
export async function getFullChannelMetadata(channelId: string) {
  const channel = await getChannelById(channelId);
  const uploadsPlaylistId = (
    channel as {
      items?: {
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }[];
    }
  )?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  const uploads = uploadsPlaylistId
    ? await getAllPlaylistItems(uploadsPlaylistId)
    : [];
  return { channel, uploads };
}
