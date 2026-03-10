import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Info,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrailCardProps, Recommendation } from '../types';

// ============================================================================
// TRAIL CARD COMPONENT
// ============================================================================

export function TrailCard({
  recommendation,
  variant,
  onSelect,
  onViewDetails,
  className
}: TrailCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative p-6 rounded-xl border-2 bg-card shadow-lg transition-all duration-300',
        isPrimary
          ? 'border-primary bg-gradient-to-br from-primary/5 to-accent-warm/5 shadow-primary/10'
          : 'border-border hover:border-primary/50 hover:shadow-xl',
        className
      )}
    >
      {/* Primary Badge */}
      {isPrimary && (
        <div className="absolute -top-3 left-6">
          <Badge className="bg-primary text-primary-foreground shadow-md">
            <Star className="w-3 h-3 mr-1" />
            Melhor para você
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={cn(
            'text-xl font-bold leading-tight',
            isPrimary ? 'text-primary' : 'text-foreground'
          )}>
            {recommendation.title}
          </h3>
          
          {/* Compatibility Score */}
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">
              {Math.round(recommendation.score * 100)}%
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {recommendation.duration}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Duração</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < recommendation.effort
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Esforço</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {Math.round(recommendation.successRate * 100)}%
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Sucesso</span>
        </div>
      </div>

      {/* Expected Outcomes */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          O que você vai conquistar
        </h4>
        <div className="space-y-1">
          {recommendation.outcomes.slice(0, 3).map((outcome, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
              <span className="text-muted-foreground">{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {recommendation.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={onSelect}
          className={cn(
            'flex-1 flex items-center justify-center gap-2',
            isPrimary && 'bg-gradient-to-r from-primary to-accent-warm hover:from-primary/90 hover:to-accent-warm/90'
          )}
        >
          {isPrimary ? 'Começar esta trilha' : 'Escolher trilha'}
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onViewDetails}
          className="flex-shrink-0"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>

      {/* Compatibility Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Compatibilidade com seu perfil</span>
          <span>{Math.round(recommendation.score * 100)}%</span>
        </div>
        <Progress value={recommendation.score * 100} className="h-1" />
      </div>
    </motion.div>
  );
}

// ============================================================================
// TRAIL COMPARISON CARD (for side-by-side comparison)
// ============================================================================

interface TrailComparisonCardProps {
  recommendations: Recommendation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function TrailComparisonCard({
  recommendations,
  selectedId,
  onSelect,
  className
}: TrailComparisonCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-foreground text-center mb-6">
        Compare suas opções
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TrailCard
              recommendation={recommendation}
              variant={index === 0 ? 'primary' : 'alternative'}
              onSelect={() => onSelect(recommendation.id)}
              onViewDetails={() => {/* Handle view details */}}
              className={cn(
                selectedId === recommendation.id && 'ring-2 ring-primary ring-offset-2'
              )}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT TRAIL CARD (for mobile or list view)
// ============================================================================

interface CompactTrailCardProps {
  recommendation: Recommendation;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function CompactTrailCard({
  recommendation,
  selected,
  onSelect,
  className
}: CompactTrailCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'w-full p-4 rounded-lg border-2 text-left transition-all duration-300',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50',
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground">{recommendation.title}</h4>
        <Badge variant={selected ? 'default' : 'secondary'} className="text-xs">
          {Math.round(recommendation.score * 100)}%
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {recommendation.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recommendation.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {recommendation.effort}/5
          </span>
        </div>
        <span>{recommendation.outcomes.length} resultados</span>
      </div>
    </motion.button>
  );
}