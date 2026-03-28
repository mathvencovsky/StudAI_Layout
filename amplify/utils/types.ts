import type { AppSyncResolverHandler } from "aws-lambda";

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
 * Creates a shared AppSync handler type from a union of function handler types.
 * Arguments and return types become unions of all individual handler types.
 */
export type SharedHandler<T> = AppSyncResolverHandler<
  ExtractHandlerArgs<T>,
  ExtractHandlerReturn<T>
>;
