import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Video,
  FileText,
  Mic,
  CheckSquare,
  Dumbbell,
  FileUp,
  Loader2,
  Check,
  X,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import type { ContentFormData, ContentTypeCreate, YouTubeVideoData } from '@/types/content-create';
import type { QuizData } from '@/types/quiz';
import type { ExerciseData } from '@/types/quiz';
import { extractYouTubeVideoId, fetchYouTubeData } from '@/lib/youtube-extractor';
import { QuizEditor } from './quiz-editor';
import { ExerciseEditor } from './exercise-editor';

export function ContentCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContentFormData>({
    type: 'video',
    title: '',
    description: '',
    tags: [],
    language: 'pt-BR',
  });
  
  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    passingScore: 70,
    allowRetry: true,
    showFeedbackImmediately: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    questions: [],
  });

  const [exerciseData, setExerciseData] = useState<ExerciseData>({
    title: '',
    description: '',
    instructions: [],
    requiredResources: [],
    evaluationCriteria: [],
    estimatedMinutes: 30,
    difficulty: 'beginner',
    submissionType: 'text',
  });
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const contentTypes = [
    { value: 'video', label: 'Vídeo do YouTube', icon: Video },
    { value: 'article', label: 'Artigo', icon: FileText },
    { value: 'podcast', label: 'Podcast', icon: Mic },
    { value: 'quiz', label: 'Quiz', icon: CheckSquare },
    { value: 'exercise', label: 'Exercício', icon: Dumbbell },
    { value: 'document', label: 'Documento', icon: FileUp },
  ];

  const handleExtractYouTubeData = async () => {
    if (!formData.videoUrl) return;

    setIsExtracting(true);
    setExtractionError(null);
    setExtractionSuccess(false);

    try {
      const videoId = extractYouTubeVideoId(formData.videoUrl);
      
      if (!videoId) {
        throw new Error('URL do YouTube inválida');
      }

      const videoData = await fetchYouTubeData(videoId);

      setFormData({
        ...formData,
        videoId: videoData.videoId,
        title: videoData.title,
        description: videoData.description,
        author: videoData.channelTitle,
        duration: Math.ceil(videoData.duration / 60), // converter para minutos
        thumbnail: videoData.thumbnail,
        tags: videoData.tags || [],
        publishedAt: new Date(videoData.publishedAt),
      });

      setExtractionSuccess(true);
    } catch (error) {
      setExtractionError(error instanceof Error ? error.message : 'Erro ao extrair dados');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Enviar para API
    console.log('Dados do formulário:', formData);
    
    // Redirecionar para o gerenciador
    navigate({ to: '/admin/content-manager' });
  };

  const selectedType = contentTypes.find((t) => t.value === formData.type);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/content-manager">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Criar Novo Conteúdo</h1>
        <p className="text-muted-foreground">
          Adicione vídeos, artigos, podcasts e outros conteúdos à plataforma
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Conteúdo */}
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Conteúdo</CardTitle>
            <CardDescription>Selecione o tipo de conteúdo que deseja adicionar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as ContentTypeCreate })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} />
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* URL do Vídeo (se tipo for vídeo) */}
        {formData.type === 'video' && (
          <Card>
            <CardHeader>
              <CardTitle>URL do YouTube</CardTitle>
              <CardDescription>
                Cole a URL do vídeo do YouTube para extrair automaticamente os dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  disabled={isExtracting}
                />
                <Button
                  type="button"
                  onClick={handleExtractYouTubeData}
                  disabled={!formData.videoUrl || isExtracting}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extraindo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Extrair Dados
                    </>
                  )}
                </Button>
              </div>

              {extractionSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Check className="h-4 w-4" />
                  Dados extraídos com sucesso!
                </div>
              )}

              {extractionError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <X className="h-4 w-4" />
                  {extractionError}
                </div>
              )}

              {formData.thumbnail && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail"
                    className="w-full max-w-md rounded-lg mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do conteúdo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Digite o título do conteúdo"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o conteúdo"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Programação"
                />
              </div>

              <div>
                <Label htmlFor="level">Nível</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: any) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nome do autor"
                />
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (BR)</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Adicione tags para facilitar a busca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Digite uma tag e pressione Enter"
              />
              <Button type="button" onClick={handleAddTag}>
                Adicionar
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editor de Quiz */}
        {formData.type === 'quiz' && (
          <QuizEditor data={quizData} onChange={setQuizData} />
        )}

        {/* Editor de Exercício */}
        {formData.type === 'exercise' && (
          <ExerciseEditor data={exerciseData} onChange={setExerciseData} />
        )}

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Link to="/admin/content-manager">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit">
            Criar Conteúdo
          </Button>
        </div>
      </form>
    </div>
  );
}
