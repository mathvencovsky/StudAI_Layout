import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { StepInterests } from "./step-interests";
import { StepMinutesPerDay } from "./step-minutes-per-day";
import { StepDays } from "./step-days";
import { StepFormats } from "./step-formats";
import { StepContentLength } from "./step-content-length";
import { StepConfirmation } from "./step-confirmation";
import {
  learningPreferencesSchema,
  type LearningPreferencesFormValues,
} from "./schema";
import { TOTAL_STEPS } from "./constants";
import { type LearningPreference } from "@/model/learning-preference";

const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export interface LearningPreferencesFormProps {
  existingPreference: LearningPreference | null | undefined;
  isSaving: boolean;
  onSave: (data: LearningPreferencesFormValues) => void;
}

/** Form component that manages the learning preferences wizard UI and form state. */
export const LearningPreferencesForm = ({
  existingPreference,
  isSaving,
  onSave,
}: LearningPreferencesFormProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [reducedMotion] = useState(prefersReducedMotion());

  const form = useForm<LearningPreferencesFormValues>({
    resolver: zodResolver(learningPreferencesSchema),
    mode: "onBlur",
    defaultValues: {
      interests: existingPreference?.interests ?? [],
      minutesPerDay: existingPreference?.minutesPerDay ?? undefined,
      days: existingPreference?.days ?? [],
      formats: existingPreference?.formats ?? [],
      contentLength: existingPreference?.contentLength ?? undefined,
    },
  });

  useEffect(() => {
    if (existingPreference) {
      form.reset({
        interests: existingPreference.interests ?? [],
        minutesPerDay: existingPreference.minutesPerDay ?? undefined,
        days: existingPreference.days ?? [],
        formats: existingPreference.formats ?? [],
        contentLength: existingPreference.contentLength ?? undefined,
      });
    }
  }, [existingPreference, form]);

  const handleNext = useCallback(async () => {
    if (currentStep === 0) {
      const isValid = await form.trigger("interests");
      if (!isValid) return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, form]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSave = useCallback(() => {
    onSave(form.getValues());
  }, [form, onSave]);

  const progressPercent = useMemo(
    () => ((currentStep + 1) / (TOTAL_STEPS + 1)) * 100,
    [currentStep],
  );
  const isConfirmationStep = currentStep === TOTAL_STEPS;
  const isFirstStep = currentStep === 0;
  const isOptionalStep = currentStep > 0;

  const animationVariants = useMemo(
    () =>
      reducedMotion
        ? {
            initial: { opacity: 1 },
            animate: { opacity: 1 },
            exit: { opacity: 1 },
          }
        : {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
          },
    [reducedMotion],
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t("learning-preferences")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("learning-preferences-subtitle")}
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="secondary">
              1 {t("learning-preferences-required")}
            </Badge>
            <Badge variant="outline">
              4 {t("learning-preferences-optional")}
            </Badge>
          </div>
        </div>

        {!isConfirmationStep && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("learning-preferences-step-of", {
                  current: currentStep + 1,
                  total: TOTAL_STEPS,
                })}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <Card className="p-6 min-h-[300px] flex flex-col justify-center">
          <Form {...form}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                {currentStep === 0 && <StepInterests control={form.control} />}
                {currentStep === 1 && (
                  <StepMinutesPerDay control={form.control} />
                )}
                {currentStep === 2 && <StepDays control={form.control} />}
                {currentStep === 3 && <StepFormats control={form.control} />}
                {currentStep === 4 && (
                  <StepContentLength control={form.control} />
                )}
                {isConfirmationStep && (
                  <StepConfirmation onSave={handleSave} isSaving={isSaving} />
                )}
              </motion.div>
            </AnimatePresence>
          </Form>
        </Card>

        <div className="flex gap-3 justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={isFirstStep}>
            {t("learning-preferences-back")}
          </Button>

          {isOptionalStep && !isConfirmationStep && (
            <Badge variant="outline" className="text-xs">
              {t("learning-preferences-optional-hint")}
            </Badge>
          )}

          {!isConfirmationStep && (
            <div className="flex gap-2">
              <Button onClick={handleNext}>
                {t("learning-preferences-next")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
