import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
Amplify.configure(outputs);

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import "./i18n/i18n";
import { initZodI18n } from "@/i18n/zod-i18n";

initZodI18n();
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context-providers/auth/auth-provider";
import { ThemeProvider } from "@/context-providers/theme/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 3 tentativas com exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 60000, // 1 minuto - dados considerados frescos
      gcTime: 300000, // 5 minutos - tempo no cache (era cacheTime)
      refetchOnWindowFocus: true, // Refetch ao focar na janela
      refetchOnReconnect: true, // Refetch ao reconectar
    },
    mutations: {
      retry: 0, // Não retry em mutations por padrão
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
const InnerApp = () => {
  const auth = useAuth();
  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider defaultColorTheme="studai">
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <InnerApp />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
