/**
 * Mock Learning Preference Adapter
 * 
 * Provides localStorage-based storage for learning preferences when using mock authentication.
 * Follows the same pattern as auth-adapter-mock.ts.
 */

const MOCK_LEARNING_PREFERENCE_KEY = "studai_mock_learning_preference";

export interface MockLearningPreference {
  id: string;
  userId: string;
  studyTimePreference: string;
  difficultyLevel: string;
  learningStyle: string;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get learning preference from localStorage
 */
function getMockLearningPreference(): MockLearningPreference | null {
  try {
    const stored = localStorage.getItem(MOCK_LEARNING_PREFERENCE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading mock learning preference:", error);
    return null;
  }
}

/**
 * Save learning preference to localStorage
 */
function saveMockLearningPreference(data: MockLearningPreference): void {
  try {
    localStorage.setItem(MOCK_LEARNING_PREFERENCE_KEY, JSON.stringify(data));
    console.log("🎭 Mock learning preference saved to localStorage");
  } catch (error) {
    console.error("Error saving mock learning preference:", error);
    throw error;
  }
}

/**
 * Mock implementation of getMyLearningPreference
 */
export async function mockGetMyLearningPreference(): Promise<MockLearningPreference | null> {
  console.log("🎭 Mock: Getting learning preference from localStorage");
  return getMockLearningPreference();
}

/**
 * Mock implementation of createLearningPreference
 */
export async function mockCreateLearningPreference(
  input: Omit<MockLearningPreference, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<MockLearningPreference> {
  console.log("🎭 Mock: Creating learning preference in localStorage", input);
  
  const now = new Date().toISOString();
  const preference: MockLearningPreference = {
    id: `mock-lp-${Date.now()}`,
    userId: "mock-user-id",
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  saveMockLearningPreference(preference);
  return preference;
}

/**
 * Mock implementation of updateLearningPreference
 */
export async function mockUpdateLearningPreference(
  input: Partial<Omit<MockLearningPreference, "id" | "userId" | "createdAt">>
): Promise<MockLearningPreference> {
  console.log("🎭 Mock: Updating learning preference in localStorage", input);
  
  const existing = getMockLearningPreference();
  if (!existing) {
    throw new Error("No learning preference found to update");
  }
  
  const updated: MockLearningPreference = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  saveMockLearningPreference(updated);
  return updated;
}

/**
 * Initialize the mock learning preference adapter
 * Registers the adapter on the window object for detection by the API layer
 */
export function initializeMockLearningPreferenceAdapter(): void {
  if (typeof window === "undefined") return;
  
  (window as any).__STUDAI_LEARNING_PREFERENCE_ADAPTER__ = {
    get: mockGetMyLearningPreference,
    create: mockCreateLearningPreference,
    update: mockUpdateLearningPreference,
  };
  
  console.log("🎭 Mock Learning Preference Adapter initialized");
}
