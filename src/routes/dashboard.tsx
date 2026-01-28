import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LastStartedModuleSection } from "@/components/dashboard/last-started-module-section";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  loader: () => {
    return {
      crumb: "dashboard",
    };
  },
});

function Dashboard() {
  const { t } = useTranslation();
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t("dashboard")}</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("continue-learning")}
          </h2>
          <LastStartedModuleSection />
        </div>
      </div>
    </div>
  );
}
