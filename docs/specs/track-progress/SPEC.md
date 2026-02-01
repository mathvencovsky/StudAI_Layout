# Technical Spec: Track Progress (Start/Complete) and Home Page Track Viewer

## 0. Summary

**Goal:** Add functionality to start and complete tracks (similar to modules), and display the last started incomplete track on the home page using a reusable track viewer component.

**Out of scope:** Track recommendations, track search from home page, track completion notifications, automatic track completion when all modules are completed, tracks completed stat on home page.

## 1. Technical Design

### 1.1 Amplify schema changes

Add a new `UserTrackProgress` model to track user progress on tracks, following the same pattern as `UserModuleProgress`.

```ts
// amplify/data/resource.ts - Add to schema
UserTrackProgress: a
  .model({
    trackId: a.id().required(),
    startDate: a.timestamp().required(),
    completionDate: a.timestamp(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 1.2 Type definitions

**`src/model/user-track-progress.ts`**

```ts
import { type Schema } from "../../amplify/data/resource";

export type UserTrackProgress = Schema["UserTrackProgress"]["type"];
export type UserTrackProgressIdentifier =
  Schema["UserTrackProgress"]["identifier"];
export type UserTrackProgressCreateInput =
  Schema["UserTrackProgress"]["createType"];
export type UserTrackProgressUpdateInput =
  Schema["UserTrackProgress"]["updateType"];
export type UserTrackProgressDeleteInput =
  Schema["UserTrackProgress"]["deleteType"];
```

### 1.3 API / Data fetching changes

**`src/api/track-progress.ts`** - Track progress API functions

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type UserTrackProgress,
  type UserTrackProgressCreateInput,
} from "@/model/user-track-progress";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

/**
 * Start a track for the current user
 * Returns existing progress if already started, creates new if not
 * Uses get-or-create pattern with error handling for race conditions
 */
export const startTrack = async (input: {
  trackId: string;
}): Promise<UserTrackProgress> => {
  await getCurrentUserId();

  const existing = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: input.trackId } },
  });

  if (existing.data && existing.data.length > 0) {
    return existing.data[0];
  }

  const createInput: UserTrackProgressCreateInput = {
    trackId: input.trackId,
    startDate: Date.now(),
  };

  const result = await client.models.UserTrackProgress.create(createInput);

  if (!result.data) {
    // Handle race condition: another request may have created the record
    const retryExisting = await client.models.UserTrackProgress.list({
      filter: { trackId: { eq: input.trackId } },
    });

    if (retryExisting.data && retryExisting.data.length > 0) {
      return retryExisting.data[0];
    }

    console.error("Failed to start track:", result.errors);
    throw new Error("Failed to start track");
  }

  return result.data;
};

/**
 * Get the current user's progress for a specific track
 */
export const getUserTrackProgress = async (
  trackId: string,
): Promise<UserTrackProgress | null> => {
  await getCurrentUserId();

  const result = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: trackId } },
  });

  if (!result.data || result.data.length === 0) {
    return null;
  }

  return result.data[0];
};

/**
 * Get the current user's most recently started incomplete track
 */
export const getLastStartedIncompleteTrack =
  async (): Promise<UserTrackProgress | null> => {
    await getCurrentUserId();

    const result = await client.models.UserTrackProgress.list();

    if (!result.data || result.data.length === 0) {
      return null;
    }

    const incompleteTracks = result.data.filter((p) => !p.completionDate);

    if (incompleteTracks.length === 0) {
      return null;
    }

    const sortedProgress = incompleteTracks.sort(
      (a, b) => b.startDate - a.startDate,
    );

    return sortedProgress[0];
  };

/**
 * Mark a track as completed for the current user
 */
export const completeTrack = async (
  trackId: string,
): Promise<UserTrackProgress> => {
  await getCurrentUserId();

  const result = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: trackId } },
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("Track progress not found");
  }

  const updateResult = await client.models.UserTrackProgress.update({
    id: result.data[0].id,
    completionDate: Date.now(),
  });

  if (!updateResult.data) {
    console.error("Failed to complete track:", updateResult.errors);
    throw new Error("Failed to complete track");
  }

  return updateResult.data;
};

/**
 * Mark a track as incomplete for the current user
 */
export const uncompleteTrack = async (
  trackId: string,
): Promise<UserTrackProgress> => {
  await getCurrentUserId();

  const result = await client.models.UserTrackProgress.list({
    filter: { trackId: { eq: trackId } },
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("Track progress not found");
  }

  const updateResult = await client.models.UserTrackProgress.update({
    id: result.data[0].id,
    completionDate: null,
  });

  if (!updateResult.data) {
    console.error("Failed to uncomplete track:", updateResult.errors);
    throw new Error("Failed to uncomplete track");
  }

  return updateResult.data;
};
```

