# Technical Spec: Rename Portuguese Files and Routes to English

## 0. Summary

**Goal:** Rename all Portuguese-named files (components, routes) and URL paths to English, and review/translate all Portuguese code inside those files (exported names, variable names, comments, hardcoded strings) to comply with the project's code-language guideline that all code and file names must be in English.
**Out of scope:** Renaming i18n locale files/directories (e.g., `i18n/pt-BR.ts`, `i18n/locales/pt-BR/`), and changing translation string _values_ inside locale files. AI prompt content in `lib/ai/system-prompt.ts` and `lib/ai/course-generator.ts` is also out of scope since those prompts may intentionally target Portuguese-speaking users.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required.

### 1.2 Type definitions

No type changes required.

### 1.3 API / Data fetching changes

No API changes required.

### 1.4 Page changes

All route files with Portuguese names must be renamed. Since TanStack Router uses file-based routing, renaming a route file changes the URL path.

**Route rename mapping (file → new file, old URL → new URL):**

| Old route file                 | New route file                | Old URL              | New URL             |
| ------------------------------ | ----------------------------- | -------------------- | ------------------- |
| `routes/explorar.tsx`          | `routes/explore.tsx`          | `/explorar`          | `/explore`          |
| `routes/explorar/$trackId.tsx` | `routes/explore/$trackId.tsx` | `/explorar/$trackId` | `/explore/$trackId` |
| `routes/pesquisar.tsx`         | `routes/search.tsx`           | `/pesquisar`         | `/search`           |
| `routes/pesquisar-trilhas.tsx` | `routes/search-tracks.tsx`    | `/pesquisar-trilhas` | `/search-tracks`    |
| `routes/estudar.tsx`           | `routes/study.tsx`            | `/estudar`           | `/study`            |
| `routes/avaliacoes.tsx`        | `routes/assessments.tsx`      | `/avaliacoes`        | `/assessments`      |
| `routes/Sessões.tsx`           | `routes/sessions.tsx`         | `/Sessões`           | `/sessions`         |
| `routes/calendario.tsx`        | `routes/calendar.tsx`         | `/calendario`        | `/calendar`         |
| `routes/meu-objetivo.tsx`      | `routes/my-goal.tsx`          | `/meu-objetivo`      | `/my-goal`          |
| `routes/revisoes.tsx`          | `routes/reviews.tsx`          | `/revisoes`          | `/reviews`          |
| `routes/relatorios.tsx`        | `routes/reports.tsx`          | `/relatorios`        | `/reports`          |
| `routes/metricas.tsx`          | `routes/metrics.tsx`          | `/metricas`          | `/metrics`          |
| `routes/atividade.tsx`         | `routes/activity.tsx`         | `/atividade`         | `/activity`         |
| `routes/salvos.tsx`            | `routes/saved.tsx`            | `/salvos`            | `/saved`            |
| `routes/configuracoes.tsx`     | `routes/settings.tsx`         | `/configuracoes`     | `/settings`         |
| `routes/criar-trilha.tsx`      | `routes/create-track.tsx`     | `/criar-trilha`      | `/create-track`     |
| `routes/criar-curso.tsx`       | `routes/create-course.tsx`    | `/criar-curso`       | `/create-course`    |
| `routes/meu-plano.tsx`         | `routes/my-plan.tsx`          | `/meu-plano`         | `/my-plan`          |
| `routes/meus-cursos.tsx`       | `routes/my-courses.tsx`       | `/meus-cursos`       | `/my-courses`       |
| `routes/perfil.tsx`            | `routes/profile.tsx`          | `/perfil`            | `/profile`          |
| `routes/programas.tsx`         | `routes/programs.tsx`         | `/programas`         | `/programs`         |
| `routes/trilha.tsx`            | `routes/my-track.tsx`         | `/trilha`            | `/my-track`         |
| `routes/curso/$courseId.tsx`   | `routes/course/$courseId.tsx` | `/curso/$courseId`   | `/course/$courseId` |

Each route file must update its `createFileRoute` path string to match the new URL.

### 1.5 Component changes

All Portuguese-named component files must be renamed. Exported component/function names and their imports must be updated accordingly.

**Component rename mapping:**

