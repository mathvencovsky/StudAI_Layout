import { cn } from "@/lib/utils";

interface SidebarContainerProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
  className?: string;
}

const widthStyles = {
  sm: "w-64",
  md: "w-80", 
  lg: "w-96"
};

export function SidebarContainer({
  children,
  side = 'right',
  width = 'md',
  className
}: SidebarContainerProps) {
  return (
    <div className={cn(
      "border-l bg-card",
      widthStyles[width],
      side === 'left' && "border-l-0 border-r",
      className
    )}>
      {children}
    </div>
  );
}