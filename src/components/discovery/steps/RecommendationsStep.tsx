import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrailCard, TrailComparisonCard } from '../ui/TrailCard';
import { RecommendationExplanation, QuickExplanation } from '../ui/RecommendationExplanation';
import { RefinementControls, SimpleRefinementControls } from '../ui/RefinementControls';
import { StepProps, Recommendation, RefinementOption } from '../types';
import { MICROCOPY } from '../constants';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle, 
  Loader2,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// RECOMMENDATIONS STEP COMPONENT
// ============================================================================

interface RecommendationsStepProps extends StepProps {
  recommendations: Recommendation[];
  onRefine: (option: RefinementOption) => void;
  onRestart: () => void;
}

export function RecommendationsStep({
  userProfile,
  onUpdate,
  onNext,
  onBack,
  isLoading,
  recommendations,
  onRefine,
  onRestart
}: RecommendationsStepProps) {
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  const primaryRecommendation = recommendations[0];
  const alternativeRecommendations = recommendations.slice(1);

  const handleTrailSelect = (trailId: string) => {
    setSelectedTrailId(trailId);
    // Track selection
    console.log('Trail selected:', trailId);
  };

  const handleStartTrail = () => {
    if (selectedTrailId) {
      const selectedTrail = recommendations.find(r => r.id === selectedTrailId);
      if (selectedTrail) {
        // Track trail start
        console.log('Starting trail:', selectedTrail);
        // Navigate to trail or show confirmation
        onNext();
      }
    }
  };

  const handleViewDetails = (trailId: string) => {
    setShowExplanation(showExplanation === trailId ? null : trailId);
  };

  // Loading state
  if (isLoading) {
    return <LoadingRecommendations />;
  }

  // No recommendations state
  if (!recommendations || recommendations.length === 0) {
    return <NoRecommendationsState onRestart={onRestart} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Suas trilhas personalizadas
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Com base no seu perfil, encontramos {recommendations.length} trilhas 
          que fazem sentido para você. A primeira é nossa recomendação principal.
        </p>
      </motion.div>

      {/* Primary Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TrailCard
          recommendation={primaryRecommendation}
          variant="primary"
          onSelect={() => handleTrailSelect(primaryRecommendation.id)}
          onViewDetails={() => handleViewDetails(primaryRecommendation.id)}
          className={cn(
            selectedTrailId === primaryRecommendation.id && 'ring-2 ring-primary ring-offset-4'
          )}
        />

        {/* Quick Explanation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <QuickExplanation
            recommendation={primaryRecommendation}
            userProfile={userProfile}
          />
        </motion.div>

        {/* Detailed Explanation */}
        <AnimatePresence>
          {showExplanation === primaryRecommendation.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <RecommendationExplanation
                recommendation={primaryRecommendation}
                userProfile={userProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Alternative Recommendations */}
      {alternativeRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Outras opções para você
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Ocultar comparação' : 'Comparar opções'}
            </Button>
          </div>

          {showComparison ? (
            <TrailComparisonCard
              recommendations={recommendations}
              selectedId={selectedTrailId}
              onSelect={handleTrailSelect}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternativeRecommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <TrailCard
                    recommendation={recommendation}
                    variant="alternative"
                    onSelect={() => handleTrailSelect(recommendation.id)}
                    onViewDetails={() => handleViewDetails(recommendation.id)}
                    className={cn(
                      selectedTrailId === recommendation.id && 'ring-2 ring-primary ring-offset-2'
                    )}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Refinement Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SimpleRefinementControls onRefine={onRefine} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
      >
        <Button
          variant="outline"
          onClick={onRestart}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Começar nova descoberta
        </Button>

        <Button
          onClick={handleStartTrail}
          disabled={!selectedTrailId}
          size="lg"
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-warm hover:from-primary/90 hover:to-accent-warm/90"
        >
          <CheckCircle className="w-5 h-5" />
          {selectedTrailId ? 'Começar trilha selecionada' : 'Selecione uma trilha'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Success Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center pt-6 border-t border-border"
      >
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>+1.2k alunos ativos</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>4.8/5 satisfação</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>78% taxa de conclusão</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// LOADING RECOMMENDATIONS COMPONENT
// ============================================================================

function LoadingRecommendations() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Analisando seu perfil...
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Estamos processando suas preferências e gerando recomendações 
          personalizadas. Isso pode levar alguns segundos.
        </p>
      </motion.div>

      {/* Loading Animation */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className="h-48 bg-muted/30 rounded-xl border border-border animate-pulse"
          />
        ))}
      </div>

      {/* Progress Steps */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✓ Analisando objetivos
          </motion.span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            ⏳ Comparando trilhas disponíveis
          </motion.span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          >
            🎯 Personalizando recomendações
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NO RECOMMENDATIONS STATE
// ============================================================================

interface NoRecommendationsStateProps {
  onRestart: () => void;
}

function NoRecommendationsState({ onRestart }: NoRecommendationsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="text-6xl mb-4">🤔</div>
      
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Não encontramos trilhas ideais
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {MICROCOPY.emptyStates.noRecommendations}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Que tal tentar com outras preferências?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Tentar novamente
          </Button>
          
          <Button className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Falar com especialista
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border max-w-md mx-auto">
        <h3 className="font-medium text-foreground mb-2">Sugestões:</h3>
        <div className="text-sm text-muted-foreground space-y-1 text-left">
          <p>• Tente aumentar o tempo disponível por semana</p>
          <p>• Considere um prazo mais flexível</p>
          <p>• Explore diferentes estilos de aprendizado</p>
          <p>• Ajuste seus objetivos principais</p>
        </div>
      </div>
    </motion.div>
  );
}