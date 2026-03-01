import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export interface VerifyEmailFormProps {
  email: string;
  errorMessage?: string | null;
}

export const VerifyEmailForm = ({ email, errorMessage }: VerifyEmailFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              {t("verify-email-title")}
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {t("verify-email-link-sent", { email })}
            </p>
          </CardHeader>
          {errorMessage && (
            <CardContent>
              <Alert variant="destructive">
                <p>{errorMessage}</p>
              </Alert>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
