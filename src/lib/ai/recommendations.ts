/**
 * Recommendations Engine - Gera recomendações personalizadas
 * 
 * Usa perfil do usuário, histórico e objetivos para recomendar
 * recursos verificados do catálogo.
 */

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import {
  getTeoMeWhyResources,
  getResourcesForTopic,
} from "@/api/resource-catalog-search";

const client = generateClient<Schema>();

export interface RecommendationInput {
  userId: string;
  context?: string; // Optional context from user
  limit?: number;
}

export interface Recommendation {
  resource: Schema["ResourceCatalog"]["type"];
  reason: string;
  priority: number; // 1-5, higher is more important
  estimatedMinutes: number;
  xpReward: number;
}

/**
 * Generate personalized recommendations for a user
 * Includes retry logic and robust error handling
 */
export async function generateRecommendations(
  input: RecommendationInput
): Promise<Recommendation[]> {
  const { userId, context, limit = 5 } = input;

  try {
    // 1. Get user profile and preferences with retry
    const [profile, preferences, goals, recentContent] = await Promise.all([
      retryWithBackoff(() => getUserProfile(userId)),
      retryWithBackoff(() => getUserPreferences(userId)),
      retryWithBackoff(() => getUserGoals(userId)),
      retryWithBackoff(() => getRecentContent(userId)),
    ]);

    // 2. Determine topics of interest
    const topics = extractTopics(preferences, goals, context);

    // If no topics found, return default recommendations
    if (topics.length === 0) {
      return getDefaultRecommendations(limit);
    }

    // 3. Get relevant resources
    const levelStr = typeof profile?.level === "number" 
      ? (profile.level <= 3 ? "beginner" : profile.level <= 7 ? "intermediate" : "advanced")
      : "beginner";
    
    const resources = await retryWithBackoff(() =>
      getRelevantResources(topics, levelStr, "pt")
    );

    // If no resources found, return default recommendations
    if (resources.length === 0) {
      return getDefaultRecommendations(limit);
    }

    // 4. Score and rank resources
    const scored = scoreResources(resources, profile, preferences, goals, recentContent);

    // 5. Generate reasons for each recommendation
    const recommendations = await generateReasons(scored, profile, goals);

    // 6. Return top N recommendations
    return recommendations.slice(0, limit);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    // Return default recommendations on error
    return getDefaultRecommendations(limit);
  }
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

/**
 * Get default recommendations when personalization fails
 */
async function getDefaultRecommendations(limit: number): Promise<Recommendation[]> {
  try {
    // Get popular TeoMeWhy resources
    const teoResources = await getTeoMeWhyResources("python");
    
    return teoResources.slice(0, limit).map((resource, index) => ({
      resource,
      reason: "Conteúdo popular e verificado",
      priority: 5 - Math.floor(index / 2),
      estimatedMinutes: 30,
      xpReward: 30,
    }));
  } catch (error) {
    console.error("Error getting default recommendations:", error);
    return [];
  }
}

/**
 * Get user profile
 */
async function getUserProfile(
  userId: string
): Promise<Schema["UserProfile"]["type"] | null> {
  try {
    const result = await client.models.UserProfile.list({
      filter: { owner: { eq: userId } },
    });
    return result.data?.[0] || null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Get user learning preferences
 */
async function getUserPreferences(
  userId: string
): Promise<Schema["LearningPreference"]["type"] | null> {
  try {
    const result = await client.models.LearningPreference.list({
      filter: { owner: { eq: userId } },
    });
    return result.data?.[0] || null;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return null;
  }
}

/**
 * Get user's active goals
 */
async function getUserGoals(
  userId: string
): Promise<Schema["Goal"]["type"][]> {
  try {
    const result = await client.models.Goal.list({
      filter: {
        owner: { eq: userId },
        status: { eq: "active" },
      },
    });
    return result.data || [];
  } catch (error) {
    console.error("Error getting user goals:", error);
    return [];
  }
}

/**
 * Get recently consumed content
 */
async function getRecentContent(
  userId: string
): Promise<Schema["UserContentProgress"]["type"][]> {
  try {
    const result = await client.models.UserContentProgress.list({
      filter: { owner: { eq: userId } },
    });
    // Sort by completion date, most recent first
    return (result.data || [])
      .filter((c) => c.completionDate)
      .sort((a, b) => {
        const dateA = new Date(a.completionDate!).getTime();
        const dateB = new Date(b.completionDate!).getTime();
        return dateB - dateA;
      })
      .slice(0, 10); // Last 10 items
  } catch (error) {
    console.error("Error getting recent content:", error);
    return [];
  }
}

/**
 * Extract topics from preferences, goals, and context
 */
function extractTopics(
  preferences: Schema["LearningPreference"]["type"] | null,
  goals: Schema["Goal"]["type"][],
  context?: string
): string[] {
  const topics: string[] = [];

  // From preferences
  if (preferences?.interests) {
    topics.push(...preferences.interests);
  }

  // From goals
  goals.forEach((goal) => {
    if (goal.title) {
      topics.push(goal.title);
    }
    if (goal.description) {
      topics.push(goal.description);
    }
  });

  // From context
  if (context) {
    topics.push(context);
  }

  // Remove duplicates and return
  return [...new Set(topics)];
}

/**
 * Get relevant resources based on topics
 */
async function getRelevantResources(
  topics: string[],
  level: string,
  language: "pt" | "en"
): Promise<Schema["ResourceCatalog"]["type"][]> {
  const allResources: Schema["ResourceCatalog"]["type"][] = [];

  // Get TeoMeWhy resources if PT-BR
  if (language === "pt") {
    for (const topic of topics) {
      const teoResources = await getTeoMeWhyResources(topic);
      allResources.push(...teoResources);
    }
  }

  // Get resources for each topic
  for (const topic of topics) {
    const resources = await getResourcesForTopic(
      topic,
      level as "beginner" | "intermediate" | "advanced",
      language,
      5
    );
    allResources.push(...resources);
  }

  // Remove duplicates by ID
  const uniqueResources = allResources.filter(
    (resource, index, self) =>
      index === self.findIndex((r) => r.id === resource.id)
  );

  return uniqueResources;
}

/**
 * Score resources based on relevance
 */
function scoreResources(
  resources: Schema["ResourceCatalog"]["type"][],
  profile: Schema["UserProfile"]["type"] | null,
  preferences: Schema["LearningPreference"]["type"] | null,
  goals: Schema["Goal"]["type"][],
  recentContent: Schema["UserContentProgress"]["type"][]
): Array<Schema["ResourceCatalog"]["type"] & { score: number }> {
  return resources.map((resource) => {
    let score = 0;

    // Base score for verified resources
    if (resource.verified) score += 10;

    // Prefer TeoMeWhy for PT-BR
    if (resource.provider?.toLowerCase().includes("teomewhy")) {
      score += 15;
    }

    // Match language preference (default to PT-BR)
    if (resource.language === "pt") {
      score += 5;
    }

    // Match content type preference
    if (preferences?.formats?.includes(resource.type || "")) {
      score += 5;
    }

    // Match level
    const userLevel = profile?.level || 1;
    if (resource.level === "beginner" && userLevel <= 3) score += 5;
    if (resource.level === "intermediate" && userLevel > 3 && userLevel <= 7)
      score += 5;
    if (resource.level === "advanced" && userLevel > 7) score += 5;

    // Boost if related to active goals
    goals.forEach((goal) => {
      if (
        resource.title?.toLowerCase().includes(goal.title?.toLowerCase() || "") ||
        resource.description?.toLowerCase().includes(goal.title?.toLowerCase() || "")
      ) {
        score += 10;
      }
    });

    // Penalize if recently consumed
    const wasRecentlyConsumed = recentContent.some(
      (c) => c.contentId === resource.id
    );
    if (wasRecentlyConsumed) score -= 20;

    return { ...resource, score };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Generate reasons for recommendations
 */
async function generateReasons(
  scoredResources: Array<Schema["ResourceCatalog"]["type"] & { score: number }>,
  _profile: Schema["UserProfile"]["type"] | null,
  goals: Schema["Goal"]["type"][]
): Promise<Recommendation[]> {
  return scoredResources.map((resource, index) => {
    let reason = "";
    let priority = 5 - Math.floor(index / 2); // Decrease priority as we go down
    priority = Math.max(1, Math.min(5, priority));

    // Generate reason based on score factors
    if (resource.provider?.toLowerCase().includes("teomewhy")) {
      reason = "Conteúdo do TeoMeWhy, fonte prioritária em PT-BR";
    } else if (goals.length > 0 && resource.score > 20) {
      reason = `Alinhado com seu objetivo: ${goals[0].title}`;
    } else if (resource.level === "beginner") {
      reason = "Perfeito para começar a aprender";
    } else if (resource.type === "video") {
      reason = "Vídeo prático e visual";
    } else if (resource.type === "docs") {
      reason = "Documentação oficial e confiável";
    } else {
      reason = "Recurso verificado e de qualidade";
    }

    // Estimate time based on type
    let estimatedMinutes = 30;
    if (resource.type === "video") estimatedMinutes = 20;
    if (resource.type === "article") estimatedMinutes = 15;
    if (resource.type === "docs") estimatedMinutes = 45;
    if (resource.type === "course") estimatedMinutes = 120;

    // Calculate XP reward
    const xpReward = Math.floor(estimatedMinutes / 10) * 10;

    return {
      resource,
      reason,
      priority,
      estimatedMinutes,
      xpReward,
    };
  });
}

/**
 * Get recommendations for a specific topic
 */
export async function getTopicRecommendations(
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  language: "pt" | "en" = "pt",
  limit: number = 5
): Promise<Recommendation[]> {
  const resources = await getResourcesForTopic(topic, level, language, limit * 2);

  const recommendations: Recommendation[] = resources.map((resource, index) => ({
    resource,
    reason: `Recurso sobre ${topic} para nível ${level}`,
    priority: 5 - Math.floor(index / 2),
    estimatedMinutes: 30,
    xpReward: 30,
  }));

  return recommendations.slice(0, limit);
}

/**
 * Get next best action recommendation
 * Used in dashboard "Next Action" card
 * Includes retry logic for reliability
 */
export async function getNextBestAction(
  userId: string
): Promise<{
  action: string;
  description: string;
  link: string;
  xp: number;
} | null> {
  try {
    // Get user data with retry
    const [goals, todayTasks] = await Promise.all([
      retryWithBackoff(() => getUserGoals(userId)),
      retryWithBackoff(() => getTodayTasks(userId)),
    ]);

    // Priority 1: Complete daily tasks
    const incompleteTasks = todayTasks.filter((t) => !t.isCompleted);
    if (incompleteTasks.length > 0) {
      return {
        action: "Complete sua tarefa diária",
        description: `Você tem ${incompleteTasks.length} tarefa(s) pendente(s) hoje`,
        link: "/",
        xp: 25,
      };
    }

    // Priority 2: Continue active goal
    if (goals.length > 0 && goals[0].isActive) {
      return {
        action: "Continue seu objetivo",
        description: `Progresso: ${goals[0].progressPercentage}% - ${goals[0].title}`,
        link: "/meu-objetivo",
        xp: 50,
      };
    }

    // Priority 3: Study session
    return {
      action: "Iniciar sessão de estudo",
      description: "Que tal 15 minutos de estudo com IA?",
      link: "/estudar",
      xp: 30,
    };
  } catch (error) {
    console.error("Error getting next best action:", error);
    // Return default action on error
    return {
      action: "Explorar conteúdo",
      description: "Descubra novos recursos de aprendizado",
      link: "/explorar",
      xp: 20,
    };
  }
}

/**
 * Get today's tasks
 */
async function getTodayTasks(
  userId: string
): Promise<Schema["DailyTask"]["type"][]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await client.models.DailyTask.list({
      filter: {
        owner: { eq: userId },
        date: { eq: today },
      },
    });
    return result.data || [];
  } catch (error) {
    console.error("Error getting today tasks:", error);
    return [];
  }
}
