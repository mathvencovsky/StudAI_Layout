import { useState, useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { discoveryFormSchema, type DiscoveryFormValues } from "./schema";
import { type LearningPreference } from "@/model/learning-preference";
import { GoalStep } from "./steps/goal-step";
import { InterestAreasStep } from "./steps/interest-areas-step";
import { PreferencesStep } from "./steps/preferences-step";
import { ConstraintsStep } from "./steps/constraints-step";
import { ScheduleStep } from "./steps/schedule-step";
import { ConfirmationStep } from "./steps/confirmation-step";
import { StepNavigation } from "./ui/step-navigation";

const TOTAL_STEPS = 6;

export interface DiscoveryFormProps {
  existingPreference: LearningPreference | null | undefined;
  isSaving: boolean;
  onSubmit: (data: DiscoveryFormValues) => void;
}

/** Main discovery form component orchestrating all steps with react-hook-form. */
export const DiscoveryForm = ({
  existingPreference,
  isSaving,
  onSubmit,
}: DiscoveryFormProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<DiscoveryFormValues>({
    resolver: zodResolver(discoveryFormSchema),
    mode: "onBlur",
    defaultValues: {
      objectives: existingPreference?.objectives?.filter(Boolean) ?? [],
      context:
        (existingPreference?.context as DiscoveryFormValues["context"]) ??
        undefined,
      interests: (existingPreference?.interests ??
        []) as DiscoveryFormValues["interests"],
      learningStyles:
        existingPreference?.learningStyles?.filter(Boolean) ?? [],
      preferencePace: existingPreference?.preferencePace ?? 5,
      preferenceDepth: existingPreference?.preferenceDepth ?? 5,
      preferenceStructure: existingPreference?.preferenceStructure ?? 5,
      preferenceChallenge: existingPreference?.preferenceChallenge ?? 5,
      hoursPerWeek: existingPreference?.hoursPerWeek ?? 5,
      totalWeeks: existingPreference?.totalWeeks ?? 12,
      budget:
        (existingPreference?.budget as DiscoveryFormValues["budget"]) ?? "free",
      urgency: existingPreference?.urgency ?? 3,
      experienceLevel:
        (existingPreference?.experienceLevel as DiscoveryFormValues["experienceLevel"]) ??
        "beginner",
      minutesPerDay: existingPreference?.minutesPerDay ?? undefined,
      days: existingPreference?.days ?? [],
      formats: existingPreference?.formats ?? [],
      contentLength:
        (existingPreference?.contentLength as DiscoveryFormValues["contentLength"]) ??
        undefined,
    },
  });

  const stepValidationFields: (keyof DiscoveryFormValues)[][] = [
    ["context", "objectives"], // GoalStep sets both
    ["interests"],
    ["learningStyles"],
    ["hoursPerWeek", "totalWeeks", "budget", "urgency", "experienceLevel"],
    [], // schedule — all optional
    [], // confirmation
  ];

  const handleNext = useCallback(async () => {
    const fields = stepValidationFields[currentStep];
    if (fields && fields.length > 0) {
      const isValid = await form.trigger(fields);
      if (!isValid) return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      void form.handleSubmit(onSubmit)();
    }
  }, [currentStep, form, onSubmit, stepValidationFields]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const progressPercent = useMemo(
    () => ((currentStep + 1) / TOTAL_STEPS) * 100,
    [currentStep],
  );

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t("learning-preferences")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("learning-preferences-subtitle")}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t("discovery-step-of", {
                current: currentStep + 1,
                total: TOTAL_STEPS,
              })}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Card className="p-6 min-h-[300px] flex flex-col justify-center">
          <FormProvider {...form}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <GoalStep />}
                {currentStep === 1 && <InterestAreasStep />}
                {currentStep === 2 && <PreferencesStep />}
                {currentStep === 3 && <ConstraintsStep />}
                {currentStep === 4 && <ScheduleStep />}
                {currentStep === 5 && <ConfirmationStep />}
              </motion.div>
            </AnimatePresence>
          </FormProvider>
        </Card>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          canProceed={!isSaving}
          isLoading={isSaving && isLastStep}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};
