# Technical Spec: Study Metrics Tracking

## 0. Summary

**Goal:** Replace fake/empty study metrics with two real data sources — completion-based content hours (from `UserContentProgress` + `Content.durationInSeconds`) and active-time sessions (global Page Visibility tracking with crash recovery) — and display both in the Reports page.

**Out of scope:** Removing dead code (`StudyWithAIPage`, unused `ReportsPage`), XP logic, per-content session granularity.

---

## 1. Technical Design

### 1.1 Amplify schema changes

Add `lastActiveAt` to `StudySession` to support crash recovery (orphaned session detection on next app load):

```ts
StudySession: a.model({
  // ...existing fields...
  lastActiveAt: a.timestamp(),
})
```

No other schema changes. `UserContentProgress` already has `completionDate` and a `content` relation.

### 1.2 Type definitions

#### `src/model/study-session.ts`

No changes needed — types are inferred from schema and will automatically include `lastActiveAt` after the schema update.

#### `src/model/user-content-progress.ts`

Add a `SelectionSet` type for progress with content details:

```ts
import { type SelectionSet } from "aws-amplify/data";

const progressWithContentSelectionSet = [
  "id",
  "contentId",
  "isCompleted",
  "completionDate",
  "content.durationInSeconds",
  "content.type",
] as const;

export type UserContentProgressWithContent = SelectionSet<
  UserContentProgress,
  typeof progressWithContentSelectionSet
>;
export { progressWithContentSelectionSet };
```

#### `src/hooks/reports/use-reports.ts`

Remove `"quarter"` from `ReportPeriod` and replace `ReportData` with a shape that holds both metric sets:

```ts
export type ReportPeriod = "week" | "month" | "year";

export interface ReportData {
  period: ReportPeriod;
  // Completion-based
  contentHours: number;
  contentActiveDays: number;
  contentEvolution: number;
  contentBreakdown: {
    videos: number;
    articles: number;
    quizzes: number;
    other: number;
  };
  contentChartData: { date: string; minutes: number }[];
  // Session-based (active time on site)
  activeTimeHours: number;
  activeTimeSessions: number;
  activeTimeEvolution: number;
  activeTimeChartData: { date: string; minutes: number }[];
}
```

#### `src/hooks/session-tracker/use-session-tracker.ts` (new)

Internal state type for localStorage:

```ts
interface TrackedSession {
  sessionId: string;
  startedAt: number;        // unix seconds
  lastActiveAt: number;     // unix seconds
  accumulatedMinutes: number;
}
```

### 1.3 API / Data fetching changes

#### `src/api/user-content-progress.ts`

**Fix existing bug:** `completionDate` is currently stored as `Date.now()` (milliseconds), but the schema field is `a.timestamp()` which is Unix seconds. Fix `toggleContentCompletion` to use seconds:

```ts
completionDate: input.isCompleted ? Math.floor(Date.now() / 1000) : undefined,
```

> Note: existing records in the DB have millisecond values. These will appear as dates far in the future (~year 57000) when interpreted as seconds. They will simply fall outside any period filter and be ignored — no migration needed, they'll naturally age out as users re-complete content.

Add the new fetch function:

```ts
/**
 * Lists all user content progress with related content data
 */
export const listAllUserContentProgressWithContent = async (): Promise<UserContentProgressWithContent[]> => {
  const result = await client.models.UserContentProgress.list({
    selectionSet: progressWithContentSelectionSet,
  });
  if (!result.data) {
    console.error("Failed to list user content progress with content:", result.errors);
    return [];
  }
  return result.data;
};
```

#### `src/api/study-session.ts`

No changes needed — `updateStudySession` already accepts any `UpdateStudySessionInput` which will include `lastActiveAt` after the schema update.

#### `src/hooks/reports/use-reports.ts`

Update `reportDataQueryOptions` to fetch both sessions and content progress, then compute both metric sets:

```ts
export const reportDataQueryOptions = (period: ReportPeriod) =>
  queryOptions({
    queryKey: [QUERY_KEYS.REPORTS, period],
    queryFn: async () => {
      const [sessions, contentProgress] = await Promise.all([
        listStudySessions(),
        listAllUserContentProgressWithContent(),
      ]);
      return buildReportData(sessions, contentProgress, period);
    },
    staleTime: 1000 * 60 * 5,
  });
```

