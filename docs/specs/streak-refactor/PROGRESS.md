# Streak Refactor Progress

## Task 3.1 — Schema: remove `streak` from `UserProfile` and remove `RankingEntry`

- Removed `streak: a.integer().default(0)` from `UserProfile` in `amplify/data/resource.ts`
- Removed the entire `RankingEntry` model block from `amplify/data/resource.ts`
- Temporarily stubbed `profile?.streak` references with `0` in streak consumer files to keep the build passing (will be properly fixed in task 3.6)
- Removed unused `profile` data destructuring from `reports-page.tsx`

## Task 3.2 — Delete ranking dead code

- Deleted `src/model/ranking-entry.ts`
- Deleted `src/api/ranking.ts`
- Deleted `src/hooks/ranking/use-weekly-ranking.ts`
- Deleted `src/components/ranking/ranking-page.tsx`
- Deleted `src/components/ranking/ranking-page-integrated.tsx`
- Deleted `src/routes/ranking.tsx`

Build passes after both tasks.

## Task 3.3 — Add `calculateStreak` utility

- Created `src/utils/calculate-streak.ts` with `StreakResult` interface and `calculateStreak` function
- Logic: deduplicates and sorts dates, computes longest streak by walking forward, computes current streak by walking backward from today/yesterday
- Build passes.

## Task 3.4 — Add `listLoginDays` API and `useListLoginDays` hook

- Fixed `split("t")` bug → `split("T")` in `recordLoginDay` in `src/api/user-login-day.ts`
- Added `listLoginDays` function to `src/api/user-login-day.ts`
- Created `src/hooks/user/use-login-days.ts` with `loginDaysQueryOptions` and `useListLoginDays`
- Build passes.

## Task 3.5 — Move `recordLoginDay` to `AppLayout`

- Added `useRecordLoginDay` call with `useEffect` to `src/components/layout/app-layout.tsx` so login is recorded on every app visit
- Removed `useRecordLoginDay` import, hook call, and `useEffect` from `src/components/home/home-page.tsx`
- Build passes.

## Task 3.6 — Fix all streak consumers

- `src/hooks/metrics/use-metrics.ts`: added `useListLoginDays` + `calculateStreak`; replaced `const streak = 0` with `calculateStreak(loginDays)`; updated `streak.current`/`streak.longest` in return value and achievement unlocks; added `loginDays` to `useMemo` deps and `loginDaysLoading` to `isLoading`
- `src/components/dashboard/gamification-card.tsx`: added `useMemo`, `useListLoginDays`, `calculateStreak` imports; replaced `const streak = 0` with `const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays])`
- `src/components/profile/profile-page-integrated.tsx`: added `useMemo`, `useListLoginDays`, `calculateStreak` imports; replaced `const streak = 0` with `const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays])`
- `src/hooks/dashboard/use-dashboard-data.ts`: added `useListLoginDays` + `calculateStreak`; replaced `currentStreak: 0` with `calculateStreak(loginDays).current`; added `loginDays` to deps and `isLoadingLoginDays` to `isLoading`
- `src/components/analytics/reports-page.tsx`: added `useListLoginDays` + `calculateStreak`; replaced hardcoded `{0}` with `{calculateStreak(loginDays).current}`

Build passes.
