import React, { useEffect, useMemo, useState } from "react";
import { fetchUserAttributes, getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import {
  AuthContext,
  type AuthContextValue,
  type User,
} from "@/context-providers/auth/auth-context";
import { getMyLearningPreference } from "@/api/learning-preference";
import { useQueryClient } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setUser({
          id: currentUser.userId,
          email: attributes.email ?? currentUser.signInDetails?.loginId,
          displayName:
            attributes["custom:display_name"] ?? attributes.email ?? attributes.name,
          photoURL: attributes.picture,
        });
        // Prefetch learning preference immediately after auth — so home page
        // finds it already in cache and doesn't show a loading state
        queryClient.prefetchQuery({
          queryKey: ["learning-preference", "mine"],
          queryFn: getMyLearningPreference,
          staleTime: 60000,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const unsubscribe = Hub.listen("auth", (hubPayload) => {
      const payload = hubPayload.payload as { event: string };
      switch (payload.event) {
        case "signedIn":
          initializeAuth();
          break;
        case "signedOut":
          setUser(null);
          queryClient.clear();
          break;
        default:
          break;
      }
    });

    return () => { unsubscribe(); };
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      signOut: () => amplifySignOut(),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
