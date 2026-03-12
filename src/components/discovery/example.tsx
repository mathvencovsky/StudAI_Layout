import React from 'react';
import { DiscoveryFlow } from './DiscoveryFlow';

/**
 * Example component showing how to use the Discovery Flow
 * 
 * This is a simple example that can be used for testing
 * or as a reference for integration.
 */
export function DiscoveryExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Exemplo do Discovery Flow
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Esta é uma demonstração da experiência completa de descoberta 
            de trilhas de estudo guiada por IA.
          </p>
        </div>
        
        <DiscoveryFlow />
      </div>
    </div>
  );
}

export default DiscoveryExample;