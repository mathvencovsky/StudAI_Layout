# Redesign Completo da Experiência de Admin - StudAI
## Proposta de Produto Real para Gestão de Trilhas de Estudo

**Versão:** 1.0  
**Data:** Março 2026  
**Autoria:** Principal Product Designer, UX Strategist, Learning Systems Designer, Frontend Architect

---

## ÍNDICE

1. [Visão do Produto Admin](#1-visão-do-produto-admin)
2. [Modelo Conceitual da Edição](#2-modelo-conceitual-da-edição)
3. [Principais Fluxos](#3-principais-fluxos)
4. [Arquitetura da Experiência](#4-arquitetura-da-experiência)
5. [Estrutura da Tela Principal](#5-estrutura-da-tela-principal)
6. [Visão em Árvore / Estrutura da Trilha](#6-visão-em-árvore--estrutura-da-trilha)
7. [Edição de Conteúdo Escrito](#7-edição-de-conteúdo-escrito)
8. [Seleção de Vídeos da Base de Dados](#8-seleção-de-vídeos-da-base-de-dados)
9. [Criação e Edição de Quizzes](#9-criação-e-edição-de-quizzes)
10. [Componentes de Interface](#10-componentes-de-interface)
11. [Status, Validações e Feedback](#11-status-validações-e-feedback)
12. [Permissões e Segurança Operacional](#12-permissões-e-segurança-operacional)
13. [Versionamento e Publicação](#13-versionamento-e-publicação)
14. [Edge Cases](#14-edge-cases)
15. [Microcopy](#15-microcopy)
16. [Wireframe Textual](#16-wireframe-textual)
17. [Requisitos de UX](#17-requisitos-de-ux)
18. [Regras de Negócio](#18-regras-de-negócio)
19. [Eventos e Métricas](#19-eventos-e-métricas)
20. [Especificação para Implementação](#20-especificação-para-implementação)
21. [Estrutura Frontend](#21-estrutura-frontend)
22. [Critério de Qualidade](#22-critério-de-qualidade)
23. [Proposta Consolidada Final](#23-proposta-consolidada-final)

---


## 1. VISÃO DO PRODUTO ADMIN

### 1.1 Problemas Comuns em Sistemas Administrativos de Conteúdo Educacional

**Problemas Estruturais:**
- **Complexidade cognitiva excessiva**: Interfaces que tentam mostrar tudo ao mesmo tempo, sobrecarregando o usuário
- **Falta de hierarquia clara**: Dificuldade em entender a relação entre trilha → módulo → aula → conteúdo
- **Navegação fragmentada**: Usuário precisa abrir múltiplas abas/janelas para completar uma tarefa simples
- **Perda de contexto**: Ao editar um item específico, perde-se a visão do todo

**Problemas Operacionais:**
- **Fluxos lentos e burocráticos**: Muitos cliques e confirmações para ações simples
- **Reordenação difícil**: Drag-and-drop mal implementado ou ausente
- **Busca e seleção ineficientes**: Bibliotecas de mídia sem filtros adequados
- **Duplicação de esforço**: Falta de templates, clonagem ou reutilização de conteúdo

**Problemas de Confiabilidade:**
- **Autosave inconsistente**: Usuário não sabe se mudanças foram salvas
- **Validações tardias**: Erros só aparecem na hora de publicar
- **Falta de versionamento**: Impossível reverter mudanças ou comparar versões
- **Conflitos de edição**: Múltiplos usuários editando simultaneamente sem controle

**Problemas de Escalabilidade:**
- **Performance degradada**: Trilhas grandes travam a interface
- **Visualização limitada**: Impossível ter visão geral de trilhas complexas
- **Busca ineficiente**: Localizar conteúdo específico em trilhas grandes é difícil

### 1.2 O Que Define uma Experiência de Admin Realmente Excelente

**Velocidade Operacional:**
- Ações comuns devem ser executadas em < 3 cliques
- Feedback visual imediato para todas as ações
- Atalhos de teclado para power users
- Autosave transparente e confiável

**Clareza Estrutural:**
- Hierarquia visual óbvia e consistente
- Contexto sempre presente (breadcrumb, sidebar, preview)
- Estados visuais distintos (rascunho, publicado, erro, incompleto)
- Navegação previsível e sem surpresas

**Segurança e Confiança:**
- Validações em tempo real, não apenas no final
- Confirmações apenas para ações destrutivas
- Histórico de mudanças acessível
- Rollback fácil e seguro

**Flexibilidade com Guardrails:**
- Liberdade para criar estruturas complexas
- Mas com validações que impedem erros graves
- Templates e padrões sugeridos
- Mas customização quando necessário

**Experiência Premium:**
- Animações sutis e intencionais
- Transições suaves entre estados
- Feedback visual rico (não apenas texto)
- Design consistente com o produto principal

### 1.3 Princípios que Devem Guiar o Redesign

**1. Contexto Sempre Presente**
- O usuário nunca deve perder a noção de onde está na hierarquia
- Sidebar com estrutura da trilha sempre visível
- Breadcrumb dinâmico e clicável
- Preview acessível a qualquer momento

**2. Edição Inline Sempre que Possível**
- Evitar modais para edições simples
- Editar diretamente na árvore de estrutura quando apropriado
- Painéis laterais para edições mais complexas
- Modais apenas para ações que exigem foco total

**3. Feedback Imediato e Transparente**
- Autosave com indicador visual claro
- Validações em tempo real
- Erros mostrados no contexto, não em alertas genéricos
- Confirmação visual de ações bem-sucedidas

**4. Progressão Natural do Simples ao Complexo**
- Começar com o mínimo necessário
- Revelar complexidade progressivamente
- Campos avançados colapsados por padrão
- Mas acessíveis para power users

**5. Prevenção de Erros, Não Apenas Correção**
- Validações impedem estados inválidos
- Sugestões proativas (ex: "Este módulo não tem aulas")
- Avisos antes de ações destrutivas
- Mas sem bloquear o fluxo criativo

**6. Operação em Lote Quando Apropriado**
- Reordenar múltiplos itens de uma vez
- Aplicar mudanças a múltiplos módulos
- Duplicar estruturas completas
- Mas com clareza sobre o que está sendo afetado

### 1.4 Como Equilibrar Poder, Flexibilidade e Simplicidade

**Camadas de Complexidade:**

**Camada 1 - Essencial (80% dos casos):**
- Criar trilha com título e descrição
- Adicionar módulos e aulas
- Inserir vídeo da biblioteca
- Adicionar texto simples
- Criar quiz básico
- Publicar

**Camada 2 - Avançado (15% dos casos):**
- Metadados completos (tags, categorias, pré-requisitos)
- Editor de texto rico com formatação
- Quiz com feedback personalizado por alternativa
- Reordenação em lote
- Duplicação de estruturas
- Versionamento e comparação

**Camada 3 - Expert (5% dos casos):**
- Lógica condicional (mostrar conteúdo baseado em progresso)
- Conteúdo adaptativo
- Integração com sistemas externos
- Bulk import/export
- API access

**Estratégia de Revelação Progressiva:**
- Interface padrão mostra apenas Camada 1
- Botão "Opções avançadas" revela Camada 2
- Camada 3 acessível via menu de configurações ou API

**Padrões de Interação:**
- **Quick actions**: Ações comuns acessíveis com 1 clique
- **Bulk actions**: Seleção múltipla para operações em lote
- **Keyboard shortcuts**: Para power users
- **Templates**: Para acelerar criação de estruturas comuns

---


## 2. MODELO CONCEITUAL DA EDIÇÃO

### 2.1 Hierarquia de Informação

```
TRILHA (Track)
├── Metadados da Trilha
│   ├── Título
│   ├── Descrição
│   ├── Objetivos de Aprendizagem
│   ├── Pré-requisitos
│   ├── Nível (Iniciante/Intermediário/Avançado)
│   ├── Duração Estimada
│   ├── Tags e Categorias
│   ├── Imagem de Capa
│   └── Status (Rascunho/Publicado/Arquivado)
│
├── MÓDULO 1 (Module)
│   ├── Metadados do Módulo
│   │   ├── Título
│   │   ├── Descrição
│   │   ├── Objetivos Específicos
│   │   ├── Duração Estimada
│   │   └── Ordem
│   │
│   ├── AULA 1.1 (Lesson)
│   │   ├── Metadados da Aula
│   │   │   ├── Título
│   │   │   ├── Descrição
│   │   │   ├── Duração Estimada
│   │   │   └── Ordem
│   │   │
│   │   └── BLOCOS DE CONTEÚDO (Content Blocks)
│   │       ├── BLOCO: Vídeo
│   │       │   ├── Vídeo selecionado da biblioteca
│   │       │   ├── Timestamp de início (opcional)
│   │       │   ├── Timestamp de fim (opcional)
│   │       │   ├── Legendas (opcional)
│   │       │   └── Notas do instrutor
│   │       │
│   │       ├── BLOCO: Conteúdo Escrito
│   │       │   ├── Tipo (Texto/Callout/Observação/Destaque)
│   │       │   ├── Conteúdo formatado (rich text)
│   │       │   └── Recursos visuais (imagens, diagramas)
│   │       │
│   │       ├── BLOCO: Quiz/Checkpoint
│   │       │   ├── Tipo (Múltipla escolha/Verdadeiro-Falso/Dissertativa)
│   │       │   ├── Questões
│   │       │   │   ├── Enunciado
│   │       │   │   ├── Alternativas
│   │       │   │   ├── Resposta correta
│   │       │   │   ├── Feedback por alternativa
│   │       │   │   └── Explicação detalhada
│   │       │   ├── Pontuação
│   │       │   └── Critério de aprovação
│   │       │
│   │       ├── BLOCO: Exercício Prático
│   │       │   ├── Descrição do exercício
│   │       │   ├── Instruções passo a passo
│   │       │   ├── Recursos necessários
│   │       │   ├── Critérios de avaliação
│   │       │   └── Solução de referência
│   │       │
│   │       └── BLOCO: Recursos Complementares
│   │           ├── Links externos
│   │           ├── Documentos para download
│   │           ├── Referências bibliográficas
│   │           └── Materiais de apoio
│   │
│   ├── AULA 1.2
│   └── AULA 1.3
│
├── MÓDULO 2
└── MÓDULO 3
```

### 2.2 Modelo de Dados Proposto

**Entidades Principais:**

```typescript
// TRILHA
interface Track {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  coverImage?: string;
  tags: string[];
  categories: string[];
  
  // Relacionamentos
  modules: Module[];
  
  // Metadados de publicação
  status: 'draft' | 'published' | 'archived';
  version: number;
  publishedAt?: Date;
  publishedBy?: string;
  
  // Auditoria
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

// MÓDULO
interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  order: number;
  
  // Relacionamentos
  lessons: Lesson[];
  
  // Estado
  status: 'draft' | 'published';
  isComplete: boolean; // Calculado: todas as aulas completas
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
}

// AULA
interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  order: number;
  
  // Relacionamentos
  contentBlocks: ContentBlock[];
  
  // Estado
  status: 'draft' | 'published';
  isComplete: boolean; // Calculado: tem pelo menos 1 bloco de conteúdo
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
}

// BLOCO DE CONTEÚDO (Polimórfico)
interface ContentBlock {
  id: string;
  lessonId: string;
  type: 'video' | 'text' | 'quiz' | 'exercise' | 'resources';
  order: number;
  
  // Conteúdo específico por tipo
  content: VideoContent | TextContent | QuizContent | ExerciseContent | ResourcesContent;
  
  // Estado
  isComplete: boolean; // Validação específica por tipo
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
}

// CONTEÚDO DE VÍDEO
interface VideoContent {
  videoId: string; // Referência à biblioteca de vídeos
  startTime?: number; // Segundos
  endTime?: number; // Segundos
  subtitles?: string;
  instructorNotes?: string;
  
  // Metadados do vídeo (denormalizados para performance)
  videoTitle: string;
  videoDuration: number;
  videoThumbnail: string;
  videoUrl: string;
}

// CONTEÚDO ESCRITO
interface TextContent {
  type: 'text' | 'callout' | 'note' | 'highlight';
  content: string; // HTML ou Markdown
  images?: {
    url: string;
    alt: string;
    caption?: string;
  }[];
}

// CONTEÚDO DE QUIZ
interface QuizContent {
  title: string;
  description?: string;
  passingScore: number; // Porcentagem
  questions: QuizQuestion[];
  showFeedbackImmediately: boolean;
  allowRetry: boolean;
  maxAttempts?: number;
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'multiple_select';
  question: string;
  options: QuizOption[];
  explanation: string; // Mostrado após resposta
  points: number;
  order: number;
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string; // Feedback específico desta alternativa
}

// CONTEÚDO DE EXERCÍCIO
interface ExerciseContent {
  title: string;
  description: string;
  instructions: string[]; // Passo a passo
  requiredResources: string[];
  evaluationCriteria: string[];
  referenceSolution?: string;
  estimatedMinutes: number;
}

// RECURSOS COMPLEMENTARES
interface ResourcesContent {
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
```

### 2.3 Biblioteca de Vídeos (Entidade Separada)

```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  duration: number; // Segundos
  thumbnailUrl: string;
  videoUrl: string;
  
  // Metadados
  instructor: string;
  topics: string[];
  tags: string[];
  language: string;
  subtitles: string[];
  
  // Categorização
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Estado
  status: 'processing' | 'ready' | 'error';
  isPublic: boolean;
  
  // Estatísticas
  usageCount: number; // Quantas vezes foi usado em trilhas
  avgRating?: number;
  
  // Auditoria
  uploadedAt: Date;
  uploadedBy: string;
  updatedAt: Date;
}
```

### 2.4 Versionamento

```typescript
interface TrackVersion {
  id: string;
  trackId: string;
  version: number;
  snapshot: Track; // Snapshot completo da trilha
  changeDescription: string;
  changedBy: string;
  changedAt: Date;
  isPublished: boolean;
}
```

### 2.5 Justificativa do Modelo

**Por que essa estrutura?**

1. **Hierarquia clara**: Track → Module → Lesson → ContentBlock é intuitiva e escalável
2. **Flexibilidade**: ContentBlock polimórfico permite adicionar novos tipos sem quebrar a estrutura
3. **Separação de concerns**: Vídeos são entidade separada, permitindo reutilização
4. **Versionamento robusto**: Snapshots completos permitem rollback seguro
5. **Auditoria completa**: Todas as entidades têm tracking de criação/modificação
6. **Performance**: Denormalização estratégica (ex: metadados de vídeo) reduz joins
7. **Validação**: Campo `isComplete` calculado facilita validações antes de publicar

---


## 3. PRINCIPAIS FLUXOS

### 3.1 Criar uma Trilha do Zero

**Passo 1: Iniciar Criação**
- Usuário clica em "Nova Trilha" no dashboard
- Sistema abre modal de criação rápida
- Campos obrigatórios: Título
- Campos opcionais (colapsados): Descrição, Nível, Tags

**Passo 2: Criação Inicial**
- Usuário preenche título (ex: "Fundamentos de React")
- Clica em "Criar Trilha"
- Sistema cria trilha em status "draft"
- Redireciona para editor da trilha

**Passo 3: Configuração Básica**
- Editor abre com trilha vazia
- Sidebar mostra estrutura vazia
- Painel direito mostra "Propriedades da Trilha"
- Sistema sugere: "Adicione o primeiro módulo para começar"

**Passo 4: Adicionar Primeiro Módulo**
- Usuário clica em "+ Adicionar Módulo"
- Inline input aparece na árvore
- Usuário digita título do módulo
- Pressiona Enter → módulo criado

**Passo 5: Adicionar Primeira Aula**
- Módulo expandido automaticamente
- Usuário clica em "+ Adicionar Aula" dentro do módulo
- Inline input aparece
- Usuário digita título da aula
- Pressiona Enter → aula criada

**Passo 6: Adicionar Conteúdo**
- Aula selecionada automaticamente
- Área principal mostra "Adicione conteúdo a esta aula"
- Botões: [+ Vídeo] [+ Texto] [+ Quiz] [+ Exercício] [+ Recursos]
- Usuário escolhe tipo de conteúdo
- Sistema abre interface específica

**Tempo total estimado**: 2-3 minutos para estrutura básica

### 3.2 Editar uma Trilha Existente

**Passo 1: Localizar Trilha**
- Dashboard mostra lista de trilhas
- Filtros: Status, Categoria, Criador, Data
- Busca por título
- Ordenação: Mais recentes, Alfabética, Mais editadas

**Passo 2: Abrir Editor**
- Usuário clica na trilha
- Sistema carrega estrutura completa
- Sidebar mostra árvore de módulos/aulas
- Área principal mostra overview da trilha
- Indicador de status: "Última edição: há 2 dias por João"

**Passo 3: Navegar na Estrutura**
- Usuário expande/colapsa módulos na sidebar
- Clica em aula específica
- Área principal carrega conteúdo da aula
- Breadcrumb atualiza: Trilha > Módulo > Aula

**Passo 4: Fazer Edições**
- Editar inline quando possível (títulos, descrições curtas)
- Painel lateral para edições mais complexas
- Autosave a cada 3 segundos
- Indicador visual: "Salvando..." → "Salvo"

**Passo 5: Revisar Mudanças**
- Botão "Ver Mudanças" mostra diff
- Lista de alterações desde última publicação
- Opção de desfazer mudanças específicas

**Passo 6: Publicar ou Salvar Rascunho**
- Botão "Salvar Rascunho" sempre disponível
- Botão "Publicar" valida completude
- Se incompleto, mostra lista de pendências
- Se completo, confirma publicação

### 3.3 Adicionar um Novo Módulo

**Fluxo Rápido (Inline):**
1. Usuário clica em "+ Adicionar Módulo" na sidebar
2. Input inline aparece no final da lista
3. Usuário digita título
4. Pressiona Enter → módulo criado com valores padrão
5. Módulo expandido automaticamente, pronto para adicionar aulas

**Fluxo Completo (Com Metadados):**
1. Usuário clica em "⋮" ao lado de "+ Adicionar Módulo"
2. Seleciona "Adicionar com Detalhes"
3. Painel lateral abre com formulário:
   - Título (obrigatório)
   - Descrição
   - Objetivos de aprendizagem
   - Duração estimada
4. Usuário preenche e clica "Criar Módulo"
5. Módulo aparece na árvore

**Fluxo de Duplicação:**
1. Usuário clica em "⋮" em módulo existente
2. Seleciona "Duplicar Módulo"
3. Sistema cria cópia com "(Cópia)" no título
4. Todas as aulas e conteúdos são duplicados
5. Usuário pode editar imediatamente

### 3.4 Adicionar uma Nova Aula

**Fluxo Rápido:**
1. Módulo expandido na sidebar
2. Usuário clica em "+ Adicionar Aula"
3. Input inline aparece
4. Usuário digita título e pressiona Enter
5. Aula criada e selecionada automaticamente
6. Área principal mostra "Adicione conteúdo"

**Fluxo com Template:**
1. Usuário clica em "⋮" ao lado de "+ Adicionar Aula"
2. Seleciona "Usar Template"
3. Modal mostra templates disponíveis:
   - "Aula com Vídeo + Quiz"
   - "Aula Teórica (Texto + Recursos)"
   - "Aula Prática (Exercício + Solução)"
4. Usuário seleciona template
5. Aula criada com estrutura pré-definida
6. Usuário preenche conteúdo específico

### 3.5 Inserir um Conteúdo Escrito

**Passo 1: Adicionar Bloco**
- Aula selecionada
- Usuário clica em "+ Texto"
- Bloco de texto vazio aparece na área principal

**Passo 2: Escolher Tipo**
- Dropdown no topo do bloco: [Texto Normal] [Callout] [Nota] [Destaque]
- Usuário seleciona tipo
- Estilo visual muda conforme tipo

**Passo 3: Editar Conteúdo**
- Editor rico aparece
- Toolbar: Negrito, Itálico, Lista, Link, Imagem
- Usuário digita conteúdo
- Preview ao lado (opcional, toggle)

**Passo 4: Adicionar Recursos Visuais (Opcional)**
- Botão "Adicionar Imagem"
- Upload ou URL
- Alt text e caption
- Posicionamento: Inline, Largura Total, Lado a Lado

**Passo 5: Salvar**
- Autosave contínuo
- Indicador: "Salvando..." → "Salvo"
- Usuário pode adicionar mais blocos ou navegar

### 3.6 Selecionar um Vídeo da Base de Dados

**Passo 1: Abrir Biblioteca**
- Aula selecionada
- Usuário clica em "+ Vídeo"
- Modal "Selecionar Vídeo" abre

**Passo 2: Buscar e Filtrar**
- Barra de busca no topo
- Filtros laterais:
  - Instrutor
  - Tema/Categoria
  - Duração (< 5min, 5-15min, 15-30min, > 30min)
  - Idioma
  - Status (Pronto, Processando)
- Resultados em grid com thumbnails

**Passo 3: Visualizar Detalhes**
- Usuário clica em vídeo
- Painel lateral expande com:
  - Player de preview
  - Título e descrição
  - Duração, instrutor, tags
  - Estatísticas: "Usado em 5 trilhas"
  - Botão "Selecionar Este Vídeo"

**Passo 4: Configurar Vídeo (Opcional)**
- Após seleção, painel de configuração:
  - Timestamp de início (ex: começar em 1:30)
  - Timestamp de fim (ex: terminar em 10:45)
  - Legendas (ativar/desativar)
  - Notas do instrutor

**Passo 5: Confirmar**
- Usuário clica "Adicionar à Aula"
- Modal fecha
- Bloco de vídeo aparece na aula
- Thumbnail e metadados visíveis

### 3.7 Criar e Editar um Quiz

**Criar Quiz:**

**Passo 1: Adicionar Bloco de Quiz**
- Aula selecionada
- Usuário clica em "+ Quiz"
- Bloco de quiz vazio aparece

**Passo 2: Configurar Quiz**
- Painel de configuração:
  - Título do quiz (opcional)
  - Descrição (opcional)
  - Nota de aprovação (ex: 70%)
  - Mostrar feedback imediatamente? [Sim/Não]
  - Permitir refazer? [Sim/Não]
  - Máximo de tentativas (se permitir refazer)

**Passo 3: Adicionar Primeira Questão**
- Botão "+ Adicionar Questão"
- Card de questão aparece
- Campos:
  - Tipo: [Múltipla Escolha] [Verdadeiro/Falso] [Seleção Múltipla]
  - Enunciado (editor rico)
  - Pontos (padrão: 1)

**Passo 4: Adicionar Alternativas**
- Para múltipla escolha:
  - 4 campos de alternativa (padrão)
  - Botão "+ Adicionar Alternativa" (até 6)
  - Radio button para marcar correta
  - Campo de feedback por alternativa (opcional, colapsado)
- Para verdadeiro/falso:
  - Apenas 2 opções fixas
  - Marcar qual é correta

**Passo 5: Adicionar Explicação**
- Campo "Explicação" (colapsado por padrão)
- Editor rico
- Mostrado após resposta do aluno

**Passo 6: Adicionar Mais Questões**
- Botão "+ Adicionar Questão" no final
- Reordenar questões via drag-and-drop
- Duplicar questão via menu "⋮"

**Passo 7: Preview**
- Botão "Visualizar Quiz"
- Modal mostra quiz como aluno verá
- Testar fluxo completo

**Editar Quiz Existente:**
- Clicar no bloco de quiz
- Expandir questões
- Editar inline
- Reordenar via drag-and-drop
- Deletar questões via "⋮" → "Excluir"

### 3.8 Reordenar Módulos e Aulas

**Reordenar Módulos:**
1. Sidebar mostra lista de módulos
2. Ícone de "handle" (⋮⋮) ao lado de cada módulo
3. Usuário arrasta módulo para nova posição
4. Linha de inserção mostra onde será solto
5. Ao soltar, ordem atualiza
6. Autosave imediato
7. Feedback: "Ordem atualizada"

**Reordenar Aulas:**
1. Módulo expandido
2. Ícone de "handle" ao lado de cada aula
3. Arrastar dentro do mesmo módulo
4. Ou arrastar para outro módulo
5. Confirmação se mover entre módulos: "Mover 'Aula X' para 'Módulo Y'?"
6. Ordem atualiza
7. Autosave

**Reordenar Blocos de Conteúdo:**
1. Aula selecionada
2. Blocos listados na área principal
3. Handle ao lado de cada bloco
4. Arrastar para reordenar
5. Atualização imediata

**Reordenação em Lote:**
1. Botão "Reordenar" no topo da sidebar
2. Modo de reordenação ativado
3. Números aparecem ao lado de cada item
4. Usuário pode:
   - Arrastar múltiplos itens
   - Ou digitar nova ordem nos números
5. Botão "Aplicar Nova Ordem"
6. Confirmação: "X itens reordenados"

### 3.9 Visualizar Prévia da Trilha

**Preview Inline:**
- Botão "👁 Preview" sempre visível no topo
- Clique abre painel lateral com preview
- Mostra como aluno verá o conteúdo atual
- Pode navegar entre aulas no preview
- Fechar preview volta ao editor

**Preview em Nova Aba:**
- Botão "⋮" ao lado de "Preview"
- Opção "Abrir em Nova Aba"
- Abre trilha completa em modo aluno
- URL temporária com token
- Pode compartilhar para revisão

**Preview de Bloco Específico:**
- Hover em bloco de conteúdo
- Ícone "👁" aparece
- Clique mostra preview daquele bloco
- Modal ou painel lateral

### 3.10 Salvar Rascunho

**Autosave:**
- Ativo por padrão
- Salva a cada 3 segundos após última edição
- Indicador no topo: "Salvando..." → "Salvo às 14:32"
- Não requer ação do usuário

**Salvar Manual:**
- Atalho: Ctrl+S (Cmd+S no Mac)
- Botão "Salvar" sempre disponível
- Força salvamento imediato
- Feedback: "Rascunho salvo"

**Salvar e Sair:**
- Botão "Salvar e Fechar"
- Salva e retorna ao dashboard
- Confirmação se houver mudanças não salvas

### 3.11 Publicar Alterações

**Passo 1: Validação**
- Usuário clica em "Publicar"
- Sistema valida trilha completa:
  - Todas as aulas têm conteúdo?
  - Todos os quizzes têm questões válidas?
  - Todos os vídeos estão disponíveis?
  - Metadados obrigatórios preenchidos?

**Passo 2: Revisão de Mudanças**
- Se válido, modal "Revisar Mudanças" abre
- Lista de alterações desde última publicação:
  - "3 módulos adicionados"
  - "5 aulas editadas"
  - "2 quizzes criados"
- Opção de adicionar nota de versão

**Passo 3: Confirmação**
- Checkbox: "Confirmo que revisei as mudanças"
- Botão "Publicar Trilha"
- Sistema cria nova versão
- Atualiza status para "published"

**Passo 4: Feedback**
- Toast de sucesso: "Trilha publicada com sucesso!"
- Opção: "Ver trilha publicada" ou "Continuar editando"
- Email/notificação para stakeholders (opcional)

**Se Validação Falhar:**
- Modal "Pendências para Publicação"
- Lista de itens incompletos:
  - "Módulo 2 > Aula 3: Sem conteúdo"
  - "Módulo 3 > Aula 1 > Quiz: Questão 2 sem resposta correta"
- Links clicáveis para ir direto ao problema
- Botão "Corrigir Pendências"

---


## 4. ARQUITETURA DA EXPERIÊNCIA

### 4.1 Estrutura Geral da Interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER (Sticky)                                                         │
│ [Logo] [Breadcrumb] ────────────────── [Autosave] [Preview] [Publish]  │
└─────────────────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────┬──────────────────┐
│              │                                      │                  │
│   SIDEBAR    │         MAIN CONTENT AREA            │  PROPERTIES      │
│   (280px)    │         (Flex, min 600px)            │  PANEL           │
│              │                                      │  (320px)         │
│              │                                      │                  │
│ • Overview   │  Conteúdo dinâmico baseado em:      │ Metadados e      │
│ • Structure  │  - Nenhuma seleção: Overview        │ configurações    │
│   Tree       │  - Módulo selecionado: Detalhes     │ do item          │
│ • Quick      │  - Aula selecionada: Editor         │ selecionado      │
│   Actions    │  - Bloco selecionado: Editor        │                  │
│              │                                      │                  │
│              │                                      │                  │
└──────────────┴──────────────────────────────────────┴──────────────────┘
```

### 4.2 Navegação Principal (Sidebar)

**Seção 1: Informações da Trilha**
```
┌─────────────────────────────┐
│ Fundamentos de React        │
│ Status: Rascunho            │
│ ───────────────────────     │
│ ▓▓▓▓▓▓▓░░░░░░░░░ 45%       │
│ 3 de 5 módulos completos    │
└─────────────────────────────┘
```

**Seção 2: Árvore de Estrutura**
```
┌─────────────────────────────┐
│ 📚 Estrutura da Trilha      │
│                             │
│ ▼ 📘 Módulo 1: Introdução   │
│   ├─ ✓ Aula 1.1: O que é   │
│   ├─ ✓ Aula 1.2: Setup     │
│   └─ ⚠ Aula 1.3: Conceitos │
│                             │
│ ▼ 📘 Módulo 2: Componentes  │
│   ├─ ✓ Aula 2.1: JSX       │
│   ├─ ⚠ Aula 2.2: Props     │
│   └─ ⭕ Aula 2.3: State    │
│                             │
│ ▶ 📘 Módulo 3: Hooks        │
│                             │
│ [+ Adicionar Módulo]        │
└─────────────────────────────┘
```

**Legenda de Ícones:**
- ✓ = Completo
- ⚠ = Incompleto/Com avisos
- ⭕ = Vazio
- 📘 = Módulo
- 📄 = Aula

**Seção 3: Ações Rápidas**
```
┌─────────────────────────────┐
│ ⚡ Ações Rápidas            │
│                             │
│ [📊 Ver Estatísticas]       │
│ [📋 Duplicar Trilha]        │
│ [📦 Exportar]               │
│ [🗑️ Arquivar]               │
└─────────────────────────────┘
```

### 4.3 Área Principal de Conteúdo

**Estado 1: Nenhuma Seleção (Overview da Trilha)**
```
┌──────────────────────────────────────────────────┐
│ Fundamentos de React                             │
│ ─────────────────────────────────────────────    │
│                                                  │
│ 📊 Visão Geral                                   │
│                                                  │
│ ┌──────────┬──────────┬──────────┬──────────┐   │
│ │ 5        │ 15       │ 45       │ 8h       │   │
│ │ Módulos  │ Aulas    │ Blocos   │ Duração  │   │
│ └──────────┴──────────┴──────────┴──────────┘   │
│                                                  │
│ 📈 Progresso de Completude                       │
│ ▓▓▓▓▓▓▓░░░░░░░░░ 45%                            │
│                                                  │
│ ⚠️ Pendências (7)                                │
│ • Módulo 2 > Aula 2.3: Sem conteúdo             │
│ • Módulo 3 > Aula 3.1 > Quiz: Incompleto        │
│ • Módulo 4: Sem aulas                           │
│ [Ver Todas as Pendências]                       │
│                                                  │
│ 📝 Últimas Edições                               │
│ • Há 5 min: Aula 2.2 editada por você           │
│ • Há 1h: Quiz adicionado por Maria              │
│ • Há 2h: Módulo 3 criado por você               │
└──────────────────────────────────────────────────┘
```

**Estado 2: Módulo Selecionado**
```
┌──────────────────────────────────────────────────┐
│ 📘 Módulo 2: Componentes                         │
│ ─────────────────────────────────────────────    │
│                                                  │
│ Descrição:                                       │
│ Aprenda a criar e compor componentes React...   │
│                                                  │
│ 📊 Estatísticas                                  │
│ • 3 aulas                                        │
│ • 45 minutos estimados                          │
│ • 2 aulas completas, 1 incompleta               │
│                                                  │
│ 📚 Aulas neste Módulo                            │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ ✓ Aula 2.1: Introdução ao JSX             │  │
│ │   🎥 1 vídeo • 📝 2 textos • ✅ 1 quiz     │  │
│ │   15 min                                   │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ ⚠ Aula 2.2: Props e Comunicação           │  │
│ │   🎥 1 vídeo • ⚠️ Quiz incompleto          │  │
│ │   20 min                                   │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ [+ Adicionar Aula]                               │
└──────────────────────────────────────────────────┘
```

**Estado 3: Aula Selecionada (Editor de Conteúdo)**
```
┌──────────────────────────────────────────────────┐
│ 📄 Aula 2.1: Introdução ao JSX                   │
│ ─────────────────────────────────────────────    │
│                                                  │
│ Blocos de Conteúdo:                              │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ ⋮⋮ BLOCO 1: Vídeo                          │  │
│ │ ┌──────────────────────────────────────┐   │  │
│ │ │ [Thumbnail do Vídeo]                 │   │  │
│ │ │ "O que é JSX?"                       │   │  │
│ │ │ 12:30 • Instrutor: João Silva        │   │  │
│ │ └──────────────────────────────────────┘   │  │
│ │ [Editar] [Remover]                         │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ ⋮⋮ BLOCO 2: Texto                          │  │
│ │ ┌──────────────────────────────────────┐   │  │
│ │ │ JSX é uma extensão de sintaxe...     │   │  │
│ │ │ [Editor Rico Ativo]                  │   │  │
│ │ └──────────────────────────────────────┘   │  │
│ │ [Salvo]                                    │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ ⋮⋮ BLOCO 3: Quiz                           │  │
│ │ "Teste seus conhecimentos"                 │  │
│ │ 5 questões • 70% para aprovação            │  │
│ │ [Editar Quiz] [Preview]                    │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ [+ Vídeo] [+ Texto] [+ Quiz] [+ Exercício]      │
└──────────────────────────────────────────────────┘
```

### 4.4 Painel de Propriedades (Direita)

**Quando Trilha Selecionada:**
```
┌─────────────────────────────┐
│ Propriedades da Trilha      │
│ ─────────────────────────   │
│                             │
│ Título *                    │
│ [Fundamentos de React    ]  │
│                             │
│ Descrição                   │
│ [Aprenda React do zero...]  │
│                             │
│ Nível                       │
│ [○ Iniciante               ]│
│ [●  Intermediário          ]│
│ [○ Avançado                ]│
│                             │
│ Duração Estimada            │
│ [8] horas                   │
│                             │
│ Tags                        │
│ [React] [JavaScript] [+]    │
│                             │
│ Imagem de Capa              │
│ [Upload ou URL]             │
│                             │
│ ▼ Opções Avançadas          │
│   Pré-requisitos            │
│   Objetivos de Aprendizagem │
│   Categorias                │
│                             │
│ [Salvar Alterações]         │
└─────────────────────────────┘
```

**Quando Módulo Selecionado:**
```
┌─────────────────────────────┐
│ Propriedades do Módulo      │
│ ─────────────────────────   │
│                             │
│ Título *                    │
│ [Componentes             ]  │
│                             │
│ Descrição                   │
│ [Aprenda a criar...]        │
│                             │
│ Duração Estimada            │
│ [45] minutos                │
│                             │
│ Objetivos                   │
│ • [Criar componentes]       │
│ • [Usar props]              │
│ [+ Adicionar Objetivo]      │
│                             │
│ Ordem                       │
│ [2] de 5 módulos            │
│                             │
│ [Salvar Alterações]         │
└─────────────────────────────┘
```

**Quando Aula Selecionada:**
```
┌─────────────────────────────┐
│ Propriedades da Aula        │
│ ─────────────────────────   │
│                             │
│ Título *                    │
│ [Introdução ao JSX       ]  │
│                             │
│ Descrição                   │
│ [Entenda a sintaxe JSX...]  │
│                             │
│ Duração Estimada            │
│ [15] minutos                │
│                             │
│ Ordem                       │
│ [1] de 3 aulas              │
│                             │
│ Status                      │
│ ✓ Completa                  │
│                             │
│ Blocos de Conteúdo          │
│ • 1 Vídeo                   │
│ • 2 Textos                  │
│ • 1 Quiz                    │
│                             │
│ [Salvar Alterações]         │
└─────────────────────────────┘
```

### 4.5 Header (Sticky)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [StudAI] [Trilhas > Fundamentos de React]                              │
│                                                                         │
│                    [💾 Salvo às 14:32] [👁 Preview] [🚀 Publicar]      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Logo clicável (volta ao dashboard)
- Breadcrumb navegável
- Indicador de autosave
- Botão de preview
- Botão de publicação (destaque)

### 4.6 Responsividade

**Desktop (> 1280px):**
- Layout de 3 colunas completo
- Sidebar: 280px
- Painel de propriedades: 320px
- Conteúdo: Flex

**Tablet (768px - 1280px):**
- Sidebar colapsável (overlay)
- Painel de propriedades vira bottom sheet
- Conteúdo ocupa largura total

**Mobile (< 768px):**
- Navegação via bottom sheet
- Conteúdo em stack vertical
- Propriedades em modal
- Ações principais em FAB

---


## 5. ESTRUTURA DA TELA PRINCIPAL

### 5.1 Layout Geral

**Princípios de Design:**
1. **Contexto Persistente**: Sidebar e breadcrumb sempre visíveis
2. **Foco no Conteúdo**: Área principal maximizada
3. **Acesso Rápido**: Propriedades sempre acessíveis
4. **Feedback Contínuo**: Status de salvamento sempre visível

### 5.2 Hierarquia da Informação

**Nível 1 - Navegação Global:**
- Header fixo com breadcrumb
- Indicadores de status (autosave, publicação)
- Ações primárias (Preview, Publicar)

**Nível 2 - Navegação Estrutural:**
- Sidebar com árvore completa
- Visão geral da trilha
- Indicadores de completude

**Nível 3 - Conteúdo Ativo:**
- Área principal com editor
- Blocos de conteúdo
- Ferramentas de edição

**Nível 4 - Metadados:**
- Painel de propriedades
- Configurações específicas
- Opções avançadas

### 5.3 Painel Lateral Esquerdo (Sidebar)

**Dimensões:**
- Largura: 280px (fixa)
- Altura: 100vh - header
- Scroll independente

**Estrutura:**
```
┌─────────────────────────────┐
│ [Voltar ao Dashboard]       │ ← Link de navegação
├─────────────────────────────┤
│ INFORMAÇÕES DA TRILHA       │ ← Seção fixa
│ • Título                    │
│ • Status badge              │
│ • Barra de progresso        │
│ • Estatísticas resumidas    │
├─────────────────────────────┤
│ ESTRUTURA DA TRILHA         │ ← Seção scrollável
│ [Buscar na estrutura...]    │
│                             │
│ ▼ Módulo 1                  │
│   ├─ Aula 1.1              │
│   ├─ Aula 1.2              │
│   └─ Aula 1.3              │
│                             │
│ ▼ Módulo 2                  │
│   └─ ...                    │
│                             │
│ [+ Adicionar Módulo]        │
├─────────────────────────────┤
│ AÇÕES RÁPIDAS               │ ← Seção fixa (bottom)
│ [Estatísticas]              │
│ [Duplicar]                  │
│ [Exportar]                  │
└─────────────────────────────┘
```

**Interações:**
- Hover em item: Mostra ações (editar, duplicar, deletar)
- Clique em item: Seleciona e carrega na área principal
- Drag handle: Permite reordenação
- Expand/collapse: Mostra/oculta aulas de um módulo

### 5.4 Área Principal de Edição

**Dimensões:**
- Largura: Flex (mínimo 600px)
- Altura: 100vh - header
- Scroll independente

**Estados Visuais:**

**Estado Vazio (Nova Trilha):**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│              🎓                                  │
│                                                  │
│         Comece sua trilha                        │
│                                                  │
│    Adicione o primeiro módulo para começar      │
│    a construir o conteúdo educacional           │
│                                                  │
│         [+ Adicionar Módulo]                     │
│                                                  │
│              ou                                  │
│                                                  │
│         [📋 Usar Template]                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Estado de Edição (Aula Selecionada):**
```
┌──────────────────────────────────────────────────┐
│ 📄 Aula 2.1: Introdução ao JSX                   │
│ ─────────────────────────────────────────────    │
│                                                  │
│ [BLOCO 1: Vídeo]                                 │
│ [BLOCO 2: Texto]                                 │
│ [BLOCO 3: Quiz]                                  │
│                                                  │
│ [+ Adicionar Conteúdo]                           │
│   ├─ Vídeo                                       │
│   ├─ Texto                                       │
│   ├─ Quiz                                        │
│   ├─ Exercício                                   │
│   └─ Recursos                                    │
└──────────────────────────────────────────────────┘
```

### 5.5 Painel de Propriedades (Direita)

**Dimensões:**
- Largura: 320px (fixa)
- Altura: 100vh - header
- Scroll independente

**Comportamento:**
- Conteúdo dinâmico baseado na seleção
- Colapsável via toggle
- Autosave ao perder foco de campo

**Estrutura:**
```
┌─────────────────────────────┐
│ Propriedades                │
│ ─────────────────────────   │
│                             │
│ [Campos específicos do      │
│  item selecionado]          │
│                             │
│ ▼ Opções Avançadas          │
│   [Campos adicionais]       │
│                             │
│ ─────────────────────────   │
│ Última edição:              │
│ Há 5 min por você           │
│                             │
│ Criado em:                  │
│ 15/03/2026 por Maria        │
└─────────────────────────────┘
```

### 5.6 Barra Superior (Header)

**Dimensões:**
- Altura: 64px (fixa)
- Largura: 100vw
- Position: Sticky top

**Estrutura:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Trilhas > Fundamentos de React                                 │
│                                                                         │
│         [💾 Salvando...] [👁 Preview ▼] [⋮] [🚀 Publicar]             │
└─────────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
1. **Logo + Breadcrumb** (esquerda)
   - Logo clicável
   - Breadcrumb navegável
   - Truncate em telas pequenas

2. **Indicador de Autosave** (centro-direita)
   - Estados: Salvando, Salvo, Erro
   - Timestamp da última salvamento
   - Clicável para forçar save

3. **Botão Preview** (direita)
   - Dropdown com opções:
     - Preview inline
     - Abrir em nova aba
     - Compartilhar preview
   
4. **Menu de Opções** (direita)
   - Histórico de versões
   - Configurações
   - Ajuda

5. **Botão Publicar** (destaque, direita)
   - Cor primária
   - Validação antes de abrir modal

### 5.7 Status de Salvamento

**Indicador Visual:**
```
Estados:
┌─────────────────┐
│ 💾 Salvando...  │ ← Animação de loading
├─────────────────┤
│ ✓ Salvo 14:32   │ ← Verde, com timestamp
├─────────────────┤
│ ⚠ Erro ao salvar│ ← Vermelho, clicável para retry
├─────────────────┤
│ ⏸ Offline       │ ← Amarelo, salvará quando online
└─────────────────┘
```

**Comportamento:**
- Autosave a cada 3 segundos após última edição
- Debounce para evitar saves excessivos
- Queue de mudanças se múltiplas edições rápidas
- Retry automático em caso de erro (3 tentativas)
- Notificação se falhar após retries

### 5.8 Preview

**Preview Inline (Painel Lateral):**
```
┌─────────────────────────────┐
│ Preview                [X]  │
│ ─────────────────────────   │
│                             │
│ [Renderização do conteúdo   │
│  como aluno verá]           │
│                             │
│ ← Aula Anterior             │
│ Próxima Aula →              │
│                             │
│ [Compartilhar Preview]      │
└─────────────────────────────┘
```

**Preview em Nova Aba:**
- URL temporária: `/preview/{trackId}?token={tempToken}`
- Token expira em 24h
- Pode compartilhar com stakeholders
- Mostra banner: "Você está visualizando um preview"

### 5.9 Feedback Visual

**Animações:**
- Transições suaves entre seleções (200ms ease)
- Fade in/out de painéis (150ms)
- Slide in de modais (250ms ease-out)
- Skeleton loading para conteúdo assíncrono

**Cores de Estado:**
- Sucesso: Verde (#10B981)
- Aviso: Amarelo (#F59E0B)
- Erro: Vermelho (#EF4444)
- Info: Azul (#3B82F6)
- Neutro: Cinza (#6B7280)

**Microinterações:**
- Hover em botões: Elevação sutil
- Clique: Ripple effect
- Drag: Cursor grab, item semi-transparente
- Drop: Linha de inserção animada

---


## 6. VISÃO EM ÁRVORE / ESTRUTURA DA TRILHA

### 6.1 Padrão de UX: Tree View com Drag-and-Drop

**Por que Tree View?**
- Representa hierarquia naturalmente
- Familiar para usuários (similar a file explorers)
- Permite expand/collapse para gerenciar complexidade
- Suporta drag-and-drop intuitivamente
- Escalável para estruturas grandes

### 6.2 Anatomia de um Item na Árvore

**Módulo:**
```
┌─────────────────────────────────────────┐
│ ⋮⋮ ▼ 📘 Módulo 1: Introdução       [⋮] │
│         ▓▓▓▓▓▓░░░░ 60%  ✓ 2/3          │
└─────────────────────────────────────────┘
 │  │  │          │        │   │
 │  │  │          │        │   └─ Contador de aulas
 │  │  │          │        └───── Progresso textual
 │  │  │          └────────────── Barra de progresso
 │  │  └───────────────────────── Título editável
 │  └──────────────────────────── Ícone de expand/collapse
 └─────────────────────────────── Drag handle
                                  └─ Menu de ações
```

**Aula:**
```
┌─────────────────────────────────────────┐
│   ⋮⋮ 📄 Aula 1.1: O que é React?   [⋮] │
│         🎥 📝 ✅  •  15 min  •  ✓      │
└─────────────────────────────────────────┘
     │     │  │  │      │         │
     │     │  │  │      │         └─ Status (completo)
     │     │  │  │      └─────────── Duração
     │     │  │  └────────────────── Ícones de conteúdo
     │     │  └───────────────────── (Vídeo, Texto, Quiz)
     │     └──────────────────────── Título editável
     └────────────────────────────── Drag handle
```

### 6.3 Estados Visuais

**Estado Normal:**
```
▶ 📘 Módulo 1: Introdução
```

**Estado Hover:**
```
┌─────────────────────────────────────────┐
│ ⋮⋮ ▶ 📘 Módulo 1: Introdução       [⋮] │ ← Background cinza claro
│         [Editar] [Duplicar] [Excluir]   │ ← Ações aparecem
└─────────────────────────────────────────┘
```

**Estado Selecionado:**
```
┌─────────────────────────────────────────┐
│ ⋮⋮ ▼ 📘 Módulo 1: Introdução       [⋮] │ ← Background azul claro
│         ▓▓▓▓▓▓░░░░ 60%  ✓ 2/3          │ ← Borda azul
└─────────────────────────────────────────┘
```

**Estado Expandido:**
```
▼ 📘 Módulo 1: Introdução
  ├─ 📄 Aula 1.1: O que é React?
  ├─ 📄 Aula 1.2: Setup do Ambiente
  └─ 📄 Aula 1.3: Primeiro Componente
```

**Estado Colapsado:**
```
▶ 📘 Módulo 1: Introdução  (3 aulas)
```

**Estado Incompleto:**
```
▶ 📘 Módulo 1: Introdução  ⚠
  ├─ 📄 Aula 1.1: O que é React?  ✓
  ├─ 📄 Aula 1.2: Setup  ⚠  ← Amarelo, tooltip: "Sem conteúdo"
  └─ 📄 Aula 1.3: Componente  ⭕  ← Cinza, tooltip: "Vazio"
```

**Estado de Drag:**
```
┌─────────────────────────────────────────┐
│ 👆 📘 Módulo 1: Introdução              │ ← Semi-transparente
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ ▶ 📘 Módulo 2: Componentes              │
├─────────────────────────────────────────┤ ← Linha de inserção
│ ▶ 📘 Módulo 3: Hooks                    │
└─────────────────────────────────────────┘
```

### 6.4 Interações

**Expand/Collapse:**
- Clique no ícone ▶/▼
- Ou clique duplo no item
- Atalho: Seta direita (expand), Seta esquerda (collapse)
- Animação: Slide down/up (200ms)

**Seleção:**
- Clique simples no item
- Área principal atualiza
- Painel de propriedades atualiza
- Item destacado visualmente

**Edição Inline de Título:**
- Clique duplo no título
- Ou selecionar e pressionar F2
- Input inline aparece
- Enter salva, Esc cancela
- Autosave ao perder foco

**Drag-and-Drop:**
- Hover no drag handle (⋮⋮)
- Cursor muda para grab
- Arrastar item
- Linha de inserção mostra onde será solto
- Soltar atualiza ordem
- Animação de reordenação

**Menu de Contexto:**
- Clique no ícone [⋮]
- Ou clique direito no item
- Menu dropdown:
  - Editar
  - Duplicar
  - Mover para...
  - Excluir
  - Ver Histórico

### 6.5 Busca na Estrutura

```
┌─────────────────────────────────────────┐
│ 🔍 Buscar na estrutura...               │
└─────────────────────────────────────────┘
```

**Funcionalidade:**
- Busca em tempo real (debounce 300ms)
- Busca em títulos de módulos e aulas
- Resultados destacados na árvore
- Auto-expand módulos com resultados
- Navegação por resultados (Enter, Shift+Enter)

**Exemplo de Resultado:**
```
🔍 "jsx"

Resultados (3):
▼ 📘 Módulo 2: Componentes
  ├─ 📄 Aula 2.1: Introdução ao JSX  ← Destacado
  └─ 📄 Aula 2.2: JSX Avançado  ← Destacado

▼ 📘 Módulo 5: Boas Práticas
  └─ 📄 Aula 5.3: JSX e Performance  ← Destacado
```

### 6.6 Indicadores de Status

**Ícones de Completude:**
- ✓ (Verde): Item completo e válido
- ⚠ (Amarelo): Item incompleto ou com avisos
- ⭕ (Cinza): Item vazio
- 🔒 (Cinza escuro): Item bloqueado (permissões)

**Ícones de Conteúdo (Aulas):**
- 🎥: Contém vídeo
- 📝: Contém texto
- ✅: Contém quiz
- 💪: Contém exercício
- 📎: Contém recursos

**Badges de Status:**
- [Rascunho]: Cinza
- [Publicado]: Verde
- [Arquivado]: Vermelho
- [Em Revisão]: Amarelo

### 6.7 Barra de Progresso

**Visual:**
```
▓▓▓▓▓▓▓░░░░░░░░░ 45%
```

**Cálculo:**
- Módulo: % de aulas completas
- Trilha: % de módulos completos
- Aula: % de blocos com conteúdo válido

**Cores:**
- 0-30%: Vermelho
- 31-70%: Amarelo
- 71-100%: Verde

### 6.8 Ações em Lote

**Seleção Múltipla:**
- Ctrl+Clique (Cmd+Clique no Mac) para selecionar múltiplos
- Shift+Clique para selecionar range
- Checkbox aparece ao lado de cada item quando em modo de seleção

**Ações Disponíveis:**
```
┌─────────────────────────────────────────┐
│ 3 itens selecionados                    │
│ [Mover] [Duplicar] [Excluir] [Cancelar] │
└─────────────────────────────────────────┘
```

### 6.9 Reordenação Avançada

**Modo de Reordenação:**
- Botão "Reordenar" no topo da sidebar
- Números aparecem ao lado de cada item
- Usuário pode:
  - Arrastar itens
  - Ou digitar nova ordem nos números
- Botão "Aplicar" confirma mudanças
- Botão "Cancelar" reverte

**Visual:**
```
┌─────────────────────────────────────────┐
│ Modo de Reordenação  [Aplicar] [Cancelar]│
├─────────────────────────────────────────┤
│ [1] ⋮⋮ 📘 Módulo 1: Introdução          │
│ [2] ⋮⋮ 📘 Módulo 2: Componentes         │
│ [3] ⋮⋮ 📘 Módulo 3: Hooks               │
└─────────────────────────────────────────┘
```

### 6.10 Escalabilidade para Trilhas Grandes

**Virtualização:**
- Renderizar apenas itens visíveis
- Scroll virtual para listas > 100 itens
- Performance mantida mesmo com 1000+ itens

**Lazy Loading:**
- Carregar aulas de um módulo apenas quando expandido
- Skeleton loading enquanto carrega

**Paginação (Opcional):**
- Para trilhas muito grandes (> 50 módulos)
- "Carregar mais módulos" no final da lista

**Filtros:**
```
┌─────────────────────────────────────────┐
│ Filtrar:                                │
│ [✓] Completos  [✓] Incompletos  [✓] Vazios │
│ [✓] Rascunho   [✓] Publicados           │
└─────────────────────────────────────────┘
```

---


## 7. EDIÇÃO DE CONTEÚDO ESCRITO

### 7.1 Editor Rico (Rich Text Editor)

**Escolha de Tecnologia:**
- **Recomendado**: Tiptap (baseado em ProseMirror)
- **Alternativas**: Slate, Lexical, Quill
- **Por quê**: Extensível, moderno, boa UX, TypeScript

### 7.2 Toolbar do Editor

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [B] [I] [U] [S] │ [H1] [H2] [H3] │ [•] [1.] │ ["] [</>] │ [🔗] [🖼] │ [⋮] │
└─────────────────────────────────────────────────────────────────────────┘
  │   │   │   │      │   │    │      │    │      │    │      │    │     │
  │   │   │   │      │   │    │      │    │      │    │      │    │     └─ Mais opções
  │   │   │   │      │   │    │      │    │      │    │      │    └─────── Imagem
  │   │   │   │      │   │    │      │    │      │    │      └──────────── Link
  │   │   │   │      │   │    │      │    │      │    └─────────────────── Code block
  │   │   │   │      │   │    │      │    │      └──────────────────────── Quote
  │   │   │   │      │   │    │      │    └─────────────────────────────── Lista numerada
  │   │   │   │      │   │    │      └──────────────────────────────────── Lista
  │   │   │   │      │   │    └─────────────────────────────────────────── Heading 3
  │   │   │   │      │   └──────────────────────────────────────────────── Heading 2
  │   │   │   │      └──────────────────────────────────────────────────── Heading 1
  │   │   │   └─────────────────────────────────────────────────────────── Strikethrough
  │   │   └─────────────────────────────────────────────────────────────── Underline
  │   └─────────────────────────────────────────────────────────────────── Italic
  └─────────────────────────────────────────────────────────────────────── Bold
```

**Funcionalidades Essenciais:**
1. Formatação básica: Negrito, Itálico, Sublinhado, Tachado
2. Títulos: H1, H2, H3
3. Listas: Bullet points, Numeradas
4. Citações (blockquote)
5. Code blocks (com syntax highlighting)
6. Links (com preview)
7. Imagens (upload ou URL)

**Funcionalidades Avançadas (Menu "Mais"):**
8. Tabelas
9. Vídeos embarcados (YouTube, Vimeo)
10. Callouts/Alertas
11. Divisores horizontais
12. Emojis
13. Menções (@usuário)
14. Variáveis dinâmicas

### 7.3 Tipos de Blocos de Texto

**1. Texto Normal**
```
┌─────────────────────────────────────────┐
│ BLOCO: Texto                            │
│ ─────────────────────────────────────   │
│                                         │
│ [Editor Rico]                           │
│ Lorem ipsum dolor sit amet...           │
│                                         │
└─────────────────────────────────────────┘
```

**2. Callout (Destaque)**
```
┌─────────────────────────────────────────┐
│ BLOCO: Callout                          │
│ ─────────────────────────────────────   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💡 Dica Importante                  │ │
│ │                                     │ │
│ │ [Editor Rico]                       │ │
│ │ Este é um destaque importante...    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Tipo: [💡 Dica] [⚠ Aviso] [✓ Sucesso]  │
└─────────────────────────────────────────┘
```

**3. Nota (Observação)**
```
┌─────────────────────────────────────────┐
│ BLOCO: Nota                             │
│ ─────────────────────────────────────   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📝 Observação                       │ │
│ │ [Editor Rico - Texto menor]         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**4. Destaque (Highlight)**
```
┌─────────────────────────────────────────┐
│ BLOCO: Destaque                         │
│ ─────────────────────────────────────   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⭐ CONCEITO-CHAVE                   │ │
│ │                                     │ │
│ │ [Editor Rico - Texto grande]        │ │
│ │ JSX é uma extensão de sintaxe...    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 7.4 Interface de Edição

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ BLOCO 2: Texto                                              [⋮⋮] [⋮]    │
├─────────────────────────────────────────────────────────────────────────┤
│ Tipo: [Texto Normal ▼]                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ [Toolbar do Editor]                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ [Área de Edição]                                                        │
│                                                                         │
│ # Introdução ao JSX                                                     │
│                                                                         │
│ JSX é uma **extensão de sintaxe** para JavaScript que permite          │
│ escrever código que se parece com HTML dentro do JavaScript.           │
│                                                                         │
│ ## Por que usar JSX?                                                    │
│                                                                         │
│ - Sintaxe mais intuitiva                                               │
│ - Melhor visualização da estrutura                                     │
│ - Type safety com TypeScript                                           │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ [Toggle Preview]                                    💾 Salvo às 14:32   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Modo Split (Editor + Preview):**
```
┌──────────────────────────────┬──────────────────────────────┐
│ Editor                       │ Preview                      │
├──────────────────────────────┼──────────────────────────────┤
│ # Introdução ao JSX          │ Introdução ao JSX            │
│                              │                              │
│ JSX é uma **extensão**...    │ JSX é uma extensão...        │
│                              │                              │
│ ## Por que usar JSX?         │ Por que usar JSX?            │
│                              │                              │
│ - Sintaxe intuitiva          │ • Sintaxe intuitiva          │
└──────────────────────────────┴──────────────────────────────┘
```

### 7.5 Inserção de Imagens

**Fluxo:**
1. Usuário clica em ícone de imagem na toolbar
2. Modal abre com opções:
   - Upload de arquivo
   - URL de imagem
   - Biblioteca de imagens (se existir)

**Modal de Upload:**
```
┌─────────────────────────────────────────┐
│ Adicionar Imagem                    [X] │
│ ─────────────────────────────────────   │
│                                         │
│ [Upload] [URL] [Biblioteca]             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     Arraste a imagem aqui           │ │
│ │     ou clique para selecionar       │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Texto alternativo (alt):                │
│ [Descrição da imagem para acessibilidade]│
│                                         │
│ Legenda (opcional):                     │
│ [Legenda que aparecerá abaixo da imagem]│
│                                         │
│ Tamanho:                                │
│ [○ Pequeno  ● Médio  ○ Grande  ○ Total] │
│                                         │
│ Alinhamento:                            │
│ [○ Esquerda  ● Centro  ○ Direita]       │
│                                         │
│         [Cancelar]  [Inserir Imagem]    │
└─────────────────────────────────────────┘
```

**Imagem Inserida:**
```
┌─────────────────────────────────────────┐
│ [Texto antes da imagem...]              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     [Imagem renderizada]            │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ Legenda: Exemplo de componente React    │
│                                         │
│ [Editar] [Remover]                      │
│                                         │
│ [Texto depois da imagem...]             │
└─────────────────────────────────────────┘
```

### 7.6 Inserção de Links

**Fluxo Inline:**
1. Usuário seleciona texto
2. Clica em ícone de link ou Ctrl+K
3. Popover aparece

**Popover de Link:**
```
┌─────────────────────────────────────────┐
│ URL:                                    │
│ [https://react.dev                   ]  │
│                                         │
│ [✓] Abrir em nova aba                   │
│                                         │
│ [Remover Link]  [Aplicar]               │
└─────────────────────────────────────────┘
```

**Link Inserido:**
```
Aprenda mais sobre [React](https://react.dev) na documentação oficial.
                     └─────────────────────┘
                     Hover mostra preview
```

### 7.7 Code Blocks

**Inserção:**
1. Usuário clica em ícone de código
2. Bloco de código aparece
3. Dropdown para selecionar linguagem

**Visual:**
```
┌─────────────────────────────────────────┐
│ Linguagem: [JavaScript ▼]              │
├─────────────────────────────────────────┤
│ 1  const App = () => {                  │
│ 2    return (                           │
│ 3      <div>                            │
│ 4        <h1>Hello World</h1>           │
│ 5      </div>                           │
│ 6    );                                 │
│ 7  };                                   │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- Syntax highlighting
- Números de linha
- Botão de copiar
- Suporte a 20+ linguagens

### 7.8 Atalhos de Teclado

**Formatação:**
- Ctrl+B: Negrito
- Ctrl+I: Itálico
- Ctrl+U: Sublinhado
- Ctrl+K: Inserir link

**Estrutura:**
- Ctrl+Alt+1: Heading 1
- Ctrl+Alt+2: Heading 2
- Ctrl+Alt+3: Heading 3
- Ctrl+Shift+8: Lista bullet
- Ctrl+Shift+7: Lista numerada

**Ações:**
- Ctrl+S: Salvar
- Ctrl+Z: Desfazer
- Ctrl+Shift+Z: Refazer
- Ctrl+/: Mostrar atalhos

### 7.9 Validações

**Obrigatórias:**
- Conteúdo não pode estar vazio
- Imagens devem ter texto alternativo
- Links devem ter URL válida

**Avisos:**
- Texto muito longo (> 5000 palavras)
- Muitas imagens (> 10)
- Links quebrados (verificação assíncrona)

### 7.10 Manter Simplicidade

**Princípios:**
1. **Toolbar Limpa**: Apenas ferramentas essenciais visíveis
2. **Funcionalidades Avançadas Ocultas**: Menu "Mais opções"
3. **Markdown Support**: Para power users
4. **Templates**: Blocos pré-formatados
5. **Slash Commands**: Digite "/" para menu rápido

**Slash Commands:**
```
/h1 → Heading 1
/h2 → Heading 2
/list → Lista bullet
/code → Code block
/image → Inserir imagem
/callout → Callout
/table → Tabela
```

---


## 8. SELEÇÃO DE VÍDEOS DA BASE DE DADOS

### 8.1 Modal de Biblioteca de Vídeos

**Dimensões:**
- Largura: 1200px (ou 90vw em telas menores)
- Altura: 800px (ou 90vh)
- Modal centralizado com overlay

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Selecionar Vídeo                                                    [X] │
├──────────────┬──────────────────────────────────────────────────────────┤
│              │                                                          │
│   FILTROS    │              RESULTADOS (Grid)                          │
│   (240px)    │              (Flex)                                     │
│              │                                                          │
│ Buscar:      │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│ [        ]   │  │[Thumb] │ │[Thumb] │ │[Thumb] │ │[Thumb] │          │
│              │  │ Título │ │ Título │ │ Título │ │ Título │          │
│ Instrutor:   │  │ 12:30  │ │ 08:15  │ │ 25:00  │ │ 15:45  │          │
│ [Todos ▼]    │  └────────┘ └────────┘ └────────┘ └────────┘          │
│              │                                                          │
│ Tema:        │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│ [Todos ▼]    │  │[Thumb] │ │[Thumb] │ │[Thumb] │ │[Thumb] │          │
│              │  │ Título │ │ Título │ │ Título │ │ Título │          │
│ Duração:     │  │ 10:20  │ │ 18:30  │ │ 05:15  │ │ 22:00  │          │
│ [✓] < 5min   │  └────────┘ └────────┘ └────────┘ └────────┘          │
│ [✓] 5-15min  │                                                          │
│ [✓] 15-30min │  Mostrando 24 de 156 vídeos                             │
│ [✓] > 30min  │  [Carregar Mais]                                        │
│              │                                                          │
│ Idioma:      │                                                          │
│ [✓] PT-BR    │                                                          │
│ [✓] EN       │                                                          │
│              │                                                          │
│ Status:      │                                                          │
│ [✓] Pronto   │                                                          │
│ [ ] Process. │                                                          │
│              │                                                          │
│ [Limpar]     │                                                          │
└──────────────┴──────────────────────────────────────────────────────────┘
```

### 8.2 Card de Vídeo no Grid

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │   [Thumbnail]           │ │
│ │                         │ │
│ │   ▶ 12:30               │ │ ← Duração no canto
│ └─────────────────────────┘ │
│                             │
│ Introdução ao React         │ ← Título (truncado)
│ João Silva                  │ ← Instrutor
│ React, JavaScript           │ ← Tags
│                             │
│ 🎯 Usado em 5 trilhas       │ ← Estatística
│                             │
│ [Ver Detalhes]              │
└─────────────────────────────┘
```

**Estados:**
- **Normal**: Borda cinza clara
- **Hover**: Elevação, borda azul clara
- **Selecionado**: Borda azul, background azul claro

### 8.3 Busca e Filtros

**Barra de Busca:**
```
┌─────────────────────────────────────────┐
│ 🔍 Buscar por título, ID, tag...        │
└─────────────────────────────────────────┘
```

**Funcionalidade:**
- Busca em tempo real (debounce 300ms)
- Busca em: Título, Descrição, Tags, Instrutor, ID
- Highlight de termos encontrados
- Sugestões de busca (autocomplete)

**Filtros Laterais:**

**1. Instrutor:**
```
Instrutor:
[Todos                    ▼]
  ├─ Todos (156)
  ├─ João Silva (45)
  ├─ Maria Santos (32)
  ├─ Pedro Costa (28)
  └─ Outros (51)
```

**2. Tema/Categoria:**
```
Tema:
[Todos                    ▼]
  ├─ Todos (156)
  ├─ React (45)
  ├─ JavaScript (38)
  ├─ TypeScript (25)
  ├─ Node.js (22)
  └─ Outros (26)
```

**3. Duração:**
```
Duração:
[✓] Menos de 5 minutos (23)
[✓] 5 a 15 minutos (67)
[✓] 15 a 30 minutos (45)
[✓] Mais de 30 minutos (21)
```

**4. Idioma:**
```
Idioma:
[✓] Português (BR) (120)
[✓] Inglês (36)
```

**5. Status:**
```
Status:
[✓] Pronto (150)
[ ] Processando (6)
```

**6. Ordenação:**
```
Ordenar por:
[Mais recentes           ▼]
  ├─ Mais recentes
  ├─ Mais antigos
  ├─ Título (A-Z)
  ├─ Duração (menor)
  ├─ Duração (maior)
  └─ Mais usados
```

### 8.4 Painel de Detalhes do Vídeo

**Quando usuário clica em "Ver Detalhes":**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Voltar aos Resultados                                             [X] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐   │
│ │                                                                   │   │
│ │                    [Player de Preview]                            │   │
│ │                                                                   │   │
│ │                    ▶ Reproduzir                                   │   │
│ │                                                                   │   │
│ └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│ Introdução ao React                                                     │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ 📊 Informações                                                          │
│ • Duração: 12 minutos e 30 segundos                                     │
│ • Instrutor: João Silva                                                 │
│ • Idioma: Português (BR)                                                │
│ • Legendas: PT-BR, EN                                                   │
│ • Adicionado em: 15/03/2026                                             │
│ • Última atualização: 20/03/2026                                        │
│                                                                         │
│ 📝 Descrição                                                            │
│ Neste vídeo, você aprenderá os conceitos fundamentais do React,         │
│ incluindo componentes, JSX e o virtual DOM. Ideal para iniciantes.      │
│                                                                         │
│ 🏷️ Tags                                                                 │
│ [React] [JavaScript] [Frontend] [Iniciante]                             │
│                                                                         │
│ 📈 Estatísticas de Uso                                                  │
│ • Usado em 5 trilhas                                                    │
│ • Visualizado por 1.234 alunos                                          │
│ • Avaliação média: 4.8/5 (156 avaliações)                               │
│                                                                         │
│ 📚 Usado nas Trilhas:                                                   │
│ • Fundamentos de React                                                  │
│ • JavaScript Moderno                                                    │
│ • Frontend Completo                                                     │
│ [Ver todas]                                                             │
│                                                                         │
│                                    [Selecionar Este Vídeo]              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.5 Configuração do Vídeo Selecionado

**Após clicar em "Selecionar Este Vídeo":**

```
┌─────────────────────────────────────────┐
│ Configurar Vídeo                    [X] │
│ ─────────────────────────────────────   │
│                                         │
│ ✓ Vídeo selecionado:                    │
│ "Introdução ao React" (12:30)           │
│                                         │
│ ▼ Configurações Avançadas (Opcional)    │
│                                         │
│   Reproduzir apenas um trecho:          │
│   [✓] Ativar                            │
│                                         │
│   Início: [00:00:00]  Fim: [00:12:30]   │
│   ────────────────────────────────────  │
│   [========|==================|=====]   │
│   0:00    1:30              10:00 12:30 │
│                                         │
│   Legendas:                             │
│   [✓] Ativar legendas                   │
│   Idioma: [Português (BR)        ▼]     │
│                                         │
│   Notas do Instrutor (opcional):        │
│   ┌─────────────────────────────────┐   │
│   │ Observações sobre este vídeo... │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│         [Cancelar]  [Adicionar à Aula]  │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- **Trecho personalizado**: Permite usar apenas parte do vídeo
- **Slider visual**: Para selecionar início e fim
- **Preview**: Botão para testar o trecho selecionado
- **Legendas**: Ativar/desativar e escolher idioma
- **Notas**: Campo livre para observações internas

### 8.6 Vídeo Adicionado à Aula

**Visual no Editor:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⋮⋮ BLOCO 1: Vídeo                                              [⋮]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐   │
│ │                                                                   │   │
│ │                    [Thumbnail do Vídeo]                           │   │
│ │                                                                   │   │
│ │                    ▶ 12:30                                        │   │
│ └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│ 🎥 Introdução ao React                                                  │
│ 👤 João Silva  •  12 min 30 seg  •  PT-BR                              │
│                                                                         │
│ ⚙️ Configurações:                                                       │
│ • Trecho: 00:00 - 12:30 (vídeo completo)                                │
│ • Legendas: Ativadas (PT-BR)                                            │
│                                                                         │
│ [▶ Preview] [✏️ Editar] [🔄 Trocar Vídeo] [🗑️ Remover]                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.7 Trocar Vídeo

**Fluxo:**
1. Usuário clica em "Trocar Vídeo"
2. Modal de biblioteca abre novamente
3. Vídeo atual destacado
4. Ao selecionar novo vídeo, substitui o anterior
5. Configurações são mantidas (se aplicáveis)

### 8.8 Estados Especiais

**Vídeo em Processamento:**
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │   [Thumbnail genérico]  │ │
│ │                         │ │
│ │   ⏳ Processando...     │ │
│ └─────────────────────────┘ │
│                             │
│ Novo Vídeo de React         │
│ João Silva                  │
│                             │
│ ⚠️ Vídeo em processamento   │
│ Disponível em ~10 minutos   │
│                             │
│ [Notificar quando pronto]   │
└─────────────────────────────┘
```

**Vídeo Indisponível:**
```
┌─────────────────────────────────────────┐
│ ⋮⋮ BLOCO 1: Vídeo                  [⋮] │
├─────────────────────────────────────────┤
│                                         │
│ ⚠️ Vídeo Indisponível                   │
│                                         │
│ O vídeo "Introdução ao React" não está  │
│ mais disponível na biblioteca.          │
│                                         │
│ [🔄 Selecionar Outro Vídeo]             │
│ [🗑️ Remover Este Bloco]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 8.9 Busca Avançada

**Filtros Combinados:**
```
Busca: "react hooks"
Instrutor: João Silva
Duração: 5-15 minutos
Idioma: PT-BR
Status: Pronto

Resultados: 8 vídeos encontrados
```

**Busca por ID:**
```
Busca: "#VID-12345"

Resultado exato:
┌─────────────────────────────┐
│ ID: VID-12345               │
│ Introdução ao React         │
│ [Ver Detalhes]              │
└─────────────────────────────┘
```

### 8.10 Performance e UX

**Otimizações:**
- **Lazy loading**: Carregar thumbnails sob demanda
- **Infinite scroll**: Carregar mais vídeos ao rolar
- **Cache**: Manter resultados de busca em cache
- **Debounce**: Busca com delay de 300ms

**Indicadores:**
- Skeleton loading enquanto carrega
- Contador de resultados
- Mensagem se nenhum resultado encontrado

**Empty State:**
```
┌─────────────────────────────────────────┐
│                                         │
│              🔍                         │
│                                         │
│     Nenhum vídeo encontrado             │
│                                         │
│ Tente ajustar os filtros ou buscar      │
│ por outros termos.                      │
│                                         │
│         [Limpar Filtros]                │
│                                         │
└─────────────────────────────────────────┘
```

---


## 9. CRIAÇÃO E EDIÇÃO DE QUIZZES

### 9.1 Interface de Criação de Quiz

**Bloco de Quiz Vazio:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⋮⋮ BLOCO 3: Quiz                                                   [⋮] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ✅ Novo Quiz                                                            │
│                                                                         │
│ Título do Quiz (opcional):                                              │
│ [Teste seus conhecimentos                                            ]  │
│                                                                         │
│ Descrição (opcional):                                                   │
│ [Responda as questões abaixo para verificar seu aprendizado...       ]  │
│                                                                         │
│ ⚙️ Configurações:                                                       │
│ • Nota de aprovação: [70] %                                             │
│ • [✓] Mostrar feedback imediatamente                                    │
│ • [✓] Permitir refazer                                                  │
│ • Máximo de tentativas: [3] (0 = ilimitado)                             │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ 📝 Questões (0)                                                         │
│                                                                         │
│              [+ Adicionar Primeira Questão]                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Card de Questão

**Questão de Múltipla Escolha:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⋮⋮ QUESTÃO 1                                          [Duplicar] [⋮]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Tipo: [Múltipla Escolha ▼]  Pontos: [1]                                │
│                                                                         │
│ Enunciado:                                                              │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [B] [I] [U] [</>]                                                   │ │
│ │                                                                     │ │
│ │ O que é JSX?                                                        │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Alternativas:                                                           │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ● A) [Uma extensão de sintaxe para JavaScript              ] ✓     │ │
│ │      ▼ Feedback (opcional)                                          │ │
│ │      [Correto! JSX permite escrever HTML no JavaScript...]          │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ○ B) [Uma biblioteca de componentes                        ]       │ │
│ │      ▼ Feedback (opcional)                                          │
│ │      [Não exatamente. JSX é uma sintaxe, não uma biblioteca...]     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ○ C) [Um framework JavaScript                              ]       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ○ D) [Uma linguagem de programação                         ]       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ [+ Adicionar Alternativa] (máx. 6)                                      │
│                                                                         │
│ ▼ Explicação Detalhada (mostrada após resposta)                        │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ JSX (JavaScript XML) é uma extensão de sintaxe que permite          │ │
│ │ escrever código que se parece com HTML dentro do JavaScript...      │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│                                                    [Remover Questão]    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Questão Verdadeiro/Falso:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⋮⋮ QUESTÃO 2                                          [Duplicar] [⋮]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Tipo: [Verdadeiro/Falso ▼]  Pontos: [1]                                │
│                                                                         │
│ Enunciado:                                                              │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ React é uma biblioteca JavaScript para construir interfaces.       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Resposta Correta:                                                       │
│ ● Verdadeiro                                                            │
│ ○ Falso                                                                 │
│                                                                         │
│ ▼ Explicação                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Correto! React é uma biblioteca JavaScript desenvolvida pelo        │ │
│ │ Facebook para criar interfaces de usuário...                        │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│                                                    [Remover Questão]    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Questão de Seleção Múltipla:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⋮⋮ QUESTÃO 3                                          [Duplicar] [⋮]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Tipo: [Seleção Múltipla ▼]  Pontos: [2]                                │
│                                                                         │
│ Enunciado:                                                              │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Quais são características do React? (Selecione todas as corretas)  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Alternativas:                                                           │
│                                                                         │
│ ☑ A) [Baseado em componentes                                ] ✓        │
│ ☑ B) [Usa Virtual DOM                                       ] ✓        │
│ ☐ C) [É um framework full-stack                             ]          │
│ ☑ D) [Suporta JSX                                           ] ✓        │
│                                                                         │
│ ⚠️ 3 alternativas corretas selecionadas                                 │
│                                                                         │
│ ▼ Explicação                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ React é baseado em componentes, usa Virtual DOM e suporta JSX...    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│                                                    [Remover Questão]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Adicionar Nova Questão

**Botão de Adicionar:**
```
┌─────────────────────────────────────────┐
│ [+ Adicionar Questão]                   │
│                                         │
│ Escolha o tipo:                         │
│ ┌─────────────────────────────────────┐ │
│ │ ○ Múltipla Escolha                  │ │
│ │   Uma resposta correta              │ │
│ ├─────────────────────────────────────┤ │
│ │ ○ Verdadeiro/Falso                  │ │
│ │   Resposta binária                  │ │
│ ├─────────────────────────────────────┤ │
│ │ ○ Seleção Múltipla                  │ │
│ │   Múltiplas respostas corretas      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancelar]  [Criar Questão]             │
└─────────────────────────────────────────┘
```

### 9.4 Reordenar Questões

**Drag-and-Drop:**
```
┌─────────────────────────────────────────┐
│ 📝 Questões (5)                         │
│                                         │
│ ⋮⋮ QUESTÃO 1: O que é JSX?             │
│ ⋮⋮ QUESTÃO 2: React é uma biblioteca?  │
│ ⋮⋮ QUESTÃO 3: Características do React │
│ ⋮⋮ QUESTÃO 4: Virtual DOM              │
│ ⋮⋮ QUESTÃO 5: Componentes               │
│                                         │
│ [+ Adicionar Questão]                   │
└─────────────────────────────────────────┘
```

**Modo de Reordenação:**
```
┌─────────────────────────────────────────┐
│ Reordenar Questões  [Aplicar] [Cancelar]│
│                                         │
│ [1] ⋮⋮ O que é JSX?                     │
│ [2] ⋮⋮ React é uma biblioteca?          │
│ [3] ⋮⋮ Características do React         │
│ [4] ⋮⋮ Virtual DOM                      │
│ [5] ⋮⋮ Componentes                      │
└─────────────────────────────────────────┘
```

### 9.5 Preview do Quiz

**Botão de Preview:**
```
[👁 Visualizar Quiz]
```

**Modal de Preview:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Preview do Quiz                                                     [X] │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ Teste seus conhecimentos                                                │
│ Responda as questões abaixo para verificar seu aprendizado              │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ Questão 1 de 5                                                          │
│                                                                         │
│ O que é JSX?                                                            │
│                                                                         │
│ ○ A) Uma extensão de sintaxe para JavaScript                           │
│ ○ B) Uma biblioteca de componentes                                      │
│ ○ C) Um framework JavaScript                                            │
│ ○ D) Uma linguagem de programação                                       │
│                                                                         │
│                                    [Anterior]  [Próxima]                │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│ Progresso: ▓▓░░░░░░░░ 1/5                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.6 Validações

**Validações em Tempo Real:**

**Quiz Incompleto:**
```
⚠️ Quiz Incompleto
• Adicione pelo menos 1 questão
• Configure a nota de aprovação
```

**Questão Inválida:**
```
⚠️ Questão 2: Problemas Encontrados
• Enunciado está vazio
• Nenhuma alternativa marcada como correta
• Alternativa C está vazia
```

**Indicadores Visuais:**
```
┌─────────────────────────────────────────┐
│ ⋮⋮ QUESTÃO 2                       ⚠️  │ ← Badge de aviso
│ ─────────────────────────────────────   │
│ ⚠️ Esta questão tem problemas:          │
│ • Enunciado vazio                       │
│ • Sem resposta correta                  │
└─────────────────────────────────────────┘
```

### 9.7 Configurações Avançadas

**Painel de Configurações:**
```
┌─────────────────────────────────────────┐
│ ⚙️ Configurações do Quiz                │
│ ─────────────────────────────────────   │
│                                         │
│ Nota de Aprovação:                      │
│ [70] % ────────────────────────         │
│ 0%                              100%    │
│                                         │
│ Feedback:                               │
│ ● Mostrar imediatamente após resposta   │
│ ○ Mostrar apenas no final               │
│ ○ Não mostrar feedback                  │
│                                         │
│ Tentativas:                             │
│ [✓] Permitir refazer                    │
│ Máximo de tentativas: [3]               │
│ (0 = ilimitado)                         │
│                                         │
│ Ordem das Questões:                     │
│ ○ Ordem fixa                            │
│ ● Ordem aleatória                       │
│                                         │
│ Ordem das Alternativas:                 │
│ ○ Ordem fixa                            │
│ ● Ordem aleatória                       │
│                                         │
│ Tempo Limite (opcional):                │
│ [ ] Ativar tempo limite                 │
│ [30] minutos                            │
│                                         │
│ ▼ Opções Avançadas                      │
│   Banco de Questões:                    │
│   [ ] Selecionar X questões aleatórias  │
│       de um banco maior                 │
│                                         │
│   Peso das Questões:                    │
│   [ ] Questões têm pesos diferentes     │
│                                         │
│   Penalidade por Erro:                  │
│   [ ] Descontar pontos por erro         │
│                                         │
└─────────────────────────────────────────┘
```

### 9.8 Duplicar Questão

**Funcionalidade:**
- Botão "Duplicar" em cada questão
- Cria cópia exata abaixo da original
- Título vira "Questão X (Cópia)"
- Usuário pode editar imediatamente

### 9.9 Importar/Exportar Questões

**Importar:**
```
┌─────────────────────────────────────────┐
│ Importar Questões                   [X] │
│ ─────────────────────────────────────   │
│                                         │
│ Formato:                                │
│ ● JSON                                  │
│ ○ CSV                                   │
│ ○ Texto (formato específico)            │
│                                         │
│ [Selecionar Arquivo]                    │
│                                         │
│ ou                                      │
│                                         │
│ [Colar Conteúdo]                        │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancelar]  [Importar]                  │
└─────────────────────────────────────────┘
```

**Exportar:**
```
[⋮] Menu do Quiz
  ├─ Exportar como JSON
  ├─ Exportar como CSV
  ├─ Exportar como PDF (para impressão)
  └─ Copiar para Área de Transferência
```

### 9.10 Banco de Questões (Avançado)

**Conceito:**
- Criar banco com mais questões do que serão mostradas
- Sistema seleciona X questões aleatórias
- Cada aluno vê quiz diferente

**Interface:**
```
┌─────────────────────────────────────────┐
│ ⚙️ Banco de Questões                    │
│ ─────────────────────────────────────   │
│                                         │
│ [✓] Usar banco de questões              │
│                                         │
│ Total de questões no banco: 15          │
│ Questões por tentativa: [5]             │
│                                         │
│ Seleção:                                │
│ ● Aleatória                             │
│ ○ Balanceada por dificuldade            │
│ ○ Balanceada por tópico                 │
│                                         │
│ 📊 Distribuição Atual:                  │
│ • Fácil: 5 questões                     │
│ • Médio: 7 questões                     │
│ • Difícil: 3 questões                   │
└─────────────────────────────────────────┘
```

### 9.11 Estatísticas do Quiz (Pós-Publicação)

**Painel de Analytics:**
```
┌─────────────────────────────────────────┐
│ 📊 Estatísticas do Quiz                 │
│ ─────────────────────────────────────   │
│                                         │
│ Tentativas: 234                         │
│ Taxa de aprovação: 78%                  │
│ Nota média: 8.2/10                      │
│                                         │
│ Questões mais difíceis:                 │
│ 1. Questão 3 (45% de acerto)            │
│ 2. Questão 5 (52% de acerto)            │
│ 3. Questão 1 (61% de acerto)            │
│                                         │
│ [Ver Relatório Completo]                │
└─────────────────────────────────────────┘
```

---

