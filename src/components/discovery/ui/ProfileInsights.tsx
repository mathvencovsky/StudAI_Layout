import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, User, Target, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfileInsight, UserProfile } from '../types';
import { MICROCOPY } from '../constants';

// ============================================================================
// PROFILE INSIGHTS COMPONENT
// ============================================================================

interface ProfileInsightsProps {
  insights: ProfileInsight[];
  userProfile: Partial<UserProfile>;
  currentStep: number;
  className?: string;
}

export function ProfileInsights({
  insights,
  userProfile,
  currentStep,
  className
}: ProfileInsightsProps) {
  const hasInsights = insights.length > 0;
  const profileCompleteness = calculateProfileCompleteness(userProfile);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          {hasInsights ? 'Entendendo seu perfil' : 'Seu perfil'}
        </h3>
      </div>

      {/* Profile Completeness */}
      <ProfileCompletenessCard
        completeness={profileCompleteness}
        currentStep={currentStep}
      />

      {/* Insights List */}
      <AnimatePresence>
        {hasInsights ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <div className="text-4xl mb-2">🤔</div>
            <p className="text-sm text-muted-foreground">
              {MICROCOPY.profileInsights.analyzing}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Summary */}
      {currentStep > 0 && (
        <ProfileSummaryCard userProfile={userProfile} />
      )}
    </div>
  );
}

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

interface InsightCardProps {
  insight: ProfileInsight;
  delay?: number;
}

function InsightCard({ insight, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <span className="text-lg" role="img" aria-hidden="true">
          {insight.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-relaxed">
          {insight.text}
        </p>
        
        {/* Confidence Indicator */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${insight.confidence * 100}%` }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(insight.confidence * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// PROFILE COMPLETENESS CARD
// ============================================================================

interface ProfileCompletenessCardProps {
  completeness: number;
  currentStep: number;
}

function ProfileCompletenessCard({
  completeness,
  currentStep
}: ProfileCompletenessCardProps) {
  const getCompletenessColor = (value: number) => {
    if (value < 0.3) return 'text-red-500';
    if (value < 0.7) return 'text-amber-500';
    return 'text-green-500';
  };

  const getCompletenessLabel = (value: number) => {
    if (value < 0.3) return 'Começando';
    if (value < 0.7) return 'Progredindo';
    return 'Quase pronto';
  };

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Perfil
          </span>
        </div>
        <span className={cn(
          'text-sm font-medium',
          getCompletenessColor(completeness)
        )}>
          {getCompletenessLabel(completeness)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Completude</span>
          <span>{Math.round(completeness * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full transition-colors duration-300',
              completeness < 0.3 ? 'bg-red-500' :
              completeness < 0.7 ? 'bg-amber-500' : 'bg-green-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${completeness * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROFILE SUMMARY CARD
// ============================================================================

interface ProfileSummaryCardProps {
  userProfile: Partial<UserProfile>;
}

function ProfileSummaryCard({ userProfile }: ProfileSummaryCardProps) {
  const summaryItems = generateProfileSummary(userProfile);

  if (summaryItems.length === 0) return null;

  return (
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          Resumo do perfil
        </span>
      </div>

      <div className="space-y-2">
        {summaryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-2 text-xs"
          >
            <span className="text-primary mt-0.5">•</span>
            <span className="text-foreground leading-relaxed">
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// QUICK STATS COMPONENT
// ============================================================================

interface QuickStatsProps {
  userProfile: Partial<UserProfile>;
  className?: string;
}

export function QuickStats({ userProfile, className }: QuickStatsProps) {
  const stats = [
    {
      icon: Clock,
      label: 'Tempo/semana',
      value: userProfile.timePerWeek ? `${userProfile.timePerWeek}h` : '—',
      color: 'text-blue-500'
    },
    {
      icon: Target,
      label: 'Duração total',
      value: userProfile.totalDuration ? `${userProfile.totalDuration}m` : '—',
      color: 'text-green-500'
    },
    {
      icon: BookOpen,
      label: 'Objetivos',
      value: userProfile.objectives?.length || 0,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="text-center p-2 bg-card rounded-lg border border-border"
        >
          <stat.icon className={cn('w-4 h-4 mx-auto mb-1', stat.color)} />
          <div className="text-xs font-medium text-foreground">
            {stat.value}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateProfileCompleteness(profile: Partial<UserProfile>): number {
  const fields = [
    'context',
    'objectives',
    'timePerWeek',
    'totalDuration',
    'budget',
    'learningStyle',
    'urgency',
    'experienceLevel'
  ];

  const completedFields = fields.filter(field => {
    const value = profile[field as keyof UserProfile];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  });

  return completedFields.length / fields.length;
}

function generateProfileSummary(profile: Partial<UserProfile>): string[] {
  const summary: string[] = [];

  if (profile.context) {
    const contextLabels = {
      beginner: 'Iniciante total',
      career_change: 'Mudança de carreira',
      upskilling: 'Aprimorando habilidades',
      job_prep: 'Preparação para emprego',
      academic: 'Complemento acadêmico',
      personal_project: 'Projeto pessoal'
    };
    summary.push(contextLabels[profile.context] || profile.context);
  }

  if (profile.objectives && profile.objectives.length > 0) {
    summary.push(`${profile.objectives.length} objetivo${profile.objectives.length > 1 ? 's' : ''} definido${profile.objectives.length > 1 ? 's' : ''}`);
  }

  if (profile.timePerWeek && profile.totalDuration) {
    summary.push(`${profile.timePerWeek}h/semana por ${profile.totalDuration} meses`);
  }

  if (profile.learningStyle && profile.learningStyle.length > 0) {
    summary.push(`${profile.learningStyle.length} estilo${profile.learningStyle.length > 1 ? 's' : ''} de aprendizado`);
  }

  return summary;
}