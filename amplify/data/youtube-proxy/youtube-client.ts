const YT_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * Makes a GET request to the YouTube Data API v3, injecting the API key from environment.
 */
export async function youtubeGet<T = unknown>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY");

  const url = new URL(`${YT_BASE}${path}`);
  url.searchParams.set("key", apiKey);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || `YouTube API ${res.status}`);
  }
  return json as T;
}

/**
 * Fetches all pages from a paginated YouTube Data API v3 endpoint.
 */
export async function youtubeGetAllPages<TItem = unknown>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  maxPages = 10,
): Promise<TItem[]> {
  const items: TItem[] = [];
  let nextPageToken: string | undefined;

  for (let i = 0; i < maxPages; i++) {
    const page = await youtubeGet<{ items?: TItem[]; nextPageToken?: string }>(
      path,
      { ...params, pageToken: nextPageToken },
    );
    if (page.items?.length) items.push(...page.items);
    if (!page.nextPageToken) break;
    nextPageToken = page.nextPageToken;
  }
  return items;
}
