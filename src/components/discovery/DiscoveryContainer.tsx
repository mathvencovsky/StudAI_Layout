import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoveryFlow } from './hooks/useDiscoveryFlow';
import { StepNavigation } from './ui/StepNavigation';
import { ProgressIndicator } from './ui/ProgressIndicator';
import { ProfileInsights } from './ui/ProfileInsights';
import { ContextStep } from './steps/ContextStep';
import { InterestAreasStep } from './steps/InterestAreasStep';
import { ObjectivesStep } from './steps/ObjectivesStep';
import { ConstraintsStep } from './steps/ConstraintsStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { RecommendationsStep } from './steps/RecommendationsStep';
import { SectionWrapper } from '../landing/ui';
import { MICROCOPY } from './constants';
import { cn } from '@/lib/utils';

// ============================================================================
// DISCOVERY CONTAINER COMPONENT
// ============================================================================

export function DiscoveryContainer() {
  const {
    currentStep,
    currentStepConfig,
    userProfile,
    recommendations,
    insights,
    isLoading,
    error,
    canProceed,
    nextStep,
    prevStep,
    updateProfile,
    resetProfile,
    refineRecommendations,
    trackEvent
  } = useDiscoveryFlow();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleStepComplete = () => {
    trackEvent('step_completed', {
      step: currentStep,
      stepName: currentStepConfig?.id,
      profile: userProfile
    });
    nextStep();
  };

  const handleBack = () => {
    trackEvent('step_back', {
      step: currentStep,
      stepName: currentStepConfig?.id
    });
    prevStep();
  };

  const handleRestart = () => {
    trackEvent('discovery_restarted', {
      fromStep: currentStep,
      profile: userProfile
    });
    resetProfile();
  };

  // ============================================================================
  // STEP RENDERING
  // ============================================================================

  const renderCurrentStep = () => {
    const stepProps = {
      userProfile,
      onUpdate: updateProfile,
      onNext: handleStepComplete,
      onBack: handleBack,
      isLoading
    };

    switch (currentStep) {
      case 0:
        return <ContextStep {...stepProps} />;
      case 1:
        return <InterestAreasStep {...stepProps} />;
      case 2:
        return <ObjectivesStep {...stepProps} />;
      case 3:
        return <ConstraintsStep {...stepProps} />;
      case 4:
        return <PreferencesStep {...stepProps} />;
      case 5:
        return (
          <RecommendationsStep
            {...stepProps}
            recommendations={recommendations}
            onRefine={refineRecommendations}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SectionWrapper variant="gradient" className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
          >
            {MICROCOPY.pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {MICROCOPY.pageSubtitle}
          </motion.p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 lg:mb-12">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={6}
            stepConfig={currentStepConfig}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Step Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border-2 border-border p-6 lg:p-8 shadow-lg">
              {/* Step Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {currentStepConfig?.title}
                </h2>
                <p className="text-muted-foreground">
                  {currentStepConfig?.description}
                </p>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                  >
                    <p className="text-destructive text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-6">
              <StepNavigation
                currentStep={currentStep}
                totalSteps={6}
                canProceed={canProceed}
                isLoading={isLoading}
                onNext={handleStepComplete}
                onBack={handleBack}
                onRestart={handleRestart}
              />
            </div>
          </div>

          {/* Sidebar - Profile Insights */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileInsights
                insights={insights}
                userProfile={userProfile}
                currentStep={currentStep}
              />

              {/* Help Card */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
                <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Dica
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getHelpMessageForStep(currentStep)}
                </p>
              </div>

              {/* Progress Stats */}
              {currentStep > 0 && (
                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <h3 className="font-medium text-foreground mb-3">
                    Seu progresso
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Etapas concluídas</span>
                      <span className="font-medium">{currentStep}/6</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tempo estimado restante</span>
                      <span className="font-medium">{getEstimatedTimeRemaining(currentStep)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getHelpMessageForStep(step: number): string {
  const messages = [
    MICROCOPY.helpMessages.context,
    'Suas áreas de interesse nos ajudam a personalizar as trilhas com conteúdo mais relevante para você.',
    MICROCOPY.helpMessages.objectives,
    MICROCOPY.helpMessages.constraints,
    MICROCOPY.helpMessages.preferences,
    'Suas recomendações são baseadas em todas as informações que você forneceu. Você pode ajustá-las a qualquer momento.'
  ];
  
  return messages[step] || MICROCOPY.helpMessages.canGoBack;
}

function getEstimatedTimeRemaining(currentStep: number): string {
  const timePerStep = [1, 2, 2, 1, 1, 2]; // minutes
  const remaining = timePerStep.slice(currentStep).reduce((a, b) => a + b, 0);
  return `${remaining} min`;
}