import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScenarioCardProps } from '../types';

// ============================================================================
// SCENARIO CARD COMPONENT
// ============================================================================

export function ScenarioCard({
  id,
  title,
  description,
  icon,
  selected,
  onClick,
  className
}: ScenarioCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/10',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={selected}
      aria-describedby={`${id}-description`}
    >
      {/* Selection Indicator */}
      <motion.div
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center',
          'transition-all duration-300',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30 bg-transparent'
        )}
        animate={{
          scale: selected ? 1 : 0.8,
          opacity: selected ? 1 : 0.6
        }}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Check className="w-3 h-3" />
          </motion.div>
        )}
      </motion.div>

      {/* Icon */}
      <div className="mb-4">
        <span className="text-3xl" role="img" aria-label={title}>
          {icon}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className={cn(
          'text-lg font-semibold mb-2 transition-colors duration-300',
          selected ? 'text-primary' : 'text-foreground'
        )}>
          {title}
        </h3>
        <p 
          id={`${id}-description`}
          className="text-sm text-muted-foreground leading-relaxed"
        >
          {description}
        </p>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent-warm/5 opacity-0 pointer-events-none"
        whileHover={{ opacity: selected ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// ============================================================================
// SCENARIO GRID COMPONENT
// ============================================================================

interface ScenarioGridProps {
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function ScenarioGrid({
  scenarios,
  selectedId,
  onSelect,
  className
}: ScenarioGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      className
    )}>
      {scenarios.map((scenario, index) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ScenarioCard
            id={scenario.id}
            title={scenario.title}
            description={scenario.description}
            icon={scenario.icon}
            selected={selectedId === scenario.id}
            onClick={() => onSelect(scenario.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// COMPACT SCENARIO CARD (for smaller spaces)
// ============================================================================

interface CompactScenarioCardProps {
  id: string;
  title: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function CompactScenarioCard({
  id,
  title,
  icon,
  selected,
  onClick,
  className
}: CompactScenarioCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-border bg-card hover:border-primary/50',
        className
      )}
      aria-pressed={selected}
    >
      <span className="text-2xl" role="img" aria-label={title}>
        {icon}
      </span>
      <span className="text-sm font-medium text-center leading-tight">
        {title}
      </span>
    </motion.button>
  );
}