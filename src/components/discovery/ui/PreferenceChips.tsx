import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreferenceChipProps } from '../types';

// ============================================================================
// PREFERENCE CHIP COMPONENT
// ============================================================================

export function PreferenceChip({
  id,
  label,
  selected,
  onClick,
  icon,
  className
}: PreferenceChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'text-sm font-medium',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-card hover:border-primary/50 text-foreground',
        className
      )}
      aria-pressed={selected}
    >
      {/* Icon */}
      {icon && (
        <span className="text-base" role="img" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Label */}
      <span>{label}</span>

      {/* Selection Indicator */}
      <motion.div
        className="flex items-center justify-center"
        animate={{
          scale: selected ? 1 : 0.8,
          opacity: selected ? 1 : 0.6
        }}
      >
        {selected ? (
          <Check className="w-3 h-3" />
        ) : (
          <Plus className="w-3 h-3" />
        )}
      </motion.div>
    </motion.button>
  );
}

// ============================================================================
// PREFERENCE CHIPS GROUP
// ============================================================================

interface PreferenceChipsGroupProps {
  title?: string;
  description?: string;
  chips: Array<{
    id: string;
    label: string;
    icon?: string;
    description?: string;
  }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelections?: number;
  minSelections?: number;
  className?: string;
}

export function PreferenceChipsGroup({
  title,
  description,
  chips,
  selectedIds,
  onToggle,
  maxSelections,
  minSelections = 0,
  className
}: PreferenceChipsGroupProps) {
  const canSelectMore = !maxSelections || selectedIds.length < maxSelections;
  const hasMinimumSelections = selectedIds.length >= minSelections;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Selection Info */}
      {(maxSelections || minSelections > 0) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {minSelections > 0 && `Mínimo: ${minSelections}`}
            {minSelections > 0 && maxSelections && ' • '}
            {maxSelections && `Máximo: ${maxSelections}`}
          </span>
          <span>
            {selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => {
          const isSelected = selectedIds.includes(chip.id);
          const canSelect = isSelected || canSelectMore;

          return (
            <motion.div
              key={chip.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <PreferenceChip
                id={chip.id}
                label={chip.label}
                icon={chip.icon}
                selected={isSelected}
                onClick={() => canSelect && onToggle(chip.id)}
                className={cn(
                  !canSelect && !isSelected && 'opacity-50 cursor-not-allowed'
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Validation Message */}
      {minSelections > 0 && !hasMinimumSelections && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-destructive"
        >
          Selecione pelo menos {minSelections} opç{minSelections === 1 ? 'ão' : 'ões'}
        </motion.p>
      )}

      {/* Max Selection Warning */}
      {maxSelections && selectedIds.length >= maxSelections && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-amber-600"
        >
          Limite máximo de {maxSelections} seleções atingido
        </motion.p>
      )}
    </div>
  );
}

// ============================================================================
// PRIORITY CHIPS (with drag-to-reorder)
// ============================================================================

interface PriorityChipsProps {
  title?: string;
  chips: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  priorityOrder: string[];
  onReorder: (newOrder: string[]) => void;
  className?: string;
}

export function PriorityChips({
  title,
  chips,
  priorityOrder,
  onReorder,
  className
}: PriorityChipsProps) {
  const handleMoveUp = (id: string) => {
    const currentIndex = priorityOrder.indexOf(id);
    if (currentIndex > 0) {
      const newOrder = [...priorityOrder];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = 
      [newOrder[currentIndex], newOrder[currentIndex - 1]];
      onReorder(newOrder);
    }
  };

  const handleMoveDown = (id: string) => {
    const currentIndex = priorityOrder.indexOf(id);
    if (currentIndex < priorityOrder.length - 1) {
      const newOrder = [...priorityOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
      [newOrder[currentIndex + 1], newOrder[currentIndex]];
      onReorder(newOrder);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
      )}

      <div className="space-y-2">
        {priorityOrder.map((id, index) => {
          const chip = chips.find(c => c.id === id);
          if (!chip) return null;

          return (
            <motion.div
              key={id}
              layout
              className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
            >
              {/* Priority Number */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                {index + 1}
              </div>

              {/* Chip Content */}
              <div className="flex-1 flex items-center gap-2">
                {chip.icon && (
                  <span className="text-base" role="img" aria-hidden="true">
                    {chip.icon}
                  </span>
                )}
                <span className="font-medium">{chip.label}</span>
              </div>

              {/* Move Controls */}
              <div className="flex gap-1">
                <button
                  onClick={() => handleMoveUp(id)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(id)}
                  disabled={index === priorityOrder.length - 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}