import { createStub } from "./base-stub";

export interface SearchResult {
  id: string;
  type: "track" | "content" | "assessment";
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
}

export async function searchContentStub(
  query: string,
  filters?: { type?: string },
): Promise<SearchResult[]> {
  // Simula busca - retorna resultados apenas se query tem 3+ caracteres
  if (query.length < 3) {
    return createStub<SearchResult[]>([]);
  }

  const allResults: SearchResult[] = [
    {
      id: "track-1",
      type: "track",
      title: "Analista BACEN",
      description: "Preparação completa para o concurso",
      tags: ["concurso", "direito", "economia"],
    },
    {
      id: "content-1",
      type: "content",
      title: "Direito Constitucional - Princípios Fundamentais",
      description: "Aula sobre os princípios fundamentais da CF/88",
      tags: ["direito", "constitucional"],
    },
    {
      id: "assessment-1",
      type: "assessment",
      title: "Quiz: Direito Administrativo",
      description: "20 questões sobre atos administrativos",
      tags: ["quiz", "direito", "administrativo"],
    },
    {
      id: "track-2",
      type: "track",
      title: "CFA Level I",
      description: "Certificação CFA nível 1",
      tags: ["certificação", "finanças", "investimentos"],
    },
    {
      id: "content-2",
      type: "content",
      title: "Português - Interpretação de Texto",
      description: "Técnicas de interpretação para concursos",
      tags: ["português", "interpretação"],
    },
  ];

  // Filtra por tipo se especificado
  let results = allResults;
  if (filters?.type && filters.type !== "all") {
    results = results.filter((r) => r.type === filters.type);
  }

  // Filtra por query (busca simples no título e descrição)
  const lowerQuery = query.toLowerCase();
  results = results.filter(
    (r) =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );

  return createStub<SearchResult[]>(results);
}