**`src/hooks/track/use-track-progress.ts`** - Query hook for track progress

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserTrackProgress } from "@/api/track-progress";
import { type UserTrackProgress } from "@/model/user-track-progress";

export const getTrackProgressQueryOptions = (trackId: string) =>
  queryOptions<UserTrackProgress | null>({
    queryKey: ["trackProgress", trackId],
    queryFn: () => getUserTrackProgress(trackId),
    enabled: !!trackId,
  });

/**
 * Query hook for fetching user's progress on a specific track
 */
export const useTrackProgress = (trackId: string) =>
  useQuery(getTrackProgressQueryOptions(trackId));
```

**`src/hooks/track/use-start-track.ts`** - Mutation hook to start a track

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startTrack } from "@/api/track-progress";

/**
 * Mutation hook to start a track for the current user
 */
export const useStartTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTrack,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trackProgress", data.trackId] });
      queryClient.invalidateQueries({ queryKey: ["lastStartedIncompleteTrack"] });
    },
    onError: (error) => {
      console.error("Failed to start track:", error);
    },
  });
};
```

**`src/hooks/track/use-complete-track.ts`** - Mutation hook to complete a track

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeTrack } from "@/api/track-progress";

/**
 * Mutation hook to mark a track as completed
 */
export const useCompleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTrack,
    onSuccess: (_, trackId) => {
      queryClient.invalidateQueries({ queryKey: ["trackProgress", trackId] });
      queryClient.invalidateQueries({ queryKey: ["lastStartedIncompleteTrack"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
    onError: (error) => {
      console.error("Failed to complete track:", error);
    },
  });
};
```

**`src/hooks/track/use-uncomplete-track.ts`** - Mutation hook to uncomplete a track

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uncompleteTrack } from "@/api/track-progress";

/**
 * Mutation hook to mark a track as incomplete
 */
export const useUncompleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uncompleteTrack,
    onSuccess: (_, trackId) => {
      queryClient.invalidateQueries({ queryKey: ["trackProgress", trackId] });
      queryClient.invalidateQueries({ queryKey: ["lastStartedIncompleteTrack"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
    onError: (error) => {
      console.error("Failed to mark track as incomplete:", error);
    },
  });
};
```

**`src/hooks/track/use-last-started-incomplete-track.ts`** - Query hook for last started incomplete track

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getLastStartedIncompleteTrack } from "@/api/track-progress";
import { type UserTrackProgress } from "@/model/user-track-progress";

