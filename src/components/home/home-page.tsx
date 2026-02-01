import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useRecordLoginDay } from "@/hooks/user/use-record-login-day";
import { useEffect } from "react";
import { UserGreeting } from "@/components/home/user-greeting";
import { StatsCards } from "@/components/home/stats-cards";
import { LastStartedModuleSection } from "@/components/dashboard/last-started-module-section";
import { LastStartedTrackSection } from "@/components/home/last-started-track-section";

/**
 * Main home page component displaying greeting, stats, and continue learning section
 */
export const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { mutate: recordLogin } = useRecordLoginDay();

  useEffect(() => {
    recordLogin();
  }, [recordLogin]);

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <UserGreeting displayName={user?.displayName} />
      <StatsCards />
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("continue-track")}</h2>
        <LastStartedTrackSection />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("continue-learning")}</h2>
        <LastStartedModuleSection />
      </div>
    </div>
  );
};
