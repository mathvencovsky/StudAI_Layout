# 📚 Gerenciador de Conteúdo - Guia Rápido

## 🎯 Visão Geral

O Gerenciador de Conteúdo é uma interface completa para visualizar, filtrar e gerenciar todos os conteúdos da plataforma em um único lugar.

---

## 🚀 Como Acessar

### Opção 1: Pelo Dashboard Admin
1. Acesse: http://localhost:5173/admin
2. Clique no botão "Gerenciar Conteúdos"

### Opção 2: Acesso Direto
- URL: http://localhost:5173/admin/content-manager

---

## ✨ Funcionalidades

### 📊 Dashboard de Estatísticas

Visualize métricas importantes:
- **Total**: Quantidade total de conteúdos
- **Publicados**: Conteúdos disponíveis para alunos
- **Rascunhos**: Conteúdos em desenvolvimento
- **Visualizações**: Total de views de todos os conteúdos

### 🔍 Busca e Filtros

**Busca por Texto**
- Digite no campo de busca para filtrar por título
- Busca em tempo real

**Filtro por Tipo**
- Todos os tipos
- Trilhas
- Módulos
- Aulas
- Vídeos
- Quizzes
- Exercícios

**Filtro por Status**
- Todos os status
- Publicado
- Rascunho
- Arquivado

### 📋 Tabela de Conteúdos

**Colunas Disponíveis:**
1. **Checkbox**: Seleção múltipla
2. **Tipo**: Ícone e nome do tipo de conteúdo
3. **Título**: Nome, descrição e tags
4. **Status**: Badge colorido (Publicado/Rascunho/Arquivado)
5. **Autor**: Nome do criador
6. **Atualizado**: Data e hora da última atualização
7. **Estatísticas**: Views, matrículas, avaliação
8. **Ações**: Menu de opções

### 🎯 Ações Individuais

Clique no menu (⋮) de cada item para:
- **Visualizar**: Ver detalhes do conteúdo
- **Editar**: Abrir no editor apropriado
- **Duplicar**: Criar uma cópia
- **Arquivar**: Mover para arquivados
- **Excluir**: Remover permanentemente

### 📦 Ações em Massa

Selecione múltiplos itens para:
- **Publicar**: Publicar vários conteúdos de uma vez
- **Arquivar**: Arquivar múltiplos itens
- **Excluir**: Remover vários itens

### 📤 Importar/Exportar

**Importar**
- Importar conteúdos de arquivos CSV/JSON
- Upload em massa

**Exportar**
- Exportar lista de conteúdos
- Formatos: CSV, JSON, Excel

---

## 🎨 Interface

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Título | Botões (Importar, Exportar, Novo)         │
├─────────────────────────────────────────────────────────────┤
│ STATS: Total | Publicados | Rascunhos | Visualizações      │
├─────────────────────────────────────────────────────────────┤
│ FILTROS: Busca | Tipo | Status | Mais Filtros              │
├─────────────────────────────────────────────────────────────┤
│ TABELA:                                                      │
│ ┌─┬──────┬────────────┬────────┬────────┬──────────┬───┐  │
│ │☐│ Tipo │ Título     │ Status │ Autor  │ Atualiz. │ ⋮ │  │
│ ├─┼──────┼────────────┼────────┼────────┼──────────┼───┤  │
│ │☐│ 📚   │ React...   │ ✓ Pub  │ João   │ 01/03    │ ⋮ │  │
│ │☐│ 📖   │ Intro...   │ ✓ Pub  │ João   │ 28/02    │ ⋮ │  │
│ │☐│ 🎥   │ O que é... │ ✓ Pub  │ Maria  │ 25/01    │ ⋮ │  │
│ └─┴──────┴────────────┴────────┴────────┴──────────┴───┘  │
└─────────────────────────────────────────────────────────────┘
```

### Ícones por Tipo

- 🎓 **Trilha** (GraduationCap)
- 📖 **Módulo** (BookOpen)
- 📄 **Aula** (FileText)
- 🎥 **Vídeo** (Video)
- ☑️ **Quiz** (CheckSquare)
- 💪 **Exercício** (Dumbbell)

### Badges de Status

- **Publicado**: Verde (default)
- **Rascunho**: Cinza (secondary)
- **Arquivado**: Outline

---

## 📊 Dados Exibidos

### Para Cada Conteúdo

**Informações Básicas:**
- Tipo
- Título
- Descrição
- Tags (até 3 visíveis)
- Status
- Autor
- Data de atualização

**Estatísticas (quando disponível):**
- 👁️ Views (visualizações)
- 👥 Enrollments (matrículas)
- ⭐ Rating (avaliação)

**Metadados:**
- Duração (minutos)
- Dificuldade (beginner/intermediate/advanced)
- Idioma
- Thumbnail

---

## 🔄 Integração com Backend

### Estrutura de Dados

```typescript
interface ContentItem {
  id: string;
  type: 'track' | 'module' | 'lesson' | 'video' | 'quiz' | 'exercise';
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
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
  