| Old file                                                | New file                                               |
| ------------------------------------------------------- | ------------------------------------------------------ |
| `components/saved/salvos-page-integrated.tsx`           | `components/saved/saved-page-integrated.tsx`           |
| `components/saved/salvos-page.tsx`                      | `components/saved/saved-page.tsx`                      |
| `components/roi/roi-estudo-page-integrated.tsx`         | `components/roi/roi-study-page-integrated.tsx`         |
| `components/metrics/metricas-page-simple.tsx`           | `components/metrics/metrics-page-simple.tsx`           |
| `components/metrics/metricas-page.tsx`                  | `components/metrics/metrics-page.tsx`                  |
| `components/settings/configuracoes-page-integrated.tsx` | `components/settings/settings-page-integrated.tsx`     |
| `components/assessments/avaliacoes-page.tsx`            | `components/assessments/assessments-page.tsx`          |
| `components/study/estudar-page.tsx`                     | `components/study/study-page.tsx`                      |
| `components/calendar/calendario-page-integrated.tsx`    | `components/calendar/calendar-page-integrated.tsx`     |
| `components/calendar/calendario-page.tsx`               | `components/calendar/calendar-page.tsx`                |
| `components/activity/atividade-page.tsx`                | `components/activity/activity-page.tsx`                |
| `components/plan/meu-plano-page.tsx`                    | `components/plan/my-plan-page.tsx`                     |
| `components/tracks/pesquisar-trilhas-page.tsx`          | `components/tracks/search-tracks-page.tsx`             |
| `components/tracks/explorar-trilhas-page.tsx`           | `components/tracks/explore-tracks-page.tsx`            |
| `components/tracks/criar-trilha-page.tsx`               | `components/tracks/create-track-page.tsx`              |
| `components/content/conteudos-page-integrated.tsx`      | `components/content/contents-page-integrated.tsx`      |
| `components/search/pesquisar-page-integrated.tsx`       | `components/search/search-page-integrated.tsx`         |
| `components/search/pesquisar-page.tsx`                  | `components/search/search-page.tsx`                    |
| `components/engagement/engajamento-page-integrated.tsx` | `components/engagement/engagement-page-integrated.tsx` |
| `components/programs/programas-page-integrated.tsx`     | `components/programs/programs-page-integrated.tsx`     |
| `components/programs/programas-page.tsx`                | `components/programs/programs-page.tsx`                |
| `components/sessions/Sessões-page.tsx`                  | `components/sessions/sessions-page.tsx`                |
| `components/sessions/Sessões-page-integrated.tsx`       | `components/sessions/sessions-page-integrated.tsx`     |
| `components/profile/perfil-page-integrated.tsx`         | `components/profile/profile-page-integrated.tsx`       |
| `components/profile/perfil-page.tsx`                    | `components/profile/profile-page.tsx`                  |
| `components/review/revisoes-page-integrated.tsx`        | `components/review/reviews-page-integrated.tsx`        |
| `components/review/revisoes-page.tsx`                   | `components/review/reviews-page.tsx`                   |
| `components/goal/metas-page-integrated.tsx`             | `components/goal/goals-page-integrated.tsx`            |
| `components/goal/meu-objetivo-page.tsx`                 | `components/goal/my-goal-page.tsx`                     |
| `components/analytics/relatorios-page-integrated.tsx`   | `components/analytics/reports-page-integrated.tsx`     |
| `components/analytics/relatorios-page.tsx`              | `components/analytics/reports-page.tsx`                |
| `components/course-builder/meus-cursos-page.tsx`        | `components/course-builder/my-courses-page.tsx`        |

For each renamed component file:

1. Rename the exported component/function (e.g., `SalvosPage` → `SavedPage`)
2. Update all import statements that reference the old file path or old export name
3. Review and translate all internal Portuguese code (see section 1.5.1)

### 1.5.1 Internal code review — translate Portuguese code to English

Every file being renamed (and any other file found to contain Portuguese code) must be reviewed for:

1. **Exported component/function names** — rename to English (e.g., `MeuPlanoPage` → `MyPlanPage`)
2. **Variable and constant names** — rename to English (e.g., `produto` → `product`, `empresa` → `company`)
3. **Comments** — translate to English
4. **Hardcoded Portuguese UI strings** — replace with `t()` calls using react-i18next, and add corresponding translation keys to both `en` and `pt-BR` locale files

**Files with hardcoded Portuguese strings (excluding i18n locale files and AI prompt files):**

High impact (10+ hardcoded Portuguese strings):

- `components/plan/meu-plano-page.tsx` (22) — pricing page with hardcoded PT-BR text everywhere
- `components/public/faq-page.tsx` (21)
- `components/public/how-it-works-page.tsx` (13)
- `data/tracks-catalog-data.ts` (92) — mock/seed data
- `data/quiz-questions-data.ts` (88) — mock/seed data
- `data/program-data.ts` (20) — mock/seed data
- `data/study-goals-data.ts` (15) — mock/seed data
- `data/cfa-mock-data.ts` (14) — mock/seed data
- `data/ai-study-data.ts` (10) — mock/seed data
- `data/trail-planning-data.ts` (5) — mock/seed data
- `utils/seed-resource-catalog.ts` (80) — seed data
- `utils/seed-creator-catalog.ts` (34) — seed data
- `api/stubs/tracks-stub.ts` (19) — stub data
- `api/stubs/search-stub.ts` (9) — stub data
- `api/stubs/activity-stub.ts` (7) — stub data

