import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PreferenceChipsGroup } from "../ui/preference-chips";
import { type DiscoveryFormValues } from "../schema";
import { OBJECTIVE_OPTIONS } from "../constants";

/** Step 1: Objectives selection */
export function ObjectivesStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const selectedObjectives = useWatch({ control, name: "objectives" }) ?? [];

  const chips = OBJECTIVE_OPTIONS.map((option) => ({
    id: option.id,
    label: t(option.translationKey),
    description: t(option.descriptionKey),
    icon: option.icon,
  }));

  const handleToggle = (id: string) => {
    const isSelected = selectedObjectives.includes(id);
    setValue(
      "objectives",
      isSelected
        ? selectedObjectives.filter((o) => o !== id)
        : [...selectedObjectives, id],
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          {t("discovery-objectives-title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("discovery-objectives-description")}
        </p>
      </motion.div>

      <PreferenceChipsGroup
        chips={chips}
        selectedIds={selectedObjectives}
        onToggle={handleToggle}
        maxSelections={3}
        minSelections={1}
      />

      {selectedObjectives.length === 0 && (
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
