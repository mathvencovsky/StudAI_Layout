import { createStub } from "./base-stub";
import type { UserModuleProgress } from "@/model/user-module-progress";

/**
 * Stub implementation for module progress
 * Returns mock data for development/testing
 */
export async function getLastStartedModuleStub(): Promise<UserModuleProgress | null> {
  const mockProgress: UserModuleProgress = {
    id: "mock-progress-1",
    moduleId: "mock-module-react-basics",
    startDate: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
    completionDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return createStub(mockProgress);
}

export async function getUserModuleProgressStub(moduleId: string): Promise<UserModuleProgress | null> {
  const mockProgress: UserModuleProgress = {
    id: `mock-progress-${moduleId}`,
    moduleId,
    startDate: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
    completionDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return createStub(mockProgress);
}