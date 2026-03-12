import { createStub } from "./base-stub";
import type { UserStats } from "@/model/user-stats";

/**
 * Stub implementation for user statistics
 * Returns mock data for development/testing
 */
export async function getUserStatsStub(): Promise<UserStats> {
  const mockStats: UserStats = {
    totalHoursStudied: 24.5,
    totalModulesCompleted: 8,
    totalDaysLoggedIn: 15,
  };

  return createStub(mockStats);
}