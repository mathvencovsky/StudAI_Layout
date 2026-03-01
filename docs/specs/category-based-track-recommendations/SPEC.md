# Technical Spec: Category-Based Track Recommendations

## 0. Summary

**Goal:** Add a `TrackCategory` enum to the Amplify schema, use it for both `Track.categories` and `LearningPreference.interests`, and show a personalized track recommendation list on the home page when the user has no active modules or tracks.  
**Out of scope:** Sorting/ranking recommendations by relevance score, AI-based recommendations, filtering on the explore/search tracks pages.

---

## 1. Technical Design

### 1.1 Amplify schema changes

Add a `TrackCategory` enum with the same values as the current `INTEREST_OPTIONS` (using underscores per Amplify rules). Update `Track` to have an optional `categories` array and update `LearningPreference.interests` to use the enum.

```ts
// amplify/data/resource.ts

TrackCategory: a.enum([
  "web_development",
  "mobile_development",
  "data_science",
  "machine_learning",
  "cloud_computing",
  "devops",
  "cybersecurity",
  "databases",
  "ui_ux_design",
  "game_development",
  "blockchain",
  "embedded_systems",
]),

Track: a.model({
  // ...existing fields...
  categories: a.ref("TrackCategory").array(), // optional array, items are required by default
}),

LearningPreference: a.model({
  // ...existing fields...
  interests: a.ref("TrackCategory").required().array().required(), // required array with required items
}),
```

### 1.2 Type definitions

#### `src/model/track.ts`

Add `TrackCategory` type export and include `categories` in the selection set. Also add a selection set type for tracks with categories.

```ts
import { type SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export type TrackCategory = Schema["TrackCategory"]["type"];

export const trackSelectionSet = [
  // ...existing fields...
  "categories",
] as const;

export type TrackWithCategories = SelectionSet<Track, typeof trackSelectionSet>;
```

#### `src/model/learning-preference.ts`

No new types needed — `LearningPreference` type is already inferred from schema and will automatically reflect the enum change.

#### `src/components/learning-preferences/constants.ts`

Replace the hardcoded `INTEREST_OPTIONS` string array with values derived from the schema enum type so there is a single source of truth.

```ts
import { type TrackCategory } from "@/model/track";

export const INTEREST_OPTIONS: TrackCategory[] = [
  "web_development",
  "mobile_development",
  // ...all enum values
];
```

The translation key lookup in `StepInterests` maps enum values to i18n keys by replacing underscores with hyphens:
```ts
t(`learning-preferences-interest-${interest.replace(/_/g, "-")}`)
```

### 1.3 API / Data fetching changes

#### `src/api/track.ts`

`getTracks` and `getTrack` already use `trackSelectionSet`. No logic changes needed — adding `"categories"` to the selection set is sufficient.

#### `src/hooks/track/use-tracks-by-categories.ts` _(new file)_

New hook that fetches all tracks and filters client-side by a list of categories (OR logic). Uses the existing `getTracksQueryOptions` and follows React Query guidelines.

```ts
import { useQuery } from "@tanstack/react-query";
import { getTracksQueryOptions } from "@/hooks/track/use-tracks";
import { type TrackCategory } from "@/model/track";

/**
 * Fetches all tracks and filters by categories using OR logic.
 * Returns all tracks when categories is undefined or empty.
 */
export const useTracksByCategories = (categories: TrackCategory[] | undefined) =>
  useQuery({
    ...getTracksQueryOptions(),
    select: (tracks) => {
      if (!categories?.length) return tracks;
      return tracks.filter((track) =>
        track.categories?.some((category) => categories.includes(category))
      );
    },
  });
```

### 1.4 Page changes

No route-level page changes. All changes are within existing components.

### 1.5 Component changes

#### `src/components/home/home-page.tsx`

Add logic to detect when both the last-started module and last-started track are absent (after loading). When both are empty, render `RecommendedTracksEmptyState` in place of the two-column grid.

```tsx
const { data: lastTrack, isLoading: isLoadingTrack } = useLastStartedTrackWithDetails();
const { data: lastModule, isLoading: isLoadingModule } = useLastStartedModuleWithContents();

const hasActiveContent = !!lastTrack || !!lastModule;
const isLoadingContent = isLoadingTrack || isLoadingModule;

// In JSX, replace the grid section:
{isLoadingContent ? (
  <LoadingState />
) : hasActiveContent ? (
  <div className="grid gap-4 lg:grid-cols-2">
    {/* existing sections */}
  </div>
) : (
  <RecommendedTracksEmptyState interests={existingPreference?.interests} />
)}
```

#### `src/components/home/recommended-tracks-empty-state.tsx` _(new file)_

Presentational + data component that shows a heading, description, and a list of track cards filtered by the user's interest categories. If `interests` is undefined/empty, shows all tracks.

```tsx
export interface RecommendedTracksEmptyStateProps {
  interests: TrackCategory[] | undefined;
}

export const RecommendedTracksEmptyState = ({ interests }: RecommendedTracksEmptyStateProps) => {
  const { t } = useTranslation();
  const { data: tracks, isLoading } = useTracksByCategories(interests);
  // renders heading + track cards grid
};
```

