import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { type DiscoveryFormValues } from "../schema";
import {
  INTEREST_GROUPS,
  INTEREST_ICONS,
  INTEREST_TRANSLATION_KEYS,
} from "@/components/learning-preferences/constants";
import { type Category } from "@/model/category";
import { cn } from "@/lib/utils";

/**
 * Maps a context value to the categories that are already implied by it.
 * These get pre-selected and their group is hidden to avoid redundancy.
 */
const CONTEXT_IMPLIED_CATEGORIES: Partial<Record<string, Category[]>> = {
  job_prep: ["concursos_publicos", "certifications", "vestibular_enem"],
  academic: ["vestibular_enem", "math_logic"],
  career_change: ["career_market"],
  upskilling: ["career_market"],
};

/** Step 2: Interest areas — adapts based on what was chosen in step 1 */
export function InterestAreasStep() {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<DiscoveryFormValues>();
  const selectedInterests = useWatch({ control, name: "interests" }) ?? [];
  const context = useWatch({ control, name: "context" });

  // Pre-select implied categories when context is set
  useEffect(() => {
    const implied = CONTEXT_IMPLIED_CATEGORIES[context ?? ""] ?? [];
    if (implied.length === 0) return;
    const current = selectedInterests as Category[];
    const toAdd = implied.filter((c) => !current.includes(c));
    if (toAdd.length > 0) {
      setValue("interests", [...current, ...toAdd] as DiscoveryFormValues["interests"]);
    }
  // Only run when context changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const handleToggle = (id: string) => {
    const isSelected = selectedInterests.includes(id as DiscoveryFormValues["interests"][number]);
    setValue(
      "interests",
      isSelected
        ? (selectedInterests.filter((i) => i !== id) as DiscoveryFormValues["interests"])
        : ([...selectedInterests, id] as DiscoveryFormValues["interests"]),
    );
  };

  // Hide the group that's already implied by the context choice
  const impliedCategories = new Set(CONTEXT_IMPLIED_CATEGORIES[context ?? ""] ?? []);
  const visibleGroups = INTEREST_GROUPS.map((group) => ({
    ...group,
    // Filter out categories already implied — they're pre-selected but not shown
    categories: group.categories.filter((c) => !impliedCategories.has(c)),
  })).filter((group) => group.categories.length > 0);

  // Adapt the title based on context
  const titleKey = context === "job_prep"
    ? "interests-title-exam"
    : context === "academic"
    ? "interests-title-academic"
    : "discovery-interests-title";

  const descKey = context === "job_prep"
    ? "interests-desc-exam"
    : "discovery-interests-description";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t(titleKey as any, t("discovery-interests-title"))}
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          {t(descKey as any, t("discovery-interests-description"))}
        </p>
        {selectedInterests.length > 0 && (
          <p className="text-xs text-primary font-medium mt-2">
            {t("chips-selected" as any, "{{count}} selected", { count: selectedInterests.length })}
          </p>
        )}
      </motion.div>

      <div className="space-y-6">
        {visibleGroups.map((group, groupIdx) => (
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
