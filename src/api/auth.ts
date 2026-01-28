import {
  signIn,
  signUp,
  resetPassword,
  signOut,
  signInWithRedirect,
} from "aws-amplify/auth";

export interface User {
  email?: string;
  displayName?: string;
}

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
