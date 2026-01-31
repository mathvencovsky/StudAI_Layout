# Technical Spec: Home Page

## 0. Summary

**Goal:** Create a home page with a time-based personalized greeting, three metric cards (total hours studied from completed content, modules completed, days logged in tracked via new schema), and the existing Continue Learning section.

**Out of scope:** Real-time metric updates, historical trends/charts, gamification features.

## 1. Technical Design

### 1.1 Amplify schema changes

Add a new `UserLoginDay` model to track unique login days per user.

```ts
// amplify/data/resource.ts - Add to schema
UserLoginDay: a
  .model({
    date: a.string().required(), // Format: YYYY-MM-DD
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 1.2 Type definitions

```ts
// src/model/user-stats.ts
export interface UserStats {
  totalHoursStudied: number;
  totalModulesCompleted: number;
  totalDaysLoggedIn: number;
}
```

```ts
// src/model/user-login-day.ts
import { type Schema } from "../../amplify/data/resource";

export type UserLoginDay = Schema["UserLoginDay"]["type"];
export type UserLoginDayCreateInput = Schema["UserLoginDay"]["createType"];
```

### 1.3 API / Data fetching changes

#### `src/api/user-login-day.ts` - Track and count login days

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getCurrentUserId } from "./auth";

const client = generateClient<Schema>();

/**
 * Record today's login if not already recorded
 */
export const recordLoginDay = async (): Promise<void> => {
  await getCurrentUserId();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const existing = await client.models.UserLoginDay.list({
    filter: { date: { eq: today } },
  });

  if (!existing.data || existing.data.length === 0) {
    await client.models.UserLoginDay.create({ date: today });
  }
};

/**
 * Get total count of unique login days
 */
export const getLoginDaysCount = async (): Promise<number> => {
  await getCurrentUserId();

  const result = await client.models.UserLoginDay.list();
  return result.data?.length ?? 0;
};
```

#### `src/api/user-stats.ts` - API functions for user statistics

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getCurrentUserId } from "./auth";
import { type UserStats } from "@/model/user-stats";
import { getLoginDaysCount } from "./user-login-day";

const client = generateClient<Schema>();

/**
 * Get user statistics including hours studied, modules completed, and days logged in
 */
export const getUserStats = async (): Promise<UserStats> => {
  await getCurrentUserId();

  // Get all completed content progress
  const contentProgressResult = await client.models.UserContentProgress.list({
    filter: { isCompleted: { eq: true } },
    selectionSet: ["contentId"],
  });

  const completedContentIds = new Set(
    contentProgressResult.data?.map((p) => p.contentId) ?? []
  );

  // Get content durations for completed content
  let totalSeconds = 0;
  for (const contentId of completedContentIds) {
    const contentResult = await client.models.Content.get({ id: contentId });
    if (contentResult.data?.durationInSeconds) {
      totalSeconds += contentResult.data.durationInSeconds;
    }
  }

  // Get completed modules (those with completionDate set)
  const moduleProgressResult = await client.models.UserModuleProgress.list({
    selectionSet: ["completionDate"],
  });

  const completedModules =
    moduleProgressResult.data?.filter((p) => p.completionDate != null).length ?? 0;

  // Get login days count from UserLoginDay model
  const totalDaysLoggedIn = await getLoginDaysCount();

  return {
    totalHoursStudied: Math.round((totalSeconds / 3600) * 10) / 10,
    totalModulesCompleted: completedModules,
    totalDaysLoggedIn,
  };
};
```

#### `src/hooks/user/use-user-stats.ts` - Query hook

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserStats } from "@/api/user-stats";
import { type UserStats } from "@/model/user-stats";

export const getUserStatsQueryOptions = () =>
  queryOptions<UserStats>({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });

/**
 * Query hook for fetching user statistics
 */
export const useUserStats = () => useQuery(getUserStatsQueryOptions());
```

#### `src/hooks/user/use-record-login-day.ts` - Record login on app load

