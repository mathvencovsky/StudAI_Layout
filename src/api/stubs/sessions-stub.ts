import { createStub } from "./base-stub";
import type { StudySession } from "@/types/dashboard";

export interface SessionFilters {
  period?: "week" | "month" | "year";
  type?: "study" | "review" | "assessment";
}

export interface SessionsData {
  sessions: StudySession[];
  summary: {
    totalSessions: number;
    totalMinutes: number;
    averageDuration: number;
  };
}

export async function getSessionsStub(
  filters?: SessionFilters,
): Promise<SessionsData> {
  // Simula filtros (na prática, filtraria os dados)
  const sessions: StudySession[] = [
    {
      id: "1",
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      duration: 60,
      topic: "React Hooks",
      xpEarned: 50,
      type: "study",
    },
    {
      id: "2",
      startTime: new Date(Date.now() - 90000000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      duration: 45,
      topic: "TypeScript Basics",
      xpEarned: 40,
      type: "study",
    },
    {
      id: "3",
      startTime: new Date(Date.now() - 176400000).toISOString(),
      endTime: new Date(Date.now() - 172800000).toISOString(),
      duration: 30,
      topic: "JavaScript ES6",
      xpEarned: 30,
      type: "review",
    },
    {
      id: "4",
      startTime: new Date(Date.now() - 262800000).toISOString(),
      endTime: new Date(Date.now() - 259200000).toISOString(),
      duration: 90,
      topic: "React Testing",
      xpEarned: 75,
      type: "assessment",
    },
  ];

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  return createStub({
    sessions,
    summary: {
      totalSessions: sessions.length,
      totalMinutes,
      averageDuration: Math.round(totalMinutes / sessions.length),
    },
  });
}

export async function getActiveSessionStub(): Promise<StudySession | null> {
  // Simula que não há sessão ativa
  return createStub(null);
}

export async function startSessionStub(
  topic: string,
): Promise<StudySession> {
  return createStub({
    id: Date.now().toString(),
    startTime: new Date().toISOString(),
    duration: 0,
    topic,
    xpEarned: 0,
    type: "study",
  });
}

export async function endSessionStub(
  sessionId: string,
): Promise<StudySession> {
  return createStub({
    id: sessionId,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date().toISOString(),
    duration: 60,
    topic: "Current Study Topic",
    xpEarned: 50,
    type: "study",
  });
}