#### `src/components/track/track-form.tsx`

Add an optional `categories` multi-select field (using shadcn `ToggleGroup` or similar) to the form. Update `FormValues` type and the create/update mutation calls to include `categories`.

```tsx
// Add to FormValues
categories: TrackCategory[];

// Add field in JSX
<FormField name="categories" render={...} />
```

### 1.6 Translation keys

```
// New keys needed:
"recommended-tracks-title"           // Section heading in empty state
"recommended-tracks-description"     // Subtitle explaining why tracks are shown
"recommended-tracks-empty"           // When no tracks match the user's interests
"track-categories-label"             // Label for the categories field in TrackForm
"track-category-web-development"
"track-category-mobile-development"
"track-category-data-science"
"track-category-machine-learning"
"track-category-cloud-computing"
"track-category-devops"
"track-category-cybersecurity"
"track-category-databases"
"track-category-ui-ux-design"
"track-category-game-development"
"track-category-blockchain"
"track-category-embedded-systems"
```

> Note: The existing `learning-preferences-interest-*` keys already cover the same categories for the preferences form. The `track-category-*` keys are for displaying category badges/labels on track cards and the form.

## 1.7 Sidebar

No sidebar changes required.

---

## 2. Acceptance Criteria

### AC1: Track has optional categories

**Given** an admin is editing a track  
**When** they open the edit form  
**Then** they can select zero or more categories from the `TrackCategory` enum values

### AC2: Learning preferences interests use enum

**Given** a user is setting up learning preferences  
**When** they reach the interests step  
**Then** the available options match exactly the `TrackCategory` enum values

### AC3: Home page shows recommendations when no active content

**Given** a user has set learning preferences with at least one interest  
**And** they have no active (in-progress) modules or tracks  
**When** they visit the home page  
**Then** the two-column "continue learning / continue track" grid is replaced by a recommended tracks list filtered by their interests

### AC4: Recommendations use OR logic

**Given** a user has interests `["web_development", "data_science"]`  
**When** the recommended tracks are shown  
**Then** tracks with `categories` containing either `web_development` OR `data_science` are included

### AC5: No preferences fallback

**Given** a user somehow reaches the home page without a `LearningPreference` record  
**When** the recommendations empty state is shown  
**Then** all tracks are displayed without any category filtering

### Edge cases

- E1: A track has no `categories` set — it is excluded from filtered results but shown when no preferences exist
- E2: No tracks match the user's interests — show a `"recommended-tracks-empty"` message
- E3: Both sections are still loading — show `LoadingState`, not the recommendations

---

## 3. Implementation Tasks

### [x] 3.1 Schema and type changes

#### `amplify/data/resource.ts`

Add `TrackCategory` enum. Update `Track.categories` and `LearningPreference.interests` to use `a.ref("TrackCategory")`.

```ts
TrackCategory: a.enum(["web_development", "mobile_development", "data_science",
  "machine_learning", "cloud_computing", "devops", "cybersecurity", "databases",
  "ui_ux_design", "game_development", "blockchain", "embedded_systems"]),

// In Track:
categories: a.ref("TrackCategory").array(), // optional array, items are required by default

// In LearningPreference:
interests: a.ref("TrackCategory").required().array().required(), // required array with required items
```

#### `src/model/track.ts`

Export `TrackCategory` type and add `"categories"` to `trackSelectionSet`. Add selection set type for tracks with categories.

```ts
import { type SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export type TrackCategory = Schema["TrackCategory"]["type"];

export const trackSelectionSet = [
  "id", "title", "description", "rootModuleId",
  "parentByModuleId", "positionByModuleId", "categories",
  "createdAt", "updatedAt",
] as const;

export type TrackWithCategories = SelectionSet<Track, typeof trackSelectionSet>;
```

#### `src/components/learning-preferences/constants.ts`

Replace hardcoded `INTEREST_OPTIONS` with typed array derived from `TrackCategory`.

```ts
import { type TrackCategory } from "@/model/track";

export const INTEREST_OPTIONS: TrackCategory[] = [
  "web_development", "mobile_development", "data_science", "machine_learning",
  "cloud_computing", "devops", "cybersecurity", "databases", "ui_ux_design",
  "game_development", "blockchain", "embedded_systems",
];
```

#### `src/components/learning-preferences/step-interests.tsx`

Update the translation key lookup to replace underscores with hyphens when building the i18n key.

```ts
t(`learning-preferences-interest-${interest.replace(/_/g, "-")}`)
```

### [x] 3.2 New hook: tracks by categories

#### `src/hooks/track/use-tracks-by-categories.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { getTracksQueryOptions } from "@/hooks/track/use-tracks";
import { type TrackCategory } from "@/model/track";

/**
 * Fetches all tracks and filters by categories using OR logic.
 * Returns all tracks when categories is undefined or empty.
 */
export const useTracksByCategories = (categories: TrackCategory[] | undefined) =>
  useQuery({
    ...getTracksQueryOptions(),
    select: (tracks) => {
      if (!categories?.length) return tracks;
      return tracks.filter((track) =>
        track.categories?.some((category) => categories.includes(category))
      );
    },
  });
