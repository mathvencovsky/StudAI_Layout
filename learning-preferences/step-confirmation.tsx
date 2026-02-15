import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export interface StepConfirmationProps {
  onSave: () => void;
  isSaving: boolean;
}

export const StepConfirmation = ({
  onSave,
  isSaving,
}: StepConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-lg font-semibold">
          {t("learning-preferences-confirmation-message")}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t("learning-preferences-change-later")}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={onSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? t("verifying") : t("learning-preferences-save")}
        </Button>
      </div>
    </div>
  );
};
