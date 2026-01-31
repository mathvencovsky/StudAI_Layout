import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type ModuleFormValues,
  ModuleForm,
} from "@/components/modules/forms/module-form";
import { useModule } from "@/hooks/modules/use-module";
import { useModuleContents } from "@/hooks/modules/use-module-contents";
import { useUpdateModule } from "@/hooks/modules/use-update-module";

export interface ModuleEditProps {
  moduleId: string; // module id to edit (from route param)
  onSuccess: () => void; // navigate back to modules list after saving
  onCancel: () => void; // navigate back to modules list without saving
}

export const ModuleEdit: React.FC<ModuleEditProps> = ({
  moduleId,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<ModuleFormValues | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const moduleQuery = useModule(moduleId);
  const moduleContentsQuery = useModuleContents({ moduleId });
  const updateModule = useUpdateModule();

  // Initialize form values when module data is loaded
  const defaultValues: ModuleFormValues | null = useMemo(() => {
    if (!moduleQuery.data || !moduleContentsQuery.data) return null;

    const module = moduleQuery.data;
    const contents = moduleContentsQuery.data;

    const contentIds = contents
      .sort((a, b) => a.position - b.position)
      .map((item) => item.id);

    return {
      title: module.title,
      description: module.description,
      contentIds,
    };
  }, [moduleQuery.data, moduleContentsQuery.data]);

  useEffect(() => {
    if (defaultValues && !formValues) {
      setFormValues(defaultValues);
    }
  }, [defaultValues, formValues]);

  const handleSubmit = (values: ModuleFormValues) => {
    // Validate required fields
    if (!values.title.trim()) {
      setFeedback(t("please-enter-title"));
      return;
    }

    if (!values.description.trim()) {
      setFeedback(t("please-enter-description"));
      return;
    }

    // Clear any previous feedback
    setFeedback("");

    updateModule.mutate(
      {
        id: moduleId,
        title: values.title.trim(),
        description: values.description.trim(),
        contentIds: values.contentIds,
      },
      {
        onSuccess: () => {
          setFeedback(t("changes-saved"));
          onSuccess();
        },
        onError: (error) => {
          console.error("Module update failed:", error);
          setFeedback(t("couldnt-save-changes"));
        },
      }
    );
  };

  if (moduleQuery.isLoading || moduleContentsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Error state
  if (
    moduleQuery.isError ||
    moduleContentsQuery.isError ||
    !defaultValues ||
    !formValues
  ) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-600 mb-4">
          {t("couldnt-load-module-edit")}
        </p>
        <button
          onClick={onCancel}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {t("go-back-to-modules")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("edit-module")}</h1>
        <p className="text-muted-foreground">{t("edit-module-description")}</p>
      </div>

      <ModuleForm
        mode="edit"
        moduleId={moduleId}
        defaultValues={formValues}
        isSubmitting={updateModule.isPending}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        errorMessage={
          updateModule.isError
            ? t("couldnt-save-changes")
            : feedback || undefined
        }
        successMessage={updateModule.isSuccess ? t("changes-saved") : undefined}
      />
    </div>
  );
};
