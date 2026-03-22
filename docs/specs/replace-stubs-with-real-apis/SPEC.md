# Technical Spec: Replace API Stubs with Real Amplify APIs

## 0. Summary

**Goal:** Remove all 21 stub files in `src/api/stubs/` and rewire all 30 consumer files to use real Amplify API calls, keeping all existing functionality intact.
**Out of scope:** Changing UI layouts, adding new pages, or modifying existing component behavior. Pages should work exactly the same but with real data.

## 1. Technical Design

### 1.1 Amplify schema changes

New models needed for domains that currently have no schema representation:

```ts
// Assessment — maps to assessments-stub.ts
Assessment: a
  .model({
    title: a.string().required(),
    description: a.string(),
    questionCount: a.integer().required(),
    estimatedTimeMinutes: a.integer(),
    status: a.enum(["available", "in_progress", "completed"]),
    score: a.integer(),
    completedAt: a.timestamp(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),

// FeatureToggle — maps to admin-stub.ts feature toggles
FeatureToggle: a
  .model({
    name: a.string().required(),
    description: a.string(),
    enabled: a.boolean().default(false),
  })
  .authorization((allow) => [
    allow.authenticated().to(["read"]),
    allow.group("Admin").to(["create", "update", "delete"]),
  ]),

// SavedItem — maps to saved-stub.ts (generic saved items beyond favourites)
SavedItem: a
  .model({
    itemId: a.string().required(),
    itemType: a.enum(["track", "module", "content", "assessment"]),
    title: a.string().required(),
    thumbnail: a.url(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),

// Program — maps to programs-stub.ts
Program: a
  .model({
    name: a.string().required(),
    category: a.string().required(),
    totalHours: a.integer().required(),
    modules: a.integer().required(),
    status: a.enum(["not_started", "in_progress", "completed"]),
  })
  .authorization((allow) => [
    allow.authenticated().to(["read"]),
    allow.group("Admin").to(["create", "update", "delete"]),
  ]),

// UserProgramProgress — owner-scoped progress for a program
UserProgramProgress: a
  .model({
    programId: a.id().required(),
    completedHours: a.integer().default(0),
    progress: a.integer().default(0),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

No new models needed for these domains — they are derived/computed from existing data:

| Stub Domain       | Derive From                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| `dashboard-stub`  | `UserProfile` + `Goal` + `StudySession` + `DailyTask`                         |
| `activity-stub`   | `StudySession` + `QuizAttempt` + `UserContentProgress` + `UserModuleProgress` |
| `engagement-stub` | `StudySession` + `UserLoginDay` + `QuizAttempt` (admin aggregation)           |
| `metrics-stub`    | `StudySession` + `QuizAttempt` (user aggregation)                             |
| `reports-stub`    | `StudySession` + `QuizAttempt` + `ReviewItem` (user aggregation)              |
| `roi-stub`        | `StudySession` + `UserModuleProgress` (user computation)                      |
| `ranking-stub`    | `RankingEntry` (already exists)                                               |
| `search-stub`     | Client-side filter across `Track`, `Content`, `Module`                        |

### 1.2 Type definitions

Create model files for new schema models:

```ts
// src/model/assessment.ts
import { type Schema } from "../../amplify/data/resource";

export type Assessment = Schema["Assessment"]["type"];
export type AssessmentIdentifier = Schema["Assessment"]["identifier"];
export type AssessmentCreateInput = Schema["Assessment"]["createType"];
export type AssessmentUpdateInput = Schema["Assessment"]["updateType"];
```

```ts
// src/model/feature-toggle.ts
import { type Schema } from "../../amplify/data/resource";

export type FeatureToggle = Schema["FeatureToggle"]["type"];
export type FeatureToggleIdentifier = Schema["FeatureToggle"]["identifier"];
export type FeatureToggleUpdateInput = Schema["FeatureToggle"]["updateType"];
```

```ts
// src/model/saved-item.ts
import { type Schema } from "../../amplify/data/resource";

export type SavedItem = Schema["SavedItem"]["type"];
export type SavedItemIdentifier = Schema["SavedItem"]["identifier"];
export type SavedItemCreateInput = Schema["SavedItem"]["createType"];
```

```ts
// src/model/program.ts
import { type Schema } from "../../amplify/data/resource";

