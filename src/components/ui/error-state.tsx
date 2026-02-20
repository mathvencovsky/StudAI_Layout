import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-center min-h-[400px]"
      data-error-state
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h3 className="text-lg font-semibold">{t("error")}</h3>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("retry")}
          </Button>
        )}
      </div>
    </div>
  );
}
