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
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import { LoadingState } from "@/components/ui/loading-state";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";

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
  const { isLoading: isDashboardLoading } = useDashboardData();

  useEffect(() => {
    recordLogin();
  }, [recordLogin]);

  const handleSavePreference = useCallback(
    (data: LearningPreferencesFormValues) => {
      savePreference(
        {
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
    [savePreference, t],
  );

  if (isLoadingPreference || isDashboardLoading) return <LoadingState />;

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
    <div className="px-4 sm:px-6 lg:px-8 py-4 pb-24 md:pb-6 max-w-6xl mx-auto">
      <div className="space-y-4">
        <UserGreeting displayName={user?.displayName} />
        <StatsCards />
        <UpgradeCard variant="compact" />

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="border rounded-lg bg-card overflow-hidden">
            <div className="p-3 border-b">
              <h3 className="font-medium text-sm text-foreground">{t("continue-learning")}</h3>
            </div>
            <div className="p-3">
              <LastStartedModuleSection />
            </div>
          </section>

          <section className="border rounded-lg bg-card overflow-hidden">
            <div className="p-3 border-b">
              <h3 className="font-medium text-sm text-foreground">{t("continue-track")}</h3>
            </div>
            <div className="p-3">
              <LastStartedTrackSection />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
