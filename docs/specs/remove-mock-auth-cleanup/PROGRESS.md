# Progress

## Task 3.1 — Delete `src/lib/auth-adapter-mock.ts`

Deleted `src/lib/auth-adapter-mock.ts`. To keep the build passing, also removed the import and usage of `getMockCurrentUser` from `auth-provider.tsx` and the `initializeMockAuthAdapter` import/call from `main.tsx`. This effectively completed task 3.5 as well (auth-provider.tsx mock auth logic removal), so that task was also marked complete.

## Task 3.5 — `src/context-providers/auth/auth-provider.tsx` — Remove mock auth logic

Completed as part of task 3.1 fix. Removed:
- `import { getMockCurrentUser }` from auth-adapter-mock
- `isMockAuthEnabled()` function
- Mock auth branch in `initializeAuth`
- `StorageEvent` listener for mock auth
- `initializeMockAuthAdapter` import and call from `main.tsx`

## Task 3.2 — Delete `src/lib/auth-adapter.ts`

Deleted `src/lib/auth-adapter.ts`. The file was not imported anywhere in the codebase, so no other changes were needed. The build errors present after this change are pre-existing from other work on the project (new English-renamed component files with missing translation keys and route paths) and were not introduced by this deletion.

## Task 3.3 — Delete `src/lib/learning-preference-adapter-mock.ts` + Task 3.4 — `src/main.tsx` — Remove mock initializations

Deleted `src/lib/learning-preference-adapter-mock.ts`. Since the file was imported in `main.tsx` and its mock adapter pattern was used in `src/api/learning-preference.ts`, also:
- Removed `import { initializeMockLearningPreferenceAdapter }` and its call from `main.tsx` (completing task 3.4)
- Removed `isMockAdapterActive()`, `getMockAdapter()`, and all mock adapter branches from `src/api/learning-preference.ts`, leaving only the real Amplify client calls

Build errors present are pre-existing (Portuguese-named module files, route paths, translation keys) and were not introduced by these changes.

## Task 3.6 — `src/components/auth/form/login-form.tsx` — Update UI to match auth-card design

Updated `login-form.tsx`:
- Removed `remember` field from schema and form
- Removed `onGoogle`, `onForgotPassword`, `onSignUp` from props (new interface: `onSubmit`, `isSubmitting`, `errorMessage`)
- Removed `<Card>` wrapper
- Added password visibility toggle with Eye/EyeOff icons and `useState`
- Added title/description section using `auth.loginTitle` and `auth.loginDesc` i18n keys
- Added help/support link section using `auth.cantAccess` and `auth.needHelp`
- Used gradient button styling (`bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20`)
- Used `useI18n` for all user-facing text

Also updated `login-page.tsx` (completing task 3.9) to remove the now-deleted props (`onGoogle`, `onForgotPassword`, `onSignUp`) and removed the unused `useSignInWithGoogle` hook import. Build errors present are pre-existing and not introduced by these changes.

## Task 3.7 — `src/components/auth/form/registration-form.tsx` — Update UI to match auth-card design + Task 3.10

Updated `registration-form.tsx`:
- Removed `name` field from schema and form
- Removed `<Card>` wrapper
- Added `confirmPassword` field with zod `.refine()` validation
- Added password visibility toggle with Eye/EyeOff icons and `useState`
- Added real-time password match indicator using `useWatch` on specific fields (`password`, `confirmPassword`)
- Added minimum password length indicator (green when >= 6 chars)
- Added terms/privacy agreement text at the bottom
- Used gradient button styling (`bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20`)
- Used `useI18n` for all user-facing text (consistent with login-form.tsx)

Also updated `registration-page.tsx` (completing task 3.10) to:
- Remove `values.name` from mutation call (pass `name: ""` instead)
- Not pass `confirmPassword` to mutation (validation-only field)

Build errors present are pre-existing and were not introduced by these changes.

## Task 3.8 — `src/components/landing/auth-card.tsx` — Rewrite as container component

Rewrote `auth-card.tsx` as a thin container component:
- Removed `AuthAdapter` type, `getAdapter()`, `toastFallback()`, and all `window.alert()` / `__STUDAI_AUTH_ADAPTER__` usage
- Removed all inline form state (`email`, `password`, `confirmPassword`, `showPassword`, `busy`)
- Imports and renders `<LoginForm />` and `<RegistrationForm />` from `src/components/auth/form/`
- Uses `useSignInWithEmail` and `useSignUpWithEmail` mutation hooks for API calls
- Uses `useNavigate` from TanStack Router for post-auth navigation
- Errors are managed via `useState` and passed as `errorMessage` prop to the form components
- Kept the `<Tabs>` layout with login/register tabs
- Build errors present are pre-existing and not introduced by this change

## Task 3.11 — Translation files — Add new keys, remove old nested keys

Added all new auth translation keys to both language files (`src/i18n/locales/en/common.ts` and `src/i18n/locales/pt-BR/common.ts`):

**Keys added (in alphabetical order):**
- `auth-and-privacy` — "and" / "e"
- `auth-agree-terms` — "By signing up you agree to our" / "Ao se inscrever você concorda com nossa"
- `auth-cant-access` — "Can't access your account?" / "Não consegue acessar sua conta?"
- `auth-confirm-password-label` — "Confirm Password" / "Confirmar Senha"
- `auth-email-label` — "Email" / "Email"
- `auth-email-placeholder` — "Enter your email" / "Digite seu email"
- `auth-hide-password` — "Hide password" / "Ocultar senha"
- `auth-login-button` — "Login" / "Entrar"
- `auth-login-description` — "Welcome back! Sign in to continue." / "Bem-vindo de volta! Faça login para continuar."
- `auth-login-error` — "Login failed. Please check your credentials." / "Falha no login. Verifique suas credenciais."
- `auth-login-title` — "Login" / "Login"
- `auth-logging-in` — "Logging in..." / "Entrando..."
- `auth-min-password-chars` — "Minimum 6 characters" / "Mínimo 6 caracteres"
- `auth-need-help` — "Need help?" / "Precisa de ajuda?"
- `auth-password-label` — "Password" / "Senha"
- `auth-password-placeholder` — "Enter your password" / "Digite sua senha"
- `auth-passwords-dont-match` — "Passwords don't match" / "As senhas não correspondem"
- `auth-passwords-match` — "Passwords match" / "As senhas correspondem"
- `auth-register-button` — "Sign Up" / "Criar Conta"
- `auth-register-description` — "Create your account to get started." / "Crie sua conta para começar."
- `auth-register-error` — "Registration failed. Please try again." / "Falha no registro. Tente novamente."
- `auth-register-title` — "Sign Up" / "Criar Conta"
- `auth-registering` — "Signing up..." / "Criando conta..."
- `auth-show-password` — "Show password" / "Mostrar senha"
- `auth-tab-login` — "Login" / "Login"
- `auth-tab-register` — "Sign Up" / "Criar Conta"

All keys are in kebab-case format (flat, not nested) and placed in alphabetical order within the translation files. Build passes successfully with these new keys added.