```ts
import { useMutation } from "@tanstack/react-query";
import { recordLoginDay } from "@/api/user-login-day";

/**
 * Mutation hook to record today's login
 */
export const useRecordLoginDay = () =>
  useMutation({
    mutationFn: recordLoginDay,
  });
```

### 1.4 Page changes

#### `src/routes/dashboard.tsx` - Update to use new home page component

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/home-page";

export const Route = createFileRoute("/dashboard")({
  component: HomePage,
  loader: () => ({ crumb: "dashboard" }),
});
```

### 1.5 Component changes

#### `src/components/home/home-page.tsx` - Main home page component

```tsx
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useRecordLoginDay } from "@/hooks/user/use-record-login-day";
import { useEffect } from "react";
import { UserGreeting } from "@/components/home/user-greeting";
import { StatsCards } from "@/components/home/stats-cards";
import { LastStartedModuleSection } from "@/components/dashboard/last-started-module-section";

export const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { mutate: recordLogin } = useRecordLoginDay();

  useEffect(() => {
    recordLogin();
  }, [recordLogin]);

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <UserGreeting displayName={user?.displayName} />
      <StatsCards />
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("continue-learning")}</h2>
        <LastStartedModuleSection />
      </div>
    </div>
  );
};
```

#### `src/components/home/user-greeting.tsx` - Greeting component

```tsx
import { useTranslation } from "react-i18next";

export interface UserGreetingProps {
  displayName?: string;
}

/**
 * Returns time-based greeting key based on current hour
 */
const getGreetingKey = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "greeting-morning";
  if (hour < 18) return "greeting-afternoon";
  return "greeting-evening";
};

export const UserGreeting = ({ displayName }: UserGreetingProps) => {
  const { t } = useTranslation();

  return (
    <h1 className="text-3xl font-bold">
      {t(getGreetingKey(), { name: displayName ?? t("user") })}
    </h1>
  );
};
```

#### `src/components/home/stats-cards.tsx` - Stats cards container

```tsx
import { useTranslation } from "react-i18next";
import { useUserStats } from "@/hooks/user/use-user-stats";
import { StatCard } from "@/components/home/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookCheck, CalendarDays } from "lucide-react";

