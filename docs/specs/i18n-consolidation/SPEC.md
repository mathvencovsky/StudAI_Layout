# Technical Spec: i18n Consolidation

## 0. Summary

**Goal:** Remove the duplicate custom i18n system (`I18nContext.tsx`, `en-US.ts`, `pt-BR.ts`, `types.ts`, `landing-index.ts`, `use-i18n.ts`, `react-i18next.d.ts`) and consolidate all translations into the existing `react-i18next` setup under `src/i18n/locales/`, fixing key format, alphabetical ordering, and duplicates along the way.

**Out of scope:** Changing the actual translation text content, adding new languages, or modifying the landing page visual design.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required.

### 1.2 Type definitions

**Delete `src/i18n/types.ts`** — This file manually defines a `TranslationKeys` type with every key listed as `string`. This violates the guideline against custom interfaces when types can be inferred.

**Rewrite `src/@types/i18next.d.ts`** — Currently merges the custom `TranslationKeys` type with the locale module type. After removing `types.ts`, it should only reference the locale file:

```ts
import "i18next";
import common from "@/i18n/locales/en/common.ts";
import { defaultNS } from "@/i18n/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      common: typeof common;
    };
  }
}
```

**Delete `src/i18n/react-i18next.d.ts`** — Uses `any` type which violates TypeScript guidelines. The `src/@types/i18next.d.ts` file already handles type augmentation correctly.

### 1.3 API / Data fetching changes

No API or data fetching changes required.

### 1.4 Page changes

No page-level route changes required. The landing page components that consume i18n are addressed in section 1.5.

### 1.5 Component changes

**11 landing page components** need to replace `useI18n()` with `useTranslation()` from `react-i18next`. All translation key references must be updated from dot-notation to kebab-case.

Components that only use `t`:

- `src/components/landing/final-cta.tsx`
- `src/components/landing/trust-section.tsx`
- `src/components/landing/pricing-section.tsx`
- `src/components/landing/faq-section.tsx`
- `src/components/landing/auth-card.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/LandingHero.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/logo-strip-section.tsx`

Before:

```tsx
import { useI18n } from "@/i18n";

const { t } = useI18n();
return <h1>{t("hero.headline")}</h1>;
```

After:

```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
return <h1>{t("hero-headline")}</h1>;
```

Components that use `t`, `locale`, and `setLocale`:

- `src/components/landing/landing-header.tsx`
- `src/components/landing/landing-footer.tsx`

These need both `useTranslation` and `useLocale`:

Before:

```tsx
import { useI18n } from "@/i18n";

const { t, locale, setLocale } = useI18n();
```

After:

```tsx
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/use-locale";

const { t } = useTranslation();
const [locale, setLocale] = useLocale();
```

**Rename `LandingHero.tsx`** to `landing-hero.tsx` to follow the kebab-case file naming guideline.

### 1.6 Translation keys

All landing page translation keys from `en-US.ts` / `pt-BR.ts` must be migrated into `locales/en/common.ts` and `locales/pt-BR/common.ts` with the key format changed from dot-notation to kebab-case.

Key format mapping (examples):

| Old key (dot-notation)        | New key (kebab-case)          |
| ----------------------------- | ----------------------------- |
| `common.startFree`            | `common-start-free`           |
| `common.login`                | `common-login`                |
| `header.product`              | `header-product`              |
| `header.howItWorks`           | `header-how-it-works`         |
| `hero.kicker`                 | `hero-kicker`                 |
| `hero.headline`               | `hero-headline`               |
| `hero.headlineHighlight`      | `hero-headline-highlight`     |
| `hero.concurso.benefit1`      | `hero-concurso-benefit1`      |
| `product.feature1.title`      | `product-feature1-title`      |
| `howItWorks.step1.title`      | `how-it-works-step1-title`    |
| `trust.card1.title`           | `trust-card1-title`           |
| `testimonials.concurso.quote` | `testimonials-concurso-quote` |
| `pricing.free.name`           | `pricing-free-name`           |
| `faq.concurso.q`              | `faq-concurso-q`              |
| `finalCta.kicker`             | `final-cta-kicker`            |
| `auth.loginTitle`             | `auth-login-title`            |
| `auth.toast.fillFields`       | `auth-toast-fill-fields`      |
| `footer.tagline`              | `footer-tagline`              |
| `pricing.waitlistSubject`     | `pricing-waitlist-subject`    |

This applies to all ~200 landing page keys in `en-US.ts` / `pt-BR.ts`.

Additionally, duplicate keys that already exist in `locales/en/common.ts` at the bottom of the file (pricing, metrics, search-tracks, search, programs, my-courses, engagement, profile, saved sections) must be deduplicated.

After merging, all keys in both locale files must be sorted alphabetically.

## 1.7. Sidebar

No sidebar changes required.

## 2. Acceptance Criteria

### AC1: Custom i18n system removed

**Given** the codebase after implementation
**When** searching for imports of `I18nContext`, `landing-index`, `useI18n`, or `types` from `@/i18n`
**Then** no results are found; only `react-i18next` hooks are used for translations.

### AC2: All landing page translations work

