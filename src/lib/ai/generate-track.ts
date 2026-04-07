/**
 * AI Track Generator
 * Uses the Amplify AI conversation to generate a structured learning track
 * from questionnaire data + learning preferences.
 */

import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { type Schema } from "../../../amplify/data/resource";
import { createModule } from "@/api/modules";
import { createTrack } from "@/api/track";
import { type LearningPreference } from "@/model/learning-preference";

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIConversation } = createAIHooks(client);

export interface TrackQuestionnaireData {
  topic: string;
  goal: string;
  currentKnowledge: string;
  timeAvailable: string;
  learningStyle: string;
  deadline?: string;
  specificTopics?: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
}

export interface GeneratedTrackPlan {
  title: string;
  description: string;
  modules: GeneratedModule[];
}

/**
 * Build the AI prompt from questionnaire + learning preferences
 */
export function buildTrackGenerationPrompt(
  questionnaire: TrackQuestionnaireData,
  preference: LearningPreference | null | undefined
): string {
  const prefContext = preference ? `
PERFIL DO ALUNO (das preferências salvas):
- Situação: ${preference.context ?? "não informado"}
- Nível de experiência: ${preference.experienceLevel ?? "não informado"}
- Tempo disponível: ${preference.minutesPerDay ? `${preference.minutesPerDay} min/dia` : "não informado"}
- Horas por semana: ${preference.hoursPerWeek ? `${preference.hoursPerWeek}h` : "não informado"}
- Orçamento: ${preference.budget ?? "gratuito"}
- Urgência: ${preference.urgency ?? 3}/5
` : "";

  return `Você é o motor de criação de trilhas da StudAI. Crie uma trilha de aprendizado estruturada.

${prefContext}
DADOS DO QUESTIONÁRIO:
- Tema: ${questionnaire.topic}
- Objetivo: ${questionnaire.goal}
- Nível atual: ${questionnaire.currentKnowledge}
- Tempo disponível: ${questionnaire.timeAvailable} horas/semana
- Estilo de aprendizado: ${questionnaire.learningStyle}
${questionnaire.deadline ? `- Prazo: ${questionnaire.deadline}` : ""}
${questionnaire.specificTopics ? `- Tópicos específicos: ${questionnaire.specificTopics}` : ""}

INSTRUÇÕES:
1. Crie uma trilha com 4 a 8 módulos progressivos
2. Cada módulo deve ter título claro e descrição de 1-2 frases
3. Os módulos devem seguir uma progressão lógica do básico ao avançado
4. Adapte ao nível e tempo disponível do aluno
5. Use linguagem motivadora e clara

RESPONDA APENAS com um JSON válido neste formato exato (sem markdown, sem explicações):
{
  "title": "Título da trilha",
  "description": "Descrição da trilha em 1-2 frases",
  "modules": [
    { "title": "Módulo 1", "description": "Descrição do módulo 1" },
    { "title": "Módulo 2", "description": "Descrição do módulo 2" }
  ]
}`;
}

/**
 * Parse the AI response JSON into a GeneratedTrackPlan
 */
export function parseTrackPlan(aiResponse: string): GeneratedTrackPlan | null {
  try {
    // Strip markdown code blocks if present
    const cleaned = aiResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.title || !parsed.modules || !Array.isArray(parsed.modules)) {
      return null;
    }
    return parsed as GeneratedTrackPlan;
  } catch {
    return null;
  }
}

/**
 * Create the actual Track + Modules in Amplify from the generated plan
 */
export async function createTrackFromPlan(
  plan: GeneratedTrackPlan
): Promise<string> {
  // 1. Create all modules in parallel
  const createdModules = await Promise.all(
    plan.modules.map((m) =>
      createModule({ title: m.title, description: m.description })
    )
  );

  if (createdModules.length === 0) throw new Error("No modules created");

  // 2. Build parent map (linear chain: each module's parent is the previous)
  const parentByModuleId: Record<string, string> = {};
  const positionByModuleId: Record<string, string> = {};

  createdModules.forEach((mod, idx) => {
    if (idx > 0) {
      parentByModuleId[mod.id] = createdModules[idx - 1].id;
    }
    positionByModuleId[mod.id] = JSON.stringify({ x: idx * 250, y: 0 });
  });

  // 3. Create the track with the first module as root
  const track = await createTrack({
    title: plan.title,
    description: plan.description,
    rootModuleId: createdModules[0].id,
    parentByModuleId: JSON.stringify(parentByModuleId),
    positionByModuleId: JSON.stringify(positionByModuleId),
    categories: [],
  });

  return track.id;
}

// Export the hook for use in components
export { useAIConversation };
