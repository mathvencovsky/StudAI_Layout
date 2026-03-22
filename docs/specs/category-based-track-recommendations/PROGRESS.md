# Progress

## Task 3.1 - Schema and type changes ✅

### Changes made:

- `amplify/data/resource.ts`: Added `Category` enum with 12 values (web_development, mobile_development, data_science, machine_learning, cloud_computing, devops, cybersecurity, databases, ui_ux_design, game_development, blockchain, embedded_systems). Updated `Track.categories` to `a.ref("Category").array()`. Updated `LearningPreference.interests` to `a.ref("Category").required().array().required()`.

- `src/model/track.ts`: Added `Category` type export (`Schema["Category"]["type"]`). Added `"categories"` to `trackSelectionSet`.

- `src/components/learning-preferences/constants.ts`: Replaced hardcoded hyphen-based `INTEREST_OPTIONS` with `Category[]` using underscore values. Added `INTEREST_TRANSLATION_KEYS` const object mapping each `Category` to its i18n key (type-safe, avoids `.replace()` returning `string`).

- `src/components/learning-preferences/schema.ts`: Updated `interests` field from `z.array(z.string())` to `z.array(z.enum(CategoryValues))` so `LearningPreferencesFormValues.interests` is typed as `Category[]`.

- `src/components/learning-preferences/step-interests.tsx`: Updated translation key lookup to use `INTEREST_TRANSLATION_KEYS[interest]` instead of template literal with `.replace()`.

- `src/i18n/locales/en/common.ts`: Re-added `learning-preferences-interest-*` keys (blockchain, cloud-computing, cybersecurity, data-science, databases, devops, embedded-systems, game-development, machine-learning, mobile-development, ui-ux-design, web-development) in alphabetical order.

- `src/i18n/locales/pt-BR/common.ts`: Added same keys with Portuguese translations.

- Deleted `src/api/category.ts` and `src/hooks/category/` (untracked files referencing a non-existent `Category` model that were causing pre-existing build errors).

Build passes with no TypeScript errors.

## Task 3.2 - New hook: tracks by categories ✅

### Changes made:

- `src/hooks/track/use-tracks-by-categories.ts`: Created new hook `useTracksByCategories(categories)` that reuses `getTracksQueryOptions()` with a `select` transform to filter tracks by categories using OR logic. Handles nullable category items (`category !== null` guard). Returns all tracks when `categories` is undefined or empty.

Build passes with no TypeScript errors.

## Task 3.3 - New component: recommended tracks empty state ✅

### Changes made:

- `src/components/home/recommended-tracks-empty-state.tsx`: Created new `RecommendedTracksEmptyState` component that accepts `interests: Category[] | undefined` and uses `useTracksByCategories` to fetch filtered tracks. Shows a loading state while fetching, an empty message when no tracks match, or a list of track buttons navigating to `/track/$trackId`. Includes a "Browse Tracks" button linking to `/track`.

- `src/i18n/locales/en/common.ts`: Added `recommended-tracks-description`, `recommended-tracks-empty`, and `recommended-tracks-title` keys in alphabetical order (after `rating`, before `remove`).

- `src/i18n/locales/pt-BR/common.ts`: Added same keys with Portuguese translations in alphabetical order.

Build passes with no TypeScript errors.

## Task 3.4 - Update home page ✅

### Changes made:

- `src/components/home/home-page.tsx`: Imported `useLastStartedTrackWithDetails`, `useLastStartedModuleWithContents`, and `RecommendedTracksEmptyState`. Added both hooks to the component. Replaced the static two-column grid with conditional rendering: shows `LoadingState` while track/module data is loading, shows the grid when either `lastTrack` or `lastModule` is present, and shows `RecommendedTracksEmptyState` (with `existingPreference?.interests`) when both are null.

Build passes with no TypeScript errors.

## Task 3.5 - Update track form with categories field ✅

### Changes made:

- `src/components/track/track-form.tsx`: Added `categories: Category[]` to `FormValues`. Added `categories` to `TrackFormProps.initialData` (optional). Destructured `control` and `setValue` from `useForm`. Added `useWatch` for `categories` field. Added a `ToggleGroup` multi-select field using `INTEREST_OPTIONS` and `INTEREST_TRANSLATION_KEYS` (reusing existing i18n keys). Passed `categories` in both create and update mutation calls.

- `src/routes/track/$trackId/edit.tsx`: Added `Category` import. Passed `categories` in `initialData` (filtering nulls from `track.categories`).

- `src/i18n/locales/en/common.ts`: Added `track-categories-label: "Categories"` in alphabetical order.

- `src/i18n/locales/pt-BR/common.ts`: Added `track-categories-label: "Categorias"` in alphabetical order.

Build passes with no TypeScript errors.

## Task 3.6 - Add translation keys ✅

### Changes made:

- `src/i18n/locales/en/common.ts`: Added 12 `track-category-*` keys in alphabetical order after `track-categories-label`: blockchain, cloud-computing, cybersecurity, data-science, databases, devops, embedded-systems, game-development, machine-learning, mobile-development, ui-ux-design, web-development.

- `src/i18n/locales/pt-BR/common.ts`: Added same 12 keys with Portuguese translations in alphabetical order.

Build passes with no TypeScript errors.
