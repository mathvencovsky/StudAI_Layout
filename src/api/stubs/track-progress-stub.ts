import { createStub } from "./base-stub";
import type { UserTrackProgress } from "@/model/user-track-progress";

/**
 * Stub implementation for track progress
 * Returns mock data for development/testing
 */
export async function getLastStartedIncompleteTrackStub(): Promise<UserTrackProgress | null> {
  const mockProgress: UserTrackProgress = {
    id: "mock-track-progress-1",
    trackId: "mock-track-frontend-react",
    startDate: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
    completionDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return createStub(mockProgress);
}