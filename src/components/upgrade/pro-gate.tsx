/**
 * ProGate — wraps Pro-only UI sections.
 *
 * When the user is Free, renders a locked overlay with an upgrade prompt
 * instead of the children. When Pro, renders children normally.
 *
 * Usage:
 *   <ProGate feature="progressAnalytics">
 *     <AdvancedAnalyticsDashboard />
 *   </ProGate>
 */

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeatureAccess } from "@/hooks/subscription/use-entitlements";
import { UpgradeModal, type UpgradeFeature } from "./upgrade-modal";
import type { FeatureKey } from "@/api/entitlements";
import { cn } from "@/lib/utils";

interface ProGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  /** Custom label shown on the lock overlay */
  lockLabel?: string;
  className?: string;
}

export function ProGate({ feature, children, lockLabel, className }: ProGateProps) {
  const access = useFeatureAccess(feature);
  const [modalOpen, setModalOpen] = useState(false);

  // While loading, render children (optimistic — backend will enforce)
  if (access.isLoading) return <>{children}</>;

  if (access.enabled) return <>{children}</>;

  return (
    <>
      <div className={cn("relative", className)}>
        {/* Blurred preview of the content */}
        <div className="pointer-events-none select-none blur-sm opacity-40" aria-hidden="true">
          {children}
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/60 backdrop-blur-[2px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground text-center px-4">
            {lockLabel ?? "This feature requires StudAI Pro"}
          </p>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Upgrade to Pro
          </Button>
        </div>
      </div>

      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feature={feature as UpgradeFeature}
      />
    </>
  );
}
