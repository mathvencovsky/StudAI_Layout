import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModuleContentWithContentType } from "@/api/module-content";

export interface ContentItemDisplayProps {
  moduleContent: ModuleContentWithContentType;
  isCompleted: boolean;
  onClick: () => void;
  onToggleCompletion: () => void;
}

/**
 * Displays a module content item with completion toggle and metadata
 */
export const ContentItemDisplay = ({
  moduleContent,
  isCompleted,
  onClick,
  onToggleCompletion,
}: ContentItemDisplayProps) => {
  const { thumbnailUrl, author } = moduleContent.content;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/20 transition-colors">
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
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>

      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          className="w-16 h-12 object-cover rounded"
        />
      )}

      <button
        onClick={onClick}
        className="flex-1 text-left hover:opacity-75 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <h4
            className={`font-medium text-sm ${
              isCompleted ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {moduleContent.content.title}
          </h4>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
            {moduleContent.content.type}
          </span>
        </div>
        {author && <span className="text-xs text-muted-foreground">{author}</span>}
        {moduleContent.content.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {moduleContent.content.description}
          </p>
        )}
      </button>
    </div>
  );
};
