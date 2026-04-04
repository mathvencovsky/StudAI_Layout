
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// ============================================================================
// STEP NAVIGATION COMPONENT
// ============================================================================

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isLoading?: boolean;
  onNext: () => void;
  onBack: () => void;
  onRestart?: () => void;
  className?: string;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  canProceed,
  isLoading = false,
  onNext,
  onBack,
  onRestart,
  className
}: StepNavigationProps) {
  const { t } = useTranslation();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* Back Button */}
      <div className="flex items-center gap-3">
        {!isFirstStep ? (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("discovery-back")}
          </Button>
        ) : (
          <div /> // Spacer
        )}

        {/* Restart Button (only show after first step) */}
        {currentStep > 0 && onRestart && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Recomeçar
          </Button>
        )}
      </div>

      {/* Next/Continue Button */}
      <div className="flex items-center gap-3">
        {/* Step Counter (mobile) */}
        <div className="md:hidden text-sm text-muted-foreground">
          {currentStep + 1}/{totalSteps}
        </div>

        {/* Primary Action Button */}
        <motion.div
          whileHover={{ scale: canProceed && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: canProceed && !isLoading ? 0.98 : 1 }}
        >
          <Button
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className={cn(
              'flex items-center gap-2 min-w-[120px]',
              isLastStep && 'bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("discovery-next")}
              </>
            ) : (
              <>
                {t("discovery-next")}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT NAVIGATION (for mobile/inline use)
// ============================================================================

interface CompactNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isLoading?: boolean;
  onNext: () => void;
  onBack: () => void;
  className?: string;
}

export function CompactNavigation({
  currentStep,
  totalSteps,
  canProceed,
  isLoading = false,
  onNext,
  onBack,
  className
}: CompactNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {/* Back Button */}
      {!isFirstStep && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar
        </Button>
      )}

      {/* Progress Dots */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index <= currentStep
                ? 'bg-primary'
                : 'bg-muted-foreground/30'
            )}
          />
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed || isLoading}
        size="sm"
        className="flex items-center gap-1"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            {isLastStep ? 'Finalizar' : 'Próximo'}
            {!isLastStep && <ArrowRight className="w-3 h-3" />}
          </>
        )}
      </Button>
    </div>
  );
}

// ============================================================================
// FLOATING NAVIGATION (sticky bottom navigation)
// ============================================================================

interface FloatingNavigationProps extends StepNavigationProps {
  visible: boolean;
}

export function FloatingNavigation({
  visible,
  ...props
}: FloatingNavigationProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: visible ? 0 : 100, 
        opacity: visible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <CompactNavigation {...props} />
      </div>
    </motion.div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================