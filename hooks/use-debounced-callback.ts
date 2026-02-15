import { useRef, useEffect, useCallback } from "react";

/**
 * useDebouncedCallback
 * Returns a debounced function that delays invoking `fn` until after
 * `delayMs` milliseconds have elapsed since the last time it was called.
 */
export const useDebouncedCallback = <
  T extends (...args: Parameters<T>) => void,
>(
  fn: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  // Always keep the latest function reference
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delayMs);
    },
    [delayMs]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debouncedFn;
};
