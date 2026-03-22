# Technical Spec: Remove Mock Auth & Unify Auth Forms

## 0. Summary

**Goal:** Remove all mock/fake auth infrastructure (`__STUDAI_AUTH_ADAPTER__`, localStorage-based mock auth, mock learning preference adapter) and unify the auth UI so that `auth-card.tsx` (landing page) reuses the form components from `src/components/auth/form/`, updating those form components to match the auth-card's superior UI design.

**Out of scope:** Adding new auth flows (e.g., OAuth providers, MFA), changing the Amplify auth configuration, or modifying the verify-email or password-reset flows.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required.

### 1.2 Type definitions

No new type definitions. The existing types in `src/api/auth.ts` and `src/context-providers/auth/auth-context.ts` remain unchanged.

### 1.3 API / Data fetching changes

No changes to `src/api/auth.ts` or the existing mutation hooks (`use-sign-in-email.ts`, `use-sign-up-email.ts`, etc.). These already call real Amplify APIs and are correct.

### 1.4 Page changes

#### `src/routes/index.tsx` (landing page)

No route changes. The landing page already renders `<LandingPage />` which contains `<AuthCard />`. The auth-card will be refactored to use the updated form components.

### 1.5 Component changes

#### 1.5.1 Update `src/components/auth/form/login-form.tsx`

Update the login form to match the auth-card's UI design:

- **Add** password visibility toggle (Eye/EyeOff icon button)
- **Remove** "Remember Me" checkbox and related logic
- **Remove** "Continue with Google" button (not present in auth-card)
- **Remove** "Sign Up" button (tab switching handles this in auth-card)
- **Remove** "Forgot Password?" link (auth-card has a "Need help?" mailto link instead)
- **Add** help/support link section at the bottom
- **Update** submit button to use gradient styling (`bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20`)
- **Use** i18n translations for all text (via `useTranslation`)
- **Remove** the wrapping `<Card>` — the parent (`auth-card.tsx`) provides the card wrapper
- **Add** title and description text above the form fields

Updated props interface:

```tsx
export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}
```

Updated schema (remove `remember`):

```tsx
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
```

Summarized structure:

```tsx
export const LoginForm = ({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h3>{t("auth-login-title")}</h3>
        <p>{t("auth-login-description")}</p>
      </div>
      {/* Email field */}
      {/* Password field with Eye/EyeOff toggle */}
      {/* Error message display */}
      {/* Gradient submit button */}
      {/* Help/support link */}
    </form>
  );
};
```

#### 1.5.2 Update `src/components/auth/form/registration-form.tsx`

Update the registration form to match the auth-card's UI design:

- **Remove** the `name` field (auth-card does not collect name at registration)
- **Add** password visibility toggle (Eye/EyeOff icon button)
- **Add** confirm password field with real-time match indicator
- **Add** minimum password length indicator (shows green when >= 6 chars)
- **Add** terms of service and privacy policy agreement text at the bottom
- **Update** submit button to use gradient styling
- **Use** i18n translations for all text
- **Remove** the wrapping `<Card>` — the parent provides the card wrapper
- **Add** title and description text above the form fields

Updated schema:

```tsx
const registrationSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords-dont-match",
  path: ["confirmPassword"],
});
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
```

Updated props interface:

```tsx
export interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormValues) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}
```

Summarized structure:

```tsx
export const RegistrationForm = ({ onSubmit, isSubmitting, errorMessage }: RegistrationFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  });
  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h3>{t("auth-register-title")}</h3>
        <p>{t("auth-register-description")}</p>
      </div>
      {/* Email field */}
      {/* Password field with Eye/EyeOff toggle + min chars indicator */}
      {/* Confirm password field with match indicator */}
      {/* Error message display */}
      {/* Gradient submit button */}
      {/* Terms & privacy text */}
    </form>
  );
};
```

#### 1.5.3 Rewrite `src/components/landing/auth-card.tsx`

Rewrite to be a container component that:

- Uses `<Tabs>` to switch between login and register
- Renders `<LoginForm />` and `<RegistrationForm />` from `src/components/auth/form/`
- Uses the existing mutation hooks (`useSignInWithEmail`, `useSignUpWithEmail`) for API calls
- Uses `useNavigate` from TanStack Router instead of `window.location.reload()`
- Displays errors using state (no `window.alert()`)

