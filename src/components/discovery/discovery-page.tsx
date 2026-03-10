import React from 'react';
import { DiscoveryFlow } from './DiscoveryFlow';

// ============================================================================
// DISCOVERY PAGE COMPONENT
// ============================================================================

/**
 * Discovery Page - Complete page component for the AI-guided learning path discovery.
 * 
 * This page can be used as a standalone route or integrated into existing layouts.
 * It provides the full discovery experience from context gathering to trail selection.
 */
export function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <DiscoveryFlow />
    </div>
  );
}

export default DiscoveryPage;