export const getLastStartedIncompleteTrackQueryOptions = () =>
  queryOptions<UserTrackProgress | null>({
    queryKey: ["lastStartedIncompleteTrack"],
    queryFn: getLastStartedIncompleteTrack,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

/**
 * Query hook for fetching the user's most recently started incomplete track
 */
export const useLastStartedIncompleteTrack = () =>
  useQuery(getLastStartedIncompleteTrackQueryOptions());
```

**`src/hooks/track/use-track.ts`** - Update to support enabled option

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTrack } from "@/api/track";

/**
 * Query options for fetching a single track by ID
 */
export const getTrackQueryOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track", trackId],
    queryFn: () => getTrack({ id: trackId }),
    enabled: !!trackId,
  });

/**
 * Hook to fetch a single track by ID
 */
export const useTrack = (trackId: string) =>
  useQuery(getTrackQueryOptions(trackId));
```

**`src/hooks/track/use-last-started-track-with-details.ts`** - Combined hook for track with details

```ts
import { useLastStartedIncompleteTrack } from "./use-last-started-incomplete-track";
import { useTrack } from "./use-track";
import { type TrackFull } from "@/model/track";

export interface LastStartedTrackWithDetails {
  track: TrackFull;
  startDate: number;
}

/**
 * Hook that fetches the last started incomplete track with full track details
 */
export const useLastStartedTrackWithDetails = () => {
  const lastStartedTrackQuery = useLastStartedIncompleteTrack();
  const trackId = lastStartedTrackQuery.data?.trackId;

  const trackQuery = useTrack(trackId ?? "");

  const isLoading = lastStartedTrackQuery.isLoading || trackQuery.isLoading;
  const isError = lastStartedTrackQuery.isError || trackQuery.isError;
  const isFetching = lastStartedTrackQuery.isFetching || trackQuery.isFetching;

  const data: LastStartedTrackWithDetails | null =
    lastStartedTrackQuery.data && trackQuery.data
      ? {
          track: trackQuery.data,
          startDate: lastStartedTrackQuery.data.startDate,
        }
      : null;

  return {
    data,
    isLoading,
    isError,
    isFetching,
    error: lastStartedTrackQuery.error || trackQuery.error,
  };
};
```

### 1.4 Page changes

No new pages required. The track detail page will be updated to include start/complete buttons.

### 1.5 Component changes

**`src/components/track/track-progress-actions.tsx`** - Start/Complete buttons for track

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTrackProgress } from "@/hooks/track/use-track-progress";
import { useStartTrack } from "@/hooks/track/use-start-track";
import { useCompleteTrack } from "@/hooks/track/use-complete-track";
import { useUncompleteTrack } from "@/hooks/track/use-uncomplete-track";
import { CheckCircle, Play, RotateCcw, AlertCircle } from "lucide-react";

export interface TrackProgressActionsProps {
  trackId: string;
}

/**
 * Displays start/complete/uncomplete buttons based on track progress state
 */
export const TrackProgressActions = ({ trackId }: TrackProgressActionsProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { data: progress, isLoading } = useTrackProgress(trackId);
  const startTrackMutation = useStartTrack();
  const completeTrackMutation = useCompleteTrack();
  const uncompleteTrackMutation = useUncompleteTrack();

  const handleStart = () => {
    setError(null);
    startTrackMutation.mutate(
      { trackId },
      { onError: () => setError(t("failed-start-track")) },
    );
  };

  const handleComplete = () => {
    setError(null);
    completeTrackMutation.mutate(trackId, {
      onError: () => setError(t("failed-complete-track")),
    });
  };

  const handleUncomplete = () => {
    setError(null);
    uncompleteTrackMutation.mutate(trackId, {
      onError: () => setError(t("failed-uncomplete-track")),
    });
  };

  if (isLoading) {
    return null;
  }

  const isStarted = !!progress;
  const isCompleted = !!progress?.completionDate;

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!isStarted && (
        <Button onClick={handleStart} disabled={startTrackMutation.isPending}>
          <Play className="mr-2 h-4 w-4" />
          {t("start-track")}
        </Button>
      )}
      {isStarted && isCompleted && (
        <Button
          variant="outline"
          onClick={handleUncomplete}
          disabled={uncompleteTrackMutation.isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("mark-incomplete")}
        </Button>
      )}
      {isStarted && !isCompleted && (
        <Button onClick={handleComplete} disabled={completeTrackMutation.isPending}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {t("complete-track")}
        </Button>
      )}
    </div>
  );
};
```

**`src/components/track/track-detail.tsx`** - Update to include progress actions

Add import and render `TrackProgressActions` component.

```tsx
// Add import
import { TrackProgressActions } from "@/components/track/track-progress-actions";

// Add TrackProgressActions in the button group (inside the flex gap-2 div):
<div className="flex gap-2">
  <TrackProgressActions trackId={trackId} />
  {isAdminUser && (
    // ... existing Edit and Delete buttons
  )}
</div>
```

**`src/components/track/track-viewer-card.tsx`** - Reusable track viewer card for home page

```tsx
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrackFlowViewer } from "@/components/track/track-flow-viewer";
import { type TrackFull } from "@/model/track";
import { ArrowRight } from "lucide-react";

export interface TrackViewerCardProps {
  track: TrackFull;
  height?: string;
}

/**
 * Reusable card component displaying a track with its flow viewer
 */