`buildReportData` uses Unix seconds throughout (not milliseconds). `now = Math.floor(Date.now() / 1000)`. The `periodSeconds` map replaces `periodDays`:

```ts
const periodSeconds: Record<ReportPeriod, number> = {
  week: 7 * 86400,
  month: 30 * 86400,
  year: 365 * 86400,
};
```

All period boundary comparisons use seconds directly — no division by 1000 needed:

```ts
// Sessions: startedAt is already seconds
const currentSessions = sessions.filter(s => s.startedAt >= currentStart && s.startedAt <= now);

// Content: completionDate is now seconds (after the bug fix)
const currentContent = contentProgress.filter(p =>
  p.isCompleted && p.completionDate != null &&
  p.completionDate >= currentStart && p.completionDate <= now
);

// Chart date from seconds
const dateFromSeconds = (s: number) => new Date(s * 1000).toISOString().split("T")[0];
```

### 1.4 Page changes

#### `/reports` — `src/components/analytics/reports-page-integrated.tsx`

Replace the current single-metric layout with two sections:

**Content Hours section** (completion-based):
- Stats row: total content hours, active days, avg/day, evolution %
- Distribution bar chart: Videos / Articles / Quizzes / Other
- Activity chart: shown for all periods. For `week`: one bar per day. For `month`: one bar per day. For `year`: one bar per week (group `contentChartData` into 52 weekly buckets).

**Active Time section** (session-based):
- Stats row: total active hours, number of sessions, avg session length, evolution %
- Activity chart: same grouping rules as content hours chart above.

Both sections are inside the same period tabs (week / month / year). Remove the `quarter` tab.

#### `/study` — `src/routes/study.tsx`

Remove this route and delete `src/components/study/study-page.tsx`.

Files with links to `/study` that need updating:
- `src/components/layout/app-sidebar.tsx` — remove "Study" nav item entirely
- `src/components/dashboard/daily-plan-card.tsx` — update link to `/module`
- `src/components/dashboard/active-track-status-card.tsx` — update link to `/module`
- `src/components/dashboard/next-action-card.tsx` — update link to `/module`
- `src/components/tracks/track-detail-page.tsx` — update link to `/module`
- `src/components/programs/programs-page.tsx` — update link to `/module`
- `src/components/goal/my-goal-page.tsx` — update link to `/module`

#### `src/components/dashboard/next-action-card.tsx`

The `getRecommendation` function currently uses recent sessions as a signal to suggest studying. Since sessions are now created automatically on every app load, `recentSessions.length === 0` will almost never be true and is no longer a meaningful signal. Remove the session-based check. The remaining logic (incomplete tasks → active goal → explore content) stays:

```ts
/**
 * Gets recommendation for next action based on user's current state
 */
const getRecommendation = (
  goals: Goal[] | undefined,
  tasks: DailyTask[] | undefined,
  t: TFunction
) => {
  const incompleteTasks = tasks?.filter((task) => !task.isCompleted) ?? [];
  if (incompleteTasks.length > 0) {
    return { /* complete tasks */ link: "/module" };
  }

  const activeGoal = goals?.find((goal) => goal.isActive);
  if (activeGoal && (activeGoal.progressPercentage ?? 0) < 100) {
    return { /* continue goal */ link: "/module" };
  }

  return { /* explore content */ link: "/module" };
};
```

Remove `useListStudySessions` import and usage from this component.

### 1.5 Component changes

#### `src/components/layout/app-layout.tsx`

Mount `useSessionTracker` here so it runs for all authenticated pages:

```tsx
import { useSessionTracker } from "@/hooks/session-tracker/use-session-tracker";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useSessionTracker();
  // ...existing JSX unchanged
}
```

#### `src/hooks/session-tracker/use-session-tracker.ts` (new)

Global hook that manages the session lifecycle. Only the minimal fields needed for time tracking are written to the session — `startedAt`, `lastActiveAt`, `durationMinutes`, `endedAt`. No `type`, `moduleId`, `score`, etc.

