# Technical Spec: YouTube API Proxy Lambda

## 0. Summary

**Goal:** Replace direct browser-side YouTube API calls (currently hitting the third-party Mattw proxy with a hardcoded key) with a secure Amplify-backed Lambda proxy that keeps the `YOUTUBE_API_KEY` secret, exposes all public YouTube Data API v3 endpoints as custom queries in the Amplify data schema, and requires Cognito authentication.
**Out of scope:** OAuth-based YouTube operations (uploads, private playlists, `mine=true` queries), response caching, rate limiting, and any UI changes.

## 1. Technical Design

### 1.1 Amplify schema changes

Add 14 custom queries to the Amplify data schema in `amplify/data/resource.ts`, all backed by a single Lambda handler defined with `defineFunction`. Each query uses `a.json()` as the return type (YouTube API responses are complex JSON) and `allow.authenticated()` authorization.

The function is defined in `amplify/data/resource.ts` using `defineFunction` with `secret("YOUTUBE_API_KEY")` and `entry: "./youtube-proxy/handler.ts"`.

Custom queries:

| Query | Arguments | Description |
|---|---|---|
| `getYouTubeVideo` | `id!` | Single video metadata |
| `getYouTubeVideos` | `ids!` | Multiple videos (comma-separated) |
| `getYouTubeVideoFull` | `id!` | Full video metadata (composite) |
| `getYouTubeChannel` | `id`, `forHandle` | Channel by ID or handle |
| `getYouTubeChannelFull` | `id!` | Channel + uploads playlist |
| `getYouTubePlaylist` | `id!` | Playlist metadata |
| `getYouTubePlaylistFull` | `id!` | Playlist + all items |
| `getYouTubePlaylistItems` | `playlistId!`, `maxResults?`, `pageToken?` | Paginated playlist items |
| `searchYouTube` | `q!`, `type?`, `maxResults?`, `pageToken?` | YouTube search |
| `getYouTubeComments` | `videoId!` | Comment threads for a video |
| `getYouTubeActivities` | `channelId!` | Channel activity feed |
| `getYouTubeI18nLanguages` | `hl?` | Available languages |
| `getYouTubeI18nRegions` | `hl?` | Available regions |
| `getYouTubeVideoCategories` | `regionCode?`, `hl?` | Video categories |

### 1.2 Type definitions

No new model files. The existing `ExtractedMetadata` type and `PlaylistData` interface in `src/api/youtube.ts` remain unchanged.

### 1.3 API / Data fetching changes

#### Lambda function: generic YouTube client

**`amplify/data/youtube-proxy/youtube-client.ts`**

A single generic helper that calls any YouTube Data API v3 endpoint, automatically injecting the secret API key from `process.env.YOUTUBE_API_KEY`.

```ts
export async function youtubeGet<T = unknown>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
): Promise<T> {
  // Builds URL with key from env, calls YouTube, throws on error
}

export async function youtubeGetAllPages<TItem = unknown>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  maxPages = 10,
): Promise<TItem[]> {
  // Paginates through results, max 500 items (10 pages × 50)
}
```

#### Lambda function: resource-specific helpers

**`amplify/data/youtube-proxy/youtube-helpers.ts`**

Thin wrappers: `getVideoById`, `getVideosByIds`, `getChannelById`, `getChannelByHandle`, `getPlaylistById`, `getPlaylistItems`, `getAllPlaylistItems`, `searchYouTube`, `getCommentThreadsByVideoId`, `getActivitiesByChannelId`, `getI18nLanguages`, `getI18nRegions`, `getVideoCategories`.

#### Lambda function: composite helpers

**`amplify/data/youtube-proxy/youtube-composite.ts`**

`getFullVideoMetadata`, `getFullPlaylistMetadata`, `getFullChannelMetadata` — combine multiple API calls.

#### Lambda handler

**`amplify/data/youtube-proxy/handler.ts`**

AppSync custom query handler that routes based on `event.fieldName` to the appropriate helper. Returns data directly (AppSync handles serialization). Throws on errors (AppSync returns them as GraphQL errors).

