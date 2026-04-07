import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { useSaveLearningPreference } from "@/hooks/learning-preference/use-save-learning-preference";
import { LoadingState } from "@/components/ui/loading-state";
import { DiscoveryForm } from "./discovery-form";
import { type DiscoveryFormValues } from "./schema";
import { useQueryClient } from "@tanstack/react-query";

const LOCAL_PREF_KEY = "studai:learning-preference";

/** Page component that fetches existing learning preference and renders the discovery form. */
export const DiscoveryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existingPreference, isLoading } = useMyLearningPreference();
  const { mutate: savePreference, isPending: isSaving } =
    useSaveLearningPreference();

  const handleSubmit = useCallback(
    (data: DiscoveryFormValues) => {
      const payload = {
        interests: data.interests,
        days: data.days ?? [],
        formats: data.formats ?? [],
        ...(data.minutesPerDay != null && { minutesPerDay: data.minutesPerDay }),
        ...(data.contentLength && { contentLength: data.contentLength }),
        ...(data.context && { context: data.context }),
        ...(data.objectives?.length && { objectives: data.objectives }),
        ...(data.learningStyles?.length && { learningStyles: data.learningStyles }),
        ...(data.hoursPerWeek != null && { hoursPerWeek: data.hoursPerWeek }),
        ...(data.totalWeeks != null && { totalWeeks: data.totalWeeks }),
        ...(data.budget && { budget: data.budget }),
        ...(data.urgency != null && { urgency: data.urgency }),
        ...(data.experienceLevel && { experienceLevel: data.experienceLevel }),
        ...(data.preferencePace != null && { preferencePace: data.preferencePace }),
        ...(data.preferenceDepth != null && { preferenceDepth: data.preferenceDepth }),
        ...(data.preferenceStructure != null && { preferenceStructure: data.preferenceStructure }),
        ...(data.preferenceChallenge != null && { preferenceChallenge: data.preferenceChallenge }),
      };

      // Always save to localStorage first — works even if backend is unavailable
      try {
        localStorage.setItem(LOCAL_PREF_KEY, JSON.stringify({ ...payload, id: existingPreference?.id ?? "local" }));
        // Update query cache immediately so home page sees it
        queryClient.setQueryData(["learning-preference", "mine"], { ...payload, id: existingPreference?.id ?? "local" });
      } catch {
        // localStorage unavailable — continue
      }

      savePreference(
        {
          id: existingPreference?.id,
          data: payload as Parameters<typeof savePreference>[0]["data"],
        },
        {
          onSuccess: () => {
            toast.success(t("discovery-save-success"));
            void navigate({ to: "/" });
          },
          onError: (err) => {
            console.error("Backend save failed, using local storage:", err);
            // Backend failed but we already saved locally — still navigate
            toast.success(t("discovery-save-success"));
            void navigate({ to: "/" });
          },
        },
      );
    },
    [existingPreference?.id, savePreference, t, navigate, queryClient],
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