```ts
const STORAGE_KEY = "stud-ai:active-session";
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const ORPHAN_THRESHOLD_SECONDS = 10 * 60;    // 10 minutes

/**
 * Global session tracker hook that manages active time tracking
 */
export function useSessionTracker() {
  const { mutateAsync: createSession } = useCreateStudySession();
  const { mutate: updateSession } = useUpdateStudySession();
  const sessionRef = useRef<TrackedSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeartbeatRef = useRef<number>(0);

  useEffect(() => {
    // Uses navigator.locks to ensure only one tab tracks at a time
    // Full implementation described below
  }, []);
}
```

**Single-tab enforcement via `navigator.locks`:**

Only one tab should track at a time. Use the Web Locks API to ensure this. If `navigator.locks` is unavailable, call `startTracking()` directly:

```ts
if (!navigator.locks) {
  await startTracking();
  return;
}
navigator.locks.request(
  "stud-ai:session-lock",
  { ifAvailable: true },
  async (lock) => {
    if (!lock) return; // Another tab holds the lock — do nothing
    await startTracking();
    return new Promise<void>((resolve) => {
      cleanupRef.current = resolve;
    });
  }
);
```

**Orphan recovery on mount (inside `startTracking`):**

```ts
const now = Math.floor(Date.now() / 1000);
let stored: TrackedSession | null = null;
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) stored = JSON.parse(raw);
} catch {
  localStorage.removeItem(STORAGE_KEY);
}

if (stored) {
  const age = now - stored.lastActiveAt;
  if (age < ORPHAN_THRESHOLD_SECONDS) {
    // Resume: reuse existing session
    sessionRef.current = stored;
    lastHeartbeatRef.current = now; // start from now, not from stored.lastActiveAt
  } else {
    // Close orphan
    updateSession({ id: stored.sessionId, endedAt: stored.lastActiveAt, durationMinutes: stored.accumulatedMinutes });
    localStorage.removeItem(STORAGE_KEY);
    stored = null;
  }
}

if (!sessionRef.current) {
  // Create new session — only startedAt and lastActiveAt needed
  const session = await createSession({ startedAt: now, lastActiveAt: now });
  sessionRef.current = { sessionId: session.id, startedAt: now, lastActiveAt: now, accumulatedMinutes: 0 };
  lastHeartbeatRef.current = now;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionRef.current));
}
```

**Heartbeat (every 5 min, only when visible):**

Increments `accumulatedMinutes` by elapsed time since last heartbeat — gap time is never counted:

```ts
const sync = () => {
  if (!sessionRef.current) return;
  const now = Math.floor(Date.now() / 1000);
  const elapsed = Math.floor((now - lastHeartbeatRef.current) / 60);
  sessionRef.current.accumulatedMinutes += elapsed;
  sessionRef.current.lastActiveAt = now;
  lastHeartbeatRef.current = now;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionRef.current));
  updateSession({ id: sessionRef.current.sessionId, lastActiveAt: now, durationMinutes: sessionRef.current.accumulatedMinutes });
};
```

**Visibility handling:**

```ts
const handleVisibilityChange = () => {
  if (document.hidden) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    sync();
  } else {
    lastHeartbeatRef.current = Math.floor(Date.now() / 1000); // reset so gap isn't counted
    intervalRef.current = setInterval(sync, HEARTBEAT_INTERVAL_MS);
  }
};
document.addEventListener("visibilitychange", handleVisibilityChange);
```

**Unmount / cleanup:**

```ts
return () => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  if (intervalRef.current) clearInterval(intervalRef.current);
  sync(); // final sync
  cleanupRef.current?.(); // release the lock
};
```

### 1.6 Translation keys

New keys needed (add to both `en/common.ts` and `pt-BR/common.ts` in alphabetical order, using hyphen format):

