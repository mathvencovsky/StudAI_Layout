import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ContentSelector } from "./content-selector";

export interface ModuleFormValues {
  title: string;
  description: string;
  contentIds: string[];
}

export interface ModuleFormProps {
  mode: "create" | "edit";
  moduleId?: string;
  defaultValues: Partial<ModuleFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: ModuleFormValues) => void;
  onCancel: () => void;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * Pure presentational form for module creation and editing:
 * - Handles title and description validation
 * - Integrates with content selection interface
 * - Uses useWatch for real-time feedback
 */
export const ModuleForm: React.FC<ModuleFormProps> = ({
  mode,
  moduleId,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
  errorMessage,
  successMessage,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModuleFormValues>({
    defaultValues,
    mode: "onChange",
  });

  // Using useWatch instead of watch (guideline)
  const watched = useWatch({ control });

  const requiredRule = { required: t("this-field-is-required") };

  const handleFormSubmit = (values: ModuleFormValues) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        aria-busy={isSubmitting}
      >
        <div>
          <Label htmlFor="title">{t("module-title")}</Label>
          <Input
            id="title"
            placeholder={t("enter-module-title")}
            {...register("title", {
              ...requiredRule,
              minLength: {
                value: 3,
                message: t("title-min-length"),
              },
            })}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">{t("module-description")}</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder={t("describe-module-coverage")}
            {...register("description", {
              ...requiredRule,
              minLength: {
                value: 10,
                message: t("validation-description-min"),
              },
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Content Selection Section */}
        <div>
          <ContentSelector
            control={control}
            name="contentIds"
            moduleId={moduleId}
          />
        </div>

        {/* Friendly feedback blocks */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>{t("couldnt-save-module")}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert>
            <AlertTitle>
              {mode === "create" ? t("module-created") : t("module-updated")}
            </AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Draft preview */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">{t("draft-preview")}</span>{" "}
          {watched.title || t("no-title")} —{" "}
          {watched.description
            ? `${watched.description.slice(0, 50)}${watched.description.length > 50 ? "..." : ""}`
            : t("no-description")}
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {mode === "create" ? t("create-module") : t("save-changes")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
};
