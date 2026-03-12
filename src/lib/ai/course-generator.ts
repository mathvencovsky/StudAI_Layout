/**
 * Course Generator - Gera cursos estruturados com IA
 * 
 * Usa o sistema de prompts canônicos e busca recursos verificados
 * do ResourceCatalog para criar cursos completos.
 */

import {
  COURSE_BUILDER_PROMPT,
} from "../../../amplify/data/chat/system-prompt";
import {
  getResourcesForTopic,
  getTeoMeWhyResources,
} from "@/api/resource-catalog-search";
import type { Schema } from "../../../amplify/data/resource";

export interface CourseGenerationInput {
  objetivo: string;
  nivel: "beginner" | "intermediate" | "advanced";
  tempoDisponivel: number; // minutos por dia
  prazo?: string; // data alvo ou número de semanas
  area: string; // dados, web, cloud, IA, etc.
  idioma: "pt" | "en";
}

export interface CourseModule {
  title: string;
  goals: string[];
  lessons: CourseLesson[];
  tasks: CourseTask[];
  xpTotal: number;
  position: number;
}

export interface CourseLesson {
  title: string;
  type: "video" | "article" | "docs" | "reading";
  resourceId?: string;
  url?: string;
  estimatedMinutes: number;
  description?: string;
}

export interface CourseTask {
  title: string;
  instructions: string;
  type: "practice" | "reading" | "project" | "quiz" | "review";
  estimatedMinutes: number;
  xp: number;
}

export interface GeneratedCourse {
  title: string;
  summary: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  modules: CourseModule[];
  dailyRoutine: {
    description: string;
    tasks: string[];
  };
  badges: {
    name: string;
    description: string;
    requirement: string;
  }[];
}

/**
 * Generate a complete course based on user inputs
 * Uses AI + verified resources from ResourceCatalog
 */
export async function generateCourse(
  input: CourseGenerationInput
): Promise<GeneratedCourse> {
  // 1. Get relevant resources from catalog
  const resources = await getResourcesForTopic(
    input.area,
    input.nivel,
    input.idioma,
    20 // Get up to 20 resources
  );

  // 2. Get TeoMeWhy resources if PT-BR
  let teoResources: Schema["ResourceCatalog"]["type"][] = [];
  if (input.idioma === "pt") {
    teoResources = await getTeoMeWhyResources(input.area);
  }

  // 3. Build context for AI
  const resourceContext = buildResourceContext(resources, teoResources);

  // 4. Build prompt
  const prompt = buildCoursePrompt(input, resourceContext);

  // 5. Call AI (placeholder - integrate with actual AI service)
  // TODO: Integrate with Amazon Nova Micro or other AI model
  const aiResponse = await callAI(prompt);

  // 6. Parse and validate response
  const course = parseCourseResponse(aiResponse);

  // 7. Enrich with actual resource links
  const enrichedCourse = enrichCourseWithResources(
    course,
    resources,
    teoResources
  );

  return enrichedCourse;
}

/**
 * Build resource context for AI prompt
 */
function buildResourceContext(
  resources: Schema["ResourceCatalog"]["type"][],
  teoResources: Schema["ResourceCatalog"]["type"][]
): string {
  let context = "## RECURSOS DISPONÍVEIS NO CATÁLOGO\n\n";

  if (teoResources.length > 0) {
    context += "### TeoMeWhy (Fonte Prioritária PT-BR):\n";
    teoResources.forEach((r, i) => {
      context += `${i + 1}. ${r.title} - ${r.url}\n`;
      if (r.description) context += `   ${r.description}\n`;
    });
    context += "\n";
  }

  if (resources.length > 0) {
    context += "### Outros Recursos Verificados:\n";
    resources.forEach((r, i) => {
      context += `${i + 1}. ${r.title} - ${r.url}\n`;
      if (r.description) context += `   ${r.description}\n`;
      context += `   Tipo: ${r.type}, Nível: ${r.level}\n`;
    });
  }

  context +=
    "\n**IMPORTANTE:** Use APENAS os links acima. Não invente URLs.\n\n";

  return context;
}

/**
 * Build complete prompt for course generation
 */
function buildCoursePrompt(
  input: CourseGenerationInput,
  resourceContext: string
): string {
  return `${COURSE_BUILDER_PROMPT}

${resourceContext}

## INPUTS DO USUÁRIO

- **Objetivo:** ${input.objetivo}
- **Nível:** ${input.nivel}
- **Tempo disponível:** ${input.tempoDisponivel} minutos por dia
- **Prazo:** ${input.prazo || "Flexível"}
- **Área:** ${input.area}
- **Idioma preferido:** ${input.idioma === "pt" ? "Português (PT-BR)" : "English"}

## INSTRUÇÕES

1. Crie um curso completo e estruturado
2. Use APENAS os recursos listados acima
3. Priorize TeoMeWhy quando disponível
4. Adapte ao tempo disponível (${input.tempoDisponivel} min/dia)
5. Inclua gamificação (XP, badges, missões)
6. Inclua produtividade (rotina, Pomodoro, micro-hábitos)
7. Retorne em formato JSON válido

Gere o curso agora:`;
}

