# Technical Spec: Streak Refactor

## 0. Summary

**Goal:** Replace the stored `UserProfile.streak` field with a streak computed on-the-fly from `UserLoginDay` records, remove the dead `RankingEntry` model and all associated code, and fix all UI that displays streak data.

**Out of scope:** Per-course streak (`UserCourse.streak`), XP system changes.

---

## 1. Technical Design

### 1.1 Amplify schema changes

#### `UserProfile` — remove `streak`

```ts
UserProfile: a.model({
  displayName: a.string(),
  locale: a.string().default("pt-BR"),
  dailyGoalMinutes: a.integer().default(30),
  notificationsEnabled: a.boolean().default(true),
  dailyReminderEnabled: a.boolean().default(false),
  theme: a.string().default("system"),
  xp: a.integer().default(0),
  level: a.integer().default(1),
  // streak removed
  owner: a.string().authorization(...),
})
```

#### `RankingEntry` — remove entirely

The model is not linked from the sidebar, has no write path from the app, and is dead code. Remove from schema.

### 1.2 Type definitions

#### `src/utils/calculate-streak.ts` — new file

```ts
export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * Calculates current and longest login streak from ISO date strings (YYYY-MM-DD).
 * @param dates Array of ISO date strings in YYYY-MM-DD format
 * @returns Object containing current streak and longest streak counts
 */
export function calculateStreak(dates: string[]): StreakResult { ... }
```

Logic:
- Sort dates ascending, deduplicate
- Longest streak: walk through sorted dates, count consecutive days, track max run
- Current streak: walk backwards from today; if today or yesterday is not present, current = 0; otherwise count consecutive days back

### 1.3 API / Data fetching changes

#### `src/api/user-login-day.ts`

- Fix bug: `split("t")` → `split("T")` in `recordLoginDay`
- Add `listLoginDays`:

```ts
export const listLoginDays = async (): Promise<string[]> => {
  const result = await client.models.UserLoginDay.list();
  return (result.data ?? []).map((d) => d.date);
};
```

#### `src/hooks/user/use-login-days.ts` — new file

```ts
export const loginDaysQueryOptions = () =>
  queryOptions({
    queryKey: ["login-days"],
    queryFn: listLoginDays,
  });

export const useListLoginDays = () => useQuery(loginDaysQueryOptions());
```

### 1.4 Page changes

#### `src/components/layout/app-layout.tsx`

Move `recordLoginDay` call here (remove from `home-page.tsx`) so it fires on every app visit regardless of landing page.

```ts
const { mutate: recordLogin } = useRecordLoginDay();
useEffect(() => { recordLogin(); }, []);
```

#### `src/routes/ranking.tsx` — delete

#### `src/components/ranking/ranking-page.tsx` — delete

#### `src/components/ranking/ranking-page-integrated.tsx` — delete

### 1.5 Component changes

All components below currently read `profile?.streak`. Replace with streak computed from `useListLoginDays` + `calculateStreak`.

#### `src/hooks/metrics/use-metrics.ts`

Replace `useMyProfile` streak read:

```ts
const { data: loginDays = [] } = useListLoginDays();
const streak = useMemo(() => calculateStreak(loginDays), [loginDays]);
// streak.current, streak.longest
```

Remove `profile` dependency for streak entirely.

#### `src/components/dashboard/gamification-card.tsx`

```ts
const { data: loginDays = [] } = useListLoginDays();
const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);
```

#### `src/components/profile/profile-page-integrated.tsx`

Same pattern as `gamification-card.tsx`.

#### `src/hooks/dashboard/use-dashboard-data.ts`

```ts
const { data: loginDays = [] } = useListLoginDays();
// in useMemo:
currentStreak: calculateStreak(loginDays).current,
```

#### `src/components/analytics/reports-page.tsx`

Replace `profile?.streak` with `calculateStreak(loginDays).current`.

#### Files to delete

- `src/model/ranking-entry.ts`
- `src/api/ranking.ts`
- `src/hooks/ranking/use-weekly-ranking.ts`
- `src/components/ranking/ranking-page.tsx`
- `src/components/ranking/ranking-page-integrated.tsx`
- `src/routes/ranking.tsx`

### 1.6 Translation keys

No new keys needed. Existing keys (`gamification-streak-title`, `gamification-streak-subtitle`, `pages-metrics-current-streak`, `pages-metrics-record`) remain unchanged.

## 1.7 Sidebar

No sidebar changes needed. The ranking route is not in the sidebar.

---

## 2. Acceptance Criteria

### AC1: Streak computed from login days

**Given** a user has logged in on days `[2026-02-26, 2026-02-27, 2026-02-28, 2026-03-01]`  
**When** they view the metrics or dashboard  
**Then** current streak shows `4` and longest streak shows `4`

### AC2: Streak resets when a day is missed

**Given** a user has login days `[2026-02-25, 2026-02-26]` and today is `2026-03-01`  
**When** they view the metrics page  
**Then** current streak shows `0` and longest streak shows `2`

### AC3: Login recorded on every app visit

