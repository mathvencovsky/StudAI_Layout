import { useTranslation } from "react-i18next";
import { UpgradeGate } from "@/components/plan/upgrade-gate";

export function ActivityPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages-activity-title")}</h1>
        <p className="text-muted-foreground">{t("pages-activity-description")}</p>
      </div>
      <UpgradeGate
        description={t("pages-activity-upgrade-description")}
        features={[
          t("pages-activity-upgrade-feature-1"),
          t("pages-activity-upgrade-feature-2"),
          t("pages-activity-upgrade-feature-3"),
          t("pages-activity-upgrade-feature-4"),
        ]}
      />
    </div>
  );
}
