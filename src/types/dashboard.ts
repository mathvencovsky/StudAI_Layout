export interface DashboardMetrics {
  currentStreak: number;
  weeklyMinutes: number;
  xp: number;
  level: number;
}

export interface LastContent {
  id: string;
  title: string;
  type: "track" | "module" | "content";
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // em minutos
  topic: string;
  xpEarned: number;
  type: "study" | "review" | "assessment";
}

export interface DashboardData {
  metrics: DashboardMetrics;
  lastContent?: LastContent;
  upcomingTasks: Task[];
  recentSessions: StudySession[];
}
