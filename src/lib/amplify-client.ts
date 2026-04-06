import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

/**
 * Raw Amplify client — use safeClient for pages that may crash
 * when models aren't deployed yet.
 */
export const client = generateClient<Schema>();

/**
 * Wraps a client.models call so it returns a safe empty result
 * instead of throwing when the model doesn't exist in the deployed backend.
 *
 * Usage:
 *   const result = await safeList(() => client.models.UserProfile.list());
 */
export async function safeList<T>(
  fn: () => Promise<{ data: T[] | null; errors?: unknown[] }>
): Promise<T[]> {
  try {
    const result = await fn();
    return result.data ?? [];
  } catch (e) {
    console.warn("[safeList] Model not available:", e);
    return [];
  }
}

export async function safeGet<T>(
  fn: () => Promise<{ data: T | null; errors?: unknown[] }>
): Promise<T | null> {
  try {
    const result = await fn();
    return result.data ?? null;
  } catch (e) {
    console.warn("[safeGet] Model not available:", e);
    return null;
  }
}
