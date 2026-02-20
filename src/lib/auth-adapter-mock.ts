/**
 * Mock Auth Adapter for Development
 * Use this for testing the UI without AWS Amplify
 * 
 * IMPORTANT: This is for development only!
 * Use the real Amplify adapter for production.
 */

export interface AuthAdapter {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

// Simple in-memory user storage for mock
const MOCK_USERS_KEY = "studai_mock_users";
const MOCK_CURRENT_USER_KEY = "studai_mock_current_user";

interface MockUser {
  email: string;
  password: string;
  createdAt: string;
}

function getMockUsers(): MockUser[] {
  try {
    const users = localStorage.getItem(MOCK_USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUser[]): void {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function findMockUser(email: string): MockUser | undefined {
  const users = getMockUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export const mockAuthAdapter: AuthAdapter = {
  async signIn(email: string, password: string): Promise<void> {
    console.log("🔐 Mock Sign In:", email);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Find user
    const user = findMockUser(email);
    
    if (!user) {
      throw new Error("Usuário não encontrado. Crie uma conta primeiro.");
    }
    
    if (user.password !== password) {
      throw new Error("Senha incorreta.");
    }
    
    // Save current user
    localStorage.setItem(
      MOCK_CURRENT_USER_KEY,
      JSON.stringify({
        email: user.email,
        signedInAt: new Date().toISOString(),
      })
    );
    
    console.log("✅ Mock Sign In successful!");
    
    // Reload to trigger auth state update
    window.location.reload();
  },

  async signUp(email: string, password: string): Promise<void> {
    console.log("📝 Mock Sign Up:", email);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = findMockUser(email);
    if (existingUser) {
      throw new Error("Este email já está cadastrado. Faça login.");
    }
    
    // Validate password
    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }
    
    // Create new user
    const users = getMockUsers();
    const newUser: MockUser = {
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveMockUsers(users);
    
    console.log("✅ Mock Sign Up successful!");
    
    // Auto sign-in after registration
    localStorage.setItem(
      MOCK_CURRENT_USER_KEY,
      JSON.stringify({
        email: newUser.email,
        signedInAt: new Date().toISOString(),
      })
    );
    
    // Reload to trigger auth state update
    window.location.reload();
  },
};

/**
 * Initialize the mock auth adapter
 * Call this in main.tsx instead of initializeAuthAdapter()
 */
export function initializeMockAuthAdapter(): void {
  if (typeof window !== "undefined") {
    (window as any).__STUDAI_AUTH_ADAPTER__ = mockAuthAdapter;
    console.log("🎭 Mock Auth Adapter initialized");
    console.log("⚠️  This is for development only!");
  }
}

/**
 * Check if user is signed in (for mock auth provider)
 */
export function getMockCurrentUser(): { email: string } | null {
  try {
    const user = localStorage.getItem(MOCK_CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Sign out (for mock auth provider)
 */
export function mockSignOut(): void {
  localStorage.removeItem(MOCK_CURRENT_USER_KEY);
  window.location.reload();
}

/**
 * Clear all mock data (useful for testing)
 */
export function clearMockData(): void {
  localStorage.removeItem(MOCK_USERS_KEY);
  localStorage.removeItem(MOCK_CURRENT_USER_KEY);
  console.log("🗑️  Mock data cleared");
}
