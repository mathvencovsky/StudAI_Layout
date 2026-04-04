# Technical Spec: Merge Discovery Flow into Learning Preferences

## 0. Summary

**Goal:** Merge the discovery flow's richer preference collection UI (objectives, context, learning style, pace/depth/structure/challenge sliders, constraints) into the existing learning preferences system at `/learning-preferences`, backed by real Amplify schema fields and proper i18n. Remove the discovery prototype code that won't be used (recommendations, fake AI).

**Out of scope:** AI-powered trail recommendations, the RecommendationsStep UI, changes to the home page recommendation logic beyond updating the inline form.

## 1. Technical Design

### 1.1 Amplify schema changes

Expand the `Category` enum with new non-tech categories:

```ts
Category: a.enum([
  // Existing
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
  // New
  "vestibular_enem",
  "concursos_publicos",
  "certifications",
  "languages",
  "math_logic",
  "productivity_tools",
  "career_market",
  "business_entrepreneurship",
  "marketing_sales",
  "design_creative",
  "law",
]),
```

Add new enums:

```ts
LearningContext: a.enum([
  "beginner",
  "career_change",
  "upskilling",
  "job_prep",
  "academic",
  "personal_project",
]),

Objective: a.enum([
  "employment",
  "career_change",
  "skill_improvement",
  "personal_project",
  "academic_growth",
]),

Budget: a.enum(["free", "paid"]),

LearningStyle: a.enum([
  "visual",
  "hands_on",
  "theoretical",
  "interactive",
  "self_paced",
  "structured",
]),

ExperienceLevel: a.enum([
  "beginner",
  "intermediate",
  "advanced",
]),
```

Add new fields to `LearningPreference`:

```ts
LearningPreference: a
  .model({
    // Existing fields (keep as-is)
    interests: a.ref("Category").required().array().required(),
    minutesPerDay: a.integer(),
    days: a.string().required().array().required(),
    formats: a.string().required().array().required(),
    contentLength: a.enum(["bite_sized", "short", "medium", "deep_dive"]),

    // New fields
    objectives: a.ref("Objective").required().array(),
    context: a.ref("LearningContext"),
    learningStyles: a.ref("LearningStyle").required().array(),
    preferencePace: a.integer(),
    preferenceDepth: a.integer(),
    preferenceStructure: a.integer(),
    preferenceChallenge: a.integer(),
    hoursPerWeek: a.integer(),
    totalWeeks: a.integer(),
    budget: a.ref("Budget"),
    urgency: a.integer(),
    experienceLevel: a.ref("ExperienceLevel"),

    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 1.2 Type definitions

No manual type changes needed — `src/model/learning-preference.ts` infers types from the schema.

Add a Zod schema for the merged form at `src/components/discovery/schema.ts`:

```ts
import { z } from "zod";

export const discoveryFormSchema = z.object({
  // New fields
  objectives: z.array(z.string()).min(1),
  context: z.enum(["beginner", "career_change", "upskilling", "job_prep", "academic", "personal_project"]),
  learningStyles: z.array(z.string()).min(1).max(3),
  preferencePace: z.number().min(1).max(10),
  preferenceDepth: z.number().min(1).max(10),
  preferenceStructure: z.number().min(1).max(10),
  preferenceChallenge: z.number().min(1).max(10),
  hoursPerWeek: z.number().min(1).max(40),
  totalWeeks: z.number().min(1).max(52),
  budget: z.enum(["free", "paid"]),
  urgency: z.number().min(1).max(5),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  // Existing fields (merged in)
  interests: z.array(z.string()).min(1),
  minutesPerDay: z.number().min(5).max(120).optional(),
  days: z.array(z.string()).optional(),
  formats: z.array(z.string()).optional(),
  contentLength: z.enum(["bite_sized", "short", "medium", "deep_dive"]).optional(),
});

