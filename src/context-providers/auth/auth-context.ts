import { createContext } from "react";

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
