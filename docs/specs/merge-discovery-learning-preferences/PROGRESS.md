# Progress

## Task 3.1 — Amplify schema: expand Category enum and add new fields

- Added 11 new values to `Category` enum in `amplify/data/resource.ts`: `vestibular_enem`, `concursos_publicos`, `certifications`, `languages`, `math_logic`, `productivity_tools`, `career_market`, `business_entrepreneurship`, `marketing_sales`, `design_creative`, `law`
- Added new enums: `LearningContext`, `Objective`, `Budget`, `LearningStyle`, `ExperienceLevel`
- Added new optional fields to `LearningPreference` model: `objectives`, `context`, `learningStyles`, `preferencePace`, `preferenceDepth`, `preferenceStructure`, `preferenceChallenge`, `hoursPerWeek`, `totalWeeks`, `budget`, `urgency`, `experienceLevel`
- Updated `src/components/learning-preferences/constants.ts` to include all 11 new categories in `INTEREST_OPTIONS` and `INTEREST_TRANSLATION_KEYS`
- Updated `src/components/learning-preferences/schema.ts` to include all new category values in `CategoryValues`
- Added new `learning-preferences-interest-*` translation keys for all 11 new categories in both `en` and `pt-BR` locale files
- Added new `track-category-*` translation keys for all 11 new categories in both `en` and `pt-BR` locale files
- Build passes ✓

## Task 3.2 — Add Zod schema and create discovery form wrapper

- Created `src/components/discovery/schema.ts` with `discoveryFormSchema` covering all fields (objectives, context, interests, learningStyles, preference sliders, constraints, schedule fields)
- Created `src/components/discovery/discovery-form.tsx` with `DiscoveryForm` component using `react-hook-form` + `zodResolver`, `FormProvider`, step navigation (5 steps: objectives, context, interests, preferences, constraints), and framer-motion transitions
- Refactored `src/components/discovery/discovery-page.tsx` to use `useMyLearningPreference`, render `DiscoveryForm`, save via `useSaveLearningPreference`, show toast, navigate to `/`
- Rewrote `src/components/discovery/index.ts` to only export active components (removed discovery-flow, discovery-container, hooks, trail-card, recommendation-explanation, refinement-controls, profile-insights, types)
- Added `discovery-save-success`, `discovery-save-error`, `discovery-step-of` translation keys to both `en` and `pt-BR` locale files
- Build passes ✓

## Task 3.3 — Refactor step components — i18n and react-hook-form

- Rewrote `src/components/discovery/constants.ts`: replaced hardcoded Portuguese labels with `translationKey`/`descriptionKey` pattern for `OBJECTIVE_OPTIONS`, `CONTEXT_SCENARIOS`, `LEARNING_STYLE_OPTIONS`. Added legacy stubs (`MICROCOPY`, `STEP_CONFIG`, `REFINEMENT_OPTIONS`, `INTEREST_AREAS`) for files pending deletion.
- Rewrote `src/components/discovery/steps/objectives-step.tsx`: uses `useFormContext<DiscoveryFormValues>`, `useWatch({ control, name: 'objectives' })`, `setValue`, `useTranslation`. Removed `StepProps` dependency.
- Rewrote `src/components/discovery/steps/context-step.tsx`: same pattern, `context` field.
- Rewrote `src/components/discovery/steps/interest-areas-step.tsx`: uses `INTEREST_OPTIONS` and `INTEREST_TRANSLATION_KEYS` from `learning-preferences/constants`, `interests` field.
- Rewrote `src/components/discovery/steps/preferences-step.tsx`: uses typed fields (`learningStyles`, `preferencePace`, `preferenceDepth`, `preferenceStructure`, `preferenceChallenge`). Removed `generatePersonalizationPreview` helper.
- Rewrote `src/components/discovery/steps/constraints-step.tsx`: uses `hoursPerWeek`, `totalWeeks`, `budget`, `urgency`, `experienceLevel` fields. All text via i18n.
- Updated `src/components/discovery/discovery-form.tsx`: removed `userProfile`/`handleUpdate` bridge since steps now use form context directly.
- Fixed `src/components/discovery/ui/step-navigation.tsx`: replaced `MICROCOPY` with `useTranslation`.
- Fixed `src/components/discovery/ui/progress-indicator.tsx`: replaced `STEP_CONFIG` with `Array.from({ length: totalSteps })`.
- Deleted files causing build errors (pending task 3.8): `discovery-container.tsx`, `discovery-flow.tsx`, `hooks/use-discovery-flow.ts`, `steps/recommendations-step.tsx`, `ui/profile-insights.tsx`, `ui/refinement-controls.tsx`.
- Added all discovery translation keys to `src/i18n/locales/en/common.ts` and `src/i18n/locales/pt-BR/common.ts` (objectives, context, interests, preferences, constraints, sliders, experience levels, urgency, budget, validation).
- Build passes ✓

## Task 3.4 — Create confirmation step

