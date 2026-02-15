# Technical Spec: Learning Preferences Onboarding

## 0. Summary

**Goal:** Create a guided, step-by-step "Learning Preferences" page where users define their learning profile (interests, daily time, available days, preferred formats, content length) so the AI can recommend tailored learning paths. The experience uses a wizard-like flow with animated transitions, one question per step, and quick-pick UI controls instead of text inputs.

**Out of scope:** AI recommendation engine, backend processing of preferences, integration with learning path generation, editing preferences from a settings page.

## 1. Technical Design

### 1.1 Amplify schema changes

Add a new `LearningPreference` model with owner-based authorization:

```ts
// amplify/data/resource.ts
LearningPreference: a
  .model({
    interests: a.string().array().required(),
    minutesPerDay: a.integer(),
    days: a.string().array(),
    formats: a.string().array(),
    contentLength: a.enum([
      "bite_sized",
      "short",
      "medium",
      "deep_dive",
    ]),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 1.2 Type definitions

Create `src/model/learning-preference.ts`:

```ts
import { type Schema } from "../../amplify/data/resource";

export type LearningPreference = Schema["LearningPreference"]["type"];
export type LearningPreferenceIdentifier =
  Schema["LearningPreference"]["identifier"];
export type LearningPreferenceCreateInput =
  Schema["LearningPreference"]["createType"];
export type LearningPreferenceUpdateInput =
  Schema["LearningPreference"]["updateType"];
export type LearningPreferenceDeleteInput =
  Schema["LearningPreference"]["deleteType"];
```

### 1.3 API / Data fetching changes

#### `src/api/learning-preference.ts` — CRUD functions

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type LearningPreference,
  type LearningPreferenceCreateInput,
  type LearningPreferenceUpdateInput,
} from "@/model/learning-preference";

const client = generateClient<Schema>();

/** Gets the current user's learning preference (first record) */
export const getMyLearningPreference =
  async (): Promise<LearningPreference | null> => {
    const result = await client.models.LearningPreference.list();
    return result.data?.[0] ?? null;
  };

/** Creates a learning preference */
export const createLearningPreference = async (
  input: LearningPreferenceCreateInput,
): Promise<LearningPreference> => {
  const result = await client.models.LearningPreference.create(input);
  if (!result.data) throw new Error("Failed to create learning preference");
  return result.data;
};

/** Updates a learning preference */
export const updateLearningPreference = async (
  input: LearningPreferenceUpdateInput,
): Promise<LearningPreference> => {
  const result = await client.models.LearningPreference.update(input);
  if (!result.data) throw new Error("Failed to update learning preference");
  return result.data;
};
```

#### `src/hooks/learning-preference/use-my-learning-preference.ts`

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyLearningPreference } from "@/api/learning-preference";

export const getMyLearningPreferenceQueryOptions = () =>
  queryOptions({
    queryKey: ["learning-preference", "mine"],
    queryFn: getMyLearningPreference,
  });

export const useMyLearningPreference = () =>
  useQuery(getMyLearningPreferenceQueryOptions());
```

#### `src/hooks/learning-preference/use-save-learning-preference.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLearningPreference,
  updateLearningPreference,
} from "@/api/learning-preference";

export const useSaveLearningPreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id?: string;
      data: Record<string, unknown>;
    }) => {
      if (params.id) {
        return updateLearningPreference({ id: params.id, ...params.data });
      }
      return createLearningPreference(params.data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["learning-preference"] });
    },
  });
};
```

### 1.4 Page changes

#### New route: `/learning-preferences`

**Route file:** `src/routes/learning-preferences.tsx`

This is a leaf route (no nested children). It renders the `LearningPreferencesPage` component and defines a breadcrumb.

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learning-preferences")({
  component: LearningPreferencesPage,
  loader: () => ({ crumb: "Learning Preferences" }),
});
```

### 1.5 Component changes

All new components live under `src/components/learning-preferences/`.

#### Constants: `src/components/learning-preferences/constants.ts`

Predefined lists used across steps:

