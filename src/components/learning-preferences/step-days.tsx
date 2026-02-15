import { type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { DAY_OPTIONS } from "./constants";
import { type LearningPreferencesFormValues } from "./schema";

export interface StepDaysProps {
  control: Control<LearningPreferencesFormValues>;
}

const getDateForWeekday = (isoDay: number): Date => {
  return new Date(2024, 0, isoDay);
};

export const StepDays = ({ control }: StepDaysProps) => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language;
  const narrowFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "narrow",
  });
  const longFormatter = new Intl.DateTimeFormat(locale, { weekday: "long" });

  return (
    <FormField
      control={control}
      name="days"
      render={({ field }) => {
        const selectedCount = field.value?.length ?? 0;

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              {t("learning-preferences-days-title")}
            </FormLabel>
            <FormDescription>
              {t("learning-preferences-optional-hint")}
            </FormDescription>

            <ToggleGroup
              type="multiple"
              value={field.value ?? []}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-2 justify-start"
            >
              {DAY_OPTIONS.map((day) => {
                const date = getDateForWeekday(day);
                const shortLabel = narrowFormatter.format(date);
                const longLabel = longFormatter.format(date);

                return (
                  <ToggleGroupItem
                    key={day}
                    value={day.toString()}
                    className="px-3 py-2 text-sm"
                    aria-label={longLabel}
                  >
                    {shortLabel}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>

            {selectedCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("learning-preferences-days-selected", {
                  count: selectedCount,
                })}
              </p>
            )}
          </FormItem>
        );
      }}
    />
  );
};
