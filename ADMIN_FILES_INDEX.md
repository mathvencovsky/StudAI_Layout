# 📁 Índice de Arquivos - Editor de Trilhas Admin

## 📊 Resumo
- **Total de Arquivos**: 28
- **Linhas de Código**: ~3.500
- **Componentes**: 17
- **Tipos**: 1 arquivo completo
- **Store**: 1 arquivo Zustand
- **Documentação**: 6 arquivos

---

## 🎯 Arquivos Principais

### 1. Tipos e Estado

#### `src/types/admin-track.ts` (350 linhas)
**Descrição**: Todos os tipos TypeScript do sistema
**Conteúdo**:
- `AdminTrack` - Trilha completa
- `AdminModule` - Módulo
- `AdminLesson` - Aula
- `ContentBlock` - Bloco de conteúdo
- `VideoContent`, `TextContent`, `QuizContent`, etc.
- `Video` - Biblioteca de vídeos
- `TrackVersion` - Versionamento
- `ValidationIssue` - Validações
- Enums e tipos auxiliares

#### `src/stores/admin-track-store.ts` (450 linhas)
**Descrição**: Store Zustand com todo o estado e ações
**Conteúdo**:
- Estado: currentTrack, seleções, UI state
- Ações de trilha: setCurrentTrack, updateTrack
- Ações de módulo: add, update, delete, reorder, duplicate
- Ações de aula: add, update, delete, reorder, duplicate
- Ações de bloco: add, update, delete, reorder
- Ações de UI: toggles, autosave, validações

---

## 🎨 Componentes de Layout

### 2. Estrutura Principal

#### `src/components/admin/track-editor/track-editor-page.tsx` (50 linhas)
**Descrição**: Página container principal
**Responsabilidade**: Carregar trilha e inicializar editor

#### `src/components/admin/track-editor/track-editor-layout.tsx` (40 linhas)
**Descrição**: Layout de 3 colunas
**Responsabilidade**: Organizar sidebar, conteúdo e propriedades

#### `src/components/admin/track-editor/track-editor-header.tsx` (120 linhas)
**Descrição**: Header fixo com ações
**Conteúdo**:
- Breadcrumb navegável
- Indicador de autosave (4 estados)
- Botão de preview (dropdown)
- Menu de opções
- Botão de publicação

#### `src/components/admin/track-editor/track-editor-sidebar.tsx` (100 linhas)
**Descrição**: Sidebar esquerda
**Conteúdo**:
- Info da trilha com progresso
- Campo de busca
- Árvore de estrutura
- Botão adicionar módulo
- Ações rápidas

#### `src/components/admin/track-editor/track-editor-properties-panel.tsx` (250 linhas)
**Descrição**: Painel de propriedades direito
**Conteúdo**:
- Propriedades da trilha
- Propriedades do módulo
- Propriedades da aula
- Renderização dinâmica baseada em seleção

---

## 🌳 Componentes de Navegação

### 3. Árvore de Estrutura

#### `src/components/admin/track-editor/track-structure-tree.tsx` (350 linhas)
**Descrição**: Árvore hierárquica completa
**Conteúdo**:
- `TrackStructureTree` - Container principal
- `ModuleTreeItem` - Item de módulo
- `LessonTreeItem` - Item de aula
**Funcionalidades**:
- Expand/collapse
- Edição inline de títulos
- Indicadores de status (✓ ⚠ ⭕)
- Menu contextual
- Drag handles (preparado)
- Busca com highlight

---

## 📝 Componentes de Conteúdo

### 4. Editores Principais

#### `src/components/admin/track-editor/track-editor-content.tsx` (40 linhas)
**Descrição**: Roteador de conteúdo
**Responsabilidade**: Decidir qual view mostrar

#### `src/components/admin/track-editor/content/track-overview.tsx` (200 linhas)
**Descrição**: Overview da trilha
**Conteúdo**:
- Cards de estatísticas (4)
- Barra de progresso
- Lista de pendências
- Últimas edições
- Metadados da trilha

