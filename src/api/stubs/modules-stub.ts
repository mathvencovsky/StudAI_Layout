import { createStub } from "./base-stub";
import type { Module } from "@/model/module";

/**
 * Stub implementation for modules
 * Returns mock data for development/testing
 */
export async function getModuleStub(moduleId: string): Promise<Module | null> {
  const mockModules: Record<string, Module> = {
    "mock-module-react-basics": {
      id: "mock-module-react-basics",
      title: "React Básico",
      description: "Introdução aos conceitos fundamentais do React",
      category: "Tecnologia",
      difficulty: "beginner",
      estimatedDuration: 120, // 2 hours
      tags: ["React", "JavaScript", "Frontend"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  const module = mockModules[moduleId] || null;
  return createStub(module);
}

export async function getModuleContentsStub(moduleId: string) {
  const mockContents = [
    {
      id: "content-1",
      contentId: "content-1",
      moduleId,
      order: 1,
      content: {
        id: "content-1",
        title: "Introdução ao React",
        type: "video" as const,
        durationInSeconds: 1800, // 30 minutes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    {
      id: "content-2", 
      contentId: "content-2",
      moduleId,
      order: 2,
      content: {
        id: "content-2",
        title: "Componentes e Props",
        type: "video" as const,
        durationInSeconds: 2400, // 40 minutes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    {
      id: "content-3",
      contentId: "content-3", 
      moduleId,
      order: 3,
      content: {
        id: "content-3",
        title: "Exercício Prático",
        type: "assignment" as const,
        durationInSeconds: 3600, // 1 hour
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  ];

  return createStub(mockContents);
}

export async function getUserContentProgressStub(moduleId: string) {
  const mockProgress = [
    {
      id: "progress-1",
      contentId: "content-1",
      isCompleted: true,
      completionDate: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "progress-2",
      contentId: "content-2", 
      isCompleted: false,
      completionDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "progress-3",
      contentId: "content-3",
      isCompleted: false,
      completionDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return createStub(mockProgress);
}