// Tipos para o sistema de Admin de Trilhas

export type TrackStatus = 'draft' | 'published' | 'archived';
export type LessonStatus = 'draft' | 'published';
export type ContentBlockType = 'video' | 'text' | 'quiz' | 'exercise' | 'resources';
export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'multiple_select';
export type TrackLevel = 'beginner' | 'intermediate' | 'advanced';
export type TextBlockType = 'text' | 'callout' | 'note' | 'highlight';
export type CalloutType = 'tip' | 'warning' | 'success' | 'info';

// Trilha
export interface AdminTrack {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  level: TrackLevel;
  estimatedHours: number;
  coverImage?: string;
  tags: string[];
  categories: string[];
  modules: AdminModule[];
  status: TrackStatus;
  version: number;
  publishedAt?: Date;
  publishedBy?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

// Módulo
export interface AdminModule {
  id: string;
  trackId: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  order: number;
  lessons: AdminLesson[];
  status: LessonStatus;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Aula
export interface AdminLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  order: number;
  contentBlocks: ContentBlock[];
  status: LessonStatus;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Bloco de Conteúdo (Polimórfico)
export interface ContentBlock {
  id: string;
  lessonId: string;
  type: ContentBlockType;
  order: number;
  content: VideoContent | TextContent | QuizContent | ExerciseContent | ResourcesContent;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Conteúdo de Vídeo
export interface VideoContent {
  videoId: string;
  startTime?: number;
  endTime?: number;
  subtitles?: string;
  instructorNotes?: string;
  // Metadados denormalizados
  videoTitle: string;
  videoDuration: number;
  videoThumbnail: string;
  videoUrl: string;
}

// Conteúdo Escrito
export interface TextContent {
  type: TextBlockType;
  calloutType?: CalloutType;
  content: string; // HTML ou Markdown
  images?: {
    url: string;
    alt: string;
    caption?: string;
  }[];
}

// Conteúdo de Quiz
export interface QuizContent {
  title: string;
  description?: string;
  passingScore: number;
  questions: QuizQuestion[];
  showFeedbackImmediately: boolean;
  allowRetry: boolean;
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options: QuizOption[];
  explanation: string;
  points: number;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

// Conteúdo de Exercício
export interface ExerciseContent {
  title: string;
  description: string;
  instructions: string[];
  requiredResources: string[];
  evaluationCriteria: string[];
  referenceSolution?: string;
  estimatedMinutes: number;
}

// Recursos Complementares
export interface ResourcesContent {
  links: {
    title: string;
    url: string;
    description?: string;
  }[];
  downloads: {
    title: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  }[];
  references: {
    title: string;
    author?: string;
    url?: string;
  }[];
}

// Biblioteca de Vídeos
export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  instructor: string;
  topics: string[];
  tags: string[];
  language: string;
  subtitles: string[];
  category: string;
  difficulty: TrackLevel;
  status: 'processing' | 'ready' | 'error';
  isPublic: boolean;
  usageCount: number;
  avgRating?: number;
  uploadedAt: Date;
  uploadedBy: string;
  updatedAt: Date;
}

// Versionamento
export interface TrackVersion {
  id: string;
  trackId: string;
  version: number;
  snapshot: AdminTrack;
  changeDescription: string;
  changedBy: string;
  changedAt: Date;
  isPublished: boolean;
}

// Validação
export interface ValidationIssue {
  type: 'error' | 'warning';
  path: string; // Ex: "modules[0].lessons[1].contentBlocks[0]"
  message: string;
  itemId: string;
  itemType: 'track' | 'module' | 'lesson' | 'block';
}

// Filtros de Vídeo
export interface VideoFilters {
  search?: string;
  instructor?: string;
  category?: string;
  duration?: 'short' | 'medium' | 'long' | 'verylong';
  language?: string;
  status?: 'ready' | 'processing';
  sortBy?: 'recent' | 'oldest' | 'title' | 'duration_asc' | 'duration_desc' | 'usage';
}

// Estado de Autosave
export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

// Permissões
export type UserRole = 'editor' | 'reviewer' | 'publisher' | 'admin';

export interface UserPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canPublish: boolean;
  canArchive: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
}
