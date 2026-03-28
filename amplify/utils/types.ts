import type { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

/**
 * Extends the AppSync resolver event with top-level properties that
 * Amplify custom query handlers receive at runtime.
 * Amplify flattens the `info` fields (`fieldName`, `typeName`, etc.) to the top level.
 */
export type AmplifyResolverEvent<TArgs> = AppSyncResolverEvent<TArgs> &
  Partial<AppSyncResolverEvent<TArgs>["info"]>;

/**
 * Extracts the arguments type from an AppSync function handler.
 */
export type ExtractHandlerArgs<T> =
  T extends AppSyncResolverHandler<infer A, infer _R> ? A : never;

/**
 * Extracts the return type from an AppSync function handler.
 */
export type ExtractHandlerReturn<T> =
  T extends AppSyncResolverHandler<infer _A, infer R> ? R : never;

/**
 * Creates a shared handler type from a union of Amplify function handler types.
 * Uses AmplifyResolverEvent which includes top-level `fieldName` and `typeName`.
 */
export type SharedHandler<T> = (
  event: AmplifyResolverEvent<ExtractHandlerArgs<T>>,
) => Promise<ExtractHandlerReturn<T>>;
