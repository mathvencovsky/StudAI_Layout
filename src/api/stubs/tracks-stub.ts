import { createStub } from "./base-stub";

export interface Track {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  progress?: number;
  moduleCount: number;
  isActive?: boolean;
  tags: string[];
  estimatedHours: number;
  completedModules?: number;
  totalModules?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  order: number;
  duration: number;
}

export async function getTrackStub(trackId: string): Promise<Track | null> {
  const mockTracks: Record<string, Track> = {
    "mock-track-frontend-react": {
      id: "mock-track-frontend-react",
      title: "Desenvolvedor Frontend com React",
      description: "Torne-se um desenvolvedor frontend completo com React e TypeScript",
      category: "Tecnologia",
      difficulty: "intermediate",
      duration: "6 meses",
      progress: 35,
      moduleCount: 8,
      completedModules: 3,
      totalModules: 8,
      estimatedHours: 150,
      isActive: true,
      tags: ["React", "TypeScript", "Frontend", "JavaScript"],
    },
    "track-1": {
      id: "track-1",
      title: "Analista BACEN",
      description: "Preparação completa para o concurso de Analista do Banco Central",
      category: "Concurso",
      difficulty: "advanced",
      duration: "6 meses",
      progress: 42,
      moduleCount: 12,
      completedModules: 5,
      totalModules: 12,
      estimatedHours: 180,
      isActive: true,
      tags: ["Concurso", "Direito", "Economia", "Finanças"],
    },
  };

  const track = mockTracks[trackId] || null;
  return createStub(track);
}

export async function getActiveTrackStub(): Promise<Track | null> {
  return createStub<Track | null>({
    id: "track-1",
    title: "Analista BACEN",
    description: "Preparação completa para o concurso de Analista do Banco Central",
    category: "Concurso",
    difficulty: "advanced",
    duration: "6 meses",
    progress: 42,
    moduleCount: 12,
    completedModules: 5,
    totalModules: 12,
    estimatedHours: 180,
    isActive: true,
    tags: ["Concurso", "Direito", "Economia", "Finanças"],
  });
}

export async function getTrackModulesStub(trackId: string): Promise<Module[]> {
  return createStub<Module[]>([
    {
      id: "mod-1",
      title: "Direito Constitucional",
      description: "Princípios fundamentais e direitos",
      status: "completed",
      progress: 100,
      order: 1,
      duration: 45,
    },
    {
      id: "mod-2",
      title: "Direito Administrativo",
      description: "Atos administrativos e licitações",
      status: "in-progress",
      progress: 65,
      order: 2,
      duration: 60,
    },
    {
      id: "mod-3",
      title: "Português",
      description: "Gramática e interpretação de texto",
      status: "not-started",
      progress: 0,
      order: 3,
      duration: 30,
    },
    {
      id: "mod-4",
      title: "Raciocínio Lógico",
      description: "Lógica proposicional e quantitativa",
      status: "not-started",
      progress: 0,
      order: 4,
      duration: 40,
    },
  ]);
}

export async function getTracksCatalogStub(filters?: {
  category?: string;
  difficulty?: string;
  duration?: string;
}): Promise<Track[]> {
  return createStub<Track[]>([
    {
      id: "mock-track-frontend-react",
      title: "Desenvolvedor Frontend com React",
      description: "Torne-se um desenvolvedor frontend completo com React e TypeScript",
      category: "Tecnologia",
      difficulty: "intermediate",
      duration: "6 meses",
      moduleCount: 8,
      estimatedHours: 150,
      tags: ["React", "TypeScript", "Frontend", "JavaScript"],
    },
    {
      id: "track-2",
      title: "CFA Level I",
      description: "Preparação para certificação CFA nível 1",
      category: "Certificação",
      difficulty: "advanced",
      duration: "4 meses",
      moduleCount: 10,
      estimatedHours: 300,
      tags: ["Finanças", "Investimentos", "CFA", "Certificação"],
    },
    {
      id: "track-3",
      title: "Engenharia 3º Período",
      description: "Conteúdo completo do terceiro período",
      category: "Faculdade",
      difficulty: "intermediate",
      duration: "1 semestre",
      moduleCount: 8,
      estimatedHours: 120,
      tags: ["Engenharia", "Cálculo", "Física", "Faculdade"],
    },
    {
      id: "track-4",
      title: "CPA-20",
      description: "Certificação profissional ANBIMA",
      category: "Certificação",
      difficulty: "intermediate",
      duration: "2 meses",
      moduleCount: 6,
      estimatedHours: 80,
      tags: ["Certificação", "ANBIMA", "Mercado Financeiro"],
    },
    {
      id: "track-5",
      title: "React Avançado",
      description: "Domine React com hooks, context e performance",
      category: "Tecnologia",
      difficulty: "advanced",
      duration: "3 meses",
      moduleCount: 15,
      estimatedHours: 90,
      tags: ["React", "JavaScript", "Frontend", "Web"],
    },
    {
      id: "track-6",
      title: "OAB 1ª Fase",
      description: "Preparação completa para OAB primeira fase",
      category: "Concurso",
      difficulty: "intermediate",
      duration: "5 meses",
      moduleCount: 18,
      estimatedHours: 200,
      tags: ["OAB", "Direito", "Advocacia", "Concurso"],
    },
  ]);
}
