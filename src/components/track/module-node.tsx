import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { type ModuleProgressInfo } from "@/api/batch-module-progress";
import { cn } from "@/lib/utils";

export interface ModuleNodeProps {
  data: {
    label: string;
    moduleId: string;
    progress?: ModuleProgressInfo;
    isLoadingProgress?: boolean;
  };
}

const statusColors = {
  not_started: "border-border",
  in_progress: "border-yellow-500",
  completed: "border-green-500",
};

const progressBarColors = {
  not_started: "",
  in_progress: "[&>div]:bg-yellow-500",
  completed: "[&>div]:bg-green-500",
};

/**
 * Custom React Flow node for displaying modules with progress in the track flow
 */
export const ModuleNode = memo(({ data }: ModuleNodeProps) => {
  const { label, progress, isLoadingProgress } = data;
  const status = progress?.status ?? "not_started";

  return (
    <div
      className={cn(
        "px-4 py-2 rounded-md bg-card border-2 cursor-pointer hover:border-primary min-w-[180px]",
        statusColors[status],
      )}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-medium text-sm truncate">{label}</div>
      {isLoadingProgress && (
        <div className="mt-2 space-y-1">
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-8 mx-auto" />
        </div>
      )}
      {!isLoadingProgress && progress && progress.totalCount > 0 && (
        <div className="mt-2 space-y-1">
          <Progress
            value={progress.percentage}
            className={cn("h-1.5", progressBarColors[status])}
          />
          <div className="text-xs text-muted-foreground text-center">
            {progress.completedCount}/{progress.totalCount}
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";