```ts
export const INTEREST_OPTIONS = [
  "web-development",
  "mobile-development",
  "data-science",
  "machine-learning",
  "cloud-computing",
  "devops",
  "cybersecurity",
  "databases",
  "ui-ux-design",
  "game-development",
  "blockchain",
  "embedded-systems",
] as const;

export const MINUTES_PRESETS = [10, 20, 30, 45, 60] as const;
export const MINUTES_MIN = 5;
export const MINUTES_MAX = 120;
export const MINUTES_STEP = 5;

// ISO weekday indices: 1=Monday … 7=Sunday
// Labels derived at runtime via Intl.DateTimeFormat using the current locale
export const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export const FORMAT_OPTIONS = [
  { value: "video", icon: "IconVideo" },
  { value: "reading", icon: "IconBook" },
  { value: "hands_on", icon: "IconCode" },
] as const;

export const CONTENT_LENGTH_OPTIONS = [
  { value: "bite_sized", label: "2–5 min" },
  { value: "short", label: "5–15 min" },
  { value: "medium", label: "15–30 min" },
  { value: "deep_dive", label: "30+ min" },
] as const;

export const TOTAL_STEPS = 5;
```

#### Validation schema: `src/components/learning-preferences/schema.ts`

```ts
import { z } from "zod";

export const learningPreferencesSchema = z.object({
  interests: z.array(z.string()).min(1),
  minutesPerDay: z.number().min(5).max(120).optional(),
  days: z.array(z.string()).optional(),
  formats: z.array(z.string()).optional(),
  contentLength: z
    .enum(["bite_sized", "short", "medium", "deep_dive"])
    .optional(),
});

export type LearningPreferencesFormValues = z.infer<
  typeof learningPreferencesSchema
>;
```

#### `LearningPreferencesPage` (`src/components/learning-preferences/learning-preferences-page.tsx`)

Top-level page component. Renders:

- Header with title, subtitle, and badges ("1 required", "4 optional")
- Progress indicator ("Step X of 5") with `Progress` bar
- A centered `Card` containing the current step
- Bottom action bar with Back / hint / Next|Skip|Save buttons
- Confirmation screen after step 5

Manages:

- `currentStep` state (0–5, where 5 is the confirmation screen)
- `react-hook-form` with `zodResolver` for the full form across all steps
- Animated transitions between steps using `framer-motion`'s `AnimatePresence` + `motion.div` (slide + fade)
- Reduced motion: checks `prefers-reduced-motion` and disables animations accordingly

```tsx
export interface LearningPreferencesPageProps {}

export const LearningPreferencesPage = ({}: LearningPreferencesPageProps) => {
  // useForm with zodResolver(learningPreferencesSchema)
  // currentStep state
  // AnimatePresence wrapping step components
  // Action bar: Back (disabled step 0), hint badge, Next/Skip/Save
  // Step 5: confirmation screen with Save + Edit CTAs
};
```

#### `StepInterests` (`src/components/learning-preferences/step-interests.tsx`)

- Renders multi-select chips using `ToggleGroup` (type="multiple") + `ToggleGroupItem`
- Shows helper text: "Pick 1–3 to start. You can change later."
- Displays selected count badge
- Validation error shown when trying to proceed with 0 selected

```tsx
export interface StepInterestsProps {
  control: Control<LearningPreferencesFormValues>;
}
```

#### `StepMinutesPerDay` (`src/components/learning-preferences/step-minutes-per-day.tsx`)

- Quick-pick buttons (10, 20, 30, 45, 60) as `ToggleGroup` (type="single")
- `Slider` for fine-tuning (5–120, step 5)
- Displays "X minutes/day" or "Not set"
- "Clear" button to unset
- Tip text: "Even 10 minutes helps — consistency beats intensity."

```tsx
export interface StepMinutesPerDayProps {
  control: Control<LearningPreferencesFormValues>;
}
```

#### `StepDays` (`src/components/learning-preferences/step-days.tsx`)

- Day pills using `ToggleGroup` (type="multiple")
- Pill labels and `aria-label` values are derived from `Intl.DateTimeFormat` using the current locale from `useLocale()`, not from translation keys. Short labels use `{ weekday: "narrow" }` and aria-labels use `{ weekday: "long" }`.
- Shows selected count
- `DAY_OPTIONS` are numeric indices (1=Monday … 7=Sunday). The form stores them as strings (`"1"` through `"7"`) to match the Amplify `a.string().array()` field. The component parses to numbers for `Intl` formatting.

