import { AppLayout } from "@/components/layout/app-layout";
import type { AuthContextValue } from "@/context-providers/auth/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { AiChatProvider } from "@/contexts/ai-chat-context";
import { AiIconProvider } from "@/contexts/ai-icon-context";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { type FileRouteTypes } from "@/routeTree.gen";

export type CrumbLoaderData = {
  crumb: string;
};

export interface RouterContext {
  queryClient: QueryClient;
  auth?: AuthContextValue;
}

const PUBLIC_PATHS: ReadonlyArray<FileRouteTypes["fullPaths"]> = [
  "/",
  "/sign-up",
  "/reset-password",
  "/verify-email",
  "/learning-preferences",
  "/plans",
  "/terms",
  "/privacy",
  "/faq",
  "/support",
  "/contact",
  "/how-it-works",
  "/security",
];

const RootLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  const isAuthenticated = !!user;
  const isPublicPath = (PUBLIC_PATHS as ReadonlyArray<string>).includes(location.pathname);

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublicPath) {
      navigate({ to: "/" });
    }
  }, [loading, isAuthenticated, isPublicPath, navigate]);

  if (loading) return null;

  if (!isAuthenticated && !isPublicPath) return null;

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
