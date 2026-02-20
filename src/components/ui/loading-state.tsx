import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-center min-h-[400px]"
      data-loading-state
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    </div>
  );
}
