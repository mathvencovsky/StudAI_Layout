import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PreferenceChipsGroup } from "../ui/preference-chips";
import { MultiComparisonSlider } from "../ui/comparison-slider";
import { type DiscoveryFormValues } from "../schema";
import { LEARNING_STYLE_OPTIONS } from "../constants";

/** Step 4: Learning styles and preference sliders */
export function PreferencesStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const selectedStyles = useWatch({ control, name: "learningStyles" }) ?? [];
  const preferencePace = useWatch({ control, name: "preferencePace" }) ?? 5;
  const preferenceDepth = useWatch({ control, name: "preferenceDepth" }) ?? 5;
  const preferenceStructure = useWatch({ control, name: "preferenceStructure" }) ?? 5;
  const preferenceChallenge = useWatch({ control, name: "preferenceChallenge" }) ?? 5;

  const chips = LEARNING_STYLE_OPTIONS.map((option) => ({
    id: option.id,
    label: t(option.translationKey),
    description: t(option.descriptionKey),
    icon: option.icon,
  }));

  const handleStyleToggle = (id: string) => {
    const isSelected = selectedStyles.includes(id);
    setValue(
      "learningStyles",
      isSelected
        ? selectedStyles.filter((s) => s !== id)
        : [...selectedStyles, id],
    );
  };

  const comparisonPreferences = [
    {
      id: "pace",
      label: t("discovery-slider-pace"),
      leftLabel: t("discovery-slider-pace-left"),
      rightLabel: t("discovery-slider-pace-right"),
      value: preferencePace,
    },
    {
      id: "depth",
      label: t("discovery-slider-depth"),
      leftLabel: t("discovery-slider-depth-left"),
      rightLabel: t("discovery-slider-depth-right"),
      value: preferenceDepth,
    },
    {
      id: "structure",
      label: t("discovery-slider-structure"),
      leftLabel: t("discovery-slider-structure-left"),
      rightLabel: t("discovery-slider-structure-right"),
      value: preferenceStructure,
    },
    {
      id: "challenge",
      label: t("discovery-slider-challenge"),
      leftLabel: t("discovery-slider-challenge-left"),
      rightLabel: t("discovery-slider-challenge-right"),
      value: preferenceChallenge,
    },
  ];

  const handleComparisonChange = (id: string, value: number) => {
    if (id === "pace") setValue("preferencePace", value);
    else if (id === "depth") setValue("preferenceDepth", value);
    else if (id === "structure") setValue("preferenceStructure", value);
    else if (id === "challenge") setValue("preferenceChallenge", value);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          {t("discovery-preferences-title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("discovery-preferences-description")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PreferenceChipsGroup
          title={t("discovery-learning-style-title")}
          description={t("discovery-learning-style-description")}
          chips={chips}
          selectedIds={selectedStyles}
          onToggle={handleStyleToggle}
          maxSelections={3}
          minSelections={1}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MultiComparisonSlider
          comparisons={comparisonPreferences}
          onChange={handleComparisonChange}
        />
      </motion.div>

      {selectedStyles.length === 0 && (
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
