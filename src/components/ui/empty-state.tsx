import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: LucideIcon;
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div
      className="flex items-center justify-center min-h-[400px]"
      data-empty-state
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
        {Icon && <Icon className="h-16 w-16 text-muted-foreground/50" />}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action && (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