export const StatsCards = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useUserStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={Clock}
        label={t("total-hours-studied")}
        value={data?.totalHoursStudied ?? 0}
      />
      <StatCard
        icon={BookCheck}
        label={t("modules-completed")}
        value={data?.totalModulesCompleted ?? 0}
      />
      <StatCard
        icon={CalendarDays}
        label={t("days-logged-in")}
        value={data?.totalDaysLoggedIn ?? 0}
      />
    </div>
  );
};
```

#### `src/components/home/stat-card.tsx` - Individual stat card

```tsx
import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export const StatCard = ({ icon: Icon, label, value }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};
```

### 1.6 Translation keys

| Key | Purpose |
|-----|---------|
| `greeting-morning` | Morning greeting with user name interpolation |
| `greeting-afternoon` | Afternoon greeting with user name interpolation |
| `greeting-evening` | Evening greeting with user name interpolation |
| `user` | Fallback when displayName is not available |
| `total-hours-studied` | Label for hours studied metric |
| `modules-completed` | Label for modules completed metric |
| `days-logged-in` | Label for days logged in metric |

## 2. Acceptance Criteria

### AC1: User greeting displays correctly based on time

**Given** a logged-in user with displayName "John" at 9:00 AM
**When** they navigate to the dashboard
**Then** they see "Good morning, John!" (or localized equivalent)

### AC2: User greeting fallback

**Given** a logged-in user without a displayName
**When** they navigate to the dashboard
**Then** they see "Good morning/afternoon/evening, User!" (or localized equivalent)

### AC3: Login day is recorded

**Given** a logged-in user visiting the dashboard for the first time today
**When** the page loads
**Then** a new UserLoginDay record is created for today's date

### AC4: Stats cards display in a row

**Given** a logged-in user on desktop viewport
**When** they view the dashboard
**Then** they see 3 metric cards displayed horizontally in the same row

### AC5: Stats cards show correct values

**Given** a user who has completed 2 modules with 3 hours of completed content and logged in on 5 different days
**When** they view the dashboard
**Then** they see "3" for hours studied, "2" for modules completed, and "5" for days logged in

### AC6: Continue Learning section displays

**Given** a logged-in user who has started a module
**When** they view the dashboard
**Then** they see the Continue Learning section below the stats cards

### Edge cases

- E1: New user with no activity shows 0 for all metrics
- E2: Stats cards stack vertically on mobile viewports
- E3: Loading state shows skeleton placeholders for stats cards
- E4: Multiple visits on the same day only create one UserLoginDay record
- E5: In-progress (not completed) content hours are not counted

## 3. Implementation Tasks

### 3.1 `amplify/data/resource.ts` - Add UserLoginDay model

```ts
UserLoginDay: a
  .model({
    date: a.string().required(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 3.2 `src/model/user-login-day.ts` - Create type definition

```ts
import { type Schema } from "../../amplify/data/resource";

export type UserLoginDay = Schema["UserLoginDay"]["type"];
export type UserLoginDayCreateInput = Schema["UserLoginDay"]["createType"];
```

### 3.3 `src/model/user-stats.ts` - Create type definition

```ts
export interface UserStats {
  totalHoursStudied: number;
  totalModulesCompleted: number;
  totalDaysLoggedIn: number;
}
```

### 3.4 `src/api/user-login-day.ts` - Create login day API

Create the `recordLoginDay` and `getLoginDaysCount` functions as defined in section 1.3.

### 3.5 `src/api/user-stats.ts` - Create API function

Create the `getUserStats` function as defined in section 1.3.

### 3.6 `src/hooks/user/use-user-stats.ts` - Create query hook

Create the `useUserStats` hook as defined in section 1.3.

### 3.7 `src/hooks/user/use-record-login-day.ts` - Create mutation hook

Create the `useRecordLoginDay` hook as defined in section 1.3.

### 3.8 `src/components/home/stat-card.tsx` - Create stat card component

Create the `StatCard` component as defined in section 1.5.

### 3.9 `src/components/home/user-greeting.tsx` - Create greeting component

Create the `UserGreeting` component with time-based greetings as defined in section 1.5.

### 3.10 `src/components/home/stats-cards.tsx` - Create stats cards container

Create the `StatsCards` component as defined in section 1.5.

### 3.11 `src/components/home/home-page.tsx` - Update home page component

Replace existing content with the new layout as defined in section 1.5.

### 3.12 `src/routes/dashboard.tsx` - Update route component

Update to use the new `HomePage` component.

### 3.13 `src/i18n/locales/en/common.ts` - Add English translations

```ts
"days-logged-in": "Days Logged In",
"greeting-afternoon": "Good afternoon, {{name}}!",
"greeting-evening": "Good evening, {{name}}!",
"greeting-morning": "Good morning, {{name}}!",
"modules-completed": "Modules Completed",
"total-hours-studied": "Hours Studied",
"user": "User",
```

### 3.14 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

```ts
"days-logged-in": "Dias Conectado",
"greeting-afternoon": "Boa tarde, {{name}}!",
"greeting-evening": "Boa noite, {{name}}!",
"greeting-morning": "Bom dia, {{name}}!",
"modules-completed": "Módulos Concluídos",
"total-hours-studied": "Horas Estudadas",
"user": "Usuário",
```

## 4. Execution Order

- [x] 3.1 Add UserLoginDay model to schema
- [x] 3.2 Create UserLoginDay type definition
- [x] 3.3 Create UserStats type definition
- [x] 3.4 Create login day API
- [x] 3.5 Create user stats API
- [x] 3.6 Create useUserStats hook
- [x] 3.7 Create useRecordLoginDay hook
- [x] 3.8 Create stat card component
- [x] 3.9 Create greeting component
- [x] 3.10 Create stats cards container
- [x] 3.11 Update home page component
- [x] 3.12 Update route component
- [x] 3.13 Add English translations
- [x] 3.14 Add Portuguese translations

## 5. Sidebar

No sidebar changes required. The dashboard route already exists.

## 6. Open Questions and missing details

None - all questions resolved.
