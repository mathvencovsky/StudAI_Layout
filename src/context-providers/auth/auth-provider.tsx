import React, { useEffect, useMemo, useState } from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import {
  AuthContext,
  type AuthContextValue,
  type User,
} from "@/context-providers/auth/auth-context";
import { getMockCurrentUser } from "@/lib/auth-adapter-mock";

/**
 * Check if we're using mock auth
 */
function isMockAuthEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const adapter = (window as any).__STUDAI_AUTH_ADAPTER__;
  return adapter && adapter.constructor.name === "Object"; // Mock adapter is a plain object
}

/**
 * AuthProvider component that manages authentication state
 * Supports both Amplify and Mock authentication
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if using mock auth
        if (isMockAuthEnabled()) {
          console.log("🎭 Using Mock Auth Provider");
          const mockUser = getMockCurrentUser();
          if (mockUser) {
            setUser({
              id: mockUser.email,
              email: mockUser.email,
              displayName: mockUser.email.split("@")[0],
            });
          } else {
            setUser(null);
          }
        } else {
          // Use Amplify auth
          console.log("🔐 Using Amplify Auth Provider");
          const currentUser = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          setUser({
            id: currentUser.userId,
            email: attributes.email ?? currentUser.signInDetails?.loginId,
            displayName:
              attributes["custom:display_name"] ?? attributes.email ?? attributes.name,
          });
        }
      } catch (error) {
        console.log("No user authenticated");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (Amplify)
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

    // Listen for storage changes (Mock)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "studai_mock_current_user") {
        initializeAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
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
