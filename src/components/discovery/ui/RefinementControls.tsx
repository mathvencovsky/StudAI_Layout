import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Clock, 
  Zap, 
  Target, 
  BookOpen, 
  TrendingUp,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RefinementControlsProps, RefinementOption } from '../types';
import { REFINEMENT_OPTIONS } from '../constants';

// ============================================================================
// REFINEMENT CONTROLS COMPONENT
// ============================================================================

export function RefinementControls({
  options = REFINEMENT_OPTIONS,
  onRefine,
  className
}: RefinementControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRefinements, setSelectedRefinements] = useState<string[]>([]);

  const handleRefinementToggle = (optionId: string) => {
    const option = options.find(o => o.id === optionId);
    if (!option) return;

    const isSelected = selectedRefinements.includes(optionId);
    
    if (isSelected) {
      setSelectedRefinements(prev => prev.filter(id => id !== optionId));
    } else {
      setSelectedRefinements(prev => [...prev, optionId]);
    }
  };

  const handleApplyRefinements = () => {
    selectedRefinements.forEach(refinementId => {
      const option = options.find(o => o.id === refinementId);
      if (option) {
        onRefine(option);
      }
    });
    setSelectedRefinements([]);
    setIsExpanded(false);
  };

  const handleReset = () => {
    setSelectedRefinements([]);
    // Could trigger a reset refinement
    onRefine({
      id: 'reset',
      label: 'Resetar',
      action: 'reset',
      value: null
    });
  };

  const groupedOptions = groupRefinementOptions(options);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Ajustar recomendação
        </h3>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {isExpanded ? 'Ocultar opções' : 'Mostrar opções'}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Quick Actions (always visible) */}
      <div className="flex flex-wrap gap-2">
        <QuickRefinementButton
          icon={Clock}
          label="Mais rápido"
          onClick={() => onRefine(options.find(o => o.id === 'faster')!)}
          variant="outline"
        />
        <QuickRefinementButton
          icon={Zap}
          label="Mais prático"
          onClick={() => onRefine(options.find(o => o.id === 'practical')!)}
          variant="outline"
        />
        <QuickRefinementButton
          icon={Target}
          label="Foco carreira"
          onClick={() => onRefine(options.find(o => o.id === 'career_focused')!)}
          variant="outline"
        />
      </div>

      {/* Expanded Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Grouped Refinement Options */}
            {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {getCategoryLabel(category)}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryOptions.map((option) => (
                    <RefinementOptionCard
                      key={option.id}
                      option={option}
                      selected={selectedRefinements.includes(option.id)}
                      onToggle={() => handleRefinementToggle(option.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar ajustes
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleApplyRefinements}
                  disabled={selectedRefinements.length === 0}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Aplicar ajustes ({selectedRefinements.length})
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// QUICK REFINEMENT BUTTON
// ============================================================================

interface QuickRefinementButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
  className?: string;
}

function QuickRefinementButton({
  icon: Icon,
  label,
  onClick,
  variant = 'outline',
  className
}: QuickRefinementButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        size="sm"
        onClick={onClick}
        className={cn('flex items-center gap-2', className)}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Button>
    </motion.div>
  );
}

// ============================================================================
// REFINEMENT OPTION CARD
// ============================================================================

interface RefinementOptionCardProps {
  option: RefinementOption;
  selected: boolean;
  onToggle: () => void;
}

function RefinementOptionCard({
  option,
  selected,
  onToggle
}: RefinementOptionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={cn(
        'p-3 rounded-lg border-2 text-left transition-all duration-300',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/50'
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <h5 className={cn(
          'font-medium text-sm',
          selected ? 'text-primary' : 'text-foreground'
        )}>
          {option.label}
        </h5>
        
        <div className={cn(
          'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300',
          selected
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/30'
        )}>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-primary-foreground rounded-full"
            />
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground leading-relaxed">
        {option.description}
      </p>
    </motion.button>
  );
}

// ============================================================================
// SIMPLE REFINEMENT CONTROLS (compact version)
// ============================================================================

interface SimpleRefinementControlsProps {
  onRefine: (option: RefinementOption) => void;
  className?: string;
}

export function SimpleRefinementControls({
  onRefine,
  className
}: SimpleRefinementControlsProps) {
  const quickOptions = [
    { id: 'faster', icon: Clock, label: 'Mais rápido' },
    { id: 'practical', icon: Zap, label: 'Mais prático' },
    { id: 'easier', icon: BookOpen, label: 'Mais básico' },
    { id: 'career_focused', icon: Target, label: 'Foco carreira' }
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium text-foreground">
        Não é bem o que procura?
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {quickOptions.map((option) => {
          const refinementOption = REFINEMENT_OPTIONS.find(o => o.id === option.id);
          if (!refinementOption) return null;

          return (
            <QuickRefinementButton
              key={option.id}
              icon={option.icon}
              label={option.label}
              onClick={() => onRefine(refinementOption)}
              variant="outline"
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function groupRefinementOptions(options: RefinementOption[]) {
  return options.reduce((groups, option) => {
    const category = option.action;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(option);
    return groups;
  }, {} as Record<string, RefinementOption[]>);
}

function getCategoryIcon(category: string) {
  const icons = {
    adjust_duration: <Clock className="w-4 h-4" />,
    adjust_difficulty: <TrendingUp className="w-4 h-4" />,
    adjust_format: <BookOpen className="w-4 h-4" />,
    adjust_focus: <Target className="w-4 h-4" />
  };
  return icons[category as keyof typeof icons] || <Settings className="w-4 h-4" />;
}

function getCategoryLabel(category: string): string {
  const labels = {
    adjust_duration: 'Duração',
    adjust_difficulty: 'Dificuldade',
    adjust_format: 'Formato',
    adjust_focus: 'Foco'
  };
  return labels[category as keyof typeof labels] || category;
}