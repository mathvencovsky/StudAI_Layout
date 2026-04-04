import { useFormContext, useWatch, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  DAY_OPTIONS,
  FORMAT_OPTIONS,
  CONTENT_LENGTH_OPTIONS,
  MINUTES_PRESETS,
  MINUTES_MIN,
  MINUTES_MAX,
  MINUTES_STEP,
} from "@/components/learning-preferences/constants";
import { type DiscoveryFormValues } from "../schema";

/** Schedule step — days, formats, content length, and minutes per day. */
export const ScheduleStep = () => {
  const { t, i18n } = useTranslation();
  const { control } = useFormContext<DiscoveryFormValues>();

  const locale = i18n.language;
  const narrowFormatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const longFormatter = new Intl.DateTimeFormat(locale, { weekday: "long" });

  const days = useWatch({ control, name: "days" }) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">{t("discovery-schedule-title")}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t("discovery-schedule-description")}
        </p>
      </div>

      {/* Days */}
      <Controller
        control={control}
        name="days"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              {t("learning-preferences-days-title")}
            </FormLabel>
            <FormDescription>{t("learning-preferences-optional-hint")}</FormDescription>
            <ToggleGroup
              type="multiple"
              value={field.value ?? []}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-2 justify-start"
            >
              {DAY_OPTIONS.map((day) => {
                const date = new Date(2024, 0, day);
                return (
                  <ToggleGroupItem
                    key={day}
                    value={day.toString()}
                    className="px-3 py-2 text-sm"
                    aria-label={longFormatter.format(date)}
                  >
                    {narrowFormatter.format(date)}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            {days.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("learning-preferences-days-selected", { count: days.length })}
              </p>
            )}
          </FormItem>
        )}
      />

      {/* Formats */}
      <Controller
        control={control}
        name="formats"
        render={({ field }) => {
          const selected = field.value ?? [];
          const toggle = (format: string) => {
            field.onChange(
              selected.includes(format)
                ? selected.filter((f) => f !== format)
                : [...selected, format],
            );
          };
          return (
            <FormItem className="space-y-4">
              <FormLabel className="text-lg font-semibold">
                {t("learning-preferences-formats-title")}
              </FormLabel>
              <FormDescription>{t("learning-preferences-optional-hint")}</FormDescription>
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
                      onClick={() => toggle(format.value)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isSelected} disabled />
                        <span className="text-sm font-medium">
                          {t(`learning-preferences-format-${format.value}` as const)}
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

      {/* Content length */}
      <Controller
        control={control}
        name="contentLength"
        render={({ field }) => {
          const value = field.value ?? "";
          return (
            <FormItem className="space-y-4">
              <FormLabel className="text-lg font-semibold">
                {t("learning-preferences-content-length-title")}
              </FormLabel>
              <FormDescription>{t("learning-preferences-optional-hint")}</FormDescription>
              <ToggleGroup
                type="single"
                value={value}
                onValueChange={(v) => field.onChange(v === value ? "" : v)}
                className="flex flex-col gap-2"
              >
                {CONTENT_LENGTH_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="justify-start px-4 py-3 text-sm"
                  >
                    {t(`learning-preferences-content-length-${option.value}` as const)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormItem>
          );
        }}
      />

      {/* Minutes per day */}
      <Controller
        control={control}
        name="minutesPerDay"
        render={({ field }) => {
          const value = field.value ?? null;
          return (
            <FormItem className="space-y-4">
              <FormLabel className="text-lg font-semibold">
                {t("learning-preferences-minutes-title")}
              </FormLabel>
              <FormDescription>{t("learning-preferences-optional-hint")}</FormDescription>
              <ToggleGroup
                type="single"
                value={value?.toString() ?? ""}
                onValueChange={(v) => field.onChange(v ? parseInt(v, 10) : null)}
                className="flex flex-wrap gap-2 justify-start"
              >
                {MINUTES_PRESETS.map((preset) => (
                  <ToggleGroupItem key={preset} value={preset.toString()} className="px-3 py-2 text-sm">
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
                    <Button variant="ghost" size="sm" onClick={() => field.onChange(null)}>
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
    </div>
  );
};
