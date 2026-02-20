/**
 * Auth Adapter for StudAI
 * Connects the auth-card component with AWS Amplify Auth
 */

import { signIn, signUp, type SignInOutput } from "aws-amplify/auth";

export interface AuthAdapter {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

/**
 * Amplify Auth Adapter
 * Implements the AuthAdapter interface using AWS Amplify Auth
 */
export const amplifyAuthAdapter: AuthAdapter = {
  async signIn(email: string, password: string): Promise<void> {
    try {
      const result: SignInOutput = await signIn({
        username: email,
        password,
      });

      // Check if sign-in was successful
      if (result.isSignedIn) {
        // Reload the page to trigger auth state update
        window.location.reload();
      } else {
        throw new Error("Sign-in incomplete");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      
      // Provide user-friendly error messages
      if (error.name === "UserNotFoundException" || error.name === "NotAuthorizedException") {
        throw new Error("Email ou senha incorretos");
      } else if (error.name === "UserNotConfirmedException") {
        throw new Error("Por favor, confirme seu email antes de fazer login");
      } else {
        throw new Error(error.message || "Erro ao fazer login");
      }
    }
  },

  async signUp(email: string, password: string): Promise<void> {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true, // Enable auto sign-in after confirmation
        },
      });

      // Check if confirmation is required
      if (result.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        // In a real app, you would redirect to a confirmation page
        // For now, we'll just show a message
        throw new Error(
          "Conta criada! Verifique seu email para confirmar o cadastro. Depois, faça login."
        );
      } else if (result.nextStep.signUpStep === "DONE") {
        // Auto sign-in is enabled, reload the page
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      
      // Provide user-friendly error messages
      if (error.name === "UsernameExistsException") {
        throw new Error("Este email já está cadastrado");
      } else if (error.name === "InvalidPasswordException") {
        throw new Error("Senha muito fraca. Use pelo menos 8 caracteres com letras e números");
      } else if (error.name === "InvalidParameterException") {
        throw new Error("Email inválido");
      } else {
        throw new Error(error.message || "Erro ao criar conta");
      }
    }
  },
};

/**
 * Initialize the auth adapter
 * This function should be called in the app initialization
 */
export function initializeAuthAdapter(): void {
  if (typeof window !== "undefined") {
    (window as any).__STUDAI_AUTH_ADAPTER__ = amplifyAuthAdapter;
  }
}