export type Program = Schema["Program"]["type"];
export type ProgramIdentifier = Schema["Program"]["identifier"];
```

```ts
// src/model/user-program-progress.ts
import { type Schema } from "../../amplify/data/resource";

export type UserProgramProgress = Schema["UserProgramProgress"]["type"];
export type UserProgramProgressCreateInput =
  Schema["UserProgramProgress"]["createType"];
export type UserProgramProgressUpdateInput =
  Schema["UserProgramProgress"]["updateType"];
```

Delete `src/types/dashboard.ts` — replace with schema-inferred types composed in the dashboard hook.

### 1.3 API / Data fetching changes

#### New API files needed (for new schema models)

```ts
// src/api/assessment.ts
export const listAssessments = async (): Promise<Schema["Assessment"]["type"][]> => { ... };
export const updateAssessment = async (input: AssessmentUpdateInput): Promise<...> => { ... };
```

```ts
// src/api/feature-toggle.ts
export const listFeatureToggles = async (): Promise<Schema["FeatureToggle"]["type"][]> => { ... };
export const updateFeatureToggle = async (input: FeatureToggleUpdateInput): Promise<...> => { ... };
```

```ts
// src/api/saved-item.ts
export const listSavedItems = async (): Promise<Schema["SavedItem"]["type"][]> => { ... };
export const createSavedItem = async (input: SavedItemCreateInput): Promise<...> => { ... };
export const deleteSavedItem = async (identifier: SavedItemIdentifier): Promise<void> => { ... };
```

```ts
// src/api/program.ts
export const listPrograms = async (): Promise<Schema["Program"]["type"][]> => { ... };
```

```ts
// src/api/user-program-progress.ts
export const listUserProgramProgress = async (): Promise<Schema["UserProgramProgress"]["type"][]> => { ... };
export const createUserProgramProgress = async (input: ...): Promise<...> => { ... };
export const updateUserProgramProgress = async (input: ...): Promise<...> => { ... };
```

#### New hooks needed (for new schema models)

```ts
// src/hooks/assessment/use-list-assessments.ts
export const listAssessmentsQueryOptions = () =>
  queryOptions({ queryKey: ["assessments", "list"], queryFn: listAssessments });
