import { cn } from "@/lib/utils";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
}

const maxWidthStyles = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full"
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

export function ContentContainer({
  children,
  className,
  maxWidth = 'lg',
  padding = 'md'
}: ContentContainerProps) {
  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidthStyles[maxWidth],
      paddingStyles[padding],
      className
    )}>
      {children}
    </div>
  );
}