export type DiscoveryFormValues = z.infer<typeof discoveryFormSchema>;
```

### 1.3 API / Data fetching changes

Reuse existing hooks — no new hooks needed:
- `src/hooks/learning-preference/use-my-learning-preference.ts` — fetches the record
- `src/hooks/learning-preference/use-save-learning-preference.ts` — creates/updates

The save hook automatically handles new fields since types are inferred from the schema.

### 1.4 Page changes

#### `src/routes/learning-preferences.tsx`

Update to render the new merged discovery form instead of the old `LearningPreferencesPage`. Add `loader` with `crumb`.

#### `src/components/discovery/discovery-page.tsx`

Refactor to:
- Fetch existing `LearningPreference` via `useMyLearningPreference`
- Pass existing data as defaults to the form
- On submit, save via `useSaveLearningPreference`
- Show toast on success, navigate to home

#### `src/components/home/home-page.tsx`

Update the inline first-time setup to use the new merged form component instead of the old `LearningPreferencesForm`.

### 1.5 Component changes

#### Delete (no longer needed)

- `src/components/discovery/discovery-container.tsx`
- `src/components/discovery/discovery-flow.tsx`
- `src/components/discovery/hooks/use-discovery-flow.ts`
- `src/components/discovery/steps/recommendations-step.tsx`
- `src/components/discovery/ui/profile-insights.tsx`
- `src/components/discovery/ui/recommendation-explanation.tsx`
- `src/components/discovery/ui/refinement-controls.tsx`
- `src/components/discovery/ui/trail-card.tsx`
- `src/components/discovery/types.ts`
- `src/routes/discovery.tsx`

#### Delete (replaced by merged form)

- `src/components/learning-preferences/learning-preferences-form.tsx`
- `src/components/learning-preferences/learning-preferences-page.tsx`
- `src/components/learning-preferences/step-interests.tsx`
- `src/components/learning-preferences/step-minutes-per-day.tsx`
- `src/components/learning-preferences/step-days.tsx`
- `src/components/learning-preferences/step-formats.tsx`
- `src/components/learning-preferences/step-content-length.tsx`
- `src/components/learning-preferences/step-confirmation.tsx`
- `src/components/learning-preferences/schema.ts`

#### Keep from learning-preferences

- `src/components/learning-preferences/constants.ts` — expand with new categories, keep existing format/day/content-length constants

#### Keep and refactor from discovery (translate hardcoded Portuguese to i18n, use react-hook-form)

- `src/components/discovery/steps/objectives-step.tsx` — step 1
- `src/components/discovery/steps/context-step.tsx` — step 2
- `src/components/discovery/steps/interest-areas-step.tsx` — step 3, use `Category` enum values
- `src/components/discovery/steps/preferences-step.tsx` — step 4, replace `Record<string, any>` with typed fields
- `src/components/discovery/steps/constraints-step.tsx` — step 5, merge in days/formats/contentLength/minutesPerDay fields
- `src/components/discovery/constants.ts` — translate, align with `Category` enum
- `src/components/discovery/ui/comparison-slider.tsx` — keep (generic UI)
- `src/components/discovery/ui/preference-chips.tsx` — keep (generic UI)
- `src/components/discovery/ui/scenario-card.tsx` — keep (generic UI)
- `src/components/discovery/ui/step-navigation.tsx` — keep (generic UI)
- `src/components/discovery/ui/progress-indicator.tsx` — keep (generic UI)

#### Create new

- `src/components/discovery/schema.ts` — Zod validation schema
- `src/components/discovery/discovery-form.tsx` — main form using react-hook-form, orchestrates all steps
- `src/components/discovery/steps/confirmation-step.tsx` — summary of all selections before saving

### 1.6 Translation keys

All keys use `react-i18next` with lowercase-with-dashes format. Added to `src/i18n/locales/en/common.ts` and `src/i18n/locales/pt-BR/common.ts`.

**Objectives step:**
- `discovery-objectives-title`
- `discovery-objectives-description`
- `discovery-objective-employment`
- `discovery-objective-employment-desc`
- `discovery-objective-career-change`
- `discovery-objective-career-change-desc`
- `discovery-objective-skill-improvement`
- `discovery-objective-skill-improvement-desc`
- `discovery-objective-personal-project`
- `discovery-objective-personal-project-desc`
- `discovery-objective-academic-growth`
- `discovery-objective-academic-growth-desc`

**Context step:**
- `discovery-context-title`
- `discovery-context-description`
- `discovery-context-beginner`
- `discovery-context-beginner-desc`
- `discovery-context-career-change`
- `discovery-context-career-change-desc`
- `discovery-context-upskilling`
- `discovery-context-upskilling-desc`
- `discovery-context-job-prep`
- `discovery-context-job-prep-desc`
- `discovery-context-academic`
- `discovery-context-academic-desc`
- `discovery-context-personal-project`
- `discovery-context-personal-project-desc`

**Interest areas step:**
- `discovery-interests-title`
- `discovery-interests-description`
- Reuse existing `learning-preferences-interest-*` keys for old categories
- New keys for new categories:
  - `learning-preferences-interest-vestibular-enem`
  - `learning-preferences-interest-concursos-publicos`
  - `learning-preferences-interest-certifications`
  - `learning-preferences-interest-languages`
  - `learning-preferences-interest-math-logic`
  - `learning-preferences-interest-productivity-tools`
  - `learning-preferences-interest-career-market`
  - `learning-preferences-interest-business-entrepreneurship`
  - `learning-preferences-interest-marketing-sales`
  - `learning-preferences-interest-design-creative`
  - `learning-preferences-interest-law`

**Preferences step:**
- `discovery-preferences-title`
- `discovery-preferences-description`
- `discovery-learning-style-title`
- `discovery-learning-style-description`
- `discovery-style-visual`
- `discovery-style-visual-desc`
- `discovery-style-hands-on`
- `discovery-style-hands-on-desc`
- `discovery-style-theoretical`
- `discovery-style-theoretical-desc`
- `discovery-style-interactive`
- `discovery-style-interactive-desc`
- `discovery-style-self-paced`
- `discovery-style-self-paced-desc`
- `discovery-style-structured`
- `discovery-style-structured-desc`
- `discovery-slider-pace`
- `discovery-slider-pace-left`
- `discovery-slider-pace-right`
- `discovery-slider-depth`
- `discovery-slider-depth-left`
- `discovery-slider-depth-right`
- `discovery-slider-structure`
- `discovery-slider-structure-left`
- `discovery-slider-structure-right`
- `discovery-slider-challenge`
- `discovery-slider-challenge-left`
- `discovery-slider-challenge-right`

**Constraints step:**
- `discovery-constraints-title`
- `discovery-constraints-description`
- `discovery-hours-per-week`
- `discovery-total-weeks`
- `discovery-budget-title`
- `discovery-budget-free`
- `discovery-budget-paid`
- `discovery-urgency`
- `discovery-experience-level`
- `discovery-experience-beginner`
- `discovery-experience-intermediate`
- `discovery-experience-advanced`

**Schedule step:**
- `discovery-schedule-title`
- `discovery-schedule-description`
- Reuse existing keys for days/formats/contentLength/minutesPerDay:
  - `learning-preferences-step-minutes-title`
  - `learning-preferences-step-days-title`
  - `learning-preferences-step-formats-title`
  - `learning-preferences-step-content-length-title`

**Confirmation step:**
- `discovery-confirmation-title`
- `discovery-confirmation-description`
- `discovery-confirmation-save`
- `discovery-confirmation-section-objectives`
- `discovery-confirmation-section-context`
- `discovery-confirmation-section-interests`
- `discovery-confirmation-section-learning-style`
- `discovery-confirmation-section-preferences`
- `discovery-confirmation-section-constraints`
- `discovery-confirmation-section-schedule`

**General:**
- `discovery-next`
- `discovery-back`
- `discovery-step-of`
- `discovery-validation-select-one`
- `discovery-save-success`
- `discovery-save-error`

### 1.7 Sidebar

No changes. The existing "Learning Preferences" sidebar item under user nav stays as-is, pointing to `/learning-preferences`.

## 2. Acceptance Criteria

### AC1: Schema deploys with new fields

**Given** the updated Amplify schema with new LearningPreference fields and expanded Category enum
**When** `npx ampx sandbox` runs
**Then** the schema deploys without errors and the new fields are available in DynamoDB

### AC2: Merged form saves all fields to backend

**Given** a user navigates to `/learning-preferences` and fills all steps (objectives, context, interests, learning styles, preference sliders, constraints including days/formats/contentLength/minutesPerDay)
**When** they click save on the confirmation step
**Then** a LearningPreference record is created/updated with all fields

### AC3: Form loads existing data

**Given** a user already has a LearningPreference record (including old records with only original fields)
**When** they navigate to `/learning-preferences`
**Then** existing fields are pre-populated and new fields default to empty/null

### AC4: All text is translated

**Given** the learning preferences page is rendered
**When** the user switches between en and pt-BR
**Then** all text is displayed in the correct language with no hardcoded strings

### AC5: Interest areas use expanded Category enum

**Given** the interest areas step
**When** the user selects interests (including new categories like vestibular_enem, languages, law)
**Then** the selected values are valid `Category` enum values that match the Track model's `categories` field

### AC6: Home page inline form works

**Given** a new user with no LearningPreference record
**When** they visit the home page
**Then** the inline learning preferences form renders with the new merged steps

### AC7: Track recommendations still work

**Given** a user has selected interests in the new form
**When** they visit the home page
**Then** recommended tracks are filtered by the selected Category values (existing behavior preserved)

### Edge cases

- E1: User has old LearningPreference with only original fields — new fields default to null/empty, form still loads
- E2: User navigates away mid-form — no partial save, data only saved on confirmation
- E3: Validation prevents proceeding without required selections per step
- E4: Old `/discovery` route is removed — any bookmarks to it should 404

## 3. Implementation Tasks

### [x] 3.1 Amplify schema — expand Category enum and add new fields

#### `amplify/data/resource.ts`

Add 11 new values to the `Category` enum: `vestibular_enem`, `concursos_publicos`, `certifications`, `languages`, `math_logic`, `productivity_tools`, `career_market`, `business_entrepreneurship`, `marketing_sales`, `design_creative`, `law`.

Add new enums: `LearningContext`, `Objective`, `Budget`, `LearningStyle`, `ExperienceLevel`.

Add new fields to `LearningPreference` model: `objectives`, `context`, `learningStyles`, `preferencePace`, `preferenceDepth`, `preferenceStructure`, `preferenceChallenge`, `hoursPerWeek`, `totalWeeks`, `budget`, `urgency`, `experienceLevel`. All new fields are optional so existing records are not broken.

### [x] 3.2 Add Zod schema and create discovery form wrapper

#### `src/components/discovery/schema.ts`

Create Zod validation schema for the merged form covering all fields (new + existing).

#### `src/components/discovery/discovery-form.tsx`

Create the main form component using `react-hook-form` with `zodResolver`. It should:
- Accept `existingPreference` prop to pre-populate defaults
- Manage step navigation state (8 steps: objectives, context, interests, preferences, constraints, schedule, confirmation)
  - Step 1: Objectives
  - Step 2: Context
  - Step 3: Interests
  - Step 4: Learning Style & Preference Sliders
  - Step 5: Constraints (budget, urgency, experience level, hours/week, total weeks)
  - Step 6: Schedule (days, formats, content length, minutes/day)
  - Step 7: Confirmation
- Render the current step component passing form context
- Show progress indicator and step navigation with framer-motion transitions
- Call `onSubmit` with form values on confirmation

#### `src/components/discovery/discovery-page.tsx`

Refactor to use `useMyLearningPreference` to fetch existing data, render `DiscoveryForm`, save via `useSaveLearningPreference` on submit, show toast, navigate to `/`.

#### `src/components/discovery/index.ts`

Rewrite exports to only include active components.

### [x] 3.3 Refactor step components — i18n and react-hook-form

#### `src/components/discovery/steps/objectives-step.tsx`

Replace all hardcoded Portuguese strings with `useTranslation` + `t()` calls. Replace `StepProps` interface with react-hook-form `useFormContext`. Use `useWatch` for reading `objectives` field and `setValue` for updates.

#### `src/components/discovery/steps/context-step.tsx`

Same refactor pattern. Read/write `context` field via form context.

#### `src/components/discovery/steps/interest-areas-step.tsx`

Same refactor. Replace discovery `INTEREST_AREAS` with the expanded `Category` enum values from `src/components/learning-preferences/constants.ts`. Read/write `interests` field.

#### `src/components/discovery/steps/preferences-step.tsx`

Same refactor. Replace `Record<string, any>` with typed fields (`preferencePace`, `preferenceDepth`, `preferenceStructure`, `preferenceChallenge`). Read/write `learningStyles` and individual preference fields. Remove `generatePersonalizationPreview` helper.

#### `src/components/discovery/steps/constraints-step.tsx`

Same refactor. Contains the new constraint fields: `hoursPerWeek`, `totalWeeks`, `budget`, `urgency`, `experienceLevel`.

#### `src/components/discovery/steps/schedule-step.tsx`

New step component for the existing schedule fields: `days`, `formats`, `contentLength`, `minutesPerDay`. Reuse existing constants for day/format/content-length options. Port the UI patterns from the old learning-preferences step components.

### [x] 3.4 Create confirmation step

#### `src/components/discovery/steps/confirmation-step.tsx`

Create a summary step that displays all selected values grouped by section (objectives, context, interests, learning style, preferences, constraints, schedule). All text via i18n. Include a save button.

### [x] 3.5 Refactor constants — translate and align with Category enum

#### `src/components/discovery/constants.ts`

Remove all hardcoded Portuguese labels. Replace `INTEREST_AREAS` with data derived from the expanded `Category` enum. Replace `OBJECTIVE_OPTIONS`, `CONTEXT_SCENARIOS`, `LEARNING_STYLE_OPTIONS` with arrays using `id` + `translationKey` pattern instead of hardcoded `label`/`description`. Remove `MICROCOPY` and `STEP_CONFIG` objects.

#### `src/components/learning-preferences/constants.ts`

Add the 11 new categories to `INTEREST_OPTIONS` and `INTEREST_TRANSLATION_KEYS`. Keep existing format/day/content-length constants.

#### `src/components/track/track-form.tsx`

Update the category selector to include all 11 new categories so admins can tag tracks with them.

### [x] 3.6 Add translation keys

#### `src/i18n/locales/en/common.ts`

Add all translation keys listed in section 1.6 with English values. Add new category translation keys.

#### `src/i18n/locales/pt-BR/common.ts`

Add all translation keys listed in section 1.6 with Portuguese values (proper accents). Add new category translation keys.

### [x] 3.7 Update route and home page

#### `src/routes/learning-preferences.tsx`

Update to render the new `DiscoveryPage` component instead of the old `LearningPreferencesPage`.

#### `src/components/home/home-page.tsx`

Update the inline first-time setup to use the new `DiscoveryForm` component instead of the old `LearningPreferencesForm`. Update imports accordingly.

### [x] 3.8 Delete unused files

Delete discovery prototype files:
- `src/components/discovery/discovery-container.tsx`
- `src/components/discovery/discovery-flow.tsx`
- `src/components/discovery/hooks/use-discovery-flow.ts`
- `src/components/discovery/steps/recommendations-step.tsx`
- `src/components/discovery/ui/profile-insights.tsx`
- `src/components/discovery/ui/recommendation-explanation.tsx`
- `src/components/discovery/ui/refinement-controls.tsx`
- `src/components/discovery/ui/trail-card.tsx`
- `src/components/discovery/types.ts`
- `src/routes/discovery.tsx`

Delete old learning-preferences files (replaced by merged form):
- `src/components/learning-preferences/learning-preferences-form.tsx`
- `src/components/learning-preferences/learning-preferences-page.tsx`
- `src/components/learning-preferences/step-interests.tsx`
- `src/components/learning-preferences/step-minutes-per-day.tsx`
- `src/components/learning-preferences/step-days.tsx`
- `src/components/learning-preferences/step-formats.tsx`
- `src/components/learning-preferences/step-content-length.tsx`
- `src/components/learning-preferences/step-confirmation.tsx`
- `src/components/learning-preferences/schema.ts`

### [x] 3.9 Verify build and type check

Run `npm run build` and fix any TypeScript errors. Verify:
- `/learning-preferences` route renders the new merged form
- All steps navigate correctly
- Form saves to backend with all fields
- Home page inline form works for new users
- All text is translated in both en and pt-BR
- No references to deleted files remain

## 4. Open Questions and missing details

- Q1: None — all questions resolved.