#### `src/components/admin/track-editor/content/module-editor.tsx` (150 linhas)
**Descrição**: Editor de módulo
**Conteúdo**:
- Header com título e status
- Cards de estatísticas (3)
- Lista de aulas com preview
- Botão adicionar aula

#### `src/components/admin/track-editor/content/lesson-editor.tsx` (180 linhas)
**Descrição**: Editor de aula
**Conteúdo**:
- Header com título e status
- Lista de blocos de conteúdo
- Menu dropdown para adicionar blocos
- Empty state quando sem conteúdo

---

## 🧩 Editores de Blocos

### 5. Content Blocks

#### `src/components/admin/track-editor/content/content-blocks/content-block-editor.tsx` (20 linhas)
**Descrição**: Router polimórfico
**Responsabilidade**: Renderizar editor correto por tipo

#### `src/components/admin/track-editor/content/content-blocks/video-block-editor.tsx` (150 linhas)
**Descrição**: Editor de vídeo
**Conteúdo**:
- Empty state com botão de biblioteca
- Preview de vídeo com thumbnail
- Configurações avançadas (início/fim)
- Notas do instrutor
- Botões de ação (preview, trocar)

#### `src/components/admin/track-editor/content/content-blocks/text-block-editor.tsx` (120 linhas)
**Descrição**: Editor de texto
**Conteúdo**:
- Seletor de tipo (Normal, Callout, Nota, Destaque)
- Seletor de callout type (Dica, Aviso, Sucesso, Info)
- Textarea com Markdown
- Preview estilizado
- Contador de caracteres/palavras

#### `src/components/admin/track-editor/content/content-blocks/quiz-block-editor.tsx` (250 linhas)
**Descrição**: Editor de quiz
**Conteúdo**:
- Configurações do quiz (título, nota, tentativas)
- Lista de questões
- Editor de questão com alternativas
- Radio buttons para resposta correta
- Campo de explicação
- Botões adicionar/remover

#### `src/components/admin/track-editor/content/content-blocks/exercise-block-editor.tsx` (80 linhas)
**Descrição**: Editor de exercício
**Conteúdo**:
- Título e descrição
- Instruções (múltiplas linhas)
- Tempo estimado

#### `src/components/admin/track-editor/content/content-blocks/resources-block-editor.tsx` (100 linhas)
**Descrição**: Editor de recursos
**Conteúdo**:
- Lista de links
- Campos: título, URL, descrição
- Botões adicionar/remover

---

## 🛣️ Rotas

### 6. Roteamento

#### `src/routes/admin/track-editor.tsx` (15 linhas)
**Descrição**: Rota TanStack Router
**Path**: `/admin/track-editor`
**Query Params**: `trackId` (opcional)

---

## 📚 Documentação

### 7. Arquivos de Documentação

#### `ADMIN_EXPERIENCE_REDESIGN.md` (Parte 1)
**Conteúdo**: Seções 1-9 da proposta completa
- Visão do produto
- Modelo conceitual
- Principais fluxos (11 fluxos detalhados)
- Arquitetura da experiência
- Estrutura da tela
- Visão em árvore
- Edição de conteúdo escrito
- Seleção de vídeos
- Criação de quizzes

#### `ADMIN_REDESIGN_EXECUTIVE_SUMMARY.md`
**Conteúdo**: Sumário executivo consolidado
- Visão geral e objetivos
- Arquitetura da solução
- Interface principal
- Todos os componentes
- Autosave e versionamento
- Fluxo de publicação
- Permissões e segurança
- Métricas e analytics
- Microcopy completo
- Stack tecnológico
- Regras de negócio
- Roadmap (18 semanas)

#### `ADMIN_TRACK_EDITOR_README.md`
**Conteúdo**: Documentação técnica completa
- Funcionalidades implementadas
- Arquitetura e estrutura
- Como usar
- Componentes principais
- Estado global (Zustand)
- Próximos passos
- Decisões de design
- Problemas conhecidos

#### `TESTE_ADMIN_EDITOR.md`
**Conteúdo**: Guia de testes completo
- Como testar
- Checklist de testes (50+ itens)
- Cenários de uso real (4 cenários)
- Testes de performance
- Notas de teste

