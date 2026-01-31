# Progress: Track - Module Tree Structure

## 2026-01-31

### Task 3.1: Install @xyflow/react and dagre packages ✅

- Installed `@xyflow/react`, `dagre`, and `@types/dagre` packages
- Build passes successfully

### Task 3.2: Add Track model to Amplify schema ✅

- Added `Track` model to `amplify/data/resource.ts` with fields:
  - `title` (required string)
  - `description` (required string)
  - `rootModuleId` (required id)
  - `parentByModuleId` (required json)
  - `positionByModuleId` (optional json)
  - `owner` (string with read/delete permissions for owner)
- Authorization: authenticated users can read, owner can create/update/delete
- Build passes successfully

### Task 3.3: Create Track type definitions ✅

- Created `src/model/track.ts` with schema-inferred types:
  - `Track`, `TrackIdentifier`, `TrackCreateInput`, `TrackUpdateInput`, `TrackDeleteInput`
  - `trackSelectionSet` for fetching full track data
  - `TrackFull` type using `SelectionSet`
- Build passes successfully

### Task 3.4: Create Track API functions ✅

- Created `src/api/track.ts` with CRUD functions:
  - `getTracks`: Get all tracks
  - `getTrack`: Get a single track by ID with full selection set
  - `createTrack`: Create a new track
  - `updateTrack`: Update an existing track
  - `deleteTrack`: Delete a track
- Build passes successfully

### Task 3.5: Create useTracks hook ✅

- Created `src/hooks/track/use-tracks.ts` with:
  - `getTracksQueryOptions` function for query options
  - `useTracks` hook using `useQuery`
- Build passes successfully

### Task 3.6: Create useTrack hook ✅

- Created `src/hooks/track/use-track.ts` with:
  - `getTrackQueryOptions` function for query options
  - `useTrack` hook using `useQuery` to fetch a single track by ID
- Build passes successfully

### Task 3.7: Create useCreateTrack hook ✅

- Created `src/hooks/track/use-create-track.ts` with:
  - `useCreateTrack` hook using `useMutation`
  - Invalidates `["tracks"]` query on success
- Build passes successfully

### Task 3.8: Create useUpdateTrack hook ✅

- Created `src/hooks/track/use-update-track.ts` with:
  - `useUpdateTrack` hook using `useMutation`
  - Invalidates `["tracks"]` and `["track", data.id]` queries on success
- Build passes successfully

### Task 3.9: Create useDeleteTrack hook ✅

- Created `src/hooks/track/use-delete-track.ts` with:
  - `useDeleteTrack` hook using `useMutation`
  - Invalidates `["tracks"]` query on success
- Build passes successfully

### Task 3.10: Create useModules hook ✅

- Updated `src/hooks/modules/use-modules.ts` to support being called without params
- Made `params` optional with default value of `{}`
- Added JSDoc comments to `getModulesQueryOptions` and `useModules`
- Build passes successfully

### Task 3.22: Add English translations ✅

- Added all track-related translation keys to `src/i18n/locales/en/common.ts`:
  - `add-module`, `auto-layout`, `create-track`, `cycle-detected`
  - `delete`, `delete-track-confirm-title`, `delete-track-confirm-description`
  - `description-required`, `no-modules-in-track`, `remove-selected`
  - `root-module-required`, `save-structure`, `select-module`
  - `title-required`, `track-not-found`, `track-structure`, `track-structure-help`, `tracks`
- Reorganized all translation keys in alphabetical order per guidelines
- Build passes successfully

### Task 3.23: Add Portuguese translations ✅

- Added all track-related translation keys to `src/i18n/locales/pt-BR/common.ts`:
  - `add-module`, `auto-layout`, `create-track`, `cycle-detected`
  - `delete`, `delete-track-confirm-title`, `delete-track-confirm-description`
  - `description-required`, `no-modules-in-track`, `remove-selected`
  - `root-module-required`, `save-structure`, `select-module`
  - `title-required`, `track-not-found`, `track-structure`, `track-structure-help`, `tracks`
- Reorganized all translation keys in alphabetical order per guidelines
- Added `as const` to match English file format
- Build passes successfully

### Task 3.11: Create ModuleNode component ✅

