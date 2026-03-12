import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ============================================================================
// SECTION WRAPPER - Container principal para seções
// ============================================================================

type SectionVariant = "plain" | "tint" | "gradient" | "split" | "dark";

interface SectionWrapperProps {
  children: ReactNode;
  variant?: SectionVariant;
  compact?: boolean;
  id?: string;
  className?: string;
  tabIndex?: number;
  withNoise?: boolean;
}

const variantStyles: Record<SectionVariant, string> = {
  plain: "bg-background",
  tint: "bg-muted/50",
  gradient: "bg-gradient-to-br from-primary/5 via-background to-accent-warm/5",
  split: "bg-card border-y-2 border-border",
  dark: "bg-foreground text-background",
};

export function SectionWrapper({
  children,
  variant = "plain",
  compact = false,
  id,
  className,
  tabIndex,
  withNoise = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      tabIndex={tabIndex}
      className={cn(
        variantStyles[variant],
        compact ? "py-8 md:py-10" : "py-10 md:py-12 lg:py-14",
        "outline-none relative overflow-hidden",
        withNoise && "noise-bg",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}

// ============================================================================
// HEADLINE HIGHLIGHT - Destaque de texto com efeito marker
// ============================================================================

interface HeadlineHighlightProps {
  children: ReactNode;
  variant?: "warm" | "primary";
  className?: string;
}

export function HeadlineHighlight({ 
  children, 
  variant = "warm", 
  className 
}: HeadlineHighlightProps) {
  return (
    <span
      className={cn(
        "relative inline-block group",
        className
      )}
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block">
        {children}
      </span>
      {/* Organic marker/highlighter effect with gradient and animation */}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 right-0 h-[0.4em] -z-0 rounded-sm transform -rotate-[0.5deg]",
          "transition-all duration-300 group-hover:h-[0.5em] group-hover:-bottom-1",
          variant === "warm" 
            ? "bg-gradient-to-r from-accent-warm/20 via-accent-warm/30 to-accent-warm/20" 
            : "bg-gradient-to-r from-primary/15 via-primary/25 to-primary/15"
        )}
        aria-hidden="true"
      />
      {/* Subtle glow effect on hover */}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 right-0 h-[0.4em] -z-10 rounded-sm blur-md opacity-0",
          "transition-opacity duration-300 group-hover:opacity-100",
          variant === "warm" ? "bg-accent-warm/40" : "bg-primary/30"
        )}
        aria-hidden="true"
      />
    </span>
  );
}

// ============================================================================
// KICKER BADGE - Badge de categoria/seção
// ============================================================================

interface KickerBadgeProps {
  children: ReactNode;
  variant?: "warm" | "primary" | "cool";
  className?: string;
}

const variantBadgeStyles = {
  warm: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm shadow-sm hover:bg-accent-warm/15 hover:border-accent-warm/50",
  primary: "border-primary/40 bg-primary/10 text-primary shadow-sm hover:bg-primary/15 hover:border-primary/50",
  cool: "border-accent-cool/40 bg-accent-cool/10 text-accent-cool shadow-sm hover:bg-accent-cool/15 hover:border-accent-cool/50",
};

export function KickerBadge({ 
  children, 
  variant = "warm", 
  className 
}: KickerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1.5",
        "text-xs font-semibold rounded-full border-2 tracking-wide uppercase leading-tight",
        "max-w-full min-w-0 transition-all duration-200",
        variantBadgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================================================
// SECTION DIVIDER - Divisores de seção
// ============================================================================

interface SectionDividerProps {
  variant?: "wave" | "dots" | "gradient" | "shine";
  className?: string;
  flip?: boolean;
}

export function SectionDivider({ 
  variant = "gradient", 
  className,
  flip = false 
}: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className={cn("w-full overflow-hidden", flip && "rotate-180", className)}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-8 md:h-12 fill-current text-muted/30"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex justify-center gap-2 py-4", className)}>
        <span className="w-2 h-2 rounded-full bg-accent-warm/40 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-accent-warm/40 animate-pulse [animation-delay:300ms]" />
      </div>
    );
  }

  if (variant === "shine") {
    return (
      <div className={cn("relative h-px w-full max-w-2xl mx-auto overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer" />
      </div>
    );
  }

  // Gradient divider (default)
  return (
    <div 
      className={cn(
        "h-px w-full max-w-2xl mx-auto",
        "bg-gradient-to-r from-transparent via-border to-transparent",
        className
      )} 
    />
  );
}

// ============================================================================
// FLOATING CARD - Card com efeito flutuante
// ============================================================================

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ 
  children, 
  className,
  delay = 0 
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-border bg-card p-6",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/50",
        "animate-float",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// GRADIENT TEXT - Texto com gradiente animado
// ============================================================================

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export function GradientText({ 
  children, 
  className,
  animated = false 
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-accent-warm to-primary bg-clip-text text-transparent",
        animated && "bg-[length:200%_auto] animate-gradient",
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================================================
// SHIMMER BUTTON - Botão com efeito shimmer
// ============================================================================

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ShimmerButton({ 
  children, 
  className,
  onClick 
}: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3",
        "rounded-lg font-semibold text-sm",
        "bg-primary text-primary-foreground",
        "overflow-hidden group",
        "transition-all duration-300",
        "hover:shadow-lg hover:scale-105",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {/* Shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}
