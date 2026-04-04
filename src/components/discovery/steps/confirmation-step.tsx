import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type DiscoveryFormValues } from "../schema";
import {
  OBJECTIVE_OPTIONS,
  CONTEXT_SCENARIOS,
  LEARNING_STYLE_OPTIONS,
} from "../constants";
import { INTEREST_TRANSLATION_KEYS } from "@/components/learning-preferences/constants";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-1">
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {title}
    </h3>
    <div className="text-sm">{children}</div>
  </div>
);

/** Confirmation step — displays a summary of all selected form values. */
export const ConfirmationStep = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<DiscoveryFormValues>();

  const objectives = useWatch({ control, name: "objectives" });
  const context = useWatch({ control, name: "context" });
  const interests = useWatch({ control, name: "interests" });
  const learningStyles = useWatch({ control, name: "learningStyles" });
  const preferencePace = useWatch({ control, name: "preferencePace" });
  const preferenceDepth = useWatch({ control, name: "preferenceDepth" });
  const preferenceStructure = useWatch({ control, name: "preferenceStructure" });
  const preferenceChallenge = useWatch({ control, name: "preferenceChallenge" });
  const hoursPerWeek = useWatch({ control, name: "hoursPerWeek" });
  const totalWeeks = useWatch({ control, name: "totalWeeks" });
  const budget = useWatch({ control, name: "budget" });
  const urgency = useWatch({ control, name: "urgency" });
  const experienceLevel = useWatch({ control, name: "experienceLevel" });
  const days = useWatch({ control, name: "days" });
  const formats = useWatch({ control, name: "formats" });
  const contentLength = useWatch({ control, name: "contentLength" });
  const minutesPerDay = useWatch({ control, name: "minutesPerDay" });

  const objectiveLabels = objectives
    .map((id) => {
      const option = OBJECTIVE_OPTIONS.find((o) => o.id === id);
      return option ? `${option.icon} ${t(option.translationKey)}` : id;
    })
    .join(", ");

  const contextOption = CONTEXT_SCENARIOS.find((c) => c.id === context);
  const contextLabel = contextOption
    ? `${contextOption.icon} ${t(contextOption.translationKey)}`
    : context;

  const interestLabels = interests
    .map((id) => t(INTEREST_TRANSLATION_KEYS[id as keyof typeof INTEREST_TRANSLATION_KEYS] ?? id))
    .join(", ");

  const styleLabels = learningStyles
    .map((id) => {
      const option = LEARNING_STYLE_OPTIONS.find((s) => s.id === id);
      return option ? `${option.icon} ${t(option.translationKey)}` : id;
    })
    .join(", ");

  const budgetLabel = budget === "free" ? t("discovery-budget-free") : t("discovery-budget-paid");
  const experienceLabel = t(`discovery-experience-${experienceLevel}`);

  const formatLabels: Record<string, string> = {
    video: t("learning-preferences-format-video"),
    reading: t("learning-preferences-format-reading"),
    "hands-on": t("learning-preferences-format-hands-on"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t("discovery-confirmation-title")}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t("discovery-confirmation-description")}
        </p>
      </div>

      <div className="space-y-4 divide-y divide-border">
        <Section title={t("discovery-confirmation-section-objectives")}>
          {objectiveLabels || "—"}
        </Section>

        <div className="pt-4">
          <Section title={t("discovery-confirmation-section-context")}>
            {contextLabel || "—"}
          </Section>
        </div>

        <div className="pt-4">
          <Section title={t("discovery-confirmation-section-interests")}>
            {interestLabels || "—"}
          </Section>
        </div>

        <div className="pt-4">
          <Section title={t("discovery-confirmation-section-learning-style")}>
            {styleLabels || "—"}
          </Section>
        </div>

        <div className="pt-4">
          <Section title={t("discovery-confirmation-section-preferences")}>
            <ul className="space-y-0.5">
              <li>{t("discovery-slider-pace")}: {preferencePace}/10</li>
              <li>{t("discovery-slider-depth")}: {preferenceDepth}/10</li>
              <li>{t("discovery-slider-structure")}: {preferenceStructure}/10</li>
              <li>{t("discovery-slider-challenge")}: {preferenceChallenge}/10</li>
            </ul>
          </Section>
        </div>

        <div className="pt-4">
          <Section title={t("discovery-confirmation-section-constraints")}>
            <ul className="space-y-0.5">
              <li>{t("discovery-hours-per-week")}: {hoursPerWeek}h</li>
              <li>{t("discovery-total-weeks")}: {totalWeeks}</li>
              <li>{t("discovery-budget-title")}: {budgetLabel}</li>
              <li>{t("discovery-urgency")}: {urgency}/5</li>
              <li>{t("discovery-experience-level")}: {experienceLabel}</li>
            </ul>
          </Section>
        </div>

        <div className="pt-4">
          <Section title={t("discovery-confirmation-section-schedule")}>
            <ul className="space-y-0.5">
              {days && days.length > 0 && (
                <li>{t("learning-preferences-days-title")}: {t("learning-preferences-days-selected", { count: days.length })}</li>
              )}
              {formats && formats.length > 0 && (
                <li>{t("learning-preferences-formats-title")}: {formats.map((f) => formatLabels[f] ?? f).join(", ")}</li>
              )}
              {contentLength && (
                <li>{t("learning-preferences-content-length-title")}: {t(`learning-preferences-content-length-${contentLength}` as const)}</li>
              )}
              {minutesPerDay && (
                <li>{t("learning-preferences-minutes-title")}: {t("learning-preferences-minutes-value", { count: minutesPerDay })}</li>
              )}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};
