import {
  signIn,
  signUp,
  resetPassword,
  signOut,
  signInWithRedirect,
  confirmSignUp,
  getCurrentUser,
} from "aws-amplify/auth";

export interface User {
  email?: string;
  displayName?: string;
}

/**
 * Get the current user ID from Amplify auth
 * @throws Error if user is not authenticated
 */
export const getCurrentUserId = async (): Promise<string> => {
  try {
    const user = await getCurrentUser();
    return user.userId;
  } catch {
    throw new Error("User not authenticated");
  }
};

/**
 * Sign in with Google using Amplify
 */
export const signInWithGoogleApi = async (): Promise<void> => {
  await signInWithRedirect({ provider: "Google" });
};

/**
 * Send password reset email
 */
export const sendPasswordResetApi = async (email: string): Promise<void> => {
  await resetPassword({ username: email });
};

/**
 * Sign in with email and password
 */
export const signInWithEmailApi = async (
  email: string,
  password: string,
): Promise<void> => {
  await signIn({
    username: email,
    password,
  });
};

/**
 * Sign up with email and password
 */
export const signUpWithEmailApi = async (
  email: string,
  password: string,
): Promise<void> => {
  await signUp({
    username: email,
    password,
  });
};

/**
 * Sign out the current user
 */
export const signOutApi = async (): Promise<void> => {
  await signOut();
};

/**
 * Verify email with confirmation code
 */
export const verifyEmailApi = async (
  email: string,
  code: string,
): Promise<void> => {
  await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
};
