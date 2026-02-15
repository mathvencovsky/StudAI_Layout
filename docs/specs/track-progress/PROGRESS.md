# Track Progress Implementation Progress

## Completed Tasks

### 3.1 Add UserTrackProgress model to schema
- Added `UserTrackProgress` model to `amplify/data/resource.ts`
- Model includes: `trackId`, `startDate`, `completionDate`, and `owner` fields
- Owner-based authorization with restricted owner field permissions
- Also fixed unrelated TypeScript error (removed unused `isCompleted` variable in `module-detail-container.tsx`)

### 3.2 Create UserTrackProgress type definitions
- Created `src/model/user-track-progress.ts` with schema-inferred types
- Exported types: `UserTrackProgress`, `UserTrackProgressIdentifier`, `UserTrackProgressCreateInput`, `UserTrackProgressUpdateInput`

### 3.3 Create track progress API
- Created `src/api/track-progress.ts` with track progress CRUD operations
- Implemented functions: `startTrack`, `getUserTrackProgress`, `getLastStartedIncompleteTrack`, `completeTrack`, `uncompleteTrack`
- Follows same pattern as `module-progress.ts` with get-or-create pattern for race condition handling

### 3.4 Create useTrackProgress hook
- Created `src/hooks/track/use-track-progress.ts`
- Implemented `getTrackProgressQueryOptions` function with queryOptions
- Implemented `useTrackProgress` hook using useQuery
- Added `enabled: !!trackId` to prevent unnecessary API calls with empty IDs

### 3.5 Create useStartTrack hook
- Created `src/hooks/track/use-start-track.ts`
- Implemented `useStartTrack` mutation hook using useMutation
- Invalidates `trackProgress` and `lastStartedIncompleteTrack` queries on success
- Logs errors to console on failure

### 3.6 Create useCompleteTrack hook
- Created `src/hooks/track/use-complete-track.ts`
- Implemented `useCompleteTrack` mutation hook using useMutation
- Invalidates `trackProgress`, `lastStartedIncompleteTrack`, and `userStats` queries on success
- Logs errors to console on failure

### 3.7 Create useUncompleteTrack hook
- Created `src/hooks/track/use-uncomplete-track.ts`
- Implemented `useUncompleteTrack` mutation hook using useMutation
- Invalidates `trackProgress`, `lastStartedIncompleteTrack`, and `userStats` queries on success
- Logs errors to console on failure

### 3.8 Create useLastStartedIncompleteTrack hook
- Created `src/hooks/track/use-last-started-incomplete-track.ts`
- Implemented `getLastStartedIncompleteTrackQueryOptions` function with queryOptions
- Implemented `useLastStartedIncompleteTrack` hook using useQuery
- Added staleTime (60s) and gcTime (5min) for caching optimization

### 3.9 Update useTrack hook with enabled option
- Updated `src/hooks/track/use-track.ts`
- Added `enabled: !!trackId` to `getTrackQueryOptions` to prevent unnecessary API calls when trackId is empty

### 3.10 Create useLastStartedTrackWithDetails hook
- Created `src/hooks/track/use-last-started-track-with-details.ts`
- Implemented `useLastStartedTrackWithDetails` hook that combines `useLastStartedIncompleteTrack` and `useTrack`
- Exported `LastStartedTrackWithDetails` interface with `track` and `startDate` properties
- Returns combined loading, error, and fetching states from both queries

### 3.16 Add English translations
- Added translation keys to `src/i18n/locales/en/common.ts`
- Keys added: `complete-track`, `continue-track`, `failed-complete-track`, `failed-load-last-track`, `failed-start-track`, `failed-uncomplete-track`, `mark-incomplete`, `start-track`, `view-track`
- All keys inserted in alphabetical order

### 3.17 Add Portuguese translations
- Added translation keys to `src/i18n/locales/pt-BR/common.ts`
- Keys added: `complete-track`, `continue-track`, `failed-complete-track`, `failed-load-last-track`, `failed-start-track`, `failed-uncomplete-track`, `mark-incomplete`, `start-track`, `view-track`
- All keys inserted in alphabetical order

### 3.11 Create TrackProgressActions component
- Created `src/components/track/track-progress-actions.tsx`
- Component displays Start/Complete/Mark Incomplete buttons based on track progress state
- Uses `useTrackProgress`, `useStartTrack`, `useCompleteTrack`, and `useUncompleteTrack` hooks
- Shows error alerts using Alert component with user-friendly translated messages
- Returns null during loading state

### 3.12 Update TrackDetail component
- Updated `src/components/track/track-detail.tsx`
- Added import for `TrackProgressActions` component
- Added `TrackProgressActions` to the button group area
- Progress actions are now visible to all users, admin buttons (Edit/Delete) remain conditional

### 3.13 Create TrackViewerCard component
- Created `src/components/track/track-viewer-card.tsx`
- Reusable card component that displays a track with its flow viewer
- Includes track title, description, and "View Track" button
- Uses `TrackFlowViewer` component to render the track flow
- Accepts `track` (TrackFull) and optional `height` props

### 3.14 Create LastStartedTrackSection component
- Created `src/components/home/last-started-track-section.tsx`
- Component uses `useLastStartedTrackWithDetails` hook to fetch last started incomplete track
- Shows loading skeleton while fetching
- Shows error alert with translated message on error
- Returns null when no incomplete track exists
- Renders `TrackViewerCard` with the track data when available

### 3.15 Update HomePage component
- Updated `src/components/home/home-page.tsx`
- Added import for `LastStartedTrackSection` component
- Added "Continue Track" section with `LastStartedTrackSection` before the "Continue Learning" section
- Uses `t("continue-track")` translation key for section header
