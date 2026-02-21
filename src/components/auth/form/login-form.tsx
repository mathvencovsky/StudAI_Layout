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
}

/**
 * Login form component without Card wrapper.
 * Parent is responsible for providing the card container.
 */
export const LoginForm = ({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) => {
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
        <h3 className="text-lg font-extrabold text-foreground">{t("auth-login-title")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t("auth-login-description")}</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold">{t("auth-email-label")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth-email-placeholder")}
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-semibold">{t("auth-password-label")}</Label>
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
              aria-label={showPassword ? t("auth-hide-password") : t("auth-show-password")}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-bold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
      >
        {isSubmitting ? t("auth-logging-in") : t("auth-login-button")}
      </Button>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold">{t("auth-cant-access")}</span>
        <a
          href="mailto:support@studi.app"
          className="inline-flex items-center gap-1 font-bold hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          {t("auth-need-help")}
        </a>
      </div>
    </form>
  );
};
