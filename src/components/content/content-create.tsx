import { ContentForm } from "@/components/content/forms/content-form";
import { useCreateContent } from "@/hooks/content/use-create-content";
import { type CreateContentInput } from "@/api/content";
import React, { useState } from "react";

export interface ContentCreateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyValues: Partial<CreateContentInput> = {};

/**
 * Container component that manages content creation state and API calls.
 * Passes data and handlers to the presentational ContentForm component.
 */
export const ContentCreate: React.FC<ContentCreateProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [feedback, setFeedback] = useState<string>("");
  const createMutation = useCreateContent();

  const handleSubmit = (values: CreateContentInput) => {
    const publishedAt =
      values.publishedAt && !isNaN(Date.parse(values.publishedAt))
        ? new Date(values.publishedAt).toISOString()
        : undefined;

    createMutation.mutate({ ...values, publishedAt }, {
      onSuccess: () => {
        setFeedback("Your content has been created successfully.");
        onSuccess();
      },
      onError: () => {
        setFeedback("We couldn't create your content. Please try again.");
      },
    });
  };

  return (
    <ContentForm
      mode="create"
      defaultValues={emptyValues}
      isSubmitting={createMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      errorMessage={
        createMutation.isError
          ? "We couldn't create your content. Please try again."
          : feedback || undefined
      }
      successMessage={
        createMutation.isSuccess ? "Your content has been created." : undefined
      }
    />
  );
};