```tsx
export interface StepDaysProps {
  control: Control<LearningPreferencesFormValues>;
}

// Helper to get a Date for a given ISO weekday (1=Mon, 7=Sun)
const getDateForWeekday = (isoDay: number): Date => {
  // 2024-01-01 is a Monday
  return new Date(2024, 0, isoDay);
};

// Usage inside the component:
const [locale] = useLocale();
const narrowFormatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
const longFormatter = new Intl.DateTimeFormat(locale, { weekday: "long" });
```

#### `StepFormats` (`src/components/learning-preferences/step-formats.tsx`)

- Multi-select cards with icon + label
- Each card is a clickable `Card` with a `Checkbox` indicator
- Clicking toggles on/off

```tsx
export interface StepFormatsProps {
  control: Control<LearningPreferencesFormValues>;
}
```

#### `StepContentLength` (`src/components/learning-preferences/step-content-length.tsx`)

- Single-select radio-style cards using `ToggleGroup` (type="single")
- Clicking a selected option again unsets it
- Each card shows label + duration range

```tsx
export interface StepContentLengthProps {
  control: Control<LearningPreferencesFormValues>;
}
```

#### `StepConfirmation` (`src/components/learning-preferences/step-confirmation.tsx`)

- Message: "Done — we'll tailor your learning path."
- Primary CTA: "Save preferences" button
- Secondary CTA: "Edit" button (goes back to step 1)

```tsx
export interface StepConfirmationProps {
  onSave: () => void;
  onEdit: () => void;
  isSaving: boolean;
}
```

### 1.6 Translation keys

All keys follow the `learning-preferences-*` prefix. Keys needed:

- `learning-preferences` — Page title "Learning Preferences"
- `learning-preferences-subtitle` — "These preferences help AI recommend learning paths tailored to you. The more you add, the better the recommendations."
- `learning-preferences-required` — "required"
- `learning-preferences-optional` — "optional"
- `learning-preferences-step-of` — "Step {{current}} of {{total}}"
- `learning-preferences-next` — "Next"
- `learning-preferences-back` — "Back"
- `learning-preferences-skip` — "Skip"
- `learning-preferences-save` — "Save preferences"
- `learning-preferences-edit` — "Edit"
- `learning-preferences-interests-title` — "What are you interested in learning?"
- `learning-preferences-interests-helper` — "Pick 1–3 to start. You can change later."
- `learning-preferences-interests-selected` — "{{count}} selected"
- `learning-preferences-interests-error` — "Select at least one area of interest."
- `learning-preferences-minutes-title` — "How much time can you dedicate daily?"
- `learning-preferences-minutes-value` — "{{count}} minutes/day"
- `learning-preferences-minutes-not-set` — "Not set"
- `learning-preferences-minutes-clear` — "Clear"
- `learning-preferences-minutes-tip` — "Even 10 minutes helps — consistency beats intensity."
- `learning-preferences-days-title` — "Which days work best for you?"
- `learning-preferences-days-selected` — "{{count}} days selected"
- `learning-preferences-formats-title` — "How do you prefer to learn?"
- `learning-preferences-content-length-title` — "What content length do you prefer?"
- `learning-preferences-confirmation-message` — "Done — we'll tailor your learning path."
- `learning-preferences-optional-hint` — "Optional — skip if you're not sure."
- `learning-preferences-change-later` — "You can change this later."
- `learning-preferences-save-success` — "Preferences saved successfully!"
- `learning-preferences-save-error` — "Something went wrong while saving your preferences."
- `learning-preferences-interest-web-development` — "Web Development"
- `learning-preferences-interest-mobile-development` — "Mobile Development"
- `learning-preferences-interest-data-science` — "Data Science"
- `learning-preferences-interest-machine-learning` — "Machine Learning"
- `learning-preferences-interest-cloud-computing` — "Cloud Computing"
- `learning-preferences-interest-devops` — "DevOps"
- `learning-preferences-interest-cybersecurity` — "Cybersecurity"
- `learning-preferences-interest-databases` — "Databases"
- `learning-preferences-interest-ui-ux-design` — "UI/UX Design"
- `learning-preferences-interest-game-development` — "Game Development"
- `learning-preferences-interest-blockchain` — "Blockchain"
- `learning-preferences-interest-embedded-systems` — "Embedded Systems"
- `learning-preferences-format-video` — "Video"
- `learning-preferences-format-reading` — "Reading"
- `learning-preferences-format-hands-on` — "Hands-on Exercises"
- `learning-preferences-content-length-bite-sized` — "Bite-sized (2–5 min)"
- `learning-preferences-content-length-short` — "Short (5–15 min)"
- `learning-preferences-content-length-medium` — "Medium (15–30 min)"
- `learning-preferences-content-length-deep-dive` — "Deep dive (30+ min)"

