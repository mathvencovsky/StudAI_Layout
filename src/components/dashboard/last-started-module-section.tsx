import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLastStartedModuleWithContents } from "@/hooks/modules/use-last-started-module-with-contents";
import { useToggleContentCompletion } from "@/hooks/modules/use-toggle-content-completion";
import { LastStartedModuleDisplay } from "./last-started-module-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LastStartedModuleSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLastStartedModuleWithContents();
  const toggleContentCompletionMutation = useToggleContentCompletion();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("failed-load-last-module")}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const handleModuleClick = () => {
    navigate({
      to: "/module/$moduleId",
      params: { moduleId: data.module.id },
    });
  };

  const handleContentClick = (contentId: string) => {
    navigate({
      to: "/module/$moduleId/content/$contentId",
      params: { contentId, moduleId: data.module.id },
    });
  };

  const handleToggleCompletion = (contentId: string) => {
    toggleContentCompletionMutation.mutate({
      moduleId: data.module.id,
      contentId,
      isCompleted: true,
    });
  };

  return (
    <LastStartedModuleDisplay
      module={data.module}
      contents={data.contents}
      totalContents={data.totalContents}
      completedCount={data.completedCount}
      onModuleClick={handleModuleClick}
      onContentClick={handleContentClick}
      onToggleCompletion={handleToggleCompletion}
    />
  );
};
