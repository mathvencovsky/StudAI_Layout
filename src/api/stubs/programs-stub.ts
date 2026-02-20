import { createStub } from "./base-stub";

export interface Program {
  id: string;
  name: string;
  category: string;
  progress: number;
  totalHours: number;
  completedHours: number;
  modules: number;
  status: "in_progress" | "not_started" | "completed";
}

export async function getProgramsStub(): Promise<Program[]> {
  return createStub<Program[]>([
    {
      id: "prog-1",
      name: "CFA Level I - Quantitative Methods",
      category: "Certificação",
      progress: 42,
      totalHours: 44,
      completedHours: 18.5,
      modules: 7,
      status: "in_progress",
    },
    {
      id: "prog-2",
      name: "Python para Data Science",
      category: "Programação",
      progress: 15,
      totalHours: 30,
      completedHours: 4.5,
      modules: 8,
      status: "not_started",
    },
    {
      id: "prog-3",
      name: "Inglês para Negócios - B2",
      category: "Idiomas",
      progress: 0,
      totalHours: 40,
      completedHours: 0,
      modules: 12,
      status: "not_started",
    },
  ]);
}
