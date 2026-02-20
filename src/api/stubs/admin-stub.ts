import { createStub } from "./base-stub";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  registeredAt: string;
  lastLogin: string;
  status: "active" | "inactive";
  role: "user" | "admin";
}

export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string;
}

export interface CatalogResource {
  id: string;
  type: "track" | "module" | "content";
  title: string;
  category: string;
  status: "published" | "draft";
  createdAt: string;
}

export async function getAdminUsersStub(_filters?: {
  search?: string;
  page?: number;
}): Promise<{ users: AdminUser[]; total: number }> {
  const allUsers: AdminUser[] = [
    {
      id: "user-1",
      email: "joao.silva@example.com",
      name: "João Silva",
      registeredAt: "2024-01-15T10:00:00Z",
      lastLogin: "2024-02-19T15:30:00Z",
      status: "active",
      role: "user",
    },
    {
      id: "user-2",
      email: "maria.santos@example.com",
      name: "Maria Santos",
      registeredAt: "2024-01-20T14:00:00Z",
      lastLogin: "2024-02-18T09:15:00Z",
      status: "active",
      role: "user",
    },
    {
      id: "user-3",
      email: "admin@studai.app",
      name: "Admin User",
      registeredAt: "2024-01-01T00:00:00Z",
      lastLogin: "2024-02-20T08:00:00Z",
      status: "active",
      role: "admin",
    },
  ];

  return createStub({
    users: allUsers,
    total: allUsers.length,
  });
}

export async function getFeatureTogglesStub(): Promise<FeatureToggle[]> {
  return createStub<FeatureToggle[]>([
    {
      id: "feature-1",
      name: "ai-chat",
      description: "Chat com IA para assistência nos estudos",
      enabled: true,
      updatedAt: "2024-02-15T10:00:00Z",
    },
    {
      id: "feature-2",
      name: "gamification",
      description: "Sistema de XP, níveis e badges",
      enabled: true,
      updatedAt: "2024-02-10T14:00:00Z",
    },
    {
      id: "feature-3",
      name: "social-features",
      description: "Ranking e grupos de estudo",
      enabled: false,
      updatedAt: "2024-02-05T09:00:00Z",
    },
  ]);
}

export async function updateFeatureToggleStub(
  id: string,
  enabled: boolean,
): Promise<FeatureToggle> {
  return createStub<FeatureToggle>({
    id,
    name: "feature-name",
    description: "Feature description",
    enabled,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCatalogResourcesStub(_filters?: {
  type?: string;
  search?: string;
}): Promise<CatalogResource[]> {
  return createStub<CatalogResource[]>([
    {
      id: "res-1",
      type: "track",
      title: "Analista BACEN",
      category: "Concurso",
      status: "published",
      createdAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "res-2",
      type: "track",
      title: "CFA Level I",
      category: "Certificação",
      status: "published",
      createdAt: "2024-01-15T14:00:00Z",
    },
    {
      id: "res-3",
      type: "module",
      title: "Direito Constitucional",
      category: "Direito",
      status: "published",
      createdAt: "2024-01-20T09:00:00Z",
    },
  ]);
}
