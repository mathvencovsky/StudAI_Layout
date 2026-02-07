import { type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { INTEREST_OPTIONS } from "./constants";
import { type LearningPreferencesFormValues } from "./schema";

export interface StepInterestsProps {
  control: Control<LearningPreferencesFormValues>;
}

export const StepInterests = ({ control }: StepInterestsProps) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name="interests"
      render={({ field, fieldState }) => {
        const selectedCount = field.value?.length ?? 0;

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              {t("learning-preferences-interests-title")}
            </FormLabel>
            <FormDescription>
              {t("learning-preferences-interests-helper")}
            </FormDescription>

            <ToggleGroup
              type="multiple"
              value={field.value ?? []}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-2 justify-start"
            >
              {INTEREST_OPTIONS.map((interest) => (
                <ToggleGroupItem
                  key={interest}
                  value={interest}
                  className="px-3 py-2 text-sm"
                >
                  {t(`learning-preferences-interest-${interest}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {selectedCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("learning-preferences-interests-selected", {
                  count: selectedCount,
                })}
              </p>
            )}

            {fieldState.error && (
              <FormMessage>
                {t("learning-preferences-interests-error")}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};
