// ============================================================================
// DISCOVERY FLOW TYPES
// ============================================================================

export interface UserProfile {
  context: ContextType;
  interestAreas: string[];
  objectives: string[];
  timePerWeek: number;
  totalDuration: number;
  budget: 'free' | 'paid';
  learningStyle: string[];
  urgency: number;
  experienceLevel: number;
  preferences: Record<string, any>;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  score: number;
  duration: string;
  effort: number; // 1-5 stars
  outcomes: string[];
  reasoning: string[];
  format: string;
  level: string;
  tags: string[];
  estimatedHours: number;
  successRate: number;
}

export interface DiscoveryState {
  currentStep: number;
  userProfile: Partial<UserProfile>;
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  insights: ProfileInsight[];
}

export interface ProfileInsight {
  id: string;
  icon: string;
  text: string;
  confidence: number;
}

export type ContextType = 
  | 'beginner' 
  | 'career_change' 
  | 'upskilling' 
  | 'job_prep'
  | 'academic'
  | 'personal_project';

export type ObjectiveType = 
  | 'employment'
  | 'career_change'
  | 'personal_project'
  | 'academic_growth'
  | 'skill_improvement'
  | 'certification'
  | 'entrepreneurship';

export type LearningStyleType = 
  | 'visual'
  | 'hands_on'
  | 'theoretical'
  | 'interactive'
  | 'self_paced'
  | 'structured';

export type StepType = 
  | 'context'
  | 'interest_areas'
  | 'objectives'
  | 'constraints'
  | 'preferences'
  | 'recommendations';

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface StepProps {
  userProfile: Partial<UserProfile>;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export interface ScenarioCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export interface PreferenceChipProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
  className?: string;
}

export interface ComparisonSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export interface TrailCardProps {
  recommendation: Recommendation;
  variant: 'primary' | 'alternative';
  onSelect: () => void;
  onViewDetails: () => void;
  className?: string;
}

export interface RefinementOption {
  id: string;
  label: string;
  action: 'adjust_duration' | 'adjust_difficulty' | 'adjust_format' | 'adjust_focus';
  value: any;
}

export interface RefinementControlsProps {
  options: RefinementOption[];
  onRefine: (option: RefinementOption) => void;
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface AIRecommendationRequest {
  context: ContextType;
  objectives: ObjectiveType[];
  timePerWeek: number;
  totalDuration: number;
  budget: 'free' | 'paid';
  learningStyle: LearningStyleType[];
  urgency: number;
  experienceLevel: number;
  preferences?: Record<string, any>;
}

export interface AIRecommendationResponse {
  recommendations: Recommendation[];
  insights: ProfileInsight[];
  confidence: number;
  reasoning: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export type DiscoveryAnalyticsEvents = 
  | 'discovery_started'
  | 'step_completed'
  | 'step_abandoned'
  | 'recommendation_viewed'
  | 'trail_selected'
  | 'refinement_used'
  | 'discovery_completed'
  | 'trail_started';