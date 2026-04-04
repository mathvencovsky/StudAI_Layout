import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TimeSlider, ComparisonSlider } from "../ui/comparison-slider";
import { Button } from "@/components/ui/button";
import { type DiscoveryFormValues } from "../schema";

/** Step 5: Constraints (hours, weeks, budget, urgency, experience level) */
export function ConstraintsStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const hoursPerWeek = useWatch({ control, name: "hoursPerWeek" }) ?? 5;
  const totalWeeks = useWatch({ control, name: "totalWeeks" }) ?? 12;
  const budget = useWatch({ control, name: "budget" }) ?? "free";
  const urgency = useWatch({ control, name: "urgency" }) ?? 3;
  const experienceLevel = useWatch({ control, name: "experienceLevel" }) ?? "beginner";

  const experienceLevels: DiscoveryFormValues["experienceLevel"][] = [
    "beginner",
    "intermediate",
    "advanced",
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          {t("discovery-constraints-title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("discovery-constraints-description")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TimeSlider
          label={t("discovery-hours-per-week")}
          value={hoursPerWeek}
          onChange={(value) => setValue("hoursPerWeek", value)}
          min={1}
          max={40}
          unit="hours"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TimeSlider
          label={t("discovery-total-weeks")}
          value={totalWeeks}
          onChange={(value) => setValue("totalWeeks", value)}
          min={1}
          max={52}
          unit="weeks"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t("discovery-budget-title")}
          </h3>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            variant={budget === "free" ? "default" : "outline"}
            onClick={() => setValue("budget", "free")}
            className="min-w-[120px]"
          >
            {t("discovery-budget-free")}
          </Button>
          <Button
            variant={budget === "paid" ? "default" : "outline"}
            onClick={() => setValue("budget", "paid")}
            className="min-w-[120px]"
          >
            {t("discovery-budget-paid")}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ComparisonSlider
          label={t("discovery-urgency")}
          leftLabel={t("discovery-urgency-low")}
          rightLabel={t("discovery-urgency-high")}
          value={urgency}
          onChange={(value) => setValue("urgency", value)}
          min={1}
          max={5}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t("discovery-experience-level")}
          </h3>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {experienceLevels.map((level) => (
            <Button
              key={level}
              variant={experienceLevel === level ? "default" : "outline"}
              onClick={() => setValue("experienceLevel", level)}
            >
              {t(`discovery-experience-${level}`)}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