**Given** a user visits the landing page
**When** the page renders in English or Portuguese
**Then** all text is correctly translated with no missing keys shown.

### AC3: Language switching works on landing page

**Given** a user is on the landing page
**When** they click the language toggle in the header or footer
**Then** all landing page text switches to the selected language.

### AC4: App translations unaffected

**Given** a logged-in user navigating the app
**When** they use any feature (modules, tracks, content, etc.)
**Then** all translations continue to work as before.

### AC5: TypeScript compilation passes

**Given** the codebase after implementation
**When** running `tsc --noEmit`
**Then** no type errors are reported.

### AC6: Translation keys follow guidelines

**Given** the locale files after implementation
**When** inspecting the keys
**Then** all keys use lowercase kebab-case, are in alphabetical order, and there are no duplicates.

### Edge cases

- E1: Keys that exist in both `en-US.ts` and `locales/en/common.ts` with different values — use the value from `locales/en/common.ts` (the original correct system) as the source of truth.
- E2: The `pricing.waitlistBody` key uses `{profile}` (single braces) instead of `{{profile}}` — fix to use `{{profile}}` for i18next interpolation.
- E3: The `landing-header.tsx` and `landing-footer.tsx` use `locale` and `setLocale` — ensure `useLocale` hook provides the same behavior.

## 3. Implementation Tasks

### [ ] 3.1 `src/i18n/locales/en/common.ts` - Merge landing page translations and deduplicate

- Copy all keys from `en-US.ts` into this file, converting from dot-notation to kebab-case
- Remove duplicate keys that appear twice at the bottom of the file
- Sort all keys alphabetically
- Fix `pricing-waitlist-body` to use `{{profile}}` interpolation

### [ ] 3.2 `src/i18n/locales/pt-BR/common.ts` - Merge landing page translations and deduplicate

- Copy all keys from `pt-BR.ts` into this file, converting from dot-notation to kebab-case
- Sort all keys alphabetically
- Fix `pricing-waitlist-body` to use `{{profile}}` interpolation

### [ ] 3.3 `src/@types/i18next.d.ts` - Remove dependency on custom types

Remove the import of `TranslationKeys` from `@/i18n/types` and the merged `AppResources` type:

```ts
import "i18next";
import common from "@/i18n/locales/en/common.ts";
import { defaultNS } from "@/i18n/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      common: typeof common;
    };
  }
}
```

### [ ] 3.4 `src/i18n/index.ts` - Remove useI18n export

Update to only export from the correct `i18n.ts`:

```ts
export { i18n, supportedLocales, defaultNS } from "./i18n";
export type { SupportedLocale } from "./i18n";
```

### [ ] 3.5 `src/components/landing/landing-header.tsx` - Replace useI18n with useTranslation + useLocale

```tsx
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/use-locale";

const { t } = useTranslation();
const [locale, setLocale] = useLocale();
```

Update all `t("dot.notation")` calls to `t("kebab-case")`.

### [ ] 3.6 `src/components/landing/landing-footer.tsx` - Replace useI18n with useTranslation + useLocale

Same pattern as landing-header.tsx. Update all translation key references.

### [ ] 3.7 `src/components/landing/LandingHero.tsx` - Replace useI18n with useTranslation

- Replace `useI18n` import with `useTranslation` from `react-i18next`
- Update all translation key references to kebab-case
- Rename file to `landing-hero.tsx`
- Update any imports of this file elsewhere

### [ ] 3.8 Landing components (9 remaining) - Replace useI18n with useTranslation

For each of these files, replace `useI18n` with `useTranslation` and update all key references:

- `src/components/landing/final-cta.tsx`
- `src/components/landing/trust-section.tsx`
- `src/components/landing/pricing-section.tsx`
- `src/components/landing/faq-section.tsx`
- `src/components/landing/auth-card.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/logo-strip-section.tsx`

### [ ] 3.9 Delete custom i18n files

Delete the following files:

- `src/i18n/I18nContext.tsx`
- `src/i18n/en-US.ts`
- `src/i18n/pt-BR.ts`
- `src/i18n/types.ts`
- `src/i18n/landing-index.ts`
- `src/i18n/use-i18n.ts`
- `src/i18n/react-i18next.d.ts`
- `src/i18n/locales/pt-BR/common.ts.backup`

### [ ] 3.10 Verify build

- Run TypeScript compilation to confirm no type errors
- Run the dev server and verify landing page renders correctly in both languages
- Verify app pages still translate correctly

## 4. Open Questions and missing details

- Q1: Are there any other entry points (e.g., a separate landing page build) that import from `landing-index.ts`? A search shows no external consumers, but this should be confirmed.
- Q2: The `locales/en/common.ts` file uses `export default { ... } as const` while `en-US.ts` uses `export const enUS: TranslationKeys = { ... }`. After merging, the file should keep the `export default { ... } as const` pattern to preserve type inference. Yes, should not use TranslationKeys, but as const
- Q3: Some landing page keys reference section anchors in Portuguese (e.g., `href: "#produto"`, `href: "#como-funciona"`). These are hardcoded in the component, not translation keys — should they be translated or left as-is? Should be translated.