export const useListAssessments = () => useQuery(listAssessmentsQueryOptions());
```

```ts
// src/hooks/assessment/use-update-assessment.ts
export const useUpdateAssessment = () => useMutation({ mutationFn: updateAssessment, ... });
```

```ts
// src/hooks/feature-toggle/use-list-feature-toggles.ts
export const useListFeatureToggles = () => useQuery(...);
```

```ts
// src/hooks/feature-toggle/use-update-feature-toggle.ts
export const useUpdateFeatureToggle = () => useMutation(...);
```

```ts
// src/hooks/saved-item/use-list-saved-items.ts
export const useListSavedItems = () => useQuery(...);
```

```ts
// src/hooks/saved-item/use-create-saved-item.ts
export const useCreateSavedItem = () => useMutation(...);
```

```ts
// src/hooks/saved-item/use-delete-saved-item.ts
export const useDeleteSavedItem = () => useMutation(...);
```

```ts
// src/hooks/program/use-list-programs.ts
export const useListPrograms = () => useQuery(...);
```

```ts
// src/hooks/user-program-progress/use-list-user-program-progress.ts
export const useListUserProgramProgress = () => useQuery(...);
```

#### Derived/computed hooks (no new schema, compose from existing data)

```ts
// src/hooks/dashboard/use-dashboard-data.ts — rewrite to compose from real hooks
// Calls useMyProfile, useListGoals, useListStudySessions, useListDailyTasks internally
```

```ts
// src/hooks/activity/use-activity-feed.ts — rewrite to derive from real data
// Fetches StudySession + QuizAttempt + UserContentProgress and merges into activity timeline
```

```ts
// src/hooks/reports/use-reports.ts — rewrite to aggregate from real data
// Aggregates StudySession data by period
```

```ts
// src/hooks/engagement/use-engagement.ts — rewrite to aggregate from real data
// Admin-level aggregation of StudySession + UserLoginDay
```

```ts
// src/hooks/metrics/use-metrics.ts — rewrite to compute from real data
// Computes averages from StudySession data
```

```ts
// src/hooks/roi/use-roi.ts — rewrite to compute from real data
// Computes efficiency from StudySession + UserModuleProgress
```

```ts
// src/hooks/search/use-search.ts — rewrite as client-side search
// Fetches Track + Content + Module lists and filters client-side
```

#### Existing hooks to rewire (Category A — real hooks already exist)

| Stub Hook                                    | Delete | Replace With (already exists)                                 |
| -------------------------------------------- | ------ | ------------------------------------------------------------- |
| `src/hooks/profile/use-user-profile.ts`      | Yes    | `src/hooks/user-profile/use-my-profile.ts`                    |
| `src/hooks/settings/use-user-account.ts`     | Yes    | `src/hooks/user-profile/use-my-profile.ts`                    |
| `src/hooks/settings/use-user-preferences.ts` | Yes    | `src/hooks/learning-preference/use-my-learning-preference.ts` |
| `src/hooks/goals/use-goals.ts`               | Yes    | `src/hooks/goal/use-list-goals.ts` + `use-create-goal.ts`     |
| `src/hooks/goals/use-active-goal.ts`         | Yes    | `src/hooks/goal/use-list-goals.ts` (filter active)            |
| `src/hooks/goals/use-goal-history.ts`        | Yes    | `src/hooks/goal/use-list-goals.ts` (filter completed)         |
| `src/hooks/sessions/use-sessions.ts`         | Yes    | `src/hooks/study-session/use-list-sessions.ts`                |
| `src/hooks/calendar/use-upcoming-events.ts`  | Yes    | `src/hooks/calendar-event/use-list-calendar-events.ts`        |
| `src/hooks/ranking/use-ranking.ts`           | Yes    | `src/hooks/ranking/use-weekly-ranking.ts`                     |
| `src/hooks/reviews/use-reviews.ts`           | Yes    | `src/hooks/review-item/use-list-review-items.ts`              |
| `src/hooks/tracks/use-tracks-catalog.ts`     | Yes    | `src/hooks/track/use-tracks.ts`                               |
| `src/hooks/tracks/use-active-track.ts`       | Yes    | `src/hooks/track/use-tracks.ts` (filter active)               |
| `src/hooks/tracks/use-track-modules.ts`      | Yes    | `src/hooks/modules/use-modules.ts` (filter by track)          |
| `src/hooks/contents/use-contents.ts`         | Yes    | `src/hooks/content/use-list-content.ts`                       |
| `src/hooks/admin/use-admin-users.ts`         | Yes    | Cognito admin API (see 1.4)                                   |

### 1.4 Page changes

Every page keeps its current layout and behavior. Only the data source changes.

| Page                                                        | Current Stub Hook(s)                                        | New Data Source                                                                    |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/components/home/home-page.tsx`                         | `useDashboardData`                                          | Rewritten `useDashboardData` composing real hooks                                  |
| `src/components/goal/metas-page-integrated.tsx`             | `useActiveGoal`, `useGoalHistory`, `useGoals`               | `useListGoals` + `useCreateGoal` from `src/hooks/goal/`                            |
| `src/components/profile/perfil-page-integrated.tsx`         | `useUserProfile`                                            | `useMyProfile` from `src/hooks/user-profile/`                                      |
| `src/components/profile/perfil-page.tsx`                    | `useUserProfile`                                            | `useMyProfile` from `src/hooks/user-profile/`                                      |
| `src/components/ranking/ranking-page-integrated.tsx`        | `useRanking`                                                | `useWeeklyRanking` from `src/hooks/ranking/`                                       |
| `src/components/ranking/ranking-page.tsx`                   | `useRanking`                                                | `useWeeklyRanking` from `src/hooks/ranking/`                                       |
| `src/components/calendar/calendario-page-integrated.tsx`    | `useUpcomingEvents`                                         | `useListCalendarEvents` from `src/hooks/calendar-event/`                           |
| `src/components/sessions/Sessões-page-integrated.tsx`       | `useSessions`                                               | `useListStudySessions` from `src/hooks/study-session/`                             |
| `src/components/study/estudar-page.tsx`                     | `useSessions` (stub)                                        | `useListStudySessions` from `src/hooks/study-session/`                             |
| `src/components/review/revisoes-page-integrated.tsx`        | `useReviews`                                                | `useListReviewItems` from `src/hooks/review-item/`                                 |
| `src/components/saved/salvos-page-integrated.tsx`           | `useSavedItems`                                             | `useListSavedItems` from `src/hooks/saved-item/`                                   |
| `src/components/saved/salvos-page.tsx`                      | `useSavedItems`                                             | `useListSavedItems` from `src/hooks/saved-item/`                                   |
| `src/components/tracks/explorar-trilhas-page.tsx`           | `useTracksCatalog`, `useActiveTrack`, `useTrackModules`     | `useTracks` from `src/hooks/track/`                                                |
| `src/components/content/conteudos-page-integrated.tsx`      | `useContents`                                               | `useListContent` from `src/hooks/content/`                                         |
| `src/components/settings/configuracoes-page-integrated.tsx` | `useUserAccount`, `useUserPreferences`                      | `useMyProfile` + `useMyLearningPreference`                                         |
| `src/components/activity/atividade-page.tsx`                | `useActivityFeed`                                           | Rewritten `useActivityFeed` deriving from real data                                |
| `src/components/analytics/relatorios-page-integrated.tsx`   | `useReports`                                                | Rewritten `useReports` aggregating real `StudySession` data                        |
| `src/components/assessments/avaliacoes-page.tsx`            | `useAssessments`                                            | `useListAssessments` from `src/hooks/assessment/`                                  |
| `src/components/engagement/engajamento-page-integrated.tsx` | `useEngagement`                                             | Rewritten `useEngagement` aggregating real data                                    |
| `src/components/programs/programas-page-integrated.tsx`     | `usePrograms`                                               | `useListPrograms` + `useListUserProgramProgress`                                   |
| `src/components/roi/roi-estudo-page-integrated.tsx`         | `useROI`                                                    | Rewritten `useROI` computing from real data                                        |
| `src/components/admin/admin-page.tsx`                       | `useAdminUsers`, `useCatalogResources`, `useFeatureToggles` | Cognito list users API + `useListFeatureToggles` + existing resource catalog hooks |
| `src/components/search/pesquisar-page-integrated.tsx`       | `useSearch`                                                 | Rewritten `useSearch` with client-side filtering                                   |
| `src/components/search/pesquisar-page.tsx`                  | `useSearch`                                                 | Rewritten `useSearch` with client-side filtering                                   |

