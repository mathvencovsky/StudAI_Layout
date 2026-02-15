import { AppLayout } from "@/components/layout/app-layout";
import type { AuthContextValue } from "@/context-providers/auth/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { AiChatProvider } from "@/contexts/ai-chat-context";
import { AiIconProvider } from "@/contexts/ai-icon-context";
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
      <AiIconProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
        <TanStackRouterDevtools />
      </AiIconProvider>
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