| Key | Usage |
|---|---|
| `pages-reports-active-time-avg-session` | Label for average session length stat |
| `pages-reports-active-time-sessions` | Label for number of sessions stat |
| `pages-reports-active-time-title` | Section header for session-based metrics |
| `pages-reports-content-hours-title` | Section header for completion-based metrics |
| `pages-reports-content-type-articles` | Distribution bar label |
| `pages-reports-content-type-other` | Distribution bar label |
| `pages-reports-content-type-quizzes` | Distribution bar label |
| `pages-reports-content-type-videos` | Distribution bar label |

Existing keys `pages-reports-active-days`, `pages-reports-average-day`, `pages-reports-total-time`, `pages-reports-distribution` are reused for the content hours section. All new and existing keys in `reports-page-integrated.tsx` must use the hyphen format — remove any dot-notation fallback strings.

## 1.7 Sidebar

No new sidebar item. The "Study" item in the sidebar is removed as part of removing the `/study` route.

---

## 2. Acceptance Criteria

### AC1: Content hours are derived from completions

**Given** a user has completed content items in the selected period  
**When** they view the Reports page  
**Then** the "Content Hours" section shows total hours equal to the sum of `durationInSeconds / 60` for all completed content in that period

### AC2: Active time tracks only visible tab time

**Given** a user has the app open  
**When** they switch to another tab  
**Then** the session heartbeat pauses and no additional time is accumulated until they return

### AC3: Crash recovery closes orphaned sessions

**Given** a user had an active session and closed the browser without a clean unmount  
**When** they open the app again within 10 minutes  
**Then** the previous session is resumed and time continues accumulating from where it left off (gap time excluded)  
**When** they open the app again after more than 10 minutes  
**Then** the orphaned session is closed with `endedAt = lastActiveAt` and a new session starts

### AC4: Only one tab tracks at a time

**Given** a user has the app open in two tabs  
**When** both tabs are visible  
**Then** only the first tab (the one that acquired the lock) tracks time; the second tab does nothing  
**When** the first tab is closed  
**Then** the second tab acquires the lock and starts a new session

### AC5: Both metrics show evolution vs previous period

**Given** a user views the Reports page  
**When** they select any period tab  
**Then** both the content hours and active time sections show an evolution percentage comparing the current period to the equivalent previous period

### AC6: Reports page shows both sections with real data

**Given** a user is on the Reports page  
**When** any period tab is selected  
**Then** both "Content Hours" and "Active Time" sections are visible with real data (not hardcoded zeros)

### Edge cases

- E1: If `contentActiveDays` is 0, the avg/day stat shows `0` instead of dividing by zero
- E2: If `activeTimeSessions` is 0, the avg session length stat shows `0` instead of dividing by zero
- E3: If a content item has no `durationInSeconds` (null/undefined), treat it as 0 minutes
- E4: If there are no sessions or completions in the previous period, `evolution` shows `0%` (not infinity)
- E5: If the user has no completed content in the period, the content hours section shows zeros
- E6: If `localStorage` contains malformed JSON for the session key, catch the parse error and treat it as no stored session
- E7: If `navigator.locks` is not available, skip lock enforcement and call `startTracking()` directly

---

## 3. Implementation Tasks

### [x] 3.1 Schema: add `lastActiveAt` to `StudySession`

#### `amplify/data/resource.ts`

```ts
StudySession: a.model({
  // ...existing fields...
  lastActiveAt: a.timestamp(),
})
```

Deploy the schema change before proceeding with frontend tasks.

---

### [x] 3.2 Model type: add `UserContentProgressWithContent` selection set

#### `src/model/user-content-progress.ts`

```ts
import { type SelectionSet } from "aws-amplify/data";

const progressWithContentSelectionSet = [
  "id",
  "contentId",
  "isCompleted",
  "completionDate",
  "content.durationInSeconds",
  "content.type",
] as const;

export type UserContentProgressWithContent = SelectionSet<
  UserContentProgress,
  typeof progressWithContentSelectionSet
>;
export { progressWithContentSelectionSet };
```

---

### [x] 3.3 API: fix `completionDate` unit and add `listAllUserContentProgressWithContent`

#### `src/api/user-content-progress.ts`

Fix `toggleContentCompletion` to store seconds:

```ts
completionDate: input.isCompleted ? Math.floor(Date.now() / 1000) : undefined,
```