### 1.5 Component changes

No new components needed. Each page component listed in 1.4 will update its imports and adapt to the real API return types. The main adaptation is mapping schema-inferred types to the shapes the UI expects (e.g., `Schema["Goal"]["type"]` has `status` as an enum, the page may need to group goals by status).

### 1.6 Translation keys

No new translation keys needed. All existing translations remain.

## 1.7. Sidebar

No sidebar changes. All pages remain.

## 2. Acceptance Criteria

### AC1: No stub imports remain

**Given** the migration is complete
**When** running `grep -r 'api/stubs' src/`
**Then** zero results are returned

### AC2: All pages render with real data

**Given** a logged-in user
**When** navigating to any page that previously used stubs
**Then** the page fetches data from Amplify and renders it (or shows an empty state if no data exists)

### AC3: Profile page uses real data

**Given** a logged-in user with a `UserProfile` record
**When** navigating to the profile page
**Then** the page displays the user's real `displayName`, `xp`, `level`, and `streak` from DynamoDB

### AC4: Goals page uses real data

**Given** a logged-in user
**When** navigating to the goals page
**Then** goals are fetched from the `Goal` model, grouped by status (active, completed, etc.)

### AC5: Dashboard composes real data

**Given** a logged-in user
**When** navigating to the home page
**Then** metrics (streak, XP, level), recent sessions, and upcoming tasks are fetched from their respective real models

### AC6: Search works client-side

**Given** a logged-in user on the search page
**When** typing a query with 3+ characters
**Then** results are filtered client-side from `Track`, `Content`, and `Module` data

### AC7: New schema models are deployed

**Given** the schema changes are applied
**When** running `npx ampx sandbox`
**Then** `Assessment`, `FeatureToggle`, `SavedItem`, `Program`, and `UserProgramProgress` tables are created in DynamoDB

### AC8: TypeScript compiles without errors

**Given** all stubs are removed and replaced
**When** running `npx tsc --noEmit`
**Then** no type errors are reported

