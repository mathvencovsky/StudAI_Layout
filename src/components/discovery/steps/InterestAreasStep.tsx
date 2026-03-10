import React from 'react';
import { motion } from 'framer-motion';
import { PreferenceChipsGroup } from '../ui/PreferenceChips';
import { StepProps } from '../types';
import { INTEREST_AREAS, MICROCOPY } from '../constants';

// ============================================================================
// INTEREST AREAS STEP COMPONENT
// ============================================================================

export function InterestAreasStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const selectedAreas = userProfile.interestAreas || [];

  const handleAreaToggle = (areaId: string) => {
    const currentAreas = selectedAreas;
    const isSelected = currentAreas.includes(areaId);

    let newAreas: string[];
    if (isSelected) {
      newAreas = currentAreas.filter(id => id !== areaId);
    } else {
      newAreas = [...currentAreas, areaId];
    }

    onUpdate({ interestAreas: newAreas });
  };

  const canProceed = selectedAreas.length > 0;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Quais áreas despertam seu interesse?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Selecione as áreas que você gostaria de estudar. Você pode escolher mais de uma,
          mas recomendamos focar em até 3 para melhores resultados.
        </p>
      </motion.div>

      {/* Interest Areas Selection */}
      <PreferenceChipsGroup
        chips={INTEREST_AREAS}
        selectedIds={selectedAreas}
        onToggle={handleAreaToggle}
        maxSelections={3}
        minSelections={1}
      />

      {/* Selected Areas Summary */}
      {selectedAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Suas áreas de interesse selecionadas
          </h3>
          <div className="space-y-2">
            {selectedAreas.map((areaId, index) => {
              const area = INTEREST_AREAS.find(a => a.id === areaId);
              if (!area) return null;

              return (
                <motion.div
                  key={areaId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-2 bg-background/50 rounded-lg"
                >
                  <span className="text-lg mt-0.5" role="img" aria-hidden="true">
                    {area.icon}
                  </span>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {area.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {area.description}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Priority Indication */}
      {selectedAreas.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm mb-1">
                Múltiplas áreas selecionadas
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Vamos priorizar a primeira área selecionada, mas suas trilhas
                incluirão elementos das outras áreas também.
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
          Suas áreas de interesse nos ajudam a personalizar as trilhas com conteúdo mais relevante para você.
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
            Selecione pelo menos uma área de interesse para continuar
          </p>
        </motion.div>
      )}
    </div>
  );
}