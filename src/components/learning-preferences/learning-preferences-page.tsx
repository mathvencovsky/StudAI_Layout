import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { type LearningPreferencesFormValues } from "./schema";
import { useSaveLearningPreference } from "@/hooks/learning-preference/use-save-learning-preference";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { LearningPreferencesForm } from "./learning-preferences-form";
import { LoadingState } from "@/components/ui/loading-state";

/** Container component that manages API data for the learning preferences wizard. */
export const LearningPreferencesPage = () => {
  const { t } = useTranslation();

  const { data: existingPreference, isLoading } = useMyLearningPreference();
  const { mutate: savePreference, isPending: isSaving } =
    useSaveLearningPreference();

  const handleSave = useCallback(
    (data: LearningPreferencesFormValues) => {
      savePreference(
        {
          id: existingPreference?.id,
          data: { ...data, days: data.days ?? [], formats: data.formats ?? [] },
        },
        {
          onSuccess: () => {
            toast.success(t("learning-preferences-save-success"));
          },
          onError: () => {
            toast.error(t("learning-preferences-save-error"));
          },
        },
      );
    },
    [existingPreference?.id, savePreference, t],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <LearningPreferencesForm
      existingPreference={existingPreference}
      isSaving={isSaving}
      onSave={handleSave}
    />
  );
};