### Edge cases

- E1: Pages show empty states when no real data exists (not errors)
- E2: Dashboard gracefully handles partial data (e.g., user has sessions but no goals)
- E3: Ranking page shows empty state if no `RankingEntry` records exist
- E4: Activity feed shows empty state if user has no sessions, quiz attempts, or progress records
- E5: Admin page handles case where Cognito list users call fails (permission denied for non-admin)

## 3. Implementation Tasks

### Phase 1: Schema + new models

### [x] 3.1 `amplify/data/resource.ts` - Add new schema models

Add `Assessment`, `FeatureToggle`, `SavedItem`, `Program`, and `UserProgramProgress` models as described in section 1.1.

### [x] 3.2 `src/model/` - Create model type files

Create the following files with schema-inferred types as described in section 1.2:

- `src/model/assessment.ts`
- `src/model/feature-toggle.ts`
- `src/model/saved-item.ts`
- `src/model/program.ts`
- `src/model/user-program-progress.ts`

### Phase 2: New API files + hooks (for new models)

### [x] 3.3 `src/api/assessment.ts` - Assessment API functions

Create `listAssessments`, `createAssessment`, `updateAssessment` functions using Amplify client.

### [x] 3.4 `src/hooks/assessment/` - Assessment hooks

Create:

- `use-list-assessments.ts`
- `use-update-assessment.ts`

### [x] 3.5 `src/api/feature-toggle.ts` - Feature toggle API functions

Create `listFeatureToggles`, `updateFeatureToggle` functions.

### [x] 3.6 `src/hooks/feature-toggle/` - Feature toggle hooks

Create:

- `use-list-feature-toggles.ts`
- `use-update-feature-toggle.ts`

### [x] 3.7 `src/api/saved-item.ts` - Saved item API functions

Create `listSavedItems`, `createSavedItem`, `deleteSavedItem` functions.

### [x] 3.8 `src/hooks/saved-item/` - Saved item hooks

Create:

- `use-list-saved-items.ts`
- `use-create-saved-item.ts`
- `use-delete-saved-item.ts`

### [x] 3.9 `src/api/program.ts` + `src/api/user-program-progress.ts` - Program API functions

Create `listPrograms`, `listUserProgramProgress`, `createUserProgramProgress`, `updateUserProgramProgress` functions.

### [x] 3.10 `src/hooks/program/` + `src/hooks/user-program-progress/` - Program hooks

Create:

- `use-list-programs.ts`
- `use-list-user-program-progress.ts`
- `use-update-user-program-progress.ts`

### Phase 3: Rewrite derived/computed hooks

### [x] 3.11 `src/hooks/dashboard/use-dashboard-data.ts` - Compose from real hooks

Rewrite to call `useMyProfile`, `useListGoals`, `useListStudySessions`, `useListDailyTasks` and compose the `DashboardData` shape.

### [x] 3.12 `src/hooks/activity/use-activity-feed.ts` - Derive from real data

Rewrite to fetch `StudySession`, `QuizAttempt`, `UserContentProgress`, `UserModuleProgress` and merge into a chronological activity timeline.

### [x] 3.13 `src/hooks/reports/use-reports.ts` - Aggregate from real data

Rewrite to aggregate `StudySession` records by period (week/month/quarter/year) and compute totals, breakdown, and chart data.

### [x] 3.14 `src/hooks/engagement/use-engagement.ts` - Aggregate from real data

Rewrite to compute engagement metrics from `StudySession`, `UserLoginDay`, and `QuizAttempt` data.

### [x] 3.15 `src/hooks/metrics/use-metrics.ts` - Compute from real data

Create new hook file. Compute average session time, time distribution, and performance from `StudySession` and `QuizAttempt`.

### [x] 3.16 `src/hooks/roi/use-roi.ts` - Compute from real data

Rewrite to compute time invested, efficiency, and velocity from `StudySession` and `UserModuleProgress`.

### [x] 3.17 `src/hooks/search/use-search.ts` - Client-side search

Rewrite to fetch `Track`, `Content`, and `Module` lists and filter client-side by query string.

### [x] 3.18 `src/hooks/admin/` - Replace admin stubs