- Created `src/components/track/module-node.tsx` with:
  - Custom React Flow node component for displaying modules
  - `ModuleNodeProps` interface with `data.label` and `data.moduleId`
  - Handle components for top (target) and bottom (source) connections
  - Styled with Tailwind CSS classes for consistent appearance
- Build passes successfully

### Task 3.12: Create TrackFlowViewer component ✅

- Created `src/components/track/track-flow-viewer.tsx` with:
  - `TrackFlowViewerProps` interface with `rootModuleId`, `parentByModuleId`, `positionByModuleId`
  - `coerceParentMap` helper to safely convert unknown JSON to typed ParentMap
  - `applyDagreLayout` function for automatic node positioning using dagre
  - `buildFlowElements` function to convert track JSON structure to React Flow nodes/edges
  - Read-only React Flow visualization with Background, Controls, and MiniMap
  - Click handler to navigate to module detail page when clicking a node
  - Shows "no-modules-in-track" message when track is empty
  - Shows "Missing module" label for deleted/missing modules
- Build passes successfully

### Task 3.13: Create TrackFlowEditor component ✅

- Created `src/components/track/track-flow-editor.tsx` with:
  - `TrackFlowEditorProps` interface with `initialRootModuleId`, `initialParentByModuleId`, and `onChange` callback
  - `detectCycle` function for cycle detection in the graph
  - `applyDagreLayout` function for automatic node positioning
  - `flowToTrackStructure` function to convert React Flow nodes/edges back to track JSON structure
  - Interactive React Flow editor with:
    - Module selection dropdown (filters out already-added modules)
    - Add Module button
    - Auto Layout button
    - Remove Selected button
    - Save Structure button
    - Cycle detection warning message
  - Uses `useNodesState` and `useEdgesState` for interactive node/edge management
  - Supports connecting nodes via drag-and-drop
- Build passes successfully

### Tasks 3.14-3.21: Create Track Components and Routes ✅

- Created `src/components/track/track-list.tsx`:
  - `TrackListProps` interface with optional `onCreateTrack` callback
  - Displays list of tracks using Card components
  - Navigates to track detail on card click
  - Shows create button when `onCreateTrack` is provided

- Created `src/components/track/track-detail.tsx`:
  - `TrackDetailProps` interface with `trackId`
  - Displays track title, description, and React Flow visualization
  - Edit and Delete buttons visible only to admin users
  - Delete confirmation dialog using AlertDialog
  - Navigates to edit page or track list after actions

- Created `src/components/track/track-form.tsx`:
  - `TrackFormProps` interface with `mode`, `trackId`, and `initialData`
  - Form with title and description fields using react-hook-form
  - Integrates TrackFlowEditor for module structure
  - Handles create and edit modes
  - Validates root module and cycle detection before submit

- Created route files:
  - `src/routes/track/index.tsx` - Track list page
  - `src/routes/track/$trackId.tsx` - Track detail layout with breadcrumb loader
  - `src/routes/track/$trackId/index.tsx` - Track detail page
  - `src/routes/track-create.tsx` - Track creation page
  - `src/routes/track-edit/$trackId.tsx` - Track edit page with data loading

- Fixed pre-existing bug in `src/components/content/content-edit.tsx`:
  - Removed non-existent `owner` field from destructuring

- Build passes successfully

### Task 3.22: Add Tracks item to AppSidebar ✅

- Added "Tracks" navigation item to `src/components/layout/app-sidebar.tsx`
- Added to `navMain` array after "Modules" item
- Navigates to `/track` route on click
- Build passes successfully

### Tasks 3.14-3.15: Complete TrackList and TrackDetail components ✅

- Updated `src/components/track/track-list.tsx`:
  - Added `isError` state handling with `error-loading-tracks` message
  - Added empty state with `no-tracks` message when tracks array is empty

- Updated `src/components/track/track-detail.tsx`:
  - Added `isError` state handling with `error-loading-track` message

- Added missing translation keys to `src/i18n/locales/en/common.ts`:
  - `error-loading-track`: "Error loading track"
  - `error-loading-tracks`: "Error loading tracks"
  - `no-tracks`: "No tracks available"

- Added missing translation keys to `src/i18n/locales/pt-BR/common.ts`:
  - `error-loading-track`: "Erro ao carregar trilha"
  - `error-loading-tracks`: "Erro ao carregar trilhas"
  - `no-tracks`: "Nenhuma trilha disponível"

- Build passes successfully