Add new fetch function:

```ts
export const listAllUserContentProgressWithContent = async (): Promise<UserContentProgressWithContent[]> => {
  const result = await client.models.UserContentProgress.list({
    selectionSet: progressWithContentSelectionSet,
  });
  if (!result.data) {
    console.error("Failed to list user content progress with content:", result.errors);
    return [];
  }
  return result.data;
};
```

---

### [x] 3.4 Session tracker hook

#### `src/hooks/session-tracker/use-session-tracker.ts` (new file)

Full implementation as described in section 1.5, including:
- `navigator.locks` for single-tab enforcement (with fallback)
- Orphan recovery with `lastHeartbeatRef` initialized to `now` on resume
- Incremental `accumulatedMinutes` heartbeat
- `visibilitychange` listener that resets `lastHeartbeatRef` on tab focus to exclude gap time
- `mutateAsync` for session creation to capture the returned `id`
- Cleanup on unmount

#### `src/components/layout/app-layout.tsx`

```tsx
import { useSessionTracker } from "@/hooks/session-tracker/use-session-tracker";

export function AppLayout({ children }: AppLayoutProps) {
  useSessionTracker();
  // ...rest unchanged
}
```

---

### [x] 3.5 Reports data hook: refactor to use both sources with seconds

#### `src/hooks/reports/use-reports.ts`

- Remove `"quarter"` from `ReportPeriod`
- Replace `ReportData` interface with the new two-section shape
- Replace `periodDays` with `periodSeconds` (values in seconds, not days)
- Refactor `buildReportData` to use `now = Math.floor(Date.now() / 1000)` throughout — no more `/ 1000` divisions in comparisons
- Accept both `sessions` and `contentProgress` as parameters
- Compute content metrics from `contentProgress` and active time metrics from `sessions`

---

### [x] 3.6 Reports UI: show both sections

#### `src/components/analytics/reports-page-integrated.tsx`

- Remove `quarter` tab
- Replace dot-notation translation keys with hyphen format (remove fallback strings)
- Replace the current single stats block with two sections as described in section 1.4
- For `year` period, group `chartData` into 52 weekly buckets before rendering the chart

---

### [x] 3.7 Remove `/study` route, update links, and address side effects

#### Delete:
- `src/routes/study.tsx`
- `src/components/study/study-page.tsx`

#### Update links to `/module`:
- `src/components/layout/app-sidebar.tsx` — remove "Study" nav item
- `src/components/dashboard/daily-plan-card.tsx`
- `src/components/dashboard/active-track-status-card.tsx`
- `src/components/dashboard/next-action-card.tsx`
- `src/components/tracks/track-detail-page.tsx`
- `src/components/programs/programs-page.tsx`
- `src/components/goal/my-goal-page.tsx`

#### `src/components/dashboard/next-action-card.tsx`

Remove `useListStudySessions` and the session-based recommendation branch. Update `getRecommendation` signature to remove the `sessions` parameter.

#### `src/components/sessions/sessions-page-integrated.tsx`

Sessions are now created on every app visit, so the list will contain many more entries. Filter out sessions with no `endedAt` (in-progress) and sessions with `durationMinutes === 0` or `durationMinutes == null` (visits too short to record meaningful time) before rendering the list.

```ts
const completedSessions = sessions.filter(
  (s) => s.endedAt != null && (s.durationMinutes ?? 0) > 0
);
```

#### `src/hooks/activity/use-activity-feed.ts`

Same issue — the activity feed will be flooded with auto-created session entries. Apply the same filter: only include sessions with `endedAt != null` and `durationMinutes > 0`.

---

### [x] 3.8 Translation keys

#### `src/i18n/locales/en/common.ts` and `src/i18n/locales/pt-BR/common.ts`

Add the 8 new keys from section 1.6 in alphabetical order.

---

## 4. Open Questions and missing details

- Q1: The `completionDate` fix (seconds instead of milliseconds) means existing DB records have corrupted timestamps. Confirm whether this is acceptable to ignore (they'll fall outside period filters) or if a one-time data migration is needed.
