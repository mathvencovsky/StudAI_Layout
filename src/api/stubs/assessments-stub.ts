import { createStub } from "./base-stub";

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
  status: "available" | "in-progress" | "completed";
  score?: number;
  completedAt?: string;
}

export async function getAssessmentsStub(): Promise<{
  available: Assessment[];
  inProgress: Assessment[];
  completed: Assessment[];
}> {
  return createStub({
    available: [
      {
        id: "assess-1",
        title: "Quiz: Direito Constitucional",
        description: "Questões sobre princípios fundamentais",
        questionCount: 20,
        estimatedTime: "30 min",
        status: "available" as const,
      },
      {
        id: "assess-2",
        title: "Simulado: Português",
        description: "Simulado completo de gramática e interpretação",
        questionCount: 40,
        estimatedTime: "60 min",
        status: "available" as const,
      },
    ],
    inProgress: [
      {
        id: "assess-3",
        title: "Quiz: Direito Administrativo",
        description: "Atos administrativos e licitações",
        questionCount: 25,
        estimatedTime: "35 min",
        status: "in-progress" as const,
      },
    ],
    completed: [
      {
        id: "assess-4",
        title: "Quiz: Raciocínio Lógico",
        description: "Questões de lógica proposicional",
        questionCount: 15,
        estimatedTime: "25 min",
        status: "completed" as const,
        score: 85,
        completedAt: "2024-02-15T10:30:00Z",
      },
      {
        id: "assess-5",
        title: "Simulado: Conhecimentos Gerais",
        description: "Simulado geral de conhecimentos",
        questionCount: 50,
        estimatedTime: "90 min",
        status: "completed" as const,
        score: 78,
        completedAt: "2024-02-10T14:20:00Z",
      },
    ],
  });
}
