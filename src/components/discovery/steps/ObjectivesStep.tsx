import React from 'react';
import { motion } from 'framer-motion';
import { PreferenceChipsGroup } from '../ui/PreferenceChips';
import { StepProps, ObjectiveType } from '../types';
import { OBJECTIVE_OPTIONS, MICROCOPY } from '../constants';

// ============================================================================
// OBJECTIVES STEP COMPONENT
// ============================================================================

export function ObjectivesStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const selectedObjectives = userProfile.objectives || [];

  const handleObjectiveToggle = (objectiveId: string) => {
    const currentObjectives = selectedObjectives;
    const isSelected = currentObjectives.includes(objectiveId);

    let newObjectives: string[];
    if (isSelected) {
      newObjectives = currentObjectives.filter(id => id !== objectiveId);
    } else {
      newObjectives = [...currentObjectives, objectiveId];
    }

    onUpdate({ objectives: newObjectives });
  };

  const canProceed = selectedObjectives.length > 0;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          O que você quer alcançar?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Selecione seus principais objetivos. Você pode escolher mais de um,
          mas recomendamos focar em até 3 para melhores resultados.
        </p>
      </motion.div>

      {/* Objectives Selection */}
      <PreferenceChipsGroup
        chips={OBJECTIVE_OPTIONS}
        selectedIds={selectedObjectives}
        onToggle={handleObjectiveToggle}
        maxSelections={3}
        minSelections={1}
      />

      {/* Selected Objectives Summary */}
      {selectedObjectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Seus objetivos selecionados
          </h3>
          <div className="space-y-2">
            {selectedObjectives.map((objectiveId, index) => {
              const objective = OBJECTIVE_OPTIONS.find(o => o.id === objectiveId);
              if (!objective) return null;

              return (
                <motion.div
                  key={objectiveId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-2 bg-background/50 rounded-lg"
                >
                  <span className="text-lg mt-0.5" role="img" aria-hidden="true">
                    {objective.icon}
                  </span>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {objective.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {objective.description}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Priority Indication */}
      {selectedObjectives.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm mb-1">
                Múltiplos objetivos selecionados
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Vamos priorizar o primeiro objetivo selecionado, mas suas trilhas
                incluirão elementos dos outros objetivos também.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          {MICROCOPY.helpMessages.objectives}
        </p>
      </motion.div>

      {/* Validation Message */}
      {!canProceed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-center"
        >
          <p className="text-sm text-destructive">
            Selecione pelo menos um objetivo para continuar
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// OBJECTIVES PRIORITY STEP (alternative version with ranking)
// ============================================================================

export function ObjectivesPriorityStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const selectedObjectives = userProfile.objectives || [];
  const objectivePriority = userProfile.preferences?.objectivePriority || selectedObjectives;

  const handlePriorityChange = (newOrder: string[]) => {
    onUpdate({
      preferences: {
        ...userProfile.preferences,
        objectivePriority: newOrder
      }
    });
  };

  const handleObjectiveToggle = (objectiveId: string) => {
    const isSelected = selectedObjectives.includes(objectiveId);
    let newObjectives: string[];

    if (isSelected) {
      newObjectives = selectedObjectives.filter(id => id !== objectiveId);
      // Also remove from priority order
      const newPriority = objectivePriority.filter(id => id !== objectiveId);
      handlePriorityChange(newPriority);
    } else {
      newObjectives = [...selectedObjectives, objectiveId];
      // Add to end of priority order
      handlePriorityChange([...objectivePriority, objectiveId]);
    }

    onUpdate({ objectives: newObjectives });
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Defina seus objetivos e prioridades
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Primeiro selecione seus objetivos, depois organize-os por ordem de importância.
        </p>
      </motion.div>

      {/* Step 1: Select Objectives */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          1. Selecione seus objetivos
        </h3>
        <PreferenceChipsGroup
          chips={OBJECTIVE_OPTIONS}
          selectedIds={selectedObjectives}
          onToggle={handleObjectiveToggle}
          maxSelections={3}
          minSelections={1}
        />
      </div>

      {/* Step 2: Prioritize (only show if multiple objectives selected) */}
      {selectedObjectives.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium text-foreground">
            2. Organize por prioridade
          </h3>
          <p className="text-sm text-muted-foreground">
            Arraste para reordenar ou use os botões de seta
          </p>
          
          <div className="space-y-2">
            {objectivePriority.map((objectiveId, index) => {
              const objective = OBJECTIVE_OPTIONS.find(o => o.id === objectiveId);
              if (!objective || !selectedObjectives.includes(objectiveId)) return null;

              return (
                <motion.div
                  key={objectiveId}
                  layout
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
                >
                  {/* Priority Number */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Objective Info */}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-base" role="img" aria-hidden="true">
                      {objective.icon}
                    </span>
                    <span className="font-medium">{objective.label}</span>
                  </div>

                  {/* Move Controls */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        if (index > 0) {
                          const newOrder = [...objectivePriority];
                          [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                          handlePriorityChange(newOrder);
                        }
                      }}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => {
                        if (index < objectivePriority.length - 1) {
                          const newOrder = [...objectivePriority];
                          [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                          handlePriorityChange(newOrder);
                        }
                      }}
                      disabled={index === objectivePriority.length - 1}
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
        </motion.div>
      )}
    </div>
  );
}