import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const registrationSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords-dont-match",
    path: ["confirmPassword"],
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormValues) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

/**
 * Registration form component without Card wrapper.
 * Parent is responsible for providing the card container.
 */
export const RegistrationForm = ({
  onSubmit,
  isSubmitting,
  errorMessage,
}: RegistrationFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrationFormValues>({ resolver: zodResolver(registrationSchema) });

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const minPasswordOk = (password ?? "").length >= 6;
  const passwordsMatch =
    password === confirmPassword && (confirmPassword ?? "").length > 0;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <h3 className="text-lg font-extrabold text-foreground">
          {t("auth-register-title")}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{t("auth-register-description")}</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="reg-email" className="font-semibold">
            {t("auth-email-label")}
          </Label>
          <Input
            id="reg-email"
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
          <Label htmlFor="reg-password" className="font-semibold">
            {t("auth-password-label")}
          </Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth-min-password-chars")}
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={showPassword ? t("auth-hide-password") : t("auth-show-password")}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p
            className={cn(
              "text-xs font-semibold",
              minPasswordOk ? "text-success" : "text-muted-foreground"
            )}
          >
            {t("auth-min-password-chars")}
          </p>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-confirm-password" className="font-semibold">
            {t("auth-confirm-password-label")}
          </Label>
          <Input
            id="reg-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("auth-min-password-chars")}
            {...register("confirmPassword")}
          />
          {(confirmPassword ?? "").length > 0 && (
            <p
              className={cn(
                "text-xs font-semibold",
                passwordsMatch ? "text-success" : "text-destructive"
              )}
            >
              {passwordsMatch
                ? t("auth-passwords-match")
                : t("auth-passwords-dont-match")}
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
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
        {isSubmitting ? t("auth-registering") : t("auth-register-button")}
      </Button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {t("auth-agree-terms")}{" "}
        <a className="font-bold hover:text-foreground underline" href="/terms">
          {t("common-terms")}
        </a>{" "}
        {t("auth-and-privacy")}{" "}
        <a className="font-bold hover:text-foreground underline" href="/privacy">
          {t("common-privacy")}
        </a>
        .
      </p>
    </form>
  );
};
