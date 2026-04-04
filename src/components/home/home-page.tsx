import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { UserGreeting } from "@/components/home/user-greeting";
import { StatsCards } from "@/components/home/stats-cards";
import { LastStartedModuleSection } from "@/components/dashboard/last-started-module-section";
import { LastStartedTrackSection } from "@/components/home/last-started-track-section";
import { DiscoveryPage } from "@/components/discovery";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import { LoadingState } from "@/components/ui/loading-state";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";
import { useLastStartedTrackWithDetails } from "@/hooks/track/use-last-started-track-with-details";
import { useLastStartedModuleWithContents } from "@/hooks/modules/use-last-started-module-with-contents";
import { RecommendedTracksEmptyState } from "@/components/home/recommended-tracks-empty-state";

/**
 * Main home page component displaying greeting, stats, and continue learning section.
 * Shows the discovery form if the user hasn't set preferences yet.
 */
export const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: existingPreference, isLoading: isLoadingPreference } =
    useMyLearningPreference();
  const { isLoading: isDashboardLoading } = useDashboardData();
  const { data: lastTrack, isLoading: isLoadingTrack } = useLastStartedTrackWithDetails();
  const { data: lastModule, isLoading: isLoadingModule } = useLastStartedModuleWithContents();

  if (isLoadingPreference || isDashboardLoading) return <LoadingState />;

  if (!existingPreference) {
    return <DiscoveryPage />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 pb-24 md:pb-6 max-w-6xl mx-auto">
      <div className="space-y-4">
        <UserGreeting displayName={user?.displayName} />
        <StatsCards />
        <UpgradeCard variant="compact" />

        {isLoadingTrack || isLoadingModule ? (
          <LoadingState />
        ) : lastTrack || lastModule ? (
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
        ) : (
          <RecommendedTracksEmptyState interests={existingPreference?.interests} />
        )}
      </div>
    </div>
  );
};
