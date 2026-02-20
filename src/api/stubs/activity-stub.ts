import { createStub } from "./base-stub";

export interface Activity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  xp: number;
}

export async function getActivityFeedStub(): Promise<Activity[]> {
  const now = Date.now();
  const activities: Activity[] = [
    {
      id: "1",
      type: "course_completed",
      title: "Completou curso de React Avançado",
      timestamp: new Date(now - 1800000).toISOString(), // 30 min ago
      xp: 100,
    },
    {
      id: "2",
      type: "quiz_completed",
      title: "Completou quiz de JavaScript com 85%",
      timestamp: new Date(now - 7200000).toISOString(), // 2 hours ago
      xp: 50,
    },
    {
      id: "3",
      type: "study_session",
      title: "Sessão de estudo: TypeScript Generics",
      timestamp: new Date(now - 14400000).toISOString(), // 4 hours ago
      xp: 30,
    },
    {
      id: "4",
      type: "module_completed",
      title: "Completou módulo de Hooks",
      timestamp: new Date(now - 86400000).toISOString(), // 1 day ago
      xp: 75,
    },
    {
      id: "5",
      type: "task_completed",
      title: "Completou exercícios de Redux",
      timestamp: new Date(now - 172800000).toISOString(), // 2 days ago
      xp: 40,
    },
    {
      id: "6",
      type: "quiz_completed",
      title: "Quiz de CSS Grid - 92%",
      timestamp: new Date(now - 259200000).toISOString(), // 3 days ago
      xp: 60,
    },
    {
      id: "7",
      type: "study_session",
      title: "Sessão de estudo: Node.js APIs",
      timestamp: new Date(now - 345600000).toISOString(), // 4 days ago
      xp: 35,
    },
    {
      id: "8",
      type: "module_completed",
      title: "Completou módulo de Testing",
      timestamp: new Date(now - 432000000).toISOString(), // 5 days ago
      xp: 80,
    },
    {
      id: "9",
      type: "course_completed",
      title: "Completou curso de Next.js",
      timestamp: new Date(now - 518400000).toISOString(), // 6 days ago
      xp: 120,
    },
    {
      id: "10",
      type: "task_completed",
      title: "Completou projeto prático",
      timestamp: new Date(now - 604800000).toISOString(), // 7 days ago
      xp: 90,
    },
  ];

  return createStub(activities);
}
