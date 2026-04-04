import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PreferenceChipsGroup } from "../ui/preference-chips";
import { type DiscoveryFormValues } from "../schema";
import {
  INTEREST_OPTIONS,
  INTEREST_TRANSLATION_KEYS,
} from "@/components/learning-preferences/constants";

/** Step 3: Interest areas selection */
export function InterestAreasStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const selectedInterests = useWatch({ control, name: "interests" }) ?? [];

  const chips = INTEREST_OPTIONS.map((category) => ({
    id: category,
    label: t(INTEREST_TRANSLATION_KEYS[category]),
  }));

  const handleToggle = (id: string) => {
    const isSelected = selectedInterests.includes(
      id as DiscoveryFormValues["interests"][number],
    );
    setValue(
      "interests",
      isSelected
        ? (selectedInterests.filter((i) => i !== id) as DiscoveryFormValues["interests"])
        : ([...selectedInterests, id] as DiscoveryFormValues["interests"]),
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
          {t("discovery-interests-title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("discovery-interests-description")}
        </p>
      </motion.div>

      <PreferenceChipsGroup
        chips={chips}
        selectedIds={selectedInterests}
        onToggle={handleToggle}
        minSelections={1}
      />

      {selectedInterests.length === 0 && (
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
