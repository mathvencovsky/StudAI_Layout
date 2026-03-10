import React from 'react';
import { motion } from 'framer-motion';
import { ScenarioGrid } from '../ui/ScenarioCard';
import { StepProps, ContextType } from '../types';
import { CONTEXT_SCENARIOS, MICROCOPY } from '../constants';

// ============================================================================
// CONTEXT STEP COMPONENT
// ============================================================================

export function ContextStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const selectedContext = userProfile.context;

  const handleContextSelect = (contextId: string) => {
    onUpdate({ context: contextId as ContextType });
  };

  const canProceed = !!selectedContext;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Qual situação mais parece com você?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Isso nos ajuda a entender seu ponto de partida e personalizar as recomendações
          para seu momento atual de aprendizado.
        </p>
      </motion.div>

      {/* Scenario Selection */}
      <ScenarioGrid
        scenarios={CONTEXT_SCENARIOS}
        selectedId={selectedContext}
        onSelect={handleContextSelect}
      />

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          {MICROCOPY.helpMessages.context}
        </p>
      </motion.div>

      {/* Selected Context Details */}
      {selectedContext && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {CONTEXT_SCENARIOS.find(s => s.id === selectedContext)?.icon}
            </span>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                {CONTEXT_SCENARIOS.find(s => s.id === selectedContext)?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {CONTEXT_SCENARIOS.find(s => s.id === selectedContext)?.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Validation Message */}
      {!canProceed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            👆 Selecione uma opção para continuar
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// CONTEXT STEP VARIANTS
// ============================================================================

// Compact version for smaller screens or embedded use
export function CompactContextStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const selectedContext = userProfile.context;

  const handleContextSelect = (contextId: string) => {
    onUpdate({ context: contextId as ContextType });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">
        Sua situação atual
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {CONTEXT_SCENARIOS.map((scenario) => (
          <motion.button
            key={scenario.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleContextSelect(scenario.id)}
            className={`p-3 rounded-lg border-2 text-left transition-all duration-300 ${
              selectedContext === scenario.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="text-xl mb-1">{scenario.icon}</div>
            <div className="text-sm font-medium">{scenario.title}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}