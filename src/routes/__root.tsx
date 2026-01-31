import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AuthContextValue } from "@/context-providers/auth/auth-context";
import { useAuth } from "@/hooks/use-auth";
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
  const { user } = useAuth();

  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools />
    </>
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
