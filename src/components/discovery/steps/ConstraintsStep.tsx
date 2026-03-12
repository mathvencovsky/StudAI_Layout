import React from 'react';
import { motion } from 'framer-motion';
import { TimeSlider, ComparisonSlider } from '../ui/ComparisonSlider';
import { Button } from '@/components/ui/button';
import { StepProps } from '../types';
import { MICROCOPY } from '../constants';
import { Clock, Calendar, DollarSign, Zap } from 'lucide-react';

// ============================================================================
// CONSTRAINTS STEP COMPONENT
// ============================================================================

export function ConstraintsStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading
}: StepProps) {
  const timePerWeek = userProfile.timePerWeek || 5;
  const totalDuration = userProfile.totalDuration || 6;
  const budget = userProfile.budget || 'free';
  const urgency = userProfile.urgency || 3;

  const handleTimePerWeekChange = (value: number) => {
    onUpdate({ timePerWeek: value });
  };

  const handleTotalDurationChange = (value: number) => {
    onUpdate({ totalDuration: value });
  };

  const handleBudgetChange = (budgetType: 'free' | 'paid') => {
    onUpdate({ budget: budgetType });
  };

  const handleUrgencyChange = (value: number) => {
    onUpdate({ urgency: value });
  };

  const canProceed = timePerWeek > 0 && totalDuration > 0;

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Vamos ajustar aos seus recursos
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Seja realista com seu tempo disponível. É melhor começar devagar
          e manter consistência do que ser muito ambicioso.
        </p>
      </motion.div>

      {/* Time Per Week */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TimeSlider
          label="Quanto tempo você tem por semana?"
          value={timePerWeek}
          onChange={handleTimePerWeekChange}
          min={1}
          max={20}
          unit="hours"
        />
      </motion.div>

      {/* Total Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TimeSlider
          label="Em quanto tempo quer concluir?"
          value={totalDuration}
          onChange={handleTotalDurationChange}
          min={1}
          max={12}
          unit="months"
        />
      </motion.div>

      {/* Budget Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5" />
            Qual seu orçamento para estudos?
          </h3>
          <p className="text-sm text-muted-foreground">
            Isso nos ajuda a recomendar recursos gratuitos ou pagos
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            variant={budget === 'free' ? 'default' : 'outline'}
            onClick={() => handleBudgetChange('free')}
            className="flex items-center gap-2 min-w-[120px]"
          >
            <span className="text-lg">🆓</span>
            Gratuito
          </Button>
          <Button
            variant={budget === 'paid' ? 'default' : 'outline'}
            onClick={() => handleBudgetChange('paid')}
            className="flex items-center gap-2 min-w-[120px]"
          >
            <span className="text-lg">💳</span>
            Posso investir
          </Button>
        </div>
      </motion.div>

      {/* Urgency Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ComparisonSlider
          label="Qual sua urgência?"
          leftLabel="Sem pressa"
          rightLabel="Muito urgente"
          value={urgency}
          onChange={handleUrgencyChange}
          min={1}
          max={5}
        />
      </motion.div>

      {/* Summary Card */}
      {canProceed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-lg">📊</span>
            Resumo dos seus recursos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">
                  {timePerWeek}h por semana
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTimeIntensityLabel(timePerWeek)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">
                  {totalDuration} {totalDuration === 1 ? 'mês' : 'meses'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDurationLabel(totalDuration)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">
                  {budget === 'free' ? 'Recursos gratuitos' : 'Posso investir'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {budget === 'free' ? 'Foco em conteúdo gratuito' : 'Incluindo cursos pagos'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">
                  {getUrgencyLabel(urgency)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getUrgencyDescription(urgency)}
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Total Hours */}
          <div className="mt-4 p-3 bg-accent-warm/10 rounded-lg border border-accent-warm/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-warm">
                ~{timePerWeek * (totalDuration * 4.33)} horas
              </div>
              <div className="text-sm text-muted-foreground">
                Total estimado de estudo
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          {MICROCOPY.helpMessages.constraints}
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
            Configure seu tempo disponível para continuar
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTimeIntensityLabel(hours: number): string {
  if (hours <= 3) return 'Ritmo tranquilo';
  if (hours <= 7) return 'Ritmo moderado';
  if (hours <= 12) return 'Ritmo intenso';
  return 'Ritmo muito intenso';
}

function getDurationLabel(months: number): string {
  if (months <= 2) return 'Curso rápido';
  if (months <= 6) return 'Duração ideal';
  if (months <= 9) return 'Aprendizado sólido';
  return 'Especialização completa';
}

function getUrgencyLabel(urgency: number): string {
  const labels = ['', 'Sem pressa', 'Tranquilo', 'Moderado', 'Urgente', 'Muito urgente'];
  return labels[urgency] || 'Moderado';
}

function getUrgencyDescription(urgency: number): string {
  const descriptions = [
    '',
    'Posso aprender no meu ritmo',
    'Tenho tempo para absorver bem',
    'Equilibrio entre velocidade e qualidade',
    'Preciso de resultados em breve',
    'Preciso de resultados rapidamente'
  ];
  return descriptions[urgency] || 'Ritmo equilibrado';
}