import { createStub } from "./base-stub";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  currentProgram: string;
  currentFocus: string;
  dailyGoal: number;
  memberSince: string;
  level: number;
  xp: number;
  streak: number;
  totalStudyMinutes: number;
  weeklyProgress: number;
  weeklyGoal: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export async function getUserProfileStub(): Promise<UserProfile> {
  return createStub<UserProfile>({
    id: "user-1",
    name: "João Silva",
    email: "joao.silva@email.com",
    initials: "JS",
    currentProgram: "CFA Level I",
    currentFocus: "Quantitative Methods",
    dailyGoal: 60,
    memberSince: "Janeiro 2025",
    level: 5,
    xp: 2450,
    streak: 12,
    totalStudyMinutes: 1850,
    weeklyProgress: 180,
    weeklyGoal: 300,
  });
}

export async function getUserBadgesStub(): Promise<Badge[]> {
  return createStub<Badge[]>([
    {
      id: "badge-1",
      name: "Primeira Sessão",
      description: "Complete sua primeira sessão de estudo",
      icon: "🎯",
      unlocked: true,
    },
    {
      id: "badge-2",
      name: "Streak de 7 dias",
      description: "Estude por 7 dias consecutivos",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: "badge-3",
      name: "100 XP",
      description: "Alcance 100 pontos de experiência",
      icon: "⭐",
      unlocked: true,
    },
    {
      id: "badge-4",
      name: "Maratonista",
      description: "Complete 10 horas de estudo",
      icon: "🏃",
      unlocked: false,
    },
    {
      id: "badge-5",
      name: "Mestre Quiz",
      description: "Acerte 90% em 5 quizzes",
      icon: "🎓",
      unlocked: false,
    },
    {
      id: "badge-6",
      name: "Trilha Completa",
      description: "Complete uma trilha inteira",
      icon: "🏆",
      unlocked: false,
    },
  ]);
}

export async function updateUserProfileStub(profile: Partial<UserProfile>): Promise<UserProfile> {
  const current = await getUserProfileStub();
  return createStub<UserProfile>({
    ...current,
    ...profile,
  });
}