```tsx
export const AuthCard = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"login" | "register">("register");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signInMutation = useSignInWithEmail();
  const signUpMutation = useSignUpWithEmail();

  const handleLogin = async (values: LoginFormValues) => {
    setError(null);
    try {
      await signInMutation.mutateAsync({ email: values.email, password: values.password });
      navigate({ to: "/" });
    } catch (e) {
      console.error(e);
      setError(t("auth-login-error"));
    }
  };

  const handleRegister = async (values: RegistrationFormValues) => {
    setError(null);
    try {
      await signUpMutation.mutateAsync({ email: values.email, password: values.password, name: "" });
      navigate({ to: "/verify-email", search: { email: values.email } });
    } catch (e) {
      console.error(e);
      setError(t("auth-register-error"));
    }
  };

  return (
    <Card id="auth-card">
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="login">{t("auth-tab-login")}</TabsTrigger>
            <TabsTrigger value="register">{t("auth-tab-register")}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm
              onSubmit={handleLogin}
              isSubmitting={signInMutation.isPending}
              errorMessage={tab === "login" ? error : null}
            />
          </TabsContent>
          <TabsContent value="register">
            <RegistrationForm
              onSubmit={handleRegister}
              isSubmitting={signUpMutation.isPending}
              errorMessage={tab === "register" ? error : null}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
```

#### 1.5.4 Update `src/context-providers/auth/auth-provider.tsx`

Remove all mock auth logic:

- Remove `import { getMockCurrentUser }` from auth-adapter-mock
- Remove `isMockAuthEnabled()` function
- Remove the mock auth branch in `initializeAuth`
- Remove the `StorageEvent` listener for mock auth
- Keep only the Amplify auth flow (`getCurrentUser` + `fetchUserAttributes` + Hub listener)

#### 1.5.5 Update `src/components/auth/pages/login-page.tsx`

Update to match the new `LoginFormProps` (remove `onGoogle`, `onForgotPassword`, `onSignUp` since those are no longer props on `LoginForm`).

#### 1.5.6 Update `src/components/auth/pages/registration-page.tsx`

Update to handle the new `RegistrationFormValues` (no longer has `name` field, now has `confirmPassword`). Pass `name: ""` to the mutation since the API still accepts it.

### 1.6 Translation keys

New keys needed (add to all language files):

- `auth-tab-login` — Tab label for login
- `auth-tab-register` — Tab label for register
- `auth-login-title` — Login form title heading
- `auth-login-description` — Login form subtitle
- `auth-register-title` — Registration form title heading
- `auth-register-description` — Registration form subtitle
- `auth-email-label` — Email field label
- `auth-email-placeholder` — Email field placeholder
- `auth-password-label` — Password field label
- `auth-password-placeholder` — Password field placeholder
- `auth-confirm-password-label` — Confirm password field label
- `auth-min-password-chars` — "Minimum 6 characters" indicator text
- `auth-passwords-match` — "Passwords match" indicator text
- `auth-passwords-dont-match` — "Passwords don't match" indicator text
- `auth-show-password` — Accessibility label for show password button
- `auth-hide-password` — Accessibility label for hide password button
- `auth-login-button` — Login submit button text
- `auth-logging-in` — Login submit button loading text
- `auth-register-button` — Register submit button text
- `auth-registering` — Register submit button loading text
- `auth-login-error` — User-friendly login error message
- `auth-register-error` — User-friendly registration error message
- `auth-cant-access` — "Can't access your account?" text
- `auth-need-help` — "Need help?" link text
- `auth-agree-terms` — "By signing up you agree to our" text
- `auth-and-privacy` — "and" conjunction before privacy link

Existing keys from `auth-card.tsx` that use the `auth.` nested format should be migrated to the flat kebab-case format above. Remove the old nested keys after migration.

## 1.7. Sidebar

No sidebar changes required.

## 2. Acceptance Criteria

### AC1: Landing page auth card uses real Amplify auth

**Given** a user visits the landing page while not authenticated
**When** they fill in the login form and submit
**Then** the app calls `signInWithEmailApi` from `src/api/auth.ts` (not the adapter) and navigates on success

### AC2: Registration flow works end-to-end

**Given** a user is on the landing page register tab
**When** they fill in email, password, confirm password and submit
**Then** the app calls `signUpWithEmailApi` and navigates to `/verify-email` with the email as a search param

### AC3: No mock auth code remains

**Given** the codebase after implementation
**When** searching for `__STUDAI_AUTH_ADAPTER__`, `mockAuth`, `auth-adapter-mock`, `initializeMockAuthAdapter`, `learning-preference-adapter-mock`, or `initializeMockLearningPreferenceAdapter`
**Then** zero results are found

### AC4: Auth provider uses only Amplify

**Given** the app starts
**When** `AuthProvider` initializes
**Then** it only uses `getCurrentUser` and `fetchUserAttributes` from Amplify (no localStorage mock fallback)

### AC5: No `window.alert()` usage in auth flows

**Given** any auth error occurs (login, register)
**When** the error is displayed
**Then** it is shown inline in the form via state, not via `window.alert()`

### AC6: Password visibility toggle works

**Given** a user is on the login or register form
**When** they click the eye icon next to the password field
**Then** the password input toggles between `type="password"` and `type="text"`

### AC7: Confirm password validation works

**Given** a user is on the register form
**When** they type a confirm password that doesn't match the password
**Then** a "passwords don't match" indicator is shown in real-time

### AC8: Form components are reusable without Card wrapper

