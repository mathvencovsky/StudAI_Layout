import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  BookOpen,
  GraduationCap,
  CheckSquare,
  Dumbbell,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { ContentItem, ContentType, ContentStatus, ContentFilters } from '@/types/content-manager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data
const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'track',
    title: 'Fundamentos de React',
    description: 'Aprenda React do zero',
    status: 'published',
    author: 'João Silva',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01'),
    publishedAt: new Date('2024-02-01'),
    tags: ['React', 'JavaScript', 'Frontend'],
    category: 'Desenvolvimento Web',
    views: 1250,
    enrollments: 450,
    completionRate: 68,
    rating: 4.5,
    childrenCount: 5,
    metadata: {
      duration: 480,
      difficulty: 'beginner',
      language: 'pt-BR',
    },
  },
];

export function ContentManagerPage() {
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    type: 'all',
    status: 'all',
  });

  const filteredContent = mockContent.filter((item) => {
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }
    return true;
  });

  const stats = {
    total: mockContent.length,
    published: mockContent.filter((i) => i.status === 'published').length,
    draft: mockContent.filter((i) => i.status === 'draft').length,
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'track':
        return <GraduationCap className="h-4 w-4" />;
      case 'module':
        return <BookOpen className="h-4 w-4" />;
      case 'lesson':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'quiz':
        return <CheckSquare className="h-4 w-4" />;
      case 'exercise':
        return <Dumbbell className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ContentType) => {
    const labels = {
      track: 'Trilha',
      module: 'Módulo',
      lesson: 'Aula',
      video: 'Vídeo',
      quiz: 'Quiz',
      exercise: 'Exercício',
    };
    return labels[type];
  };

  const getStatusBadge = (status: ContentStatus) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline',
    } as const;

    const labels = {
      published: 'Publicado',
      draft: 'Rascunho',
      archived: 'Arquivado',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciador de Conteúdo</h1>
          <p className="text-muted-foreground">
            Gerencie trilhas, módulos, aulas e outros conteúdos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Link to="/admin/content-create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Conteúdo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todos os conteúdos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockContent.reduce((sum, item) => sum + (item.views || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total de views</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conteúdo..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value as any })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="track">Trilhas</SelectItem>
                <SelectItem value="module">Módulos</SelectItem>
                <SelectItem value="lesson">Aulas</SelectItem>
                <SelectItem value="video">Vídeos</SelectItem>
                <SelectItem value="quiz">Quizzes</SelectItem>
                <SelectItem value="exercise">Exercícios</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value as any })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdos</CardTitle>
          <CardDescription>
            {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'itens'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      {getTypeIcon(item.type)}
                      <span className="text-sm font-medium">{getTypeLabel(item.type)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          )}
                          {item.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {getStatusBadge(item.status)}
                          
                          <div className="text-sm text-right">
                            <div className="font-medium">{item.author}</div>
                            <div className="text-muted-foreground">
                              {format(item.updatedAt, 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum conteúdo encontrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tente ajustar os filtros ou criar um novo conteúdo
                </p>
                <Link to="/admin/track-editor">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Conteúdo
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
