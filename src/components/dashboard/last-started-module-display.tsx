import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { ContentItemDisplay } from "./content-item-display";
import type { Module } from "@/model/module";
import type { ModuleContentWithCompletionStatus } from "@/hooks/modules/use-last-started-module-with-contents";

export interface LastStartedModuleDisplayProps {
  module: Module;
  moduleContents: ModuleContentWithCompletionStatus[];
  totalModuleContents: number;
  completedCount: number;
  onContentClick: (contentId: string) => void;
  onModuleClick: () => void;
  onToggleCompletion: (contentId: string) => void;
}

export const LastStartedModuleDisplay = ({
  module,
  moduleContents,
  totalModuleContents,
  completedCount,
  onContentClick,
  onModuleClick,
  onToggleCompletion,
}: LastStartedModuleDisplayProps) => {
  const { t } = useTranslation();
  const progressPercentage =
    totalModuleContents > 0 ? (completedCount / totalModuleContents) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onModuleClick}
      >
        <CardTitle className="text-lg">{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("progress-label")}</span>
            <span className="font-medium text-gray-900">
              {completedCount} {t("of-completed")} {totalModuleContents}{" "}
              {t("completed")}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {moduleContents.map((moduleContent) => (
            <ContentItemDisplay
              key={moduleContent.id}
              moduleContent={moduleContent}
              isCompleted={moduleContent.isCompleted}
              onClick={() => onContentClick(moduleContent.contentId)}
              onToggleCompletion={() =>
                onToggleCompletion(moduleContent.contentId)
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
