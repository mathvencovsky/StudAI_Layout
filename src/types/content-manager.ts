export type ContentType = 'track' | 'module' | 'lesson' | 'video' | 'quiz' | 'exercise';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  status: ContentStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
  category?: string;
  
  // Estatísticas
  views?: number;
  enrollments?: number;
  completionRate?: number;
  rating?: number;
  
  // Relacionamentos
  parentId?: string;
  childrenCount?: number;
  
  // Metadados específicos por tipo
  metadata?: {
    duration?: number; // minutos
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    language?: string;
    thumbnail?: string;
  };
}

export interface ContentFilters {
  search?: string;
  type?: ContentType | 'all';
  status?: ContentStatus | 'all';
  author?: string;
  category?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ContentStats {
  total: number;
  byType: Record<ContentType, number>;
  byStatus: Record<ContentStatus, number>;
  recentlyUpdated: number;
  needsReview: number;
}