### 1.7 Sidebar

Yes. Add a new sidebar item:

- **Label:** `t("learning-preferences")` — "Learning Preferences"
- **Icon:** `IconAdjustments` (from `@tabler/icons-react`)
- **Route:** `/learning-preferences`
- **Placement:** In `navMain`, after "Favourites"

## 2. Acceptance Criteria

### AC1: Step-by-step wizard navigation

**Given** the user navigates to `/learning-preferences`
**When** the page loads
**Then** they see step 1 (Areas of Interest) with a progress bar showing "Step 1 of 5", a "1 required" and "4 optional" badge, and the "Back" button is disabled.

### AC2: Interests step requires at least 1 selection

**Given** the user is on step 1 (Interests)
**When** they click "Next" without selecting any interest
**Then** an error message "Select at least one area of interest." is displayed and they cannot proceed.

### AC3: Interests step allows proceeding with selection

**Given** the user is on step 1 and has selected at least 1 interest chip
**When** they click "Next"
**Then** the view transitions to step 2 with a slide/fade animation.

### AC4: Optional steps can be skipped

**Given** the user is on any optional step (2–5)
**When** they click "Skip"
**Then** the step value is not set and the wizard advances to the next step.

### AC5: Back navigation preserves state

**Given** the user has filled in steps 1–3 and is on step 4
**When** they click "Back" twice to return to step 2
**Then** the values they previously entered on steps 2 and 3 are still present.

### AC6: Minutes per day step interaction

**Given** the user is on step 2 (Minutes per day)
**When** they click a preset button (e.g., 30) or drag the slider
**Then** the display updates to show "30 minutes/day" and the slider position matches.

### AC7: Minutes per day clear

**Given** the user has selected a minutes value
**When** they click "Clear"
**Then** the value resets to "Not set".

### AC8: Days step multi-select

**Given** the user is on step 3 (Days)
**When** they toggle day pills
**Then** selected days are visually highlighted and the count badge updates.

### AC9: Formats step multi-select cards

**Given** the user is on step 4 (Formats)
**When** they click a format card
**Then** the card toggles on/off with a checkbox indicator.

### AC10: Content length single-select with deselect

**Given** the user is on step 5 (Content length)
**When** they click an already-selected option
**Then** the selection is cleared.

### AC11: Confirmation screen and save

**Given** the user completes all 5 steps and reaches the confirmation screen
**When** they click "Save preferences"
**Then** the preferences are persisted via the API and a success toast is shown.

### AC12: Confirmation edit goes back

**Given** the user is on the confirmation screen
**When** they click "Edit"
**Then** they return to step 1 with all previously entered values intact.

### AC13: Animated transitions

**Given** the user navigates between steps
**When** a step transition occurs
**Then** the outgoing step fades/slides out and the incoming step fades/slides in.

### AC14: Reduced motion preference

**Given** the user has `prefers-reduced-motion: reduce` enabled in their OS
**When** step transitions occur
**Then** animations are disabled or instant.

### Edge cases

- E1: User refreshes the page mid-wizard — form state resets, starts from step 1. If they have a saved preference, it could be pre-loaded (stretch goal, not required for v1).
- E2: User has an existing `LearningPreference` record — on save, the mutation updates the existing record instead of creating a new one.
- E3: Network error on save — a user-friendly error toast is shown, the form remains on the confirmation screen so they can retry.
- E4: All optional fields skipped — only `interests` is saved; other fields are `undefined`/`null`.

## 3. Implementation Tasks

### 3.1 Install dependencies

Install `framer-motion` for step animations and missing shadcn components (`toggle-group`, `slider`, `sonner`):

```bash
npm install framer-motion
npx --yes shadcn@latest add toggle-group slider sonner
```

Add `<Toaster />` from sonner to `src/main.tsx`.

### 3.2 `amplify/data/resource.ts` — Add LearningPreference model

Add the `LearningPreference` model to the schema as described in section 1.1.

### 3.3 `src/model/learning-preference.ts` — Type definitions

Create the model file re-exporting schema-inferred types as described in section 1.2.

### 3.4 `src/api/learning-preference.ts` — API functions

