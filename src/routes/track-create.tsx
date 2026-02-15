import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { TrackForm } from "@/components/track/track-form";

export const Route = createFileRoute("/track-create")({
  component: TrackCreatePage,
  loader: () => ({ crumb: "Create Track" }),
});

function TrackCreatePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("create-track")}</h1>
        <p className="text-muted-foreground">{t("create-track-description")}</p>
      </div>
      <TrackForm mode="create" />
    </div>
  );
}
