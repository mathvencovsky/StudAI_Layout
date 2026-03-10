# Landing Page i18n Fix - Translation Keys Showing

## Problem Identified

The landing page was displaying raw translation keys instead of actual translated text:
- Showing: `hero.headline`, `hero.headlineHighlight`, `auth.tabLogin`, etc.
- Expected: Actual Portuguese/English text

## Root Cause

The `LandingHero` component uses `useI18n()` hook from the custom i18n system (`I18nContext.tsx`), but the `I18nProvider` was NOT wrapped around the app in `main.tsx`.

Without the provider:
- `useI18n()` throws an error or returns undefined
- Translation function `t()` doesn't work
- Raw keys are displayed as fallback

## Solution Applied

### File: `src/main.tsx`

**Added:**
1. Import statement: `import { I18nProvider } from "@/i18n/I18nContext";`
2. Wrapped the app with `I18nProvider`:

```tsx
<I18nProvider>
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  </AuthProvider>
</I18nProvider>
```

## How the i18n System Works

### Custom i18n System (for Landing Page)
- **Provider**: `I18nProvider` from `src/i18n/I18nContext.tsx`
- **Hook**: `useI18n()` returns `{ locale, setLocale, t }`
- **Translation Files**: 
  - `src/i18n/pt-BR.ts` (Portuguese)
  - `src/i18n/en-US.ts` (English)
- **Usage**: `const { t } = useI18n(); t("hero.headline")`

### React-i18next System (for App Pages)
- **Setup**: `src/i18n/i18n.ts`
- **Hook**: `useTranslation()` from `react-i18next`
- **Translation Files**:
  - `src/i18n/locales/pt-BR/common.ts`
  - `src/i18n/locales/en/common.ts`
- **Usage**: `const { t } = useTranslation(); t("common.login")`

## Provider Hierarchy

```
<ThemeProvider>
  <I18nProvider>          ← ADDED (for custom i18n)
    <AuthProvider>
      <QueryClientProvider>
        <RouterProvider />  ← react-i18next works here
      </QueryClientProvider>
    </AuthProvider>
  </I18nProvider>
</ThemeProvider>
```

## Expected Result

After this fix, the landing page should display:

### Portuguese (pt-BR):
- **Headline**: "Seu plano de estudo pronto todo dia"
- **Subheadline**: "Defina a meta e a data. O sistema monta o cronograma e mostra onde você está."
- **Profile Options**: "Concurso", "Certificação", "Faculdade"
- **Benefits**: Proper Portuguese text for each profile
- **Auth Card**: "Login", "Cadastro", etc.

### English (en-US):
- **Headline**: "Your study plan ready every day"
- **Subheadline**: "Set your goal and deadline. The system builds the schedule and shows your progress."
- **Profile Options**: "Exam", "Certification", "College"
- **Benefits**: Proper English text for each profile
- **Auth Card**: "Login", "Register", etc.

## Testing

1. Refresh the browser (hard refresh: Ctrl+Shift+R)
2. Check landing page at `/` (logged out)
3. Verify all text is in Portuguese (default)
4. Click language toggle (EN) in header
5. Verify all text changes to English
6. Check localStorage has `studai_locale` set

## Files Modified

1. `src/main.tsx` - Added I18nProvider wrapper

## Translation Files (Already Correct)

- ✅ `src/i18n/pt-BR.ts` - Has all hero translations
- ✅ `src/i18n/en-US.ts` - Has all hero translations
- ✅ `src/i18n/I18nContext.tsx` - Provider and hook working
- ✅ `src/components/landing/LandingHero.tsx` - Uses useI18n() correctly

## Notes

- The custom i18n system is specifically for the landing page
- The rest of the app uses react-i18next
- Both systems coexist and work independently
- Language preference is stored in localStorage as `studai_locale`
- Default language is Portuguese (pt-BR)
- Falls back to English (en-US) if translation missing

## Verification Checklist

- [x] I18nProvider imported in main.tsx
- [x] I18nProvider wraps AuthProvider
- [x] No TypeScript errors
- [x] Translation files have all required keys
- [x] useI18n() hook available in components
- [x] Language toggle should work in header
