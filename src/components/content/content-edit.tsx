import React, { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentForm } from "@/components/content/forms/content-form";
import { useGetContent } from "@/hooks/content/use-get-content";
import { useUpdateContent } from "@/hooks/content/use-update-content";
import { type CreateContentInput } from "@/api/content";

export interface ContentEditProps {
  id: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Container component that manages content editing state and API calls.
 * Fetches existing content data and passes it to the presentational form component.
 */
export const ContentEdit: React.FC<ContentEditProps> = ({
  id,
  onSuccess,
  onCancel,
}) => {
  const [feedback, setFeedback] = useState<string>("");
  const contentQuery = useGetContent(id);
  const updateMutation = useUpdateContent();

  const defaultValues: CreateContentInput | null = useMemo(() => {
    if (!contentQuery.data) return null;
    const content = contentQuery.data;
    return {
      type: content.type,
      category: content.category,
      level: content.level,
      title: content.title,
      description: content.description,
      link: content.link,
      durationInSeconds: content.durationInSeconds,
    };
  }, [contentQuery.data]);

  const handleSubmit = (values: CreateContentInput) => {
    updateMutation.mutate(
      { id, ...values },
      {
        onSuccess: () => {
          setFeedback("Your changes have been saved.");
          onSuccess();
        },
        onError: () => {
          setFeedback("We couldn't save your changes. Please try again.");
        },
      }
    );
  };

  if (contentQuery.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (contentQuery.isError || !defaultValues) {
    return (
      <p className="text-sm text-red-600">
        We couldn't load this item for editing.
      </p>
    );
  }

  return (
    <ContentForm
      mode="edit"
      defaultValues={defaultValues}
      isSubmitting={updateMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      errorMessage={
        updateMutation.isError
          ? "We couldn't save your changes. Please try again."
          : feedback || undefined
      }
      successMessage={
        updateMutation.isSuccess ? "Your changes have been saved." : undefined
      }
    />
  );
};
