import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * Fetches a YouTube video by ID via the YouTube proxy Lambda.
 */
export async function getYouTubeVideo(id: string) {
  const { data, errors } = await client.queries.getYouTubeVideo({ id });
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}

/**
 * Fetches the full metadata for a YouTube playlist (playlist + all items).
 */
export async function getYouTubePlaylistFull(id: string) {
  const { data, errors } = await client.queries.getYouTubePlaylistFull({ id });
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}