Create CRUD functions (`getMyLearningPreference`, `createLearningPreference`, `updateLearningPreference`) as described in section 1.3.

### 3.5 `src/hooks/learning-preference/use-my-learning-preference.ts` — Query hook

Create the `useQuery` hook with `queryOptions` as described in section 1.3.

### 3.6 `src/hooks/learning-preference/use-save-learning-preference.ts` — Mutation hook

Create the `useMutation` hook that handles create-or-update logic as described in section 1.3.

### 3.7 `src/components/learning-preferences/constants.ts` — Predefined lists

Create the constants file with all option arrays as described in section 1.5.

### 3.8 `src/components/learning-preferences/schema.ts` — Zod validation schema

Create the zod schema and inferred type as described in section 1.5.

### 3.9 `src/components/learning-preferences/step-interests.tsx` — Step 1 component

Implement the interests multi-select chips step using `ToggleGroup` (type="multiple"). Uses `useController` from react-hook-form to bind to the `interests` field.

### 3.10 `src/components/learning-preferences/step-minutes-per-day.tsx` — Step 2 component

Implement the minutes step with preset buttons (`ToggleGroup` type="single"), `Slider`, display label, and clear button. Uses `useController` for the `minutesPerDay` field.

### 3.11 `src/components/learning-preferences/step-days.tsx` — Step 3 component

Implement the day pills step using `ToggleGroup` (type="multiple") with `aria-label` on each pill. Uses `useController` for the `days` field.

### 3.12 `src/components/learning-preferences/step-formats.tsx` — Step 4 component

Implement the format cards step with clickable `Card` components and `Checkbox` indicators. Uses `useController` for the `formats` field.

### 3.13 `src/components/learning-preferences/step-content-length.tsx` — Step 5 component

Implement the content length single-select cards using `ToggleGroup` (type="single") with deselect support. Uses `useController` for the `contentLength` field.

### 3.14 `src/components/learning-preferences/step-confirmation.tsx` — Confirmation screen

Implement the confirmation screen with "Save preferences" and "Edit" buttons.

### 3.15 `src/components/learning-preferences/learning-preferences-page.tsx` — Main page component

Implement the orchestrating page component that manages step state, form state, animated transitions with `AnimatePresence`, progress bar, action bar, and save logic.

### 3.16 `src/routes/learning-preferences.tsx` — Route definition

Create the route file with breadcrumb loader.

### 3.17 `src/components/layout/app-sidebar.tsx` — Add sidebar item

Add "Learning Preferences" to `navMain` with `IconAdjustments` icon.

### 3.18 `src/i18n/locales/en/common.ts` — English translations

Add all translation keys listed in section 1.6.

### 3.19 `src/i18n/locales/pt-BR/common.ts` — Portuguese translations

Add all translation keys listed in section 1.6 with Portuguese translations.

## 4. Execution Order

- [x] 3.1 — Install dependencies (framer-motion, shadcn toggle-group, slider, sonner)
- [x] 3.2 — Amplify schema: add LearningPreference model
- [x] 3.3 — Model types: `src/model/learning-preference.ts`
- [x] 3.4 — API functions: `src/api/learning-preference.ts`
- [x] 3.5 — Query hook: `use-my-learning-preference.ts`
- [x] 3.6 — Mutation hook: `use-save-learning-preference.ts`
- [x] 3.7 — Constants file
- [x] 3.8 — Zod schema file
- [x] 3.18 — English translations
- [x] 3.19 — Portuguese translations
- [x] 3.9 — Step 1: Interests
- [x] 3.10 — Step 2: Minutes per day
- [x] 3.11 — Step 3: Days
- [x] 3.12 — Step 4: Formats
- [x] 3.13 — Step 5: Content length
- [x] 3.14 — Confirmation screen
- [x] 3.15 — Main page component
- [x] 3.16 — Route definition
- [x] 3.17 — Sidebar item

## 5. Open Questions and Missing Details

- Q1: Should the page pre-load existing preferences if the user already has a `LearningPreference` record? Yes, this should work for the first time and for editing
- Q2: Should there be a link/entry point from the home page or onboarding flow, or is the sidebar link sufficient? For now only side bar link.
- Q3: Should the interests list be fetched from the backend or is a hardcoded list acceptable for v1? Hard coded in the code.
- Q4: Is there a maximum number of interests a user can select, or is it unlimited? No max
