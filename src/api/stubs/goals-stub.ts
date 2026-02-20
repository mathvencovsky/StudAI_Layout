import { createStub } from "./base-stub";

export interface Goal {
  id: string;
  minutesPerDay: number;
  minutesPerWeek: number;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "abandoned";
  progress: {
    currentWeekMinutes: number;
    todayMinutes: number;
  };
}

export async function getActiveGoalStub(): Promise<Goal | null> {
  return createStub({
    id: "1",
    minutesPerDay: 60,
    minutesPerWeek: 300,
    startDate: new Date(Date.now() - 604800000).toISOString(),
    endDate: new Date(Date.now() + 2592000000).toISOString(),
    status: "active" as const,
    progress: {
      currentWeekMinutes: 180,
      todayMinutes: 45,
    },
  });
}

export async function getGoalHistoryStub(): Promise<Goal[]> {
  return createStub([
    {
      id: "2",
      minutesPerDay: 45,
      minutesPerWeek: 225,
      startDate: new Date(Date.now() - 5184000000).toISOString(),
      endDate: new Date(Date.now() - 604800000).toISOString(),
      status: "completed" as const,
      progress: {
        currentWeekMinutes: 225,
        todayMinutes: 0,
      },
    },
  ]);
}

export async function createGoalStub(
  goal: Omit<Goal, "id" | "status" | "progress">,
): Promise<Goal> {
  return createStub({
    ...goal,
    id: Date.now().toString(),
    status: "active" as const,
    progress: {
      currentWeekMinutes: 0,
      todayMinutes: 0,
    },
  });
}
