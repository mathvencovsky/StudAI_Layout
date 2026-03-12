import React from 'react';
import { DiscoveryContainer } from './DiscoveryContainer';

// ============================================================================
// DISCOVERY FLOW COMPONENT
// ============================================================================

/**
 * Main Discovery Flow component that orchestrates the entire
 * AI-guided learning path discovery experience.
 * 
 * This component provides a complete user journey from initial
 * context gathering through personalized trail recommendations.
 */
export function DiscoveryFlow() {
  return <DiscoveryContainer />;
}

// Export for easy integration
export default DiscoveryFlow;