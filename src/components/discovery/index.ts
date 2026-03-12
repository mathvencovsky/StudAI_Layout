// Main Components
export { DiscoveryFlow } from './DiscoveryFlow';
export { DiscoveryContainer } from './DiscoveryContainer';
export { DiscoveryPage } from './discovery-page';

// Step Components
export { ContextStep } from './steps/ContextStep';
export { ObjectivesStep } from './steps/ObjectivesStep';
export { ConstraintsStep } from './steps/ConstraintsStep';
export { PreferencesStep } from './steps/PreferencesStep';
export { RecommendationsStep } from './steps/RecommendationsStep';

// UI Components
export { StepNavigation } from './ui/StepNavigation';
export { ProgressIndicator } from './ui/ProgressIndicator';
export { ScenarioCard, ScenarioGrid } from './ui/ScenarioCard';
export { PreferenceChip, PreferenceChipsGroup, PriorityChips } from './ui/PreferenceChips';
export { ComparisonSlider, TimeSlider, MultiComparisonSlider } from './ui/ComparisonSlider';
export { TrailCard, TrailComparisonCard } from './ui/TrailCard';
export { RecommendationExplanation, QuickExplanation } from './ui/RecommendationExplanation';
export { RefinementControls, SimpleRefinementControls } from './ui/RefinementControls';
export { ProfileInsights, QuickStats } from './ui/ProfileInsights';

// Hooks
export { useDiscoveryFlow } from './hooks/useDiscoveryFlow';

// Constants
export * from './constants';

// Types
export type * from './types';