import { createStub } from "./base-stub";

export interface UserPreferences {
  language: "pt-BR" | "en-US";
  theme: "light" | "dark" | "system";
  defaultGoalMinutes: number;
  notifications: {
    email: boolean;
    push: boolean;
    reviewReminders: boolean;
    goalReminders: boolean;
  };
}

export interface UserAccount {
  email: string;
  registeredAt: string;
  emailVerified: boolean;
}

export async function getUserPreferencesStub(): Promise<UserPreferences> {
  return createStub<UserPreferences>({
    language: "pt-BR",
    theme: "system",
    defaultGoalMinutes: 60,
    notifications: {
      email: true,
      push: false,
      reviewReminders: true,
      goalReminders: true,
    },
  });
}

export async function updateUserPreferencesStub(
  preferences: Partial<UserPreferences>,
): Promise<UserPreferences> {
  // Simula atualização - retorna preferências atualizadas
  const current = await getUserPreferencesStub();
  return createStub<UserPreferences>({
    ...current,
    ...preferences,
  });
}

export async function getUserAccountStub(): Promise<UserAccount> {
  return createStub<UserAccount>({
    email: "usuario@example.com",
    registeredAt: "2024-01-15T10:00:00Z",
    emailVerified: true,
  });
}

export async function deleteAccountStub(): Promise<{ success: boolean }> {
  return createStub<{ success: boolean }>({
    success: true,
  });
}
