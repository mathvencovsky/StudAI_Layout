export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * Calculates current and longest login streak from ISO date strings (YYYY-MM-DD).
 * @param dates Array of ISO date strings in YYYY-MM-DD format
 * @returns Object containing current streak and longest streak counts
 */
export function calculateStreak(dates: string[]): StreakResult {
  const unique = [...new Set(dates)].sort();
  if (unique.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const last = unique[unique.length - 1];

  if (last !== today && last !== yesterday) return { current: 0, longest };

  let current = 1;
  for (let i = unique.length - 2; i >= 0; i--) {
    const curr = new Date(unique[i + 1]);
    const prev = new Date(unique[i]);
    if ((curr.getTime() - prev.getTime()) / 86400000 === 1) {
      current++;
    } else {
      break;
    }
  }

  return { current, longest };
}