**Given** a user navigates directly to `/module` (not home)  
**When** the app loads  
**Then** today's date is recorded in `UserLoginDay` (if not already present)

### AC4: Ranking route removed

**Given** a user navigates to `/ranking`  
**When** the page loads  
**Then** a 404 / not-found page is shown

### Edge cases

- E1: Empty `loginDays` array → `current: 0`, `longest: 0`
- E2: Single login day that is today → `current: 1`, `longest: 1`
- E3: Single login day that is not today or yesterday → `current: 0`, `longest: 1`
- E4: Duplicate dates in `UserLoginDay` records → deduplicate before calculating
- E5: `recordLoginDay` called multiple times in the same day → idempotent, only one record created

---

## 3. Implementation Tasks

### [x] 3.1 Schema: remove `streak` from `UserProfile` and remove `RankingEntry`

#### `amplify/data/resource.ts`

Remove `streak: a.integer().default(0)` from `UserProfile`. Remove the entire `RankingEntry` model block.

### [x] 3.2 Delete ranking dead code

Delete the following files:
- `src/model/ranking-entry.ts`
- `src/api/ranking.ts`
- `src/hooks/ranking/use-weekly-ranking.ts`
- `src/components/ranking/ranking-page.tsx`
- `src/components/ranking/ranking-page-integrated.tsx`
- `src/routes/ranking.tsx`

### [x] 3.3 Add `calculateStreak` utility

#### `src/utils/calculate-streak.ts`

```ts
export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * Calculates current and longest login streak from ISO date strings (YYYY-MM-DD).
 * @param dates Array of ISO date strings in YYYY-MM-DD format
 * @returns Object containing current streak and longest streak counts
 */
export function calculateStreak(dates: string[]): StreakResult {
  const unique = [...new Set(dates)].sort();
  if (unique.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const last = unique[unique.length - 1];

  if (last !== today && last !== yesterday) return { current: 0, longest };

  let current = 1;
  for (let i = unique.length - 2; i >= 0; i--) {
    const curr = new Date(unique[i + 1]);
    const prev = new Date(unique[i]);
    if ((curr.getTime() - prev.getTime()) / 86400000 === 1) {
      current++;
    } else {
      break;
    }
  }

  return { current, longest };
}
```

### [x] 3.4 Add `listLoginDays` API and `useListLoginDays` hook

#### `src/api/user-login-day.ts`

Fix the `split("t")` bug and add `listLoginDays`:

```ts
/**
 * Records a login day for the current user if not already recorded for today.
 */
export const recordLoginDay = async (): Promise<void> => {
  const today = new Date().toISOString().split("T")[0]; // fix: was "t"
  const existing = await client.models.UserLoginDay.list({ filter: { date: { eq: today } } });
  if (!existing.data || existing.data.length === 0) {
    await client.models.UserLoginDay.create({ date: today });
  }
};

/**
 * Lists all login day dates for the current user.
 * @returns Array of ISO date strings (YYYY-MM-DD)
 */
export const listLoginDays = async (): Promise<string[]> => {
  const result = await client.models.UserLoginDay.list();
  return (result.data ?? []).map((d) => d.date);
};
```

#### `src/hooks/user/use-login-days.ts` — new file

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { listLoginDays } from "@/api/user-login-day";

export const loginDaysQueryOptions = () =>
  queryOptions({
    queryKey: ["login-days"],
    queryFn: listLoginDays,
  });

/**
 * Returns all login day date strings for the current user.
 * @returns Query result containing array of ISO date strings (YYYY-MM-DD)
 */
export const useListLoginDays = () => useQuery(loginDaysQueryOptions());
```

### [x] 3.5 Move `recordLoginDay` to `AppLayout`

#### `src/components/layout/app-layout.tsx`

Add `useRecordLoginDay` call. Remove it from `src/components/home/home-page.tsx`.

```ts
const { mutate: recordLogin } = useRecordLoginDay();
useEffect(() => { recordLogin(); }, []);
```

### [x] 3.6 Fix all streak consumers

#### `src/hooks/metrics/use-metrics.ts`

Replace `profile?.streak` with:

```ts
const { data: loginDays = [] } = useListLoginDays();
const streak = useMemo(() => calculateStreak(loginDays), [loginDays]);
// use streak.current and streak.longest
```

Remove `profile` from the hook if it's only used for streak (keep it if still needed for `xp`, `level`, `dailyGoalMinutes`).

#### `src/components/dashboard/gamification-card.tsx`

```ts
const { data: loginDays = [] } = useListLoginDays();
const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);
```

#### `src/components/profile/profile-page-integrated.tsx`

Same pattern as `gamification-card.tsx`.

#### `src/hooks/dashboard/use-dashboard-data.ts`

```ts
const { data: loginDays = [], isLoading: isLoadingLoginDays } = useListLoginDays();
// in useMemo:
currentStreak: calculateStreak(loginDays).current,
```

#### `src/components/analytics/reports-page.tsx`

```ts
const { data: loginDays = [] } = useListLoginDays();
// replace profile?.streak with:
calculateStreak(loginDays).current
```

---

## 4. Open Questions and missing details

None.
