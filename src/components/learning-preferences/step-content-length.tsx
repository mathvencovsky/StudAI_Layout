import { type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { CONTENT_LENGTH_OPTIONS } from "./constants";
import { type LearningPreferencesFormValues } from "./schema";

export interface StepContentLengthProps {
  control: Control<LearningPreferencesFormValues>;
}

export const StepContentLength = ({ control }: StepContentLengthProps) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name="contentLength"
      render={({ field }) => {
        const value = field.value ?? "";

        const handleToggle = (newValue: string) => {
          field.onChange(newValue === value ? "" : newValue);
        };

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              {t("learning-preferences-content-length-title")}
            </FormLabel>
            <FormDescription>
              {t("learning-preferences-optional-hint")}
            </FormDescription>

            <ToggleGroup
              type="single"
              value={value}
              onValueChange={handleToggle}
              className="flex flex-col gap-2"
            >
              {CONTENT_LENGTH_OPTIONS.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="justify-start px-4 py-3 text-sm"
                >
                  {t(`learning-preferences-content-length-${option.value}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormItem>
        );
      }}
    />
  );
};
