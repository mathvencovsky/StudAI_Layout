import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Recommendation, UserProfile } from '../types';

// ============================================================================
// RECOMMENDATION EXPLANATION COMPONENT
// ============================================================================

interface RecommendationExplanationProps {
  recommendation: Recommendation;
  userProfile: Partial<UserProfile>;
  className?: string;
}

export function RecommendationExplanation({
  recommendation,
  userProfile,
  className
}: RecommendationExplanationProps) {
  const explanationItems = generateExplanation(recommendation, userProfile);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Por que recomendamos esta trilha?
        </h3>
      </div>

      {/* Explanation Items */}
      <div className="space-y-3">
        {explanationItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex-shrink-0 mt-0.5">
              <item.icon className={cn('w-4 h-4', item.color)} />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compatibility Score Breakdown */}
      <CompatibilityBreakdown
        recommendation={recommendation}
        userProfile={userProfile}
      />
    </div>
  );
}

// ============================================================================
// COMPATIBILITY BREAKDOWN COMPONENT
// ============================================================================

interface CompatibilityBreakdownProps {
  recommendation: Recommendation;
  userProfile: Partial<UserProfile>;
}

function CompatibilityBreakdown({
  recommendation,
  userProfile
}: CompatibilityBreakdownProps) {
  const breakdown = calculateCompatibilityBreakdown(recommendation, userProfile);

  return (
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Análise de compatibilidade
      </h4>

      <div className="space-y-3">
        {breakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    item.score >= 0.8 ? 'bg-green-500' :
                    item.score >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground w-8">
                {Math.round(item.score * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Score */}
      <div className="mt-4 pt-3 border-t border-primary/20">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Compatibilidade geral</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {Math.round(recommendation.score * 100)}%
            </span>
            <div className={cn(
              'w-2 h-2 rounded-full',
              recommendation.score >= 0.8 ? 'bg-green-500' :
              recommendation.score >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
            )} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// QUICK EXPLANATION COMPONENT (compact version)
// ============================================================================

interface QuickExplanationProps {
  recommendation: Recommendation;
  userProfile: Partial<UserProfile>;
  className?: string;
}

export function QuickExplanation({
  recommendation,
  userProfile,
  className
}: QuickExplanationProps) {
  const topReasons = recommendation.reasoning.slice(0, 3);

  return (
    <div className={cn('p-3 bg-muted/30 rounded-lg', className)}>
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-foreground mb-1">
            Por que esta trilha?
          </h4>
          <div className="space-y-1">
            {topReasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-1 text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPLANATION MODAL/EXPANDABLE COMPONENT
// ============================================================================

interface DetailedExplanationProps {
  recommendation: Recommendation;
  userProfile: Partial<UserProfile>;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedExplanation({
  recommendation,
  userProfile,
  isOpen,
  onClose
}: DetailedExplanationProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-6 bg-card rounded-lg border border-border shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Análise detalhada da recomendação
        </h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <RecommendationExplanation
        recommendation={recommendation}
        userProfile={userProfile}
      />

      {/* Additional Details */}
      <div className="mt-6 space-y-4">
        {/* Success Factors */}
        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Fatores de sucesso
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Alinhamento com seus objetivos de carreira</p>
            <p>• Compatibilidade com seu tempo disponível</p>
            <p>• Adequação ao seu nível de experiência</p>
            <p>• Formato de aprendizado preferido</p>
          </div>
        </div>

        {/* Potential Challenges */}
        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Desafios potenciais
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {generatePotentialChallenges(recommendation, userProfile).map((challenge, index) => (
              <p key={index}>• {challenge}</p>
            ))}
          </div>
        </div>

        {/* Similar Learner Success */}
        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Sucesso de perfis similares
          </h4>
          <p className="text-sm text-muted-foreground">
            {Math.round(recommendation.successRate * 100)}% dos alunos com perfil similar
            completaram esta trilha com sucesso e alcançaram seus objetivos.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateExplanation(
  recommendation: Recommendation,
  userProfile: Partial<UserProfile>
) {
  const explanations = [];

  // Objective alignment
  if (userProfile.objectives?.includes('employment')) {
    explanations.push({
      icon: Target,
      color: 'text-green-500',
      title: 'Alinhada com seus objetivos de carreira',
      description: 'Esta trilha foca em habilidades práticas valorizadas pelo mercado de trabalho.'
    });
  }

  // Time compatibility
  if (userProfile.timePerWeek && userProfile.totalDuration) {
    explanations.push({
      icon: Clock,
      color: 'text-blue-500',
      title: 'Compatível com seu tempo disponível',
      description: `Projetada para ${userProfile.timePerWeek}h semanais ao longo de ${userProfile.totalDuration} meses.`
    });
  }

  // Learning style match
  if (userProfile.learningStyle?.includes('hands_on')) {
    explanations.push({
      icon: CheckCircle,
      color: 'text-purple-500',
      title: 'Combina com seu estilo de aprendizado',
      description: 'Foco em projetos práticos e aplicação real, ideal para quem aprende fazendo.'
    });
  }

  // Success rate
  explanations.push({
    icon: TrendingUp,
    color: 'text-amber-500',
    title: 'Alta taxa de sucesso',
    description: `${Math.round(recommendation.successRate * 100)}% dos alunos completam esta trilha com sucesso.`
  });

  return explanations;
}

function calculateCompatibilityBreakdown(
  recommendation: Recommendation,
  userProfile: Partial<UserProfile>
) {
  return [
    {
      icon: Target,
      label: 'Objetivos',
      score: 0.9 // Mock calculation
    },
    {
      icon: Clock,
      label: 'Tempo disponível',
      score: 0.85
    },
    {
      icon: Users,
      label: 'Nível de experiência',
      score: 0.8
    },
    {
      icon: CheckCircle,
      label: 'Estilo de aprendizado',
      score: 0.95
    }
  ];
}

function generatePotentialChallenges(
  recommendation: Recommendation,
  userProfile: Partial<UserProfile>
): string[] {
  const challenges = [];

  if (userProfile.timePerWeek && userProfile.timePerWeek < 5) {
    challenges.push('Tempo limitado pode exigir foco extra na consistência');
  }

  if (recommendation.effort >= 4) {
    challenges.push('Trilha intensiva que requer dedicação constante');
  }

  if (userProfile.experienceLevel && userProfile.experienceLevel < 2) {
    challenges.push('Alguns conceitos podem ser desafiadores para iniciantes');
  }

  if (challenges.length === 0) {
    challenges.push('Trilha bem adequada ao seu perfil, poucos desafios esperados');
  }

  return challenges;
}