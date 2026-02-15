import type { Content } from "@/model/content";

/**
 * Formats a duration in seconds to a human-readable string with appropriate unit.
 * Uses Intl.NumberFormat for locale-aware number formatting.
 * Rounds up to the nearest whole unit when converting to higher dimensions.
 *
 * @param seconds - Duration in seconds, or undefined
 * @returns Formatted duration string (e.g., "5m", "2h", "1d") or empty string if undefined
 */
export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined || seconds === null) {
    return "";
  }

  const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });

  if (seconds < 60) {
    return `${numberFormatter.format(seconds)}s`;
  }

  if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return `${numberFormatter.format(minutes)}m`;
  }

  if (seconds < 86400) {
    const hours = Math.ceil(seconds / 3600);
    return `${numberFormatter.format(hours)}h`;
  }

  const days = Math.ceil(seconds / 86400);
  return `${numberFormatter.format(days)}d`;
}

/**
 * Calculates the total duration of all content items in an array.
 * Treats undefined durations as 0.
 *
 * @param contents - Array of Content objects
 * @returns Total duration in seconds
 */
export function calculateModuleTotalDuration(contents: Content[]): number {
  return contents.reduce((total, content) => {
    return total + (content.durationInSeconds || 0);
  }, 0);
}