- `use-admin-users.ts`: Use Cognito `listUsers` admin API
- `use-catalog-resources.ts`: Use existing `useListContent`, `useTracks`, `useModules`
- `use-feature-toggles.ts`: Use new `useListFeatureToggles` + `useUpdateFeatureToggle`

### Phase 4: Rewire Category A (existing real hooks)

### [x] 3.19 `src/hooks/profile/use-user-profile.ts` - Delete, update consumers

Delete file. Update `perfil-page-integrated.tsx` and `perfil-page.tsx` to import `useMyProfile` from `src/hooks/user-profile/use-my-profile.ts`.

### [x] 3.20 `src/hooks/settings/` - Delete, update consumers

Delete `use-user-account.ts` and `use-user-preferences.ts`. Update `configuracoes-page-integrated.tsx` to import `useMyProfile` + `useMyLearningPreference`.

### [x] 3.21 `src/hooks/goals/` - Delete directory, update consumers

Delete entire directory. Update `metas-page-integrated.tsx` to import from `src/hooks/goal/`.

### [x] 3.22 `src/hooks/sessions/use-sessions.ts` - Delete, update consumers

Delete file. Update `Sessões-page-integrated.tsx` and `estudar-page.tsx` to import `useListStudySessions`.

### [x] 3.23 `src/hooks/calendar/use-upcoming-events.ts` - Delete, update consumer

Delete file. Update `calendario-page-integrated.tsx` to import `useListCalendarEvents`.

### [x] 3.24 `src/hooks/ranking/use-ranking.ts` - Delete, update consumers

Delete file. Update `ranking-page-integrated.tsx` and `ranking-page.tsx` to import `useWeeklyRanking`.

### [x] 3.25 `src/hooks/reviews/use-reviews.ts` - Delete, update consumer

Delete file. Update `revisoes-page-integrated.tsx` to import `useListReviewItems`.

### [x] 3.26 `src/hooks/tracks/` - Delete directory, update consumer

Delete entire directory. Update `explorar-trilhas-page.tsx` to import from `src/hooks/track/`.

### [x] 3.27 `src/hooks/contents/use-contents.ts` - Delete, update consumer

Delete file. Update `conteudos-page-integrated.tsx` to import `useListContent`.

### Phase 5: Update page components

### [x] 3.28 Update all page components to use new types

Each page listed in section 1.4 needs its imports updated and any type references changed from stub interfaces to schema-inferred types. Adapt data mapping where the real API shape differs from the stub shape.

### Phase 6: Cleanup

### [x] 3.29 Delete `src/api/stubs/` directory

```bash
rm -rf src/api/stubs/
```

### [x] 3.30 Delete empty stub hook directories

```bash
rm -rf src/hooks/goals/ src/hooks/tracks/ src/hooks/sessions/ src/hooks/calendar/
rm -rf src/hooks/profile/ src/hooks/settings/ src/hooks/saved/ src/hooks/contents/
rm -rf src/hooks/assessments/ src/hooks/programs/
```

### [x] 3.31 Delete `src/types/dashboard.ts`

Replace with schema-inferred types composed in the dashboard hook.

### Phase 7: Verify

### [x] 3.32 Verify no stub references remain

```bash
grep -r 'api/stubs' src/
```

### [x] 3.33 Verify TypeScript compiles

```bash
npx tsc --noEmit
```

### [x] 3.34 Manual smoke test all pages

Test every page in the browser to confirm real data loads or empty states display correctly.

## 4. Open Questions and missing details

- Q1: For the dashboard, should we create a single composite hook that calls multiple APIs, or should the home page call each hook individually?
- Q2: The activity feed stub has types like `course_completed`, `quiz_completed`, `module_completed` — should we create a dedicated `ActivityLog` model to store these events explicitly, or derive them from existing progress records?
- Q3: The engagement metrics (DAU, WAU, MAU, retention) require aggregation across all users. Should this be a Lambda function that runs on a schedule, or computed on-the-fly in the admin page?
- Q4: The admin users page uses Cognito `listUsers` — does the current Amplify auth setup expose this API, or do we need a custom Lambda?
- Q5: The ROI stub returns monetary values (`R$ 45k`). How should ROI be computed from real data? What formula maps study hours to estimated value?
- Q6: Should the search hook pre-fetch all data on mount, or fetch lazily when the user types?