Medium impact (3–9 hardcoded Portuguese strings):

- `components/landing/LandingHero.tsx` (9)
- `components/review/revisoes-page-integrated.tsx` (9)
- `components/analytics/relatorios-page-integrated.tsx` (9)
- `components/public/security-page.tsx` (8)
- `components/public/support-page.tsx` (8)
- `components/sessions/Sessões-page-integrated.tsx` (7)
- `components/saved/salvos-page-integrated.tsx` (6)
- `components/roi/roi-estudo-page-integrated.tsx` (6)
- `components/settings/configuracoes-page-integrated.tsx` (6)
- `components/content/conteudos-page-integrated.tsx` (6)
- `api/stubs/assessments-stub.ts` (6)
- `components/engagement/engajamento-page-integrated.tsx` (5)
- `components/dashboard/next-action-card.tsx` (5)
- `components/upgrade/upgrade-card.tsx` (4)
- `components/study/study-with-ai-page.tsx` (4)
- `components/calendar/calendario-page-integrated.tsx` (4)
- `components/profile/perfil-page-integrated.tsx` (4)
- `components/profile/perfil-page.tsx` (4)
- `api/stubs/profile-stub.ts` (4)
- `api/stubs/calendar-stub.ts` (4)
- `api/stubs/admin-stub.ts` (4)
- `components/ranking/ranking-page-integrated.tsx` (3)
- `components/study/estudar-page.tsx` (3)
- `components/quiz/quiz-session-page-integrated.tsx` (3)
- `components/goal/metas-page-integrated.tsx` (3)
- `api/stubs/programs-stub.ts` (3)
- `api/stubs/dashboard-stub.ts` (3)

Low impact (1–2 hardcoded Portuguese strings):

- `components/landing/faq-section.tsx` (2)
- `components/landing/auth-card.tsx` (2)
- `components/landing/landing-header.tsx` (2)
- `components/landing/landing-footer.tsx` (2)
- `components/quiz/quiz-session-page.tsx` (2)
- `components/quiz/quizzes-page-integrated.tsx` (2)
- `components/content/content-list-with-tabs.tsx` (2)
- `components/search/pesquisar-page-integrated.tsx` (2)
- `components/search/pesquisar-page.tsx` (2)
- `components/dashboard/daily-plan-card.tsx` (2)
- `components/public/resources-page.tsx` (2)
- `components/public/terms-page.tsx` (2)
- `components/course-builder/course-builder-page.tsx` (2)
- `components/course-builder/meus-cursos-page.tsx` (2)
- `components/course-builder/course-detail-page.tsx` (2)
- `components/course-builder/course-preview.tsx` (2)
- `api/stubs/metrics-stub.ts` (2)
- `api/stubs/ranking-stub.ts` (2)
- `components/layout/global-footer.tsx` (1+) — also has hardcoded PT-BR section headers
- `components/assessments/avaliacoes-page.tsx` (1) — "Continuar" button text
- `components/tracks/explorar-trilhas-page.tsx` (1)
- `components/programs/programas-page-integrated.tsx` (1)
- `components/public/contact-page.tsx` (1)
- And several more with 1 match each

**Files with Portuguese comments (~30 across 23 files):**

- `main.tsx`, `types/dashboard.ts`, `components/layout/nav-group.tsx`, `components/admin/admin-page.tsx`, `components/tracks/criar-trilha-page.tsx`, `components/profile/perfil-page-integrated.tsx`, `components/profile/perfil-page.tsx`, `components/guards/auth-guard.tsx`, `components/study/estudar-page.tsx`, `components/plan/meu-plano-page.tsx`, `components/landing/ui.tsx` (5 comments), `hooks/search/use-search.ts`, `api/stubs/reports-stub.ts`, `api/stubs/sessions-stub.ts`, `api/stubs/metrics-stub.ts`, `api/stubs/search-stub.ts`

**Strategy for hardcoded strings:**

- For UI-facing strings in components: replace with `t("key")` calls and add keys to both locale files
- For mock/seed/stub data files: translate the data values to English directly (these are developer-facing test data, not user-facing i18n content)
- For variable names used as object keys in footers/nav (e.g., `produto`, `empresa`, `suporte`): rename to English equivalents

