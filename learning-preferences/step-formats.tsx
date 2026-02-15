import { type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { FORMAT_OPTIONS } from "./constants";
import { type LearningPreferencesFormValues } from "./schema";

export interface StepFormatsProps {
  control: Control<LearningPreferencesFormValues>;
}

export const StepFormats = ({ control }: StepFormatsProps) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name="formats"
      render={({ field }) => {
        const selected = field.value ?? [];

        const toggleFormat = (format: string) => {
          const newValue = selected.includes(format)
            ? selected.filter((f) => f !== format)
            : [...selected, format];
          field.onChange(newValue);
        };

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              {t("learning-preferences-formats-title")}
            </FormLabel>
            <FormDescription>
              {t("learning-preferences-optional-hint")}
            </FormDescription>

            <div className="grid grid-cols-1 gap-3">
              {FORMAT_OPTIONS.map((format) => {
                const isSelected = selected.includes(format.value);
                return (
                  <Card
                    key={format.value}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleFormat(format.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} disabled />
                      <span className="text-sm font-medium">
                        {t(`learning-preferences-format-${format.value}`)}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </FormItem>
        );
      }}
    />
  );
};