#### Frontend API client

**`src/api/youtube-proxy.ts`**

Uses the existing `generateClient<Schema>()` pattern to call custom queries. No REST API, no manual auth tokens — the data client handles everything.

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export async function getYouTubeVideo(id: string) {
  const { data, errors } = await client.queries.getYouTubeVideo({ id });
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}

export async function getYouTubePlaylistFull(id: string) {
  const { data, errors } = await client.queries.getYouTubePlaylistFull({ id });
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}
```

#### Replace existing `src/api/youtube.ts`

The existing exported functions keep their signatures and return types. The internal implementation changes from calling the Mattw proxy to calling the custom queries via `src/api/youtube-proxy.ts`.

Key changes:
- Remove `MATTW_YT_API_KEY`, `MATTW_YT_QUOTA_USER`, `MATTW_YT_API_BASE`, `MATTW_YT_PLAYLIST_ITEMS_BASE` constants
- Remove `fetchFromMicrolink` function entirely
- Rename `fetchFromMattwApi` → `fetchVideoMetadata`. Calls `getYouTubeVideo(videoId)` and transforms the response into `ExtractedMetadata`. Wraps in try/catch and returns `null` on failure.
- `extractYouTubeMetadata(url, videoId)` → calls `fetchVideoMetadata` directly (no Microlink fallback). Returns `null` on failure.
- `fetchPlaylistData(playlistId)` → calls `getYouTubePlaylistFull(playlistId)` and transforms the response into `PlaylistData`. Returns empty `PlaylistData` on failure.
- `getYouTubePlaylistId(url)` → unchanged (pure string parsing)

Note: `src/api/metadata/youtube.ts` (oEmbed-based `extractYouTubeMetadata`) and `src/api/metadata/index.ts` are **not changed**. They use the oEmbed API which requires no API key and serves a different purpose.

#### Vite proxy cleanup

Remove the `/ytapi` proxy configuration from `vite.config.ts`.

### 1.4 Page changes

No page changes required.

### 1.5 Component changes

No component changes required.

### 1.6 Translation keys

No new translation keys required.

## 1.7. Sidebar

No sidebar changes required.

## 2. Acceptance Criteria

### AC1: Lambda proxy returns video metadata

**Given** the YouTube proxy Lambda is deployed with a valid API key
**When** an authenticated user calls `client.queries.getYouTubeVideo({ id })`
**Then** the query returns the full YouTube Data API response for that video

### AC2: Lambda proxy returns playlist with items

**Given** the YouTube proxy Lambda is deployed
**When** an authenticated user calls `client.queries.getYouTubePlaylistFull({ id })`
**Then** the query returns the playlist metadata and all playlist items (paginated automatically)

### AC3: Existing auto-fill from YouTube still works

**Given** an admin user is on the content creation form with a YouTube URL
**When** they click "Auto-fill from video"
**Then** the form fields are populated with metadata fetched through the Lambda proxy (same behavior as before)

### AC4: Existing playlist import still works

**Given** an admin user is creating a module with a YouTube playlist URL
**When** they submit the playlist URL
**Then** all video URLs are extracted and metadata is fetched through the Lambda proxy (same behavior as before)

### AC5: Unauthenticated requests are rejected

**Given** a custom query call without a valid Cognito session
**When** the query is executed
**Then** AppSync returns an authorization error

### AC6: API key is not exposed to the browser

**Given** the YouTube proxy is deployed
**When** inspecting network requests in the browser
**Then** no request contains the YouTube API key — it is only used server-side in the Lambda

### AC7: All custom queries return valid responses

**Given** the Lambda is deployed
**When** authenticated users call each of the 14 custom queries
**Then** each returns the expected YouTube Data API response shape, or a GraphQL error for invalid arguments

### AC8: Error handling preserves null-on-failure contract

**Given** the YouTube API returns an error or the Lambda fails
**When** `fetchVideoMetadata` or `extractYouTubeMetadata` is called from the frontend
**Then** the function returns `null` (not a thrown exception), matching the previous behavior

### AC9: oEmbed metadata extraction is unaffected

**Given** the `src/api/metadata/youtube.ts` oEmbed-based extraction
**When** any code path calls `extractMetadataFromUrl` for a YouTube URL
**Then** it still uses the oEmbed API directly (not the Lambda proxy) and works as before

### Edge cases

- E1: Invalid YouTube video/channel/playlist ID → Lambda throws, AppSync returns GraphQL error, frontend functions return `null`
- E2: YouTube API quota exceeded → Lambda throws with YouTube's quota error message, frontend functions return `null`
- E3: Playlist with deleted/private videos → handled by frontend `fetchPlaylistData` transformation (same as current behavior)

## 3. Implementation Tasks

### [ ] 3.1 Create Lambda function: generic YouTube client

#### `amplify/data/youtube-proxy/youtube-client.ts`

Create the generic `youtubeGet` and `youtubeGetAllPages` functions. These read `YOUTUBE_API_KEY` from environment, build the URL, call YouTube, and handle errors/pagination.

#### Install `@types/aws-lambda`

```bash
npm install --save-dev @types/aws-lambda
```

### [ ] 3.2 Create Lambda function: resource helpers and composite helpers

#### `amplify/data/youtube-proxy/youtube-helpers.ts`

Create all resource-specific helper functions.

#### `amplify/data/youtube-proxy/youtube-composite.ts`

Create composite helpers: `getFullVideoMetadata`, `getFullPlaylistMetadata`, `getFullChannelMetadata`.

### [ ] 3.3 Create Lambda handler

#### `amplify/data/youtube-proxy/handler.ts`

Create the AppSync custom query handler that routes based on `event.fieldName` to the appropriate helper function.

### [ ] 3.4 Add custom queries to Amplify data schema

#### `amplify/data/resource.ts`

- Add `defineFunction` and `secret` to imports
- Define `youtubeProxyHandler` with `defineFunction({ name: "youtube-proxy", entry: "./youtube-proxy/handler.ts", environment: { YOUTUBE_API_KEY: secret("YOUTUBE_API_KEY") } })`
- Add 14 custom queries to the schema, all using `a.handler.function(youtubeProxyHandler)`, `a.json()` return type, and `allow.authenticated()` authorization

No changes to `amplify/backend.ts` — the function is defined in the data schema, not as a standalone function.

#### Store the YouTube API key secret

```bash
npx ampx sandbox secret set YOUTUBE_API_KEY
```

For production branches, set the secret via the Amplify console.

### [ ] 3.5 Create frontend API client

#### `src/api/youtube-proxy.ts`

Create functions that call the custom queries via `generateClient<Schema>()`. Only expose the queries the app currently needs: `getYouTubeVideo`, `getYouTubePlaylistFull`.

### [ ] 3.6 Replace `src/api/youtube.ts` to use the Lambda proxy

#### `src/api/youtube.ts`

- Remove Mattw API constants and `fetchFromMicrolink`
- Rename `fetchFromMattwApi` → `fetchVideoMetadata`, calling `getYouTubeVideo` from `youtube-proxy.ts`
- Rewrite `extractYouTubeMetadata` to call `fetchVideoMetadata` (no Microlink fallback)
- Rewrite `fetchPlaylistData` to call `getYouTubePlaylistFull`
- All functions preserve try/catch → `null` on failure contract

#### `src/api/metadata/fetch-youtube-metadata.ts`

Update import from `fetchFromMattwApi` to `fetchVideoMetadata`.

### [ ] 3.7 Remove Vite proxy and cleanup

#### `vite.config.ts`

Remove the `/ytapi` proxy block from the `server.proxy` configuration.

## 4. Open Questions and missing details

- Q1: The `YOUTUBE_API_KEY` secret must be set in each Amplify environment (sandbox via `npx ampx sandbox secret set YOUTUBE_API_KEY`, production via the Amplify console).
- Q2: The default YouTube API quota is 10,000 units/day. `search.list` costs 100 units per request while `videos.list` and `playlistItems.list` cost 1 unit. No rate limiting is implemented in this spec — if quota becomes a concern, a follow-up spec should add per-user throttling or caching.
