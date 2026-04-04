
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// PROGRESS INDICATOR COMPONENT
// ============================================================================

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  className
}: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="relative mb-6">
        {/* Background Track */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          {/* Progress Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step Indicators */}
        <div className="absolute top-0 left-0 right-0 flex justify-between transform -translate-y-1">
          {Array.from({ length: totalSteps }, (_, index) => (
            <motion.div
              key={index}
              className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                'transition-all duration-300',
                index <= currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-muted-foreground/30 text-muted-foreground'
              )}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.2 : 1,
                borderColor: index <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)'
              }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? (
                <motion.svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.path
                    d="M2 5L4 7L8 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              ) : (
                <span className="text-xs font-medium">
                  {index + 1}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Step Info - Mobile */}
      <div className="md:hidden text-center">
        <div className="text-sm font-medium text-foreground mb-1">
          {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {Math.round(progressPercentage)}% concluído
        </span>
        <span className="text-muted-foreground">
          {currentStep + 1}/{totalSteps} etapas
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// MINI PROGRESS INDICATOR (for mobile/compact views)
// ============================================================================

interface MiniProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function MiniProgressIndicator({
  currentStep,
  totalSteps,
  className
}: MiniProgressIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Dots */}
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index <= currentStep
                ? 'bg-primary'
                : 'bg-muted-foreground/30'
            )}
            animate={{
              scale: index === currentStep ? 1.2 : 1
            }}
          />
        ))}
      </div>

      {/* Text */}
      <span className="text-xs text-muted-foreground ml-2">
        {currentStep + 1}/{totalSteps}
      </span>
    </div>
  );
}