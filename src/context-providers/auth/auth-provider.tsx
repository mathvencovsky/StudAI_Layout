import React, { useEffect, useMemo, useState } from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import {
  AuthContext,
  type AuthContextValue,
  type User,
} from "@/context-providers/auth/auth-context";

/**
 * AuthProvider component that manages authentication state using Amplify
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setUser({
          id: currentUser.userId,
          email: attributes.email ?? currentUser.signInDetails?.loginId,
          displayName:
            attributes.preferred_username ?? attributes.email ?? attributes.name,
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
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
