import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export interface VerifyEmailFormProps {
  email: string;
  onSubmit: (values: VerifyEmailFormValues) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export const VerifyEmailForm = ({
  email,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: VerifyEmailFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              {t("verify-email-title")}
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {t("verify-email-description-with-email", { email })}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t("verification-code")}</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("enter-verification-code")}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  {...register("code")}
                />
                {errors.code && (
                  <p className="text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              {errorMessage && (
                <Alert variant="destructive">
                  <p>{errorMessage}</p>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("verifying") : t("verify-email")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
