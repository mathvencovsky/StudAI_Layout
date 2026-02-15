import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useRecordLoginDay } from "@/hooks/user/use-record-login-day";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { UserGreeting } from "@/components/home/user-greeting";
import { StatsCards } from "@/components/home/stats-cards";
import { LastStartedModuleSection } from "@/components/dashboard/last-started-module-section";
import { LastStartedTrackSection } from "@/components/home/last-started-track-section";
import { LearningPreferencesForm } from "@/components/learning-preferences/learning-preferences-form";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { useSaveLearningPreference } from "@/hooks/learning-preference/use-save-learning-preference";
import { type LearningPreferencesFormValues } from "@/components/learning-preferences/schema";

/**
 * Main home page component displaying greeting, stats, and continue learning section.
 * Shows the learning preferences form if the user hasn't set preferences yet.
 */
export const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { mutate: recordLogin } = useRecordLoginDay();
  const { data: existingPreference, isLoading: isLoadingPreference } =
    useMyLearningPreference();
  const { mutate: savePreference, isPending: isSaving } =
    useSaveLearningPreference();

  useEffect(() => {
    recordLogin();
  }, [recordLogin]);

  const handleSavePreference = useCallback(
    (data: LearningPreferencesFormValues) => {
      savePreference(
        { data },
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
    [savePreference, t],
  );

  if (isLoadingPreference) return null;

  if (!existingPreference) {
    return (
      <LearningPreferencesForm
        existingPreference={existingPreference}
        isSaving={isSaving}
        onSave={handleSavePreference}
      />
    );
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl space-y-8">
        <UserGreeting displayName={user?.displayName} />
        <StatsCards />
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("continue-learning")}
          </h2>
          <LastStartedModuleSection />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("continue-track")}
          </h2>
          <LastStartedTrackSection />
        </div>
      </div>
    </div>
  );
};
