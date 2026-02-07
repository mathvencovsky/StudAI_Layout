import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AuthContextValue } from "@/context-providers/auth/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { AiChatProvider } from "@/contexts/ai-chat-context";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export type CrumbLoaderData = {
  crumb: string;
};

export interface RouterContext {
  queryClient: QueryClient;
  auth?: AuthContextValue;
}

const RootLayout = () => {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <AiChatProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            height: "100svh",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools />
    </AiChatProvider>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  loader: () => {
    return {
      crumb: "Home",
    } satisfies CrumbLoaderData;
  },
});
