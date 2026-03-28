import type { Schema } from "../resource";
import { getAllPlaylistItems, getPlaylistById } from "./youtube-helpers";

type YouTubeFullPlaylistResponse =
  Schema["YouTubeFullPlaylistResponse"]["type"];

/**
 * Returns playlist metadata together with all its items (auto-paginated).
 */
export async function getFullPlaylistMetadata(
  playlistId: string,
): Promise<YouTubeFullPlaylistResponse> {
  const [playlist, items] = await Promise.all([
    getPlaylistById(playlistId),
    getAllPlaylistItems(playlistId),
  ]);
  return { playlist, items };
}
