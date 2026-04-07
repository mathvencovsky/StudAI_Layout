import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { type DiscoveryFormValues } from "../schema";
import {
  INTEREST_GROUPS,
  INTEREST_ICONS,
  INTEREST_TRANSLATION_KEYS,
} from "@/components/learning-preferences/constants";
import { cn } from "@/lib/utils";

/** Step 3: Interest areas — grouped by domain with icons */
export function InterestAreasStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const selectedInterests = useWatch({ control, name: "interests" }) ?? [];

  const handleToggle = (id: string) => {
    const isSelected = selectedInterests.includes(id as DiscoveryFormValues["interests"][number]);
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
        className="text-center mb-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t("discovery-interests-title")}
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          {t("discovery-interests-description")}
        </p>
        {selectedInterests.length > 0 && (
          <p className="text-xs text-primary font-medium mt-2">
            {selectedInterests.length} selecionado{selectedInterests.length !== 1 ? "s" : ""}
          </p>
        )}
      </motion.div>

      <div className="space-y-6">
        {INTEREST_GROUPS.map((group, groupIdx) => (
          <motion.div
            key={group.labelKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.05 }}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t(group.labelKey as any, group.label)}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.categories.map((category) => {
                const isSelected = selectedInterests.includes(category as DiscoveryFormValues["interests"][number]);
                const icon = INTEREST_ICONS[category];
                const label = t(INTEREST_TRANSLATION_KEYS[category]);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleToggle(category)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-foreground/80 hover:border-primary/50 hover:bg-accent"
                    )}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedInterests.length === 0 && (
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