export const TrackViewerCard = ({
  track,
  height = "h-[400px]",
}: TrackViewerCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewTrack = () => {
    navigate({ to: "/track/$trackId", params: { trackId: track.id } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{track.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{track.description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleViewTrack}>
          {t("view-track")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className={`${height} border rounded-lg`}>
          <TrackFlowViewer
            rootModuleId={track.rootModuleId}
            parentByModuleId={track.parentByModuleId}
            positionByModuleId={track.positionByModuleId ?? {}}
          />
        </div>
      </CardContent>
    </Card>
  );
};
```

**`src/components/home/last-started-track-section.tsx`** - Home page section for last started track

```tsx
import { useTranslation } from "react-i18next";
import { useLastStartedTrackWithDetails } from "@/hooks/track/use-last-started-track-with-details";
import { TrackViewerCard } from "@/components/track/track-viewer-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Displays the last started incomplete track on the home page
 */
export const LastStartedTrackSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useLastStartedTrackWithDetails();

  if (!data && !isLoading && !isError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("failed-load-last-track")}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return <TrackViewerCard track={data.track} />;
};
```

**`src/components/dashboard/last-started-track-section.tsx`** - Re-export for consistency

```tsx
export { LastStartedTrackSection } from "@/components/home/last-started-track-section";
```

**`src/components/home/home-page.tsx`** - Update to include last started track section

Add import and render `LastStartedTrackSection` component.

```tsx
// Add import
import { LastStartedTrackSection } from "@/components/dashboard/last-started-track-section";

// Add section before continue-learning section in the return JSX:
<div>
  <h2 className="text-xl font-semibold mb-4">{t("continue-track")}</h2>
  <LastStartedTrackSection />
</div>
```

### 1.6 Translation keys

| Key | Purpose |
|-----|---------|
| `start-track` | Button label to start a track |
| `complete-track` | Button label to complete a track |
| `mark-incomplete` | Button label to mark track as incomplete |
| `continue-track` | Section header for continue track on home page |
| `view-track` | Button label to navigate to track detail |
| `failed-load-last-track` | Error message when loading last track fails |
| `failed-start-track` | Error message when starting track fails |
| `failed-complete-track` | Error message when completing track fails |
| `failed-uncomplete-track` | Error message when marking track incomplete fails |

## 2. Acceptance Criteria

### AC1: Start a track

**Given** a user is viewing a track detail page they haven't started  
**When** they click the "Start Track" button  
**Then** a `UserTrackProgress` record is created with the current timestamp as `startDate`

### AC2: Complete a track

**Given** a user is viewing a track detail page they have started but not completed  
**When** they click the "Complete Track" button  
**Then** the `UserTrackProgress` record is updated with the current timestamp as `completionDate`

### AC3: Mark track as incomplete

**Given** a user is viewing a track detail page they have completed  
**When** they click the "Mark Incomplete" button  
**Then** the `UserTrackProgress` record is updated with `completionDate` set to null

### AC4: Display last started incomplete track on home page

**Given** a user has started at least one track that is not completed  
**When** they navigate to the home page  
**Then** they see the "Continue Track" section with the most recently started incomplete track displayed in a card with the track flow viewer

### AC5: Home page shows nothing when no incomplete tracks

**Given** a user has not started any tracks OR all started tracks are completed  
**When** they navigate to the home page  
**Then** the "Continue Track" section is not displayed

### AC6: Track viewer card is clickable

**Given** a user is viewing the last started track on the home page  
**When** they click the "View Track" button  
**Then** they are navigated to the track detail page

### AC7: Module nodes in track viewer are clickable

**Given** a user is viewing the track viewer on the home page  
**When** they click on a module node  
**Then** they are navigated to that module's detail page

### Edge cases

- E1: User starts multiple tracks - only the most recently started incomplete one shows on home page
- E2: User completes the track shown on home page - section disappears or shows next incomplete track
- E3: Track is deleted while user has progress - progress record remains orphaned (no error)
- E4: Loading states show skeleton placeholders
- E5: Error states show user-friendly error messages within the page layout

## 3. Implementation Tasks

### 3.1 `amplify/data/resource.ts` - Add UserTrackProgress model

Add the `UserTrackProgress` model to the schema.

```ts
UserTrackProgress: a
  .model({
    trackId: a.id().required(),
    startDate: a.timestamp().required(),
    completionDate: a.timestamp(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 3.2 `src/model/user-track-progress.ts` - Create type definitions

Create the model file with schema-inferred types.

```ts
import { type Schema } from "../../amplify/data/resource";

export type UserTrackProgress = Schema["UserTrackProgress"]["type"];
export type UserTrackProgressIdentifier =
  Schema["UserTrackProgress"]["identifier"];
export type UserTrackProgressCreateInput =
  Schema["UserTrackProgress"]["createType"];
export type UserTrackProgressUpdateInput =
  Schema["UserTrackProgress"]["updateType"];
```

### 3.3 `src/api/track-progress.ts` - Create track progress API

Create API functions for track progress CRUD operations.

### 3.4 `src/hooks/track/use-track-progress.ts` - Create useTrackProgress hook

Create query hook for fetching track progress.

### 3.5 `src/hooks/track/use-start-track.ts` - Create useStartTrack hook

Create mutation hook for starting a track.

### 3.6 `src/hooks/track/use-complete-track.ts` - Create useCompleteTrack hook

Create mutation hook for completing a track.

### 3.7 `src/hooks/track/use-uncomplete-track.ts` - Create useUncompleteTrack hook

Create mutation hook for marking a track as incomplete.

### 3.8 `src/hooks/track/use-last-started-incomplete-track.ts` - Create hook for last started incomplete track

Create query hook for fetching the last started incomplete track.

### 3.9 `src/hooks/track/use-track.ts` - Update to add enabled option

Add `enabled: !!trackId` to `getTrackQueryOptions` to prevent unnecessary API calls with empty IDs.

```ts
export const getTrackQueryOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track", trackId],
    queryFn: () => getTrack({ id: trackId }),
    enabled: !!trackId,
  });
```

### 3.10 `src/hooks/track/use-last-started-track-with-details.ts` - Create combined hook

Create hook that combines last started track progress with full track details.

### 3.11 `src/components/track/track-progress-actions.tsx` - Create progress actions component

Create component with Start/Complete/Mark Incomplete buttons.

### 3.12 `src/components/track/track-detail.tsx` - Update to include progress actions

Add `TrackProgressActions` component to the track detail page.

### 3.13 `src/components/track/track-viewer-card.tsx` - Create reusable track viewer card

Create card component that wraps `TrackFlowViewer` with title and navigation.

### 3.14 `src/components/home/last-started-track-section.tsx` - Create home page track section

Create section component for displaying last started track on home page.

### 3.15 `src/components/home/home-page.tsx` - Update to include track section

Add `LastStartedTrackSection` to the home page.

### 3.16 `src/i18n/locales/en/common.ts` - Add English translations

```ts
"complete-track": "Complete Track",
"continue-track": "Continue Track",
"failed-complete-track": "Failed to complete track. Please try again.",
"failed-load-last-track": "Failed to load your current track.",
"failed-start-track": "Failed to start track. Please try again.",
"failed-uncomplete-track": "Failed to mark track as incomplete. Please try again.",
"mark-incomplete": "Mark Incomplete",
"start-track": "Start Track",
"view-track": "View Track",
```

### 3.17 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

```ts
"complete-track": "Concluir Trilha",
"continue-track": "Continuar Trilha",
"failed-complete-track": "Falha ao concluir trilha. Tente novamente.",
"failed-load-last-track": "Falha ao carregar sua trilha atual.",
"failed-start-track": "Falha ao iniciar trilha. Tente novamente.",
"failed-uncomplete-track": "Falha ao marcar trilha como incompleta. Tente novamente.",
"mark-incomplete": "Marcar como Incompleto",
"start-track": "Iniciar Trilha",
"view-track": "Ver Trilha",
```

## 4. Execution Order

- [x] 3.1 Add UserTrackProgress model to schema
- [x] 3.2 Create UserTrackProgress type definitions
- [x] 3.3 Create track progress API
- [x] 3.4 Create useTrackProgress hook
- [x] 3.5 Create useStartTrack hook
- [x] 3.6 Create useCompleteTrack hook
- [x] 3.7 Create useUncompleteTrack hook
- [x] 3.8 Create useLastStartedIncompleteTrack hook
- [x] 3.9 Update useTrack hook with enabled option
- [x] 3.10 Create useLastStartedTrackWithDetails hook
- [x] 3.16 Add English translations
- [x] 3.17 Add Portuguese translations
- [x] 3.11 Create TrackProgressActions component
- [x] 3.12 Update TrackDetail component
- [x] 3.13 Create TrackViewerCard component
- [x] 3.14 Create LastStartedTrackSection component
- [x] 3.15 Update HomePage component

## 5. Sidebar

No sidebar changes required.

## 6. Open Questions and missing details

None - all questions resolved:
- ~~Q1: Should the track be automatically marked as complete when all modules in the track are completed?~~ No, manual completion only via button click. Can also be unmarked as complete.
- ~~Q2: Should there be a "tracks completed" stat on the home page stats cards?~~ No.
