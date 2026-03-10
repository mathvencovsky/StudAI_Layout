import { ReactNode } from "react";
import { LandingHeader } from "@/components/landing/landing-header";
import { NewFooter } from "@/components/landing/NewFooter";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white relative">
      <LandingHeader />
      <main className="relative bg-white pt-20">
        {children}
      </main>
      <NewFooter />
    </div>
  );
}
