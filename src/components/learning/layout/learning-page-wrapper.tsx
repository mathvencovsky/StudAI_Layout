import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LearningPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function LearningPageWrapper({ 
  children, 
  className 
}: LearningPageWrapperProps) {
  return (
    <div className={cn(
      "min-h-[calc(100vh-120px)] bg-background",
      "learning-page-container",
      className
    )}>
      {children}
    </div>
  );
}