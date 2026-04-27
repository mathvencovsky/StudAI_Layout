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
import { useEffect } from "react";

export type CrumbLoaderData = {
  crumb: string;
};

export interface RouterContext {
  queryClient: QueryClient;
  auth?: AuthContextValue;
}

const PUBLIC_PATHS: ReadonlyArray<string> = [
  "/",
  "/sign-up",
  "/reset-password",
  "/verify-email",
  "/learning-preferences",
  "/plans",
  "/terms",
  "/privacy",
  "/ai-disclaimer",
  "/faq",
  "/support",
  "/contact",
  "/how-it-works",
  "/security",
  "/billing/cancel",
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

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
          <div className="w-24 h-2 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicPath) return null;

  if (!isAuthenticated) {
    return (
      <>
        <Outlet />
      </>
    );
  }

  return (
    <AiChatProvider>
      <AiIconProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
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