**Given** `LoginForm` or `RegistrationForm` is rendered
**When** used in the landing auth-card (inside `<Card>`) or in standalone pages
**Then** the form renders correctly in both contexts because it does not include its own `<Card>` wrapper

### Edge cases

- E1: User submits login with incorrect credentials — error message shown inline, form remains usable
- E2: User submits registration with an already-registered email — error message shown inline
- E3: Password and confirm password mismatch — zod validation prevents submission, real-time indicator shown
- E4: Network failure during auth — error caught, user-friendly message displayed, technical error logged to console

## 3. Implementation Tasks

### [x] 3.1 `src/lib/auth-adapter-mock.ts` — Delete file

Delete the entire mock auth adapter file.

### [x] 3.2 `src/lib/auth-adapter.ts` — Delete file

Delete the entire Amplify auth adapter file. The real auth logic already lives in `src/api/auth.ts`.

### [x] 3.3 `src/lib/learning-preference-adapter-mock.ts` — Delete file

Delete the entire mock learning preference adapter file.

### [x] 3.4 `src/main.tsx` — Remove mock initializations

- Remove `import { initializeMockAuthAdapter }` and its call
- Remove `import { initializeMockLearningPreferenceAdapter }` and its call

```tsx
// Remove these lines:
// import { initializeMockAuthAdapter } from "@/lib/auth-adapter-mock";
// import { initializeMockLearningPreferenceAdapter } from "@/lib/learning-preference-adapter-mock";
// initializeMockAuthAdapter();
// initializeMockLearningPreferenceAdapter();
```

### [x] 3.5 `src/context-providers/auth/auth-provider.tsx` — Remove mock auth logic

- Remove `import { getMockCurrentUser }` from auth-adapter-mock
- Remove `isMockAuthEnabled()` function
- Remove the mock auth branch inside `initializeAuth`
- Remove the `StorageEvent` listener
- Keep only the Amplify auth path

### [x] 3.6 `src/components/auth/form/login-form.tsx` — Update UI to match auth-card design

- Remove `remember` field from schema and form
- Remove `onGoogle`, `onForgotPassword`, `onSignUp` from props
- Remove `<Card>` wrapper
- Add password visibility toggle with Eye/EyeOff icons
- Add title/description section
- Add help/support link section
- Use gradient button styling
- Use i18n translations for all text

### [x] 3.7 `src/components/auth/form/registration-form.tsx` — Update UI to match auth-card design

- Remove `name` field from schema and form
- Remove `<Card>` wrapper
- Add `confirmPassword` field with zod `.refine()` validation
- Add password visibility toggle with Eye/EyeOff icons
- Add real-time password match indicator using `useWatch`
- Add minimum password length indicator
- Add terms/privacy agreement text
- Use gradient button styling
- Use i18n translations for all text

### [x] 3.8 `src/components/landing/auth-card.tsx` — Rewrite as container component

- Remove the local `AuthAdapter` type and `getAdapter()` function
- Remove `toastFallback` and all `window.alert()` usage
- Remove all inline form state (`email`, `password`, `confirmPassword`, `showPassword`)
- Import and render `<LoginForm />` and `<RegistrationForm />` from `src/components/auth/form/`
- Use `useSignInWithEmail` and `useSignUpWithEmail` mutation hooks
- Use `useNavigate` from TanStack Router for navigation after auth
- Keep the `<Tabs>` layout wrapping the two forms

### [x] 3.9 `src/components/auth/pages/login-page.tsx` — Update for new LoginForm props

- Remove `onGoogle`, `onForgotPassword`, `onSignUp` props passed to `<LoginForm />`
- Keep the mutation logic and error handling

### [x] 3.10 `src/components/auth/pages/registration-page.tsx` — Update for new RegistrationForm props

- Handle the fact that `RegistrationFormValues` no longer has `name` (pass `name: ""` to mutation)
- Handle the new `confirmPassword` field (not passed to mutation, only used for validation)

### [x] 3.11 Translation files — Add new keys, remove old nested keys

- Add all keys listed in section 1.6 to every language file
- Remove the old `auth.*` nested keys that were used by the previous auth-card implementation
- Keep keys alphabetically ordered

## 4. Open Questions and missing details

- Q1: Should the standalone login page (`/login` route via `login-page.tsx`) also have the same gradient styling and layout as the landing auth-card, or keep a simpler look? The spec assumes they share the same form components so they will look the same minus the tabs wrapper.
- Q2: The current `signUpWithEmailApi` requires a `name` parameter. Since the auth-card registration form doesn't collect a name, should we pass an empty string, derive it from the email, or update the API to make name optional?
- Q3: The old auth-card had translation keys in `auth.tabLogin` nested format. Are there other components using these keys that need updating, or are they only used in `auth-card.tsx`?
- Q4: The `learning-preference-adapter-mock.ts` is being deleted — are there any API calls in the learning preference hooks that fall back to this mock adapter? If so, those need to be updated to only use the real Amplify API.
