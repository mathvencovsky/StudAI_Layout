import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { GlobalFooter } from "@/components/layout/global-footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSessionTracker } from "@/hooks/session-tracker/use-session-tracker";
import { useRecordLoginDay } from "@/hooks/user/use-record-login-day";
import { useEffect } from "react";

export interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Root authenticated layout that provides the sidebar and header structure.
 */
export function AppLayout({ children }: AppLayoutProps) {
  useSessionTracker();
  const { mutate: recordLogin } = useRecordLoginDay();
  useEffect(() => { recordLogin(); }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </div>
        <GlobalFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
