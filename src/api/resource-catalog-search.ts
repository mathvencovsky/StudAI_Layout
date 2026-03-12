import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface ResourceSearchParams {
  tags?: string[];
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  language?: "pt" | "en";
  type?: "video" | "article" | "docs" | "repo" | "playlist" | "course";
  verified?: boolean;
  provider?: string;
}

/**
 * Search resources in catalog with filters
 * Uses RAG-like approach to find relevant resources
 */
export const searchResources = async (
  params: ResourceSearchParams
): Promise<Schema["ResourceCatalog"]["type"][]> => {
  const result = await client.models.ResourceCatalog.list();

  if (!result.data) {
    console.error("Failed to search resources:", result.errors);
    return [];
  }

  // Filter results based on params
  let filtered = result.data;

  // Only show verified resources by default
  if (params.verified !== false) {
    filtered = filtered.filter((r) => r.verified === true);
  }

  if (params.language) {
    filtered = filtered.filter((r) => r.language === params.language);
  }

  if (params.level) {
    filtered = filtered.filter((r) => r.level === params.level);
  }

  if (params.category) {
    filtered = filtered.filter(
      (r) =>
        r.category?.toLowerCase().includes(params.category!.toLowerCase())
    );
  }

  if (params.type) {
    filtered = filtered.filter((r) => r.type === params.type);
  }

  if (params.provider) {
    filtered = filtered.filter(
      (r) =>
        r.provider?.toLowerCase().includes(params.provider!.toLowerCase())
    );
  }

  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter((r) =>
      r.tags?.some((tag) =>
        tag && params.tags!.some((searchTag) =>
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      )
    );
  }

  return filtered;
};

/**
 * Search resources by topic/keyword
 * Searches in title, description, tags, and category
 */
export const searchResourcesByKeyword = async (
  keyword: string,
  language: "pt" | "en" = "pt"
): Promise<Schema["ResourceCatalog"]["type"][]> => {
  const result = await client.models.ResourceCatalog.list();

  if (!result.data) {
    return [];
  }

  const lowerKeyword = keyword.toLowerCase();

  // Filter by keyword in multiple fields
  const filtered = result.data.filter((r) => {
    if (!r.verified) return false;
    if (r.language !== language) return false;

    const matchTitle = r.title?.toLowerCase().includes(lowerKeyword);
    const matchDescription = r.description?.toLowerCase().includes(lowerKeyword);
    const matchCategory = r.category?.toLowerCase().includes(lowerKeyword);
    const matchTags = r.tags?.some((tag) =>
      tag && tag.toLowerCase().includes(lowerKeyword)
    );

    return matchTitle || matchDescription || matchCategory || matchTags;
  });

  return filtered;
};

/**
 * Get resources by specific tags (exact match)
 */
export const getResourcesByTags = async (
  tags: string[],
  language: "pt" | "en" = "pt"
): Promise<Schema["ResourceCatalog"]["type"][]> => {
  return searchResources({
    tags,
    language,
    verified: true,
  });
};

/**
 * Get resources for a specific topic and level
 * Useful for course generation
 */
export const getResourcesForTopic = async (
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  language: "pt" | "en" = "pt",
  limit: number = 10
): Promise<Schema["ResourceCatalog"]["type"][]> => {
  const resources = await searchResourcesByKeyword(topic, language);

  // Filter by level
  const filtered = resources.filter((r) => r.level === level);

  // Sort by relevance (verified first, then by type priority)
  const typePriority: Record<string, number> = {
    video: 1,
    article: 2,
    docs: 3,
    course: 4,
    playlist: 5,
    repo: 6,
  };

  filtered.sort((a, b) => {
    const aPriority = typePriority[a.type || ""] || 999;
    const bPriority = typePriority[b.type || ""] || 999;
    return aPriority - bPriority;
  });

  return filtered.slice(0, limit);
};

/**
 * Get TeoMeWhy resources (priority source for BR content)
 */
export const getTeoMeWhyResources = async (
  topic?: string
): Promise<Schema["ResourceCatalog"]["type"][]> => {
  const result = await client.models.ResourceCatalog.list();

  if (!result.data) {
    return [];
  }

  let filtered = result.data.filter(
    (r) =>
      r.verified &&
      r.language === "pt" &&
      r.provider?.toLowerCase().includes("teomewhy")
  );

  if (topic) {
    const lowerTopic = topic.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title?.toLowerCase().includes(lowerTopic) ||
        r.description?.toLowerCase().includes(lowerTopic) ||
        r.tags?.some((tag) => tag && tag.toLowerCase().includes(lowerTopic))
    );
  }

  return filtered;
};

/**
 * Verify if a URL is accessible
 * Returns verification status
 */
export interface UrlVerificationResult {
  url: string;
  verified: boolean;
  status?: number;
  error?: string;
  lastVerifiedAt: string;
}

export const verifyUrl = async (
  url: string
): Promise<UrlVerificationResult> => {
  try {
    // Use HEAD request to check if URL is accessible
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors", // Allow cross-origin requests
    });

    return {
      url,
      verified: response.ok || response.type === "opaque", // opaque = no-cors success
      status: response.status,
      lastVerifiedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      url,
      verified: false,
      error: error instanceof Error ? error.message : "Unknown error",
      lastVerifiedAt: new Date().toISOString(),
    };
  }
};

/**
 * Batch verify multiple URLs
 */
export const verifyUrls = async (
  urls: string[]
): Promise<UrlVerificationResult[]> => {
  const promises = urls.map((url) => verifyUrl(url));
  return Promise.all(promises);
};

/**
 * Get resource by ID and verify its URL
 */
export const getVerifiedResource = async (
  id: string
): Promise<{
  resource: Schema["ResourceCatalog"]["type"] | null;
  verification: UrlVerificationResult | null;
}> => {
  const result = await client.models.ResourceCatalog.get({ id });

  if (!result.data) {
    return { resource: null, verification: null };
  }

  const verification = await verifyUrl(result.data.url);

  return {
    resource: result.data,
    verification,
  };
};
