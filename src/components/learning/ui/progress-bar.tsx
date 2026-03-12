import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'lesson' | 'module' | 'track';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  lesson: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    fill: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300"
  },
  module: {
    bg: "bg-green-100 dark:bg-green-900/20", 
    fill: "bg-green-500",
    text: "text-green-700 dark:text-green-300"
  },
  track: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    fill: "bg-gradient-to-r from-purple-500 to-pink-500",
    text: "text-purple-700 dark:text-purple-300"
  }
};

const sizeStyles = {
  sm: "h-2",
  md: "h-3", 
  lg: "h-4"
};

export function ProgressBar({
  current,
  total,
  variant = 'lesson',
  showLabel = true,
  animated = true,
  className,
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const styles = variantStyles[variant];

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className={cn("font-medium", styles.text)}>
            {variant === 'lesson' && 'Progresso da Aula'}
            {variant === 'module' && 'Progresso do Módulo'}  
            {variant === 'track' && 'Progresso da Trilha'}
          </span>
          <span className={cn("text-xs", styles.text)}>
            {current} de {total} {variant === 'lesson' ? 'seções' : 'itens'}
          </span>
        </div>
      )}
      
      <div className={cn(
        "relative overflow-hidden rounded-full",
        styles.bg,
        sizeStyles[size]
      )}>
        {animated ? (
          <motion.div
            className={cn("h-full rounded-full", styles.fill)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.2 
            }}
          />
        ) : (
          <div 
            className={cn("h-full rounded-full transition-all duration-500", styles.fill)}
            style={{ width: `${percentage}%` }}
          />
        )}
        
        {/* Shine effect for track progress */}
        {variant === 'track' && percentage > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
      </div>
      
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(percentage)}% concluído</span>
          {variant === 'track' && (
            <span>🏆 {Math.round((current / total) * 2000)} XP</span>
          )}
        </div>
      )}
    </div>
  );
}