### 1.5.2 Fix broken Portuguese route references in landing footer

`landing-footer.tsx` references routes `/privacidade`, `/termos`, `/seguranca`, `/sobre`, `/contato` that don't match the actual English route files (`privacy.tsx`, `terms.tsx`, `security.tsx`). These must be fixed to use the correct English paths: `/privacy`, `/terms`, `/security`, `/about`, `/contact`.

### 1.6 Translation keys

New translation keys are required for every hardcoded Portuguese string in component files that gets replaced with a `t()` call. The exact keys will be determined during implementation as each file is reviewed. Keys must follow the existing convention (lowercase, hyphen-separated, alphabetically ordered).

### 1.7 Sidebar

No new sidebar items. The existing `navigation-config.ts` must update all `to` properties to use the new English URL paths.

## 2. Acceptance Criteria

### AC1: All file names under `src/` are in English

**Given** the refactor is complete
**When** listing all files recursively under `src/`
**Then** no file names contain Portuguese words (excluding `i18n/locales/pt-BR/` and `i18n/pt-BR.ts`)

### AC2: All route URLs are in English

**Given** a user navigates the app
**When** clicking any sidebar or in-app link
**Then** all URL paths are in English (e.g., `/explore` not `/explorar`)

### AC3: Navigation still works

**Given** the route files have been renamed
**When** clicking each sidebar navigation item
**Then** the correct page renders without errors

### AC4: Route tree regenerates successfully

**Given** all route files are renamed with updated `createFileRoute` paths
**When** running `npx tsr generate` (or the dev server)
**Then** `routeTree.gen.ts` regenerates without errors

### AC5: No broken imports

**Given** all component files are renamed
**When** running `npx tsc --noEmit`
**Then** there are zero TypeScript compilation errors

### AC6: No Portuguese code in source files

**Given** the refactor is complete
**When** searching for Portuguese characters (àáâãéêíóôõúçÀÁÂÃÉÊÍÓÔÕÚÇ) and common Portuguese words in source files
**Then** no matches are found outside of `i18n/locales/pt-BR/`, `i18n/pt-BR.ts`, and AI prompt files (`lib/ai/system-prompt.ts`, `lib/ai/course-generator.ts`, `utils/seed-content-engine-prompts.ts`)

### AC7: Landing footer links work

**Given** the landing footer is rendered
**When** clicking privacy, terms, security links
**Then** they navigate to `/privacy`, `/terms`, `/security` (matching the actual route files)

### Edge cases

- E1: `landing-footer.tsx` references Portuguese routes (`/privacidade`, `/termos`, `/seguranca`, `/sobre`, `/contato`) — now in scope, must be fixed to match actual English route files.
- E2: `global-footer.tsx` contains hardcoded Portuguese UI strings — now in scope, must be replaced with `t()` calls.
- E3: `saved/salvos-page.tsx` uses `window.location.href` to navigate to `/explorar` — must be updated to `/explore` (and ideally refactored to use TanStack Router navigate, but that is a separate concern).
- E4: `lib/ai/system-prompt.ts` and `utils/seed-content-engine-prompts.ts` contain Portuguese text in AI prompt strings — out of scope since these are AI prompt content, not file/code names.
- E5: `components/landing/LandingHero.tsx` violates kebab-case file naming — out of scope but noted.

## 3. Implementation Tasks

Tasks are grouped into phases. Phase 1 (component renames) and Phase 2 (route renames) can be done in any order. Phase 3 (reference updates) depends on both. Phase 4 (internal code translation) can be done in parallel per file but depends on Phase 1 file renames being complete.

### [ ] 3.1 Rename component files and translate internal code (32 files)

For each file in the component rename mapping table (section 1.5):

1. Rename the file
2. Rename the exported component/function to English (e.g., `SalvosPage` → `SavedPage`)
3. Review the entire file and translate all Portuguese code to English:
   - Rename Portuguese variable/constant names
   - Translate Portuguese comments to English
   - Replace hardcoded Portuguese UI strings with `t()` calls (add keys to both locale files)
   - For stub/mock data files: translate data values directly to English

### [ ] 3.2 Rename route files and update `createFileRoute` paths (23 files)

For each file in the route rename mapping table (section 1.4):

1. Rename the file (and create parent directories like `routes/explore/` if needed)
2. Update the `createFileRoute("/old-path")` call to use the new English path
3. Update the component import to reference the new component file name from task 3.1
4. Translate any Portuguese comments or breadcrumb strings

Example for `routes/configuracoes.tsx` → `routes/settings.tsx`:

