import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentInModuleView } from "@/api/module-content";

export interface ContentItemDisplayProps {
  content: ContentInModuleView;
  isCompleted: boolean;
  onClick: () => void;
  onToggleCompletion: () => void;
}

export const ContentItemDisplay = ({
  content,
  isCompleted,
  onClick,
  onToggleCompletion,
}: ContentItemDisplayProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <Button
        variant="ghost"
        size="sm"
        className="mt-0.5 p-0 h-auto"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompletion();
        }}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </Button>

      <button
        onClick={onClick}
        className="flex-1 text-left hover:opacity-75 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <h4
            className={`font-medium text-sm ${
              isCompleted ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {content.title}
          </h4>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {content.type}
          </span>
        </div>
        {content.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {content.description}
          </p>
        )}
      </button>
    </div>
  );
};
