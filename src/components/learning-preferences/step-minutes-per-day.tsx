import { type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  MINUTES_PRESETS,
  MINUTES_MIN,
  MINUTES_MAX,
  MINUTES_STEP,
} from "./constants";
import { type LearningPreferencesFormValues } from "./schema";

export interface StepMinutesPerDayProps {
  control: Control<LearningPreferencesFormValues>;
}

export const StepMinutesPerDay = ({ control }: StepMinutesPerDayProps) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name="minutesPerDay"
      render={({ field }) => {
        const value = field.value ?? null;

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              {t("learning-preferences-minutes-title")}
            </FormLabel>
            <FormDescription>
              {t("learning-preferences-optional-hint")}
            </FormDescription>

            <ToggleGroup
              type="single"
              value={value?.toString() ?? ""}
              onValueChange={(v) => field.onChange(v ? parseInt(v, 10) : null)}
              className="flex flex-wrap gap-2 justify-start"
            >
              {MINUTES_PRESETS.map((preset) => (
                <ToggleGroupItem
                  key={preset}
                  value={preset.toString()}
                  className="px-3 py-2 text-sm"
                >
                  {preset}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="space-y-2">
              <Slider
                min={MINUTES_MIN}
                max={MINUTES_MAX}
                step={MINUTES_STEP}
                value={[value ?? MINUTES_MIN]}
                onValueChange={(v) => field.onChange(v[0])}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {value !== null
                    ? t("learning-preferences-minutes-value", { count: value })
                    : t("learning-preferences-minutes-not-set")}
                </span>
                {value !== null && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => field.onChange(null)}
                  >
                    {t("learning-preferences-minutes-clear")}
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("learning-preferences-minutes-tip")}
            </p>
          </FormItem>
        );
      }}
    />
  );
};
