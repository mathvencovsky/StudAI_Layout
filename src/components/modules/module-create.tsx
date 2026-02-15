import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type ModuleFormValues,
  ModuleForm,
} from "@/components/modules/forms/module-form";
import { useCreateModule } from "@/hooks/modules/use-create-module";

export interface ModuleCreateProps {
  onSuccess: () => void; // e.g., navigate back to modules list after create
  onCancel: () => void; // e.g., navigate back to modules list without saving
}

export const ModuleCreate: React.FC<ModuleCreateProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<string>("");

  const createModule = useCreateModule();

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

    createModule.mutate(
      {
        title: values.title.trim(),
        description: values.description.trim(),
        contentIds: values.contentIds,
      },
      {
        onSuccess: () => {
          setFeedback(t("module-created-success"));
          onSuccess();
        },
        onError: (error) => {
          console.error("Module creation failed:", error);
          setFeedback(t("couldnt-create-module"));
        },
      }
    );
  };

  return (
    <ModuleForm
      mode="create"
      defaultValues={{}}
      isSubmitting={createModule.isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      errorMessage={
        createModule.isError
          ? t("couldnt-create-module")
          : feedback || undefined
      }
      successMessage={
        createModule.isSuccess ? t("module-created-success") : undefined
      }
    />
  );
};
