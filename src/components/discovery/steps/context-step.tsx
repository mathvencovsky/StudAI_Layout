import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ScenarioGrid } from "../ui/scenario-card";
import { type DiscoveryFormValues } from "../schema";
import { CONTEXT_SCENARIOS } from "../constants";

/** Step 2: Context selection */
export function ContextStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const selectedContext = useWatch({ control, name: "context" });

  const scenarios = CONTEXT_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    title: t(scenario.translationKey),
    description: t(scenario.descriptionKey),
    icon: scenario.icon,
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          {t("discovery-context-title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("discovery-context-description")}
        </p>
      </motion.div>

      <ScenarioGrid
        scenarios={scenarios}
        selectedId={selectedContext}
        onSelect={(id) =>
          setValue("context", id as DiscoveryFormValues["context"])
        }
      />

      {!selectedContext && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-sm text-destructive">
            {t("discovery-validation-select-one")}
          </p>
        </motion.div>
      )}
    </div>
  );
}