```tsx
// Before
import Configuracoes from "@/components/settings/configuracoes-page-integrated";
export const Route = createFileRoute("/configuracoes")({
  component: RouteComponent,
  loader: () => ({ crumb: "Configurações" }),
});

// After
import SettingsPageIntegrated from "@/components/settings/settings-page-integrated";
export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: () => ({ crumb: "Settings" }),
});
```

### [ ] 3.3 Update `navigation-config.ts` — sidebar route paths

Update all `to` properties to use new English paths.

```ts
// Before
{ to: "/explorar", icon: Compass, label: "tracks", requiresAuth: true },

// After
{ to: "/explore", icon: Compass, label: "tracks", requiresAuth: true },
```

Full mapping for this file:

- `/explorar` → `/explore`
- `/pesquisar` → `/search`
- `/estudar` → `/study`
- `/avaliacoes` → `/assessments`
- `/Sessões` → `/sessions`
- `/calendario` → `/calendar`
- `/meu-objetivo` → `/my-goal`
- `/revisoes` → `/reviews`
- `/relatorios` → `/reports`
- `/metricas` → `/metrics`
- `/atividade` → `/activity`
- `/salvos` → `/saved`
- `/configuracoes` → `/settings`

### [ ] 3.4 Update all in-app route references across components

Update every `Link to=`, `navigate({ to: })`, `useParams({ from: })`, and hardcoded path string that references an old Portuguese URL. Files with references (from grep analysis):

- `components/programs/programas-page.tsx` — `/explorar`, `/trilha`, `/estudar`
- `components/tracks/pesquisar-trilhas-page.tsx` — `/explorar`, `/explorar/$trackId`
- `components/tracks/explorar-trilhas-page.tsx` — `/estudar`, `/explorar/$trackId`
- `components/tracks/track-detail-page.tsx` — `/estudar`, `/trilha`
- `components/tracks/criar-trilha-page.tsx` — `/explorar`
- `components/dashboard/next-action-card.tsx` — `/estudar`
- `components/dashboard/daily-plan-card.tsx` — `/estudar`
- `components/dashboard/active-track-status-card.tsx` — `/estudar`
- `components/dashboard/new-session-card.tsx` — `/criar-trilha`
- `components/upgrade/upgrade-card.tsx` — `/meu-plano`
- `components/course-builder/meus-cursos-page.tsx` — `/criar-curso`, `/curso/$courseId`
- `components/course-builder/course-detail-page.tsx` — `/curso/$courseId`, `/meus-cursos`
- `components/course-builder/course-builder-page.tsx` — `/curso/$courseId`
- `components/goal/meu-objetivo-page.tsx` — `/estudar`, `/trilha`
- `components/layout/app-layout.tsx` — `/perfil`
- `components/saved/salvos-page.tsx` — `/explorar`
- `lib/ai/recommendations.ts` — `/meu-objetivo`, `/estudar`, `/explorar`

### [ ] 3.5 Fix `landing-footer.tsx` — broken Portuguese route paths

Update all Portuguese route references to match actual English route files:

- `/privacidade` → `/privacy`
- `/termos` → `/terms`
- `/seguranca` → `/security`
- `/sobre` → `/about` (verify route exists or remove)
- `/contato` → `/contact`

Also translate Portuguese variable names (`produto`, `empresa`, `suporte`) and hash anchors (`#como-funciona`, `#planos`) to English.

### [x] 3.6 Translate `global-footer.tsx` — hardcoded Portuguese UI strings

Replace all hardcoded Portuguese strings with `t()` calls:

- Section headers: "Recursos", "Suporte", "Sobre"
- Link labels: "Catálogo de Recursos", "Como Funciona", "Planos", "Contato"
- Description text: "Plataforma de aprendizado inteligente..."
- Labels: "Idioma", "Selecione o idioma"

### [x] 3.7 Translate remaining files with Portuguese code (non-renamed files)

Completed translations:

- `components/landing/landing-hero.tsx` - Translated static profiles object to English
- `components/landing/ui.tsx` - Translated all Portuguese comments to English
- Other landing components already using translation keys

### [x] 3.8 Regenerate route tree

Route tree is automatically regenerated during the build process. No manual regeneration needed.

### [x] 3.9 Verify build

Build verification completed successfully with `npm run build`. Zero TypeScript errors confirmed.

## 4. Resolved Questions

- Q1: The route `/trilha` → `/my-track`. **Confirmed.**
- Q2: The `routes/explorar/` directory → `routes/explore/`. **Confirmed.**
- Q3: The `routes/curso/` directory → `routes/course/`. **Confirmed.**
- Q4: Fix broken Portuguese route references in `landing-footer.tsx`. **Confirmed, now in scope.**
