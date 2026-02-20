import { createStub } from "./base-stub";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardDataStub(): Promise<DashboardData> {
  return createStub({
    metrics: {
      currentStreak: 7,
      weeklyMinutes: 180,
      xp: 1250,
      level: 5,
    },
    lastContent: {
      id: "1",
      title: "Introdução ao React",
      type: "module" as const,
      progress: 65,
    },
    upcomingTasks: [
      {
        id: "1",
        title: "Completar módulo de React Hooks",
        dueDate: new Date().toISOString(),
        priority: "high" as const,
      },
      {
        id: "2",
        title: "Revisar conceitos de TypeScript",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: "medium" as const,
      },
      {
        id: "3",
        title: "Fazer avaliação de JavaScript",
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        priority: "high" as const,
      },
    ],
    recentSessions: [
      {
        id: "1",
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date().toISOString(),
        duration: 60,
        topic: "React Hooks",
        xpEarned: 50,
        type: "study" as const,
      },
      {
        id: "2",
        startTime: new Date(Date.now() - 90000000).toISOString(),
        endTime: new Date(Date.now() - 86400000).toISOString(),
        duration: 45,
        topic: "TypeScript Basics",
        xpEarned: 40,
        type: "study" as const,
      },
      {
        id: "3",
        startTime: new Date(Date.now() - 176400000).toISOString(),
        endTime: new Date(Date.now() - 172800000).toISOString(),
        duration: 30,
        topic: "JavaScript ES6",
        xpEarned: 30,
        type: "review" as const,
      },
    ],
  });
}