  // Metadados
  metadata?: {
    duration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    language?: string;
    thumbnail?: string;
  };
}
```

### Endpoints Necessários

```typescript
// Listar conteúdos
GET /api/admin/content
Query params: search, type, status, page, limit

// Obter conteúdo específico
GET /api/admin/content/:id

// Criar conteúdo
POST /api/admin/content

// Atualizar conteúdo
PUT /api/admin/content/:id

// Excluir conteúdo
DELETE /api/admin/content/:id

// Ações em massa
POST /api/admin/content/bulk-action
Body: { action: 'publish' | 'archive' | 'delete', ids: string[] }

// Estatísticas
GET /api/admin/content/stats

// Importar
POST /api/admin/content/import

// Exportar
GET /api/admin/content/export
```

---

## 🎯 Casos de Uso

### 1. Encontrar Conteúdo Específico

1. Digite o nome no campo de busca
2. Ou use filtros de tipo/status
3. Clique no item para ver detalhes

### 2. Publicar Rascunhos

1. Filtre por "Rascunho"
2. Selecione os itens desejados
3. Clique "Publicar (X)"

### 3. Arquivar Conteúdos Antigos

1. Filtre por data ou busque
2. Selecione os itens
3. Clique "Arquivar (X)"

### 4. Revisar Conteúdos Recentes

1. Ordene por "Atualizado" (mais recente)
2. Revise os primeiros itens
3. Edite se necessário

### 5. Analisar Performance

1. Veja estatísticas no dashboard
2. Ordene por views/rating
3. Identifique conteúdos populares

---

## 🔜 Próximas Features

### Filtros Avançados
- [ ] Filtro por data (range)
- [ ] Filtro por categoria
- [ ] Filtro por tags
- [ ] Filtro por autor
- [ ] Filtro por performance (views, rating)

### Visualizações
- [ ] View em cards (grid)
- [ ] View em lista compacta
- [ ] View hierárquica (árvore)

### Ordenação
- [ ] Por título (A-Z)
- [ ] Por data (mais recente/antigo)
- [ ] Por views (mais/menos popular)
- [ ] Por rating (melhor/pior avaliado)

### Ações
- [ ] Preview inline
- [ ] Edição rápida (inline)
- [ ] Histórico de versões
- [ ] Comentários/notas

### Relatórios
- [ ] Relatório de performance
- [ ] Relatório de engajamento
- [ ] Relatório de completude
- [ ] Exportar relatórios

### Automações
- [ ] Publicação agendada
- [ ] Arquivamento automático
- [ ] Notificações de revisão
- [ ] Backup automático

---

## 🐛 Troubleshooting

### Conteúdos não aparecem
- Verifique os filtros aplicados
- Limpe a busca
- Recarregue a página

### Ações não funcionam
- Verifique permissões de admin
- Veja console do navegador (F12)
- Verifique conexão com backend

### Performance lenta
- Use filtros para reduzir resultados
- Implemente paginação
- Otimize queries no backend

---

## 📝 Notas Técnicas

### Componentes Criados

1. **content-manager-page.tsx** - Página principal
2. **content-manager.ts** - Tipos TypeScript
3. **admin.content-manager.tsx** - Rota

### Dependências

- React Table (tabela)
- date-fns (formatação de datas)
- Lucide Icons (ícones)
- Shadcn/ui (componentes)

### Estado

Atualmente usa dados mock. Para produção:
1. Criar hook `useContentManager`
2. Integrar com React Query
3. Conectar com API backend

---

## ✅ Checklist de Implementação

### Frontend (Completo)
- [x] Interface de listagem
- [x] Filtros e busca
- [x] Ações individuais
- [x] Ações em massa
- [x] Estatísticas
- [x] Responsividade

### Backend (Pendente)
- [ ] Endpoints de API
- [ ] Autenticação/autorização
- [ ] Validações
- [ ] Paginação
- [ ] Ordenação
- [ ] Filtros avançados

### Integrações (Pendente)
- [ ] Conectar com banco de dados
- [ ] Implementar busca full-text
- [ ] Cache de estatísticas
- [ ] Upload de arquivos
- [ ] Processamento em background

---

**Versão**: 1.0.0  
**Data**: Março 2026  
**Status**: ✅ Interface Completa - Backend Pendente

**Próximo Passo**: Integrar com API backend real
