import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AdminTrack,
  AdminModule,
  AdminLesson,
  ContentBlock,
  AutosaveStatus,
  ValidationIssue,
} from '@/types/admin-track';

interface AdminTrackState {
  // Estado atual
  currentTrack: AdminTrack | null;
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  selectedBlockId: string | null;
  
  // UI State
  autosaveStatus: AutosaveStatus;
  lastSavedAt: Date | null;
  validationIssues: ValidationIssue[];
  isPreviewOpen: boolean;
  isSidebarCollapsed: boolean;
  isPropertiesPanelCollapsed: boolean;
  
  // Ações
  setCurrentTrack: (track: AdminTrack | null) => void;
  updateTrack: (updates: Partial<AdminTrack>) => void;
  
  // Seleção
  selectModule: (moduleId: string | null) => void;
  selectLesson: (lessonId: string | null) => void;
  selectBlock: (blockId: string | null) => void;
  
  // Módulos
  addModule: (module: Omit<AdminModule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateModule: (moduleId: string, updates: Partial<AdminModule>) => void;
  deleteModule: (moduleId: string) => void;
  reorderModules: (moduleIds: string[]) => void;
  duplicateModule: (moduleId: string) => void;
  
  // Aulas
  addLesson: (moduleId: string, lesson: Omit<AdminLesson, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLesson: (lessonId: string, updates: Partial<AdminLesson>) => void;
  deleteLesson: (lessonId: string) => void;
  reorderLessons: (moduleId: string, lessonIds: string[]) => void;
  duplicateLesson: (lessonId: string) => void;
  
  // Blocos de Conteúdo
  addContentBlock: (lessonId: string, block: Omit<ContentBlock, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContentBlock: (blockId: string, updates: Partial<ContentBlock>) => void;
  deleteContentBlock: (blockId: string) => void;
  reorderContentBlocks: (lessonId: string, blockIds: string[]) => void;
  
  // Autosave
  setAutosaveStatus: (status: AutosaveStatus) => void;
  setLastSavedAt: (date: Date) => void;
  
  // Validação
  setValidationIssues: (issues: ValidationIssue[]) => void;
  
  // UI
  togglePreview: () => void;
  toggleSidebar: () => void;
  togglePropertiesPanel: () => void;
  
  // Reset
  reset: () => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAdminTrackStore = create<AdminTrackState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      currentTrack: null,
      selectedModuleId: null,
      selectedLessonId: null,
      selectedBlockId: null,
      autosaveStatus: 'idle',
      lastSavedAt: null,
      validationIssues: [],
      isPreviewOpen: false,
      isSidebarCollapsed: false,
      isPropertiesPanelCollapsed: false,

      // Ações básicas
      setCurrentTrack: (track) => set({ currentTrack: track }),
      
      updateTrack: (updates) => set((state) => ({
        currentTrack: state.currentTrack
          ? { ...state.currentTrack, ...updates, updatedAt: new Date() }
          : null,
      })),

      // Seleção
      selectModule: (moduleId) => set({
        selectedModuleId: moduleId,
        selectedLessonId: null,
        selectedBlockId: null,
      }),
      
      selectLesson: (lessonId) => set({
        selectedLessonId: lessonId,
        selectedBlockId: null,
      }),
      
      selectBlock: (blockId) => set({ selectedBlockId: blockId }),

      // Módulos
      addModule: (moduleData) => set((state) => {
        if (!state.currentTrack) return state;
        
        const newModule: AdminModule = {
          ...moduleData,
          id: generateId(),
          order: state.currentTrack.modules.length,
          lessons: [],
          isComplete: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: [...state.currentTrack.modules, newModule],
            updatedAt: new Date(),
          },
        };
      }),

      updateModule: (moduleId, updates) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) =>
              module.id === moduleId
                ? { ...module, ...updates, updatedAt: new Date() }
                : module
            ),
            updatedAt: new Date(),
          },
        };
      }),

      deleteModule: (moduleId) => set((state) => {
        if (!state.currentTrack) return state;
        
        const modules = state.currentTrack.modules
          .filter((m) => m.id !== moduleId)
          .map((m, index) => ({ ...m, order: index }));
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules,
            updatedAt: new Date(),
          },
          selectedModuleId: state.selectedModuleId === moduleId ? null : state.selectedModuleId,
        };
      }),

      reorderModules: (moduleIds) => set((state) => {
        if (!state.currentTrack) return state;
        
        const modulesMap = new Map(state.currentTrack.modules.map((m) => [m.id, m]));
        const reorderedModules = moduleIds
          .map((id) => modulesMap.get(id))
          .filter((m): m is AdminModule => m !== undefined)
          .map((m, index) => ({ ...m, order: index }));
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: reorderedModules,
            updatedAt: new Date(),
          },
        };
      }),

      duplicateModule: (moduleId) => set((state) => {
        if (!state.currentTrack) return state;
        
        const module = state.currentTrack.modules.find((m) => m.id === moduleId);
        if (!module) return state;
        
        const duplicatedModule: AdminModule = {
          ...module,
          id: generateId(),
          title: `${module.title} (Cópia)`,
          order: state.currentTrack.modules.length,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            id: generateId(),
            moduleId: generateId(),
            contentBlocks: lesson.contentBlocks.map((block) => ({
              ...block,
              id: generateId(),
              lessonId: generateId(),
            })),
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: [...state.currentTrack.modules, duplicatedModule],
            updatedAt: new Date(),
          },
        };
      }),

      // Aulas
      addLesson: (moduleId, lessonData) => set((state) => {
        if (!state.currentTrack) return state;
        
        const module = state.currentTrack.modules.find((m) => m.id === moduleId);
        if (!module) return state;
        
        const newLesson: AdminLesson = {
          ...lessonData,
          id: generateId(),
          order: module.lessons.length,
          contentBlocks: [],
          isComplete: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((m) =>
              m.id === moduleId
                ? { ...m, lessons: [...m.lessons, newLesson], updatedAt: new Date() }
                : m
            ),
            updatedAt: new Date(),
          },
        };
      }),

      updateLesson: (lessonId, updates) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? { ...lesson, ...updates, updatedAt: new Date() }
                  : lesson
              ),
            })),
            updatedAt: new Date(),
          },
        };
      }),

      deleteLesson: (lessonId) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => ({
              ...module,
              lessons: module.lessons
                .filter((l) => l.id !== lessonId)
                .map((l, index) => ({ ...l, order: index })),
            })),
            updatedAt: new Date(),
          },
          selectedLessonId: state.selectedLessonId === lessonId ? null : state.selectedLessonId,
        };
      }),

      reorderLessons: (moduleId, lessonIds) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => {
              if (module.id !== moduleId) return module;
              
              const lessonsMap = new Map(module.lessons.map((l) => [l.id, l]));
              const reorderedLessons = lessonIds
                .map((id) => lessonsMap.get(id))
                .filter((l): l is AdminLesson => l !== undefined)
                .map((l, index) => ({ ...l, order: index }));
              
              return { ...module, lessons: reorderedLessons };
            }),
            updatedAt: new Date(),
          },
        };
      }),

      duplicateLesson: (lessonId) => set((state) => {
        if (!state.currentTrack) return state;
        
        let duplicatedLesson: AdminLesson | null = null;
        let targetModuleId: string | null = null;
        
        for (const module of state.currentTrack.modules) {
          const lesson = module.lessons.find((l) => l.id === lessonId);
          if (lesson) {
            targetModuleId = module.id;
            duplicatedLesson = {
              ...lesson,
              id: generateId(),
              title: `${lesson.title} (Cópia)`,
              order: module.lessons.length,
              contentBlocks: lesson.contentBlocks.map((block) => ({
                ...block,
                id: generateId(),
                lessonId: generateId(),
              })),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            break;
          }
        }
        
        if (!duplicatedLesson || !targetModuleId) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((m) =>
              m.id === targetModuleId
                ? { ...m, lessons: [...m.lessons, duplicatedLesson!], updatedAt: new Date() }
                : m
            ),
            updatedAt: new Date(),
          },
        };
      }),

      // Blocos de Conteúdo
      addContentBlock: (lessonId, blockData) => set((state) => {
        if (!state.currentTrack) return state;
        
        let targetLesson: AdminLesson | null = null;
        
        for (const module of state.currentTrack.modules) {
          const lesson = module.lessons.find((l) => l.id === lessonId);
          if (lesson) {
            targetLesson = lesson;
            break;
          }
        }
        
        if (!targetLesson) return state;
        
        const newBlock: ContentBlock = {
          ...blockData,
          id: generateId(),
          order: targetLesson.contentBlocks.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? {
                      ...lesson,
                      contentBlocks: [...lesson.contentBlocks, newBlock],
                      updatedAt: new Date(),
                    }
                  : lesson
              ),
            })),
            updatedAt: new Date(),
          },
        };
      }),

      updateContentBlock: (blockId, updates) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) => ({
                ...lesson,
                contentBlocks: lesson.contentBlocks.map((block) =>
                  block.id === blockId
                    ? { ...block, ...updates, updatedAt: new Date() }
                    : block
                ),
              })),
            })),
            updatedAt: new Date(),
          },
        };
      }),

      deleteContentBlock: (blockId) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) => ({
                ...lesson,
                contentBlocks: lesson.contentBlocks
                  .filter((b) => b.id !== blockId)
                  .map((b, index) => ({ ...b, order: index })),
              })),
            })),
            updatedAt: new Date(),
          },
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        };
      }),

      reorderContentBlocks: (lessonId, blockIds) => set((state) => {
        if (!state.currentTrack) return state;
        
        return {
          currentTrack: {
            ...state.currentTrack,
            modules: state.currentTrack.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) => {
                if (lesson.id !== lessonId) return lesson;
                
                const blocksMap = new Map(lesson.contentBlocks.map((b) => [b.id, b]));
                const reorderedBlocks = blockIds
                  .map((id) => blocksMap.get(id))
                  .filter((b): b is ContentBlock => b !== undefined)
                  .map((b, index) => ({ ...b, order: index }));
                
                return { ...lesson, contentBlocks: reorderedBlocks };
              }),
            })),
            updatedAt: new Date(),
          },
        };
      }),

      // Autosave
      setAutosaveStatus: (status) => set({ autosaveStatus: status }),
      setLastSavedAt: (date) => set({ lastSavedAt: date }),

      // Validação
      setValidationIssues: (issues) => set({ validationIssues: issues }),

      // UI
      togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      togglePropertiesPanel: () => set((state) => ({
        isPropertiesPanelCollapsed: !state.isPropertiesPanelCollapsed,
      })),

      // Reset
      reset: () => set({
        currentTrack: null,
        selectedModuleId: null,
        selectedLessonId: null,
        selectedBlockId: null,
        autosaveStatus: 'idle',
        lastSavedAt: null,
        validationIssues: [],
        isPreviewOpen: false,
      }),
    }),
    { name: 'AdminTrackStore' }
  )
);
