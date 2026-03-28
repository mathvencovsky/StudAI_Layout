# YouTube API Proxy - Progress

## Task 3.1 - Create Lambda function: generic YouTube client and function definition

- Created `amplify/functions/youtube-proxy/youtube-client.ts` with `youtubeGet` and `youtubeGetAllPages` generic helpers
- Created `amplify/functions/youtube-proxy/resource.ts` with `defineFunction` injecting `YOUTUBE_API_KEY` via `secret()`
- Installed `@types/aws-lambda` as a dev dependency
- Build passes ✓

## Task 3.2 - Create Lambda function: resource helpers and composite helpers

- Created `amplify/functions/youtube-proxy/youtube-helpers.ts` with all 13 resource-specific helpers: `getVideoById`, `getVideosByIds`, `getChannelById`, `getChannelByHandle`, `getPlaylistById`, `getPlaylistItems`, `getAllPlaylistItems`, `searchYouTube`, `getCommentThreadsByVideoId`, `getActivitiesByChannelId`, `getI18nLanguages`, `getI18nRegions`, `getVideoCategories`
- Created `amplify/functions/youtube-proxy/youtube-composite.ts` with `getFullVideoMetadata`, `getFullPlaylistMetadata`, `getFullChannelMetadata`
- Build passes ✓

## Task 3.3 - Create Lambda handler with route dispatcher

- Created `amplify/functions/youtube-proxy/handler.ts` with `APIGatewayProxyHandler` routing all 13 routes from the spec
- Includes CORS headers in every response
- Validates required query params are non-empty strings
- Returns `400` for missing params, `404` for unknown routes, `500` for upstream errors
- Build passes ✓

## Task 3.4 - Wire Lambda into Amplify backend with API Gateway

- Updated `amplify/backend.ts` to import `youtubeProxy` and add it to `defineBackend`
- Created a `YouTubeApiStack` CDK stack with `RestApi` (API Gateway v1), `CognitoUserPoolsAuthorizer`, and `LambdaIntegration`
- Added `/youtube/{proxy+}` route with Cognito auth pointing to the Lambda
- Called `backend.addOutput` with the REST API endpoint under `custom.API.youtubeApi`
- Build passes ✓

## Task 3.5 - Create frontend API client for the proxy

- Created `src/api/youtube-proxy.ts` with `youtubeProxyGet<T>` using Amplify's `get()` from `aws-amplify/api`
- Updated `src/main.tsx` to extend `Amplify.configure` with REST API config from `outputs.custom.API` and a global `headers` function that attaches the Cognito ID token as `Authorization` header
- Build passes ✓

## Task 3.6 - Replace `src/api/youtube.ts` to use the Lambda proxy

- Removed `MATTW_YT_API_KEY`, `MATTW_YT_QUOTA_USER`, `MATTW_YT_API_BASE`, `MATTW_YT_PLAYLIST_ITEMS_BASE` constants
- Removed `fetchFromMicrolink` function entirely
- Renamed `fetchFromMattwApi` → `fetchVideoMetadata`; now calls `youtubeProxyGet("/youtube/videos", { id: videoId })` and transforms the YouTube API response into `ExtractedMetadata`; returns `null` on failure
- Rewrote `extractYouTubeMetadata` to call `fetchVideoMetadata` directly (no Microlink fallback)
- Rewrote `fetchPlaylistData` to call `youtubeProxyGet("/youtube/playlists/full", { id: playlistId })` and transform the response into `PlaylistData`; returns empty `PlaylistData` on failure
- `fetch-youtube-metadata.ts` required no changes (it imports `extractYouTubeMetadata` which is still exported)
- Build passes ✓

## Task 3.7 - Remove Vite proxy and cleanup

- Removed the `/ytapi` proxy block from `vite.config.ts`
- Removed the `/ytapi` proxy block from `vite.config.js`
- Build passes ✓
