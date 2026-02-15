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
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Hero - Minimal greeting */}
        <UserGreeting displayName={user?.displayName} />

        {/* Stats overview */}
        <StatsCards />

        {/* Two-column layout for continue sections */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          {/* Left column - Continue Module */}
          <section className="border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium text-foreground">
                {t("continue-learning")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("continue-learning-description") ?? "Pick up where you left off."}
              </p>
            </div>
            <div className="p-4">
              <LastStartedModuleSection />
            </div>
          </section>

          {/* Right column - Continue Track */}
          <section className="border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium text-foreground">
                {t("continue-track")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("continue-track-description") ?? "Your active learning path."}
              </p>
            </div>
            <div className="p-4">
              <LastStartedTrackSection />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
