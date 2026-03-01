import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  onGoogleSignIn?: () => void;
}

/**
 * Login form component without Card wrapper.
 * Parent is responsible for providing the card container.
 */
export const LoginForm = ({
  onSubmit,
  isSubmitting,
  errorMessage,
  onGoogleSignIn,
}: LoginFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <h3 className="text-lg font-extrabold text-foreground">
          {t("auth-login-title")}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("auth-login-description")}
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold">
            {t("auth-email-label")}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth-email-placeholder")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-semibold">
            {t("auth-password-label")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("auth-password-placeholder")}
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={
                showPassword ? t("auth-hide-password") : t("auth-show-password")
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-bold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
      >
        {isSubmitting ? t("auth-logging-in") : t("auth-login-button")}
      </Button>

      {onGoogleSignIn && (
        <>
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">{t("auth-or")}</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={onGoogleSignIn}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("auth-sign-in-with-google")}
          </Button>
        </>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold">{t("auth-cant-access")}</span>
        <a
          href="mailto:support@studai.app"
          className="inline-flex items-center gap-1 font-bold hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          {t("auth-need-help")}
        </a>
      </div>
    </form>
  );
};
