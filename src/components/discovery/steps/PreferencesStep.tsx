import React from 'react';
import { motion } from 'framer-motion';
import { PreferenceChipsGroup } from '../ui/PreferenceChips';
import { MultiComparisonSlider } from '../ui/ComparisonSlider';
import { StepProps, LearningStyleType } from '../types';
import { LEARNING_STYLE_OPTIONS, MICROCOPY } from '../constants';

// ============================================================================
// PREFERENCES STEP COMPONENT
// ============================================================================

export function PreferencesStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const selectedLearningStyles = userProfile.learningStyle || [];
  const preferences = userProfile.preferences || {};

  // Learning style preferences
  const handleLearningStyleToggle = (styleId: string) => {
    const currentStyles = selectedLearningStyles;
    const isSelected = currentStyles.includes(styleId);

    let newStyles: string[];
    if (isSelected) {
      newStyles = currentStyles.filter(id => id !== styleId);
    } else {
      newStyles = [...currentStyles, styleId];
    }

    onUpdate({ learningStyle: newStyles });
  };

  // Comparison preferences
  const comparisonPreferences = [
    {
      id: 'pace',
      label: 'Ritmo de aprendizado',
      leftLabel: 'Devagar e seguro',
      rightLabel: 'Rápido e direto',
      value: preferences.pace || 5
    },
    {
      id: 'depth',
      label: 'Profundidade vs Amplitude',
      leftLabel: 'Foco profundo',
      rightLabel: 'Visão ampla',
      value: preferences.depth || 5
    },
    {
      id: 'structure',
      label: 'Estrutura do aprendizado',
      leftLabel: 'Muito estruturado',
      rightLabel: 'Mais flexível',
      value: preferences.structure || 5
    },
    {
      id: 'challenge',
      label: 'Nível de desafio',
      leftLabel: 'Gradual e suave',
      rightLabel: 'Desafiador desde o início',
      value: preferences.challenge || 5
    }
  ];

  const handleComparisonChange = (id: string, value: number) => {
    onUpdate({
      preferences: {
        ...preferences,
        [id]: value
      }
    });
  };

  const canProceed = selectedLearningStyles.length > 0;

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Como você aprende melhor?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Suas preferências de aprendizado nos ajudam a personalizar o conteúdo
          e formato das trilhas para seu estilo único.
        </p>
      </motion.div>

      {/* Learning Styles Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PreferenceChipsGroup
          title="Estilos de aprendizado"
          description="Selecione até 3 estilos que mais combinam com você"
          chips={LEARNING_STYLE_OPTIONS}
          selectedIds={selectedLearningStyles}
          onToggle={handleLearningStyleToggle}
          maxSelections={3}
          minSelections={1}
        />
      </motion.div>

      {/* Learning Preferences Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ajuste suas preferências
          </h3>
          <p className="text-sm text-muted-foreground">
            Deslize para indicar sua preferência em cada aspecto
          </p>
        </div>

        <MultiComparisonSlider
          comparisons={comparisonPreferences}
          onChange={handleComparisonChange}
        />
      </motion.div>

      {/* Selected Styles Summary */}
      {selectedLearningStyles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Seu perfil de aprendizado
          </h3>

          {/* Selected Learning Styles */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Estilos preferidos:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedLearningStyles.map((styleId) => {
                const style = LEARNING_STYLE_OPTIONS.find(s => s.id === styleId);
                if (!style) return null;

                return (
                  <div
                    key={styleId}
                    className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    <span role="img" aria-hidden="true">{style.icon}</span>
                    <span className="font-medium text-primary">{style.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferences Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comparisonPreferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-2 bg-background/50 rounded-lg text-sm"
              >
                <span className="text-muted-foreground">{pref.label}:</span>
                <span className="font-medium text-foreground">
                  {getPreferenceLabel(pref.value, pref.leftLabel, pref.rightLabel)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Personalization Preview */}
      {canProceed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-accent-warm/10 rounded-lg border border-accent-warm/20"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Como isso personaliza sua experiência
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {generatePersonalizationPreview(selectedLearningStyles, preferences).map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-accent-warm mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          {MICROCOPY.helpMessages.preferences}
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
            Selecione pelo menos um estilo de aprendizado para continuar
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPreferenceLabel(value: number, leftLabel: string, rightLabel: string): string {
  const percentage = (value / 10) * 100;
  
  if (percentage < 20) return `Muito ${leftLabel.toLowerCase()}`;
  if (percentage < 40) return `Mais ${leftLabel.toLowerCase()}`;
  if (percentage < 60) return 'Equilibrado';
  if (percentage < 80) return `Mais ${rightLabel.toLowerCase()}`;
  return `Muito ${rightLabel.toLowerCase()}`;
}

function generatePersonalizationPreview(
  learningStyles: string[], 
  preferences: Record<string, any>
): string[] {
  const preview: string[] = [];

  // Learning style based personalization
  if (learningStyles.includes('visual')) {
    preview.push('Trilhas com mais diagramas, vídeos e conteúdo visual');
  }
  if (learningStyles.includes('hands_on')) {
    preview.push('Foco em projetos práticos e exercícios aplicados');
  }
  if (learningStyles.includes('theoretical')) {
    preview.push('Explicações detalhadas dos fundamentos e conceitos');
  }
  if (learningStyles.includes('interactive')) {
    preview.push('Sugestões de comunidades e grupos de estudo');
  }

  // Preference based personalization
  if (preferences.pace && preferences.pace < 4) {
    preview.push('Ritmo mais pausado com tempo para absorção');
  }
  if (preferences.pace && preferences.pace > 6) {
    preview.push('Conteúdo condensado e progressão acelerada');
  }

  if (preferences.structure && preferences.structure < 4) {
    preview.push('Sequência bem definida e cronograma estruturado');
  }
  if (preferences.structure && preferences.structure > 6) {
    preview.push('Flexibilidade para escolher ordem dos tópicos');
  }

  if (preferences.challenge && preferences.challenge > 6) {
    preview.push('Projetos desafiadores desde o início');
  }

  // Default if no specific personalization
  if (preview.length === 0) {
    preview.push('Trilhas balanceadas com teoria e prática');
    preview.push('Progressão gradual e bem estruturada');
  }

  return preview.slice(0, 4); // Limit to 4 items
}