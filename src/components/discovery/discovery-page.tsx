import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { useSaveLearningPreference } from "@/hooks/learning-preference/use-save-learning-preference";
import { LoadingState } from "@/components/ui/loading-state";
import { DiscoveryForm } from "./discovery-form";
import { type DiscoveryFormValues } from "./schema";

/** Page component that fetches existing learning preference and renders the discovery form. */
export const DiscoveryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: existingPreference, isLoading } = useMyLearningPreference();
  const { mutate: savePreference, isPending: isSaving } =
    useSaveLearningPreference();

  const handleSubmit = useCallback(
    (data: DiscoveryFormValues) => {
      savePreference(
        {
          id: existingPreference?.id,
          data: {
            ...data,
            days: data.days ?? [],
            formats: data.formats ?? [],
          } as Parameters<typeof savePreference>[0]["data"],
        },
        {
          onSuccess: () => {
            toast.success(t("discovery-save-success"));
            void navigate({ to: "/" });
          },
          onError: () => {
            toast.error(t("discovery-save-error"));
          },
        },
      );
    },
    [existingPreference?.id, savePreference, t, navigate],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <DiscoveryForm
      existingPreference={existingPreference}
      isSaving={isSaving}
      onSubmit={handleSubmit}
    />
  );
};

export default DiscoveryPage;
