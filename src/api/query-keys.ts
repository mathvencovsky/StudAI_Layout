/**
 * Query keys hierárquicos para React Query
 * Estrutura: [feature, action, ...params]
 */

// Legacy flat keys for backward compatibility
export const QUERY_KEYS = {
  DASHBOARD: "dashboard",
  SESSIONS: "sessions",
  CALENDAR_EVENTS: "calendar-events",
  GOALS: "goals",
  REVIEWS: "reviews",
  ASSESSMENTS: "assessments",
  TRACKS: "tracks",
  REPORTS: "reports",
  METRICS: "metrics",
  ACTIVITY: "activity",
  SAVED: "saved",
  SEARCH: "search",
  ADMIN: "admin",
  SETTINGS: "settings",
} as const;

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  
  sessions: {
    all: ["sessions"] as const,
    list: (filters?: unknown) => ["sessions", "list", filters] as const,
    detail: (id: string) => ["sessions", id] as const,
    active: ["sessions", "active"] as const,
  },
  
  calendar: {
    all: ["calendar"] as const,
    upcoming: (days: number) => ["calendar", "upcoming", days] as const,
  },
  
  goals: {
    all: ["goals"] as const,
    active: ["goals", "active"] as const,
    history: ["goals", "history"] as const,
  },
  
  reviews: {
    all: ["reviews"] as const,
    pending: ["reviews", "pending"] as const,
    completed: ["reviews", "completed"] as const,
  },
  
  assessments: {
    all: ["assessments"] as const,
    list: ["assessments", "list"] as const,
    detail: (id: string) => ["assessments", id] as const,
  },
  
  tracks: {
    all: ["tracks"] as const,
    active: ["tracks", "active"] as const,
    catalog: (filters?: unknown) => ["tracks", "catalog", filters] as const,
  },
  
  reports: {
    all: ["reports"] as const,
    data: (period: string) => ["reports", "data", period] as const,
  },
  
  metrics: {
    all: ["metrics"] as const,
    data: (period: string) => ["metrics", "data", period] as const,
  },
  
  activity: {
    all: ["activity"] as const,
    list: (page: number) => ["activity", "list", page] as const,
  },
  
  saved: {
    all: ["saved"] as const,
    list: ["saved", "list"] as const,
  },
  
  search: {
    all: ["search"] as const,
    results: (query: string, filters?: unknown) =>
      ["search", "results", query, filters] as const,
  },
  
  admin: {
    users: ["admin", "users"] as const,
    features: ["admin", "features"] as const,
    catalog: ["admin", "catalog"] as const,
  },
  
  settings: {
    preferences: ["settings", "preferences"] as const,
    account: ["settings", "account"] as const,
  },
} as const;
