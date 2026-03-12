import type { YouTubeVideoData } from '@/types/content-create';

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Converte duração ISO 8601 para segundos
 * Exemplo: PT15M33S = 933 segundos
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return 0;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Busca dados do vídeo usando a API do YouTube
 * NOTA: Em produção, isso deve ser feito no backend para proteger a API key
 */
export async function fetchYouTubeData(videoId: string): Promise<YouTubeVideoData> {
  // TODO: Mover para backend em produção
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!API_KEY) {
    // Fallback: retornar dados mock se não houver API key
    return fetchYouTubeDataMock(videoId);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do YouTube');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Vídeo não encontrado');
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;
    const statistics = video.statistics;

    return {
      videoId,
      title: snippet.title,
      description: snippet.description,
      author: snippet.channelTitle,
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      duration: parseDuration(contentDetails.duration),
      thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      publishedAt: snippet.publishedAt,
      viewCount: parseInt(statistics.viewCount || '0'),
      likeCount: parseInt(statistics.likeCount || '0'),
      tags: snippet.tags || [],
    };
  } catch (error) {
    console.error('Erro ao buscar dados do YouTube:', error);
    throw error;
  }
}

/**
 * Versão mock para desenvolvimento (quando não há API key)
 */
async function fetchYouTubeDataMock(videoId: string): Promise<YouTubeVideoData> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    videoId,
    title: 'Fundamentos de React - Tutorial Completo',
    description: 'Aprenda React do zero neste tutorial completo. Vamos cobrir componentes, hooks, estado e muito mais.',
    author: 'Canal de Programação',
    channelId: 'UC123456789',
    channelTitle: 'Canal de Programação',
    duration: 1800, // 30 minutos
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    publishedAt: new Date().toISOString(),
    viewCount: 15000,
    likeCount: 1200,
    tags: ['React', 'JavaScript', 'Tutorial', 'Programação'],
  };
}

/**
 * Busca dados do vídeo usando oEmbed (alternativa sem API key)
 * Limitado: não retorna duração, tags, estatísticas
 */
export async function fetchYouTubeDataOEmbed(videoId: string): Promise<Partial<YouTubeVideoData>> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do YouTube');
    }

    const data = await response.json();

    return {
      videoId,
      title: data.title,
      author: data.author_name,
      channelTitle: data.author_name,
      thumbnail: data.thumbnail_url,
    };
  } catch (error) {
    console.error('Erro ao buscar dados do YouTube (oEmbed):', error);
    throw error;
  }
}