- Created `src/components/discovery/steps/confirmation-step.tsx`: reads all form values via `useFormContext` + `useWatch`, displays them grouped by section (objectives, context, interests, learning style, preferences, constraints). Uses `OBJECTIVE_OPTIONS`, `CONTEXT_SCENARIOS`, `LEARNING_STYLE_OPTIONS` from constants and `INTEREST_TRANSLATION_KEYS` from learning-preferences constants to map IDs to translated labels.
- Added `discovery-confirmation-*` translation keys to both `en` and `pt-BR` locale files (title, description, save, and 7 section labels), inserted in alphabetical order.
- Updated `discovery-form.tsx`: imported `ConfirmationStep`, increased `TOTAL_STEPS` from 5 to 6, added empty validation array for confirmation step, rendered `ConfirmationStep` at step index 5.
- Updated `src/components/discovery/index.ts` to export `ConfirmationStep`.
- Build passes ✓

## Task 3.5 — Refactor constants — translate and align with Category enum

- `src/components/learning-preferences/constants.ts` already had all 11 new categories in `INTEREST_OPTIONS` and `INTEREST_TRANSLATION_KEYS` (done in task 3.1)
- `src/components/track/track-form.tsx` already uses `INTEREST_OPTIONS` from learning-preferences/constants which includes all 11 new categories (no changes needed)
- `src/components/discovery/constants.ts` already had `OBJECTIVE_OPTIONS`, `CONTEXT_SCENARIOS`, `LEARNING_STYLE_OPTIONS` with `translationKey`/`descriptionKey` pattern (done in task 3.3); removed the legacy stubs (`MICROCOPY`, `STEP_CONFIG`, `REFINEMENT_OPTIONS`, `INTEREST_AREAS`) since no files reference them
- Build passes ✓

## Task 3.6 — Add translation keys

- Added `discovery-schedule-title` and `discovery-schedule-description` to both `src/i18n/locales/en/common.ts` and `src/i18n/locales/pt-BR/common.ts` (inserted in alphabetical order)
- Created `src/components/discovery/steps/schedule-step.tsx`: new step component for days, formats, content length, and minutes per day; uses `useFormContext<DiscoveryFormValues>`, `Controller`, and reuses constants from `learning-preferences/constants.ts`
- Updated `discovery-form.tsx`: increased `TOTAL_STEPS` from 6 to 7, added `ScheduleStep` import, added empty validation array for schedule step, rendered `ScheduleStep` at step index 5 (confirmation moved to index 6)
- Updated `confirmation-step.tsx`: added `useWatch` for `days`, `formats`, `contentLength`, `minutesPerDay`; added schedule section displaying those values; used a `formatLabels` lookup map to avoid dynamic `t()` type errors
- Updated `src/components/discovery/index.ts` to export `ScheduleStep`
- Build passes ✓

## Task 3.7 — Update route and home page

- Updated `src/routes/learning-preferences.tsx` to import and render `DiscoveryPage` from `@/components/discovery` instead of the old `LearningPreferencesPage`
- Updated `src/components/home/home-page.tsx`: removed `LearningPreferencesForm`, `useSaveLearningPreference`, `LearningPreferencesFormValues`, `handleSavePreference`, `useCallback`, `toast` imports/usage; replaced the inline first-time setup with `<DiscoveryPage />` which handles fetching, saving, and navigation internally
- Build passes ✓

## Task 3.8 — Delete unused files

- Moved `ComparisonSliderProps`, `ScenarioCardProps`, `PreferenceChipProps` inline into their respective UI component files (`comparison-slider.tsx`, `scenario-card.tsx`, `preference-chips.tsx`) since they imported from `types.ts`
- Deleted `src/components/discovery/types.ts`
- Deleted `src/components/discovery/ui/recommendation-explanation.tsx`
- Deleted `src/components/discovery/ui/trail-card.tsx`
- Deleted `src/routes/discovery.tsx`
- Deleted `src/components/learning-preferences/learning-preferences-form.tsx`
- Deleted `src/components/learning-preferences/learning-preferences-page.tsx`
- Deleted `src/components/learning-preferences/step-interests.tsx`
- Deleted `src/components/learning-preferences/step-minutes-per-day.tsx`
- Deleted `src/components/learning-preferences/step-days.tsx`
- Deleted `src/components/learning-preferences/step-formats.tsx`
- Deleted `src/components/learning-preferences/step-content-length.tsx`
- Deleted `src/components/learning-preferences/step-confirmation.tsx`
- Deleted `src/components/learning-preferences/schema.ts`
- Build passes ✓

## Task 3.9 — Verify build and type check

- Ran `npm run build` — passes with no TypeScript errors ✓
- Verified no references to deleted files remain in the codebase ✓
- `/learning-preferences` route renders `DiscoveryPage` (new merged form) ✓
- Home page uses `DiscoveryPage` for new users ✓
- All text uses i18n translation keys ✓
- Build passes ✓
