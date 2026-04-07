import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { type DiscoveryFormValues } from "../schema";
import { GOAL_OPTIONS } from "../constants";
import { cn } from "@/lib/utils";

/**
 * Combined step 1: replaces the old Objectives + Context steps.
 */

export function GoalStep() {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext<DiscoveryFormValues>();
  const selectedContext = useWatch({ control, name: "context" });

  const handleSelect = (option: typeof GOAL_OPTIONS[number]) => {
    setValue("context", option.context);
    setValue("objectives", [...option.objectives]);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t("goal-step-title" as any, "Por que você está aqui?")}
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          {t("goal-step-desc" as any, "Escolha o que melhor descreve sua situação.")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOAL_OPTIONS.map((option, i) => {
          const isSelected = selectedContext === option.context;
          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleSelect(option)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:bg-accent"
              )}
            >
              <span className="text-3xl flex-shrink-0 mt-0.5">{option.icon}</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-snug" style={{ color: isSelected ? "var(--color-primary-foreground, white)" : undefined }}>
                  {t(option.titleKey as any, option.titleKey)}
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: isSelected ? "rgba(255,255,255,0.85)" : undefined, opacity: isSelected ? 1 : undefined }}
                  data-selected={isSelected}
                >
                  {t(option.descKey as any, option.descKey)}
                </p>
              </div>
              {isSelected && (
                <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {!selectedContext && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-destructive"
        >
          {t("discovery-validation-select-one")}
        </motion.p>
      )}
    </div>
  );
}