#### `QUICK_START_ADMIN.md`
**Conteúdo**: Início rápido
- Instalação e execução
- Teste rápido (5 minutos)
- Recursos da interface
- Funcionalidades principais
- Troubleshooting

#### `ADMIN_DEV_TIPS.md`
**Conteúdo**: Dicas de desenvolvimento
- Ferramentas úteis
- Estrutura do código
- Como adicionar novo tipo de bloco
- Integrar com backend
- Customizar estilos
- Debug e performance
- Testes e deploy

#### `ADMIN_FILES_INDEX.md` (Este arquivo)
**Conteúdo**: Índice de todos os arquivos

---

## 📊 Estatísticas

### Por Tipo
- **Componentes React**: 17 arquivos
- **Tipos TypeScript**: 1 arquivo (350 linhas)
- **Store Zustand**: 1 arquivo (450 linhas)
- **Rotas**: 1 arquivo
- **Documentação**: 7 arquivos
- **Índices**: 1 arquivo

### Por Funcionalidade
- **Layout**: 5 componentes
- **Navegação**: 1 componente (árvore)
- **Editores Principais**: 3 componentes
- **Editores de Blocos**: 6 componentes
- **Infraestrutura**: 2 arquivos (tipos + store)

### Linhas de Código
- **TypeScript/React**: ~2.800 linhas
- **Documentação**: ~2.500 linhas
- **Total**: ~5.300 linhas

---

## 🎯 Mapa de Dependências

```
track-editor-page.tsx
  └─ track-editor-layout.tsx
      ├─ track-editor-header.tsx
      ├─ track-editor-sidebar.tsx
      │   └─ track-structure-tree.tsx
      ├─ track-editor-content.tsx
      │   ├─ track-overview.tsx
      │   ├─ module-editor.tsx
      │   └─ lesson-editor.tsx
      │       └─ content-block-editor.tsx
      │           ├─ video-block-editor.tsx
      │           ├─ text-block-editor.tsx
      │           ├─ quiz-block-editor.tsx
      │           ├─ exercise-block-editor.tsx
      │           └─ resources-block-editor.tsx
      └─ track-editor-properties-panel.tsx

Todos dependem de:
  ├─ admin-track-store.ts (Zustand)
  └─ admin-track.ts (Tipos)
```

---

## 🔍 Como Encontrar

### Precisa editar...

**Layout geral?**
→ `track-editor-layout.tsx`

**Header?**
→ `track-editor-header.tsx`

**Árvore de navegação?**
→ `track-structure-tree.tsx`

**Overview da trilha?**
→ `content/track-overview.tsx`

**Editor de aula?**
→ `content/lesson-editor.tsx`

**Editor de quiz?**
→ `content/content-blocks/quiz-block-editor.tsx`

**Tipos?**
→ `types/admin-track.ts`

**Estado global?**
→ `stores/admin-track-store.ts`

**Rota?**
→ `routes/admin/track-editor.tsx`

---

## 📝 Convenções

### Nomenclatura
- Componentes: PascalCase (`TrackEditorPage`)
- Arquivos: kebab-case (`track-editor-page.tsx`)
- Tipos: PascalCase (`AdminTrack`)
- Props: PascalCase + Props (`TrackEditorPageProps`)

### Estrutura de Arquivo
```typescript
// 1. Imports
import { ... } from '...';

// 2. Types/Interfaces
interface ComponentProps { ... }

// 3. Component
export function Component({ props }: ComponentProps) {
  // 4. Hooks
  const state = useStore();
  
  // 5. Handlers
  const handleAction = () => { ... };
  
  // 6. Render
  return <div>...</div>;
}

// 7. Sub-components (se necessário)
function SubComponent() { ... }
```

---

## 🎉 Conclusão

Sistema completo e bem organizado, pronto para:
- ✅ Desenvolvimento contínuo
- ✅ Manutenção fácil
- ✅ Extensão com novos recursos
- ✅ Integração com backend
- ✅ Testes automatizados

**Total**: 28 arquivos, ~5.300 linhas, 100% TypeScript, documentação completa.

---

**Última Atualização**: Março 2026  
**Versão**: 1.0.0
