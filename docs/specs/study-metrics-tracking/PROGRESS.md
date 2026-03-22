# Study Metrics Tracking - Progress

## Task 3.1 - Schema: add `lastActiveAt` to `StudySession`

Added `lastActiveAt: a.timestamp()` field to the `StudySession` model in `amplify/data/resource.ts`. Build passes.

## Task 3.2 - Model type: add `UserContentProgressWithContent` selection set

Added `progressWithContentSelectionSet` and `UserContentProgressWithContent` type to `src/model/user-content-progress.ts`. Also added the `SelectionSet` import from `aws-amplify/data`. Build passes.

## Task 3.3 - API: fix `completionDate` unit and add `listAllUserContentProgressWithContent`

In `src/api/user-content-progress.ts`:
- Fixed `toggleContentCompletion` to store `completionDate` as Unix seconds (`Math.floor(Date.now() / 1000)`) instead of milliseconds in both the update and create paths.
- Added `listAllUserContentProgressWithContent` function that fetches all user content progress records with related content data using the `progressWithContentSelectionSet` selection set.
- Added imports for `UserContentProgressWithContent` and `progressWithContentSelectionSet` from the model file.

Build passes.

## Task 3.4 - Session tracker hook

Created `src/hooks/session-tracker/use-session-tracker.ts` with:
- `navigator.locks` for single-tab enforcement (with fallback when unavailable)
- Orphan recovery: resumes session if last active < 10 min ago, otherwise closes it and starts fresh
- Incremental `accumulatedMinutes` heartbeat every 5 minutes (only when tab is visible)
- `visibilitychange` listener that resets `lastHeartbeatRef` on tab focus to exclude gap time
- `mutateAsync` for session creation to capture the returned `id`
- Cleanup on unmount (final sync + lock release)

Updated `src/components/layout/app-layout.tsx` to call `useSessionTracker()` so it runs for all authenticated pages.

Build passes.

## Task 3.5 - Reports data hook: refactor to use both sources with seconds

Rewrote `src/hooks/reports/use-reports.ts`:
- Removed `"quarter"` from `ReportPeriod` (now `"week" | "month" | "year"`)
- Replaced `ReportData` with the two-section shape: `contentHours`, `contentActiveDays`, `contentEvolution`, `contentBreakdown`, `contentChartData`, `activeTimeHours`, `activeTimeSessions`, `activeTimeEvolution`, `activeTimeChartData`
- Replaced `periodDays` with `periodSeconds` (values in seconds)
- `buildReportData` now uses `Math.floor(Date.now() / 1000)` throughout — no ms divisions
- `reportDataQueryOptions` fetches both `listStudySessions()` and `listAllUserContentProgressWithContent()` in parallel
- Content breakdown maps `youtube_video` → videos, `article` → articles, `quiz` → quizzes, everything else → other
- Edge cases handled: division by zero returns 0, null `durationInSeconds` treated as 0

## Task 3.6 - Reports UI: show both sections

Rewrote `src/components/analytics/reports-page-integrated.tsx`:
- Removed `quarter` tab; tabs are now week / month / year
- Replaced dot-notation translation keys with hyphen format (no fallback strings)
- Added `ActivityChart` sub-component that handles week/month/year grouping (year groups into 52 weekly buckets)
- Content Hours section: stats row (total, active days, avg/day, evolution) + distribution bar chart (videos/articles/quizzes/other) + activity chart
- Active Time section: stats row (total, sessions, avg session, evolution) + activity chart
- Added 13 new translation keys to both `en/common.ts` and `pt-BR/common.ts` in alphabetical order: `pages-reports-active-time-avg-session`, `pages-reports-active-time-sessions`, `pages-reports-active-time-title`, `pages-reports-activity`, `pages-reports-content-hours-title`, `pages-reports-content-type-articles`, `pages-reports-content-type-other`, `pages-reports-content-type-quizzes`, `pages-reports-content-type-videos`, `pages-reports-evolution`, `pages-reports-month`, `pages-reports-week`, `pages-reports-year`

Build passes.

## Task 3.7 - Remove `/study` route, update links, and address side effects

- Deleted `src/routes/study.tsx` and `src/components/study/study-page.tsx`
- Removed "Study" nav item from `src/components/layout/app-sidebar.tsx` (also removed unused `IconBook` import)
- Removed `/study` entry from `src/components/layout/navigation-config.ts` (also removed unused `BookOpen` import)
- Updated all `/study` links to `/module` in: `daily-plan-card.tsx`, `active-track-status-card.tsx`, `next-action-card.tsx`, `track-detail-page.tsx`, `programs-page.tsx`, `my-goal-page.tsx`
- Rewrote `next-action-card.tsx`: removed `useListStudySessions` import/usage, updated `getRecommendation` to take only `goals` and `tasks` (no sessions), removed session-based recommendation branch, all links now point to `/module`
- Updated `sessions-page-integrated.tsx`: added `completedSessions` filter (`endedAt != null && durationMinutes > 0`), all stats and list rendering use `completedSessions`
- Updated `use-activity-feed.ts`: sessions mapped to activities are filtered to `endedAt != null && durationMinutes > 0`

## Task 3.8 - Translation keys

Translation keys were added as part of task 3.6. All 13 new keys added to both `en/common.ts` and `pt-BR/common.ts` in alphabetical order. Build passes.
