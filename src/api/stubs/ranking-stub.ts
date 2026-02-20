import { createStub } from "./base-stub";

export interface RankingUser {
  id: string;
  name: string;
  xp: number;
  streak: number;
  trend: "up" | "down" | "same";
  position: number;
  isCurrentUser?: boolean;
}

export async function getRankingStub(_period: "week" | "month" | "all" = "week"): Promise<RankingUser[]> {
  return createStub<RankingUser[]>([
    { id: "1", name: "Maria Silva", xp: 4850, streak: 28, trend: "up", position: 1 },
    { id: "2", name: "João Santos", xp: 4520, streak: 21, trend: "up", position: 2 },
    { id: "3", name: "Ana Costa", xp: 4200, streak: 15, trend: "same", position: 3 },
    { id: "4", name: "Pedro Lima", xp: 3890, streak: 12, trend: "down", position: 4 },
    { id: "5", name: "Você", xp: 2450, streak: 12, trend: "up", position: 5, isCurrentUser: true },
    { id: "6", name: "Lucas Oliveira", xp: 2300, streak: 8, trend: "down", position: 6 },
    { id: "7", name: "Carla Mendes", xp: 2100, streak: 5, trend: "up", position: 7 },
    { id: "8", name: "Bruno Alves", xp: 1950, streak: 3, trend: "same", position: 8 },
    { id: "9", name: "Julia Ferreira", xp: 1800, streak: 10, trend: "up", position: 9 },
    { id: "10", name: "Rafael Souza", xp: 1650, streak: 2, trend: "down", position: 10 },
  ]);
}
