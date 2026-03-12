export type ContentTypeCreate = 'video' | 'article' | 'podcast' | 'quiz' | 'exercise' | 'document';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface YouTubeVideoData {
  videoId: string;
  title: string;
  description: string;
  author: string;
  channelId: string;
  channelTitle: string;
  duration: number; // em segundos
  thumbnail: string;
  publishedAt: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string[];
}

export interface ContentFormData {
  type: ContentTypeCreate;
  title: string;
  description: string;
  category?: string;
  level?: DifficultyLevel;
  duration?: number; // em minutos
  author?: string;
  language?: string;
  
  // Específico para vídeo
  videoUrl?: string;
  videoId?: string;
  thumbnail?: string;
  
  // Específico para artigo
  articleUrl?: string;
  articleContent?: string;
  
  // Específico para podcast
  podcastUrl?: string;
  podcastEpisode?: string;
  
  // Transcrição e resumo (IA)
  transcript?: string;
  summary?: string;
  
  // Metadados
  tags: string[];
  publishedAt?: Date;
}
