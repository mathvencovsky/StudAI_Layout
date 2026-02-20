import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/ui/loading-state";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Salva URL de destino para redirecionamento após login
      navigate({
        to: "/sign-up",
        search: { redirect: location.pathname },
      });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