```

### [x] 3.3 New component: recommended tracks empty state

#### `src/components/home/recommended-tracks-empty-state.tsx`

```tsx
import { useTranslation } from "react-i18next";
import { useTracksByCategories } from "@/hooks/track/use-tracks-by-categories";
import { type TrackCategory } from "@/model/track";
import { LoadingState } from "@/components/ui/loading-state";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface RecommendedTracksEmptyStateProps {
  interests: TrackCategory[] | undefined;
}

/**
 * Shown on the home page when the user has no active modules or tracks.
 * Displays tracks filtered by the user's interest categories.
 */
export const RecommendedTracksEmptyState = ({ interests }: RecommendedTracksEmptyStateProps) => {
  const { t } = useTranslation();
  const { data: tracks, isLoading } = useTracksByCategories(interests);

  if (isLoading) return <LoadingState />;

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-medium text-sm text-foreground">{t("recommended-tracks-title")}</h3>
        <p className="text-xs text-muted-foreground">{t("recommended-tracks-description")}</p>
      </div>
      {!tracks?.length ? (
        <p className="text-sm text-muted-foreground">{t("recommended-tracks-empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tracks.map((track) => (
            <Card key={track.id}>
              <CardHeader>
                <CardTitle className="text-sm line-clamp-1">{track.title}</CardTitle>
                <CardDescription className="line-clamp-2">{track.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/track/$trackId" params={{ trackId: track.id }}>
                  <Button size="sm" className="w-full">{t("browse-tracks")}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
```

### [x] 3.4 Update home page

#### `src/components/home/home-page.tsx`

Import `useLastStartedModuleWithContents` and `useLastStartedTrackWithDetails`. Replace the two-column grid with conditional rendering.

```tsx
const { data: lastTrack, isLoading: isLoadingTrack } = useLastStartedTrackWithDetails();
const { data: lastModule, isLoading: isLoadingModule } = useLastStartedModuleWithContents();

const isLoadingContent = isLoadingTrack || isLoadingModule;
const hasActiveContent = !!lastTrack || !!lastModule;

// Replace the grid JSX:
{isLoadingContent ? (
  <LoadingState />
) : hasActiveContent ? (
  <div className="grid gap-4 lg:grid-cols-2">
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="font-medium text-sm text-foreground">{t("continue-learning")}</h3>
      </div>
      <div className="p-3"><LastStartedModuleSection /></div>
    </section>
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="font-medium text-sm text-foreground">{t("continue-track")}</h3>
      </div>
      <div className="p-3"><LastStartedTrackSection /></div>
    </section>
  </div>
) : (
  <RecommendedTracksEmptyState interests={existingPreference?.interests} />
)}
```

### [x] 3.5 Update track form with categories field

#### `src/components/track/track-form.tsx`

Add `categories` to `FormValues`, default it to `[]`, and add a `ToggleGroup` multi-select field.

```tsx
import { type TrackCategory } from "@/model/track";
import { INTEREST_OPTIONS } from "@/components/learning-preferences/constants";

type FormValues = {
  title: string;
  description: string;
  categories: TrackCategory[];
};

// In defaultValues:
categories: initialData?.categories ?? [],

// In JSX, add after description field:
<div className="space-y-2">
  <Label>{t("track-categories-label")}</Label>
  <ToggleGroup
    type="multiple"
    value={watch("categories")}
    onValueChange={(value) => setValue("categories", value as TrackCategory[])}
    className="flex flex-wrap gap-2 justify-start"
  >
    {INTEREST_OPTIONS.map((category) => (
      <ToggleGroupItem key={category} value={category} className="px-3 py-2 text-sm">
        {t(`track-category-${category.replace(/_/g, "-")}`)}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
</div>

// Include categories in create/update mutation calls:
categories: values.categories,
```

### [x] 3.6 Add translation keys

#### `src/i18n/locales/en/common.ts` and `src/i18n/locales/pt-BR/common.ts`

Add all new keys in alphabetical order in both files.

```ts
// Keys to add (en values shown):
"recommended-tracks-description": "Based on your learning interests",
"recommended-tracks-empty": "No tracks found for your interests yet",
"recommended-tracks-title": "Recommended Tracks",
"track-categories-label": "Categories",
"track-category-blockchain": "Blockchain",
"track-category-cloud-computing": "Cloud Computing",
"track-category-cybersecurity": "Cybersecurity",
"track-category-data-science": "Data Science",
"track-category-databases": "Databases",
"track-category-devops": "DevOps",
"track-category-embedded-systems": "Embedded Systems",
"track-category-game-development": "Game Development",
"track-category-machine-learning": "Machine Learning",
"track-category-mobile-development": "Mobile Development",
"track-category-ui-ux-design": "UI/UX Design",
"track-category-web-development": "Web Development",
```

---

## 4. Open Questions and missing details

- Q1: Should category badges be displayed on track cards in the explore/search pages as a follow-up? (Not in scope here but likely desired.)
- Q2: Should the `RecommendedTracksEmptyState` have a limit on how many tracks it shows, or paginate?