/**
 * Call AI service with retry logic and error handling
 * Integrates with AWS Bedrock (Amazon Nova or Claude)
 */
async function callAI(prompt: string): Promise<string> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try to use AWS Bedrock if available
      if (typeof window !== "undefined" && (window as any).AWS) {
        return await callBedrockAI(prompt);
      }

      // Fallback to mock response for development
      console.warn("AWS Bedrock not available, using mock response");
      return getMockCourseResponse(prompt);
    } catch (error) {
      lastError = error as Error;
      console.error(`AI call attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // All retries failed
  throw lastError || new Error("AI call failed after all retries");

  // All retries failed, return mock response
  console.error("All AI call attempts failed, using fallback");
  return getMockCourseResponse(prompt);
}

/**
 * Call AWS Bedrock AI service
 */
async function callBedrockAI(prompt: string): Promise<string> {
  // This would integrate with AWS Bedrock
  // Example using Amazon Nova Micro or Claude
  
  try {
    // Import AWS SDK dynamically
    const { BedrockRuntimeClient, InvokeModelCommand } = await import(
      "@aws-sdk/client-bedrock-runtime"
    );

    const client = new BedrockRuntimeClient({
      region: import.meta.env.VITE_AWS_REGION || "us-east-1",
    });

    const modelId = "amazon.nova-micro-v1:0"; // or "anthropic.claude-3-sonnet-20240229-v1:0"

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.completion || responseBody.content?.[0]?.text || "";
  } catch (error) {
    console.error("Bedrock AI call failed:", error);
    throw error;
  }
}

/**
 * Get mock course response for development/fallback
 */
function getMockCourseResponse(prompt: string): string {
  // Extract info from prompt for more realistic mock
  const objetivoMatch = prompt.match(/\*\*Objetivo:\*\* (.+)/);
  const nivelMatch = prompt.match(/\*\*Nível:\*\* (\w+)/);
  const areaMatch = prompt.match(/\*\*Área:\*\* (.+)/);

  const objetivo = objetivoMatch?.[1] || "Aprender programação";
  const nivel = nivelMatch?.[1] || "beginner";
  const area = areaMatch?.[1] || "Programação";

  return JSON.stringify({
    title: `Curso de ${area}`,
    summary: `Curso completo para ${objetivo}. Aprenda de forma prática e estruturada.`,
    category: area,
    level: nivel,
    estimatedHours: 40,
    modules: [
      {
        title: "Módulo 1: Fundamentos",
        goals: [
          "Entender os conceitos básicos",
          "Configurar ambiente de desenvolvimento",
          "Criar primeiro projeto",
        ],
        lessons: [
          {
            title: "Introdução e Conceitos",
            type: "video",
            estimatedMinutes: 30,
            description: "Visão geral e conceitos fundamentais",
          },
          {
            title: "Configuração do Ambiente",
            type: "article",
            estimatedMinutes: 20,
            description: "Como configurar seu ambiente",
          },
        ],
        tasks: [
          {
            title: "Exercício: Primeiro Projeto",
            instructions:
              "Crie seu primeiro projeto seguindo o tutorial. Pratique os conceitos aprendidos.",
            type: "practice",
            estimatedMinutes: 45,
            xp: 50,
          },
          {
            title: "Quiz: Fundamentos",
            instructions: "Teste seus conhecimentos sobre os fundamentos",
            type: "quiz",
            estimatedMinutes: 15,
            xp: 30,
          },
        ],
        xpTotal: 100,
        position: 1,
      },
      {
        title: "Módulo 2: Prática Intermediária",
        goals: [
          "Aplicar conceitos em projetos reais",
          "Desenvolver boas práticas",
          "Resolver problemas comuns",
        ],
        lessons: [
          {
            title: "Boas Práticas",
            type: "article",
            estimatedMinutes: 25,
            description: "Padrões e boas práticas da indústria",
          },
          {
            title: "Projeto Prático",
            type: "video",
            estimatedMinutes: 40,
            description: "Desenvolvimento de projeto completo",
          },
        ],
        tasks: [
          {
            title: "Projeto: Aplicação Completa",
            instructions:
              "Desenvolva uma aplicação completa aplicando as boas práticas",
            type: "project",
            estimatedMinutes: 120,
            xp: 150,
          },
          {
            title: "Revisão de Código",
            instructions: "Revise e otimize seu código",
            type: "review",
            estimatedMinutes: 30,
            xp: 50,
          },
        ],
        xpTotal: 250,
        position: 2,
      },
      {
        title: "Módulo 3: Avançado e Projeto Final",
        goals: [
          "Dominar técnicas avançadas",
          "Criar projeto portfolio",
          "Preparar para mercado",
        ],
        lessons: [
          {
            title: "Técnicas Avançadas",
            type: "video",
            estimatedMinutes: 45,
            description: "Conceitos e técnicas avançadas",
          },
          {
            title: "Arquitetura e Design",
            type: "docs",
            estimatedMinutes: 30,
            description: "Padrões de arquitetura",
          },
        ],
        tasks: [
          {
            title: "Projeto Final",
            instructions:
              "Desenvolva um projeto completo para seu portfolio",
            type: "project",
            estimatedMinutes: 180,
            xp: 300,
          },
          {
            title: "Apresentação do Projeto",
            instructions: "Documente e apresente seu projeto",
            type: "practice",
            estimatedMinutes: 60,
            xp: 100,
          },
        ],
        xpTotal: 450,
        position: 3,
      },
    ],
    dailyRoutine: {
      description:
        "Rotina diária otimizada com técnica Pomodoro (25min foco + 5min pausa)",
      tasks: [
        "🎯 Revisar objetivos do dia (5 min)",
        "📚 Estudar novo conteúdo (25 min)",
        "☕ Pausa (5 min)",
        "💻 Praticar com exercícios (25 min)",
        "☕ Pausa (5 min)",
        "🚀 Trabalhar em projeto (25 min)",
        "📝 Revisar e anotar aprendizados (10 min)",
      ],
    },
    badges: [
      {
        name: "🎓 Iniciante Dedicado",
        description: "Complete o primeiro módulo",
        requirement: "Módulo 1 completo (100 XP)",
      },
      {
        name: "💪 Praticante Consistente",
        description: "Mantenha 7 dias de sequência",
        requirement: "7 dias consecutivos estudando",
      },
      {
        name: "🏆 Mestre do Curso",
        description: "Complete todos os módulos",
        requirement: "Todos os módulos completos (800 XP)",
      },
      {
        name: "🚀 Projeto Showcase",
        description: "Finalize o projeto final",
        requirement: "Projeto final completo e documentado",
      },
    ],
  });
}

/**
 * Parse AI response into structured course
 */
function parseCourseResponse(response: string): GeneratedCourse {
  try {
    const parsed = JSON.parse(response);
    return parsed as GeneratedCourse;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Failed to parse course from AI response");
  }
}

/**
 * Enrich course with actual resource links from catalog
 */
function enrichCourseWithResources(
  course: GeneratedCourse,
  resources: Schema["ResourceCatalog"]["type"][],
  teoResources: Schema["ResourceCatalog"]["type"][]
): GeneratedCourse {
  const allResources = [...teoResources, ...resources];

  // Map resource titles to actual resources
  course.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      // Try to find matching resource
      const matchingResource = allResources.find(
        (r) =>
          r.title?.toLowerCase().includes(lesson.title.toLowerCase()) ||
          lesson.title.toLowerCase().includes(r.title?.toLowerCase() || "")
      );

      if (matchingResource) {
        lesson.resourceId = matchingResource.id;
        lesson.url = matchingResource.url;
        lesson.description = matchingResource.description || undefined;
      }
    });
  });

  return course;
}

/**
 * Calculate estimated hours based on modules
 */
export function calculateEstimatedHours(modules: CourseModule[]): number {
  let totalMinutes = 0;

  modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      totalMinutes += lesson.estimatedMinutes;
    });
    module.tasks.forEach((task) => {
      totalMinutes += task.estimatedMinutes;
    });
  });

  return Math.ceil(totalMinutes / 60);
}

/**
 * Calculate total XP for a course
 */
export function calculateTotalXP(modules: CourseModule[]): number {
  return modules.reduce((total, module) => total + module.xpTotal, 0);
}

/**
 * Validate course structure
 */
export function validateCourse(course: GeneratedCourse): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!course.title || course.title.length < 3) {
    errors.push("Título do curso inválido");
  }

  if (!course.modules || course.modules.length === 0) {
    errors.push("Curso deve ter pelo menos 1 módulo");
  }

  course.modules.forEach((module, i) => {
    if (!module.title) {
      errors.push(`Módulo ${i + 1} sem título`);
    }
    if (!module.lessons || module.lessons.length === 0) {
      errors.push(`Módulo ${i + 1} deve ter pelo menos 1 aula`);
    }
    if (!module.tasks || module.tasks.length === 0) {
      errors.push(`Módulo ${i + 1} deve ter pelo menos 1 tarefa`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
