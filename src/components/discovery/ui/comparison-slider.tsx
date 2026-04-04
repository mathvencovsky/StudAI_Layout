
import { motion } from 'framer-motion';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
interface ComparisonSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

// ============================================================================
// COMPARISON SLIDER COMPONENT
// ============================================================================

export function ComparisonSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  className
}: ComparisonSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const isLeftSide = percentage < 50;
  const isRightSide = percentage > 50;
  const isCenter = percentage === 50;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {label}
        </h3>
      </div>

      {/* Slider Container */}
      <div className="relative px-4">
        {/* Left/Right Labels */}
        <div className="flex justify-between items-center mb-6">
          <div className={cn(
            'text-sm font-medium transition-all duration-300 text-center max-w-[120px]',
            isLeftSide ? 'text-primary scale-105' : 'text-muted-foreground'
          )}>
            {leftLabel}
          </div>
          <div className={cn(
            'text-sm font-medium transition-all duration-300 text-center max-w-[120px]',
            isRightSide ? 'text-primary scale-105' : 'text-muted-foreground'
          )}>
            {rightLabel}
          </div>
        </div>

        {/* Custom Slider */}
        <div className="relative">
          <SliderPrimitive.Root
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            min={min}
            max={max}
            step={step}
            className="relative flex w-full touch-none select-none items-center"
          >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          </SliderPrimitive.Root>

          {/* Visual Indicators */}
          <div className="absolute top-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            <span>←</span>
            <span className={cn(
              'transition-opacity duration-300',
              isCenter ? 'opacity-100' : 'opacity-50'
            )}>
              Equilibrado
            </span>
            <span>→</span>
          </div>
        </div>

        {/* Current Value Indicator */}
        <motion.div
          className="mt-4 text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          key={value}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">
              {getCurrentDescription(percentage, leftLabel, rightLabel)}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// TIME SLIDER (specialized for time selection)
// ============================================================================

interface TimeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: 'hours' | 'months' | 'weeks';
  className?: string;
}

export function TimeSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 20,
  unit = 'hours',
  className
}: TimeSliderProps) {
  const getTimeLabel = (val: number) => {
    if (unit === 'hours') {
      return `${val}h por semana`;
    }
    if (unit === 'months') {
      return `${val} ${val === 1 ? 'mês' : 'meses'}`;
    }
    if (unit === 'weeks') {
      return `${val} ${val === 1 ? 'semana' : 'semanas'}`;
    }
    return `${val}`;
  };

  const getIntensityColor = (val: number) => {
    const percentage = ((val - min) / (max - min)) * 100;
    if (percentage < 33) return 'text-green-600';
    if (percentage < 66) return 'text-amber-600';
    return 'text-red-600';
  };

  const getIntensityLabel = (val: number) => {
    const percentage = ((val - min) / (max - min)) * 100;
    if (percentage < 33) return 'Tranquilo';
    if (percentage < 66) return 'Moderado';
    return 'Intenso';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {label}
        </h3>
      </div>

      {/* Slider */}
      <div className="px-4">
        <SliderPrimitive.Root
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={1}
          className="relative flex w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>

        {/* Value Display */}
        <div className="mt-4 text-center space-y-2">
          <motion.div
            className="text-2xl font-bold text-primary"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            key={value}
          >
            {getTimeLabel(value)}
          </motion.div>
          
          <div className={cn(
            'text-sm font-medium',
            getIntensityColor(value)
          )}>
            {getIntensityLabel(value)}
          </div>
        </div>

        {/* Range Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{getTimeLabel(min)}</span>
          <span>{getTimeLabel(max)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MULTI COMPARISON SLIDER (for multiple comparisons)
// ============================================================================

interface MultiComparisonSliderProps {
  comparisons: Array<{
    id: string;
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number;
  }>;
  onChange: (id: string, value: number) => void;
  className?: string;
}

export function MultiComparisonSlider({
  comparisons,
  onChange,
  className
}: MultiComparisonSliderProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {comparisons.map((comparison, index) => (
        <motion.div
          key={comparison.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ComparisonSlider
            label={comparison.label}
            leftLabel={comparison.leftLabel}
            rightLabel={comparison.rightLabel}
            value={comparison.value}
            onChange={(value) => onChange(comparison.id, value)}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCurrentDescription(percentage: number, leftLabel: string, rightLabel: string): string {
  if (percentage < 20) return `Muito mais ${leftLabel.toLowerCase()}`;
  if (percentage < 40) return `Mais ${leftLabel.toLowerCase()}`;
  if (percentage < 60) return 'Equilibrado';
  if (percentage < 80) return `Mais ${rightLabel.toLowerCase()}`;
  return `Muito mais ${rightLabel.toLowerCase()}`;
}