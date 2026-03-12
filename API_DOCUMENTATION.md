# StudAI - Documentação da API

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Modelos de Dados](#modelos-de-dados)
- [API Layer](#api-layer)
- [Hooks React Query](#hooks-react-query)
- [Motor de IA](#motor-de-ia)
- [Limites e Rate Limiting](#limites-e-rate-limiting)
- [Erros](#erros)
- [Exemplos](#exemplos)

---

## 🎯 Visão Geral

A API do StudAI é construída sobre AWS Amplify Gen 2 com GraphQL (AppSync) e segue o padrão owner-based access control. Todas as operações requerem autenticação via AWS Cognito.

### Arquitetura

```
Component → Hook → API Layer → Amplify Client → AWS AppSync → DynamoDB
```

### Tecnologias
- **GraphQL** - Query language
- **AWS AppSync** - GraphQL API
- **AWS Cognito** - Authentication
- **DynamoDB** - Database
- **TanStack Query** - Data fetching

---

## 🔐 Autenticação

### AWS Cognito

Todas as requisições requerem um token JWT válido obtido via AWS Cognito.

```typescript
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

// Login
await signIn({ username, password });

// Logout
await signOut();

// Get current user
const user = await getCurrentUser();
```

### Owner-based Access Control

Todos os modelos usam `owner` field para controle de acesso:

```graphql
type Track @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  owner: String
  # ...
}
```

Usuários só podem acessar seus próprios dados.

---

## 📊 Modelos de Dados

### Core Models (10)

#### 1. UserProfile
Perfil completo do usuário.

```typescript
interface UserProfile {
  id: string;
  owner: string;
  displayName: string;
  locale: string;
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}
```

#### 2. Track
Trilha de aprendizado.

```typescript
interface Track {
  id: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  tags: string[];
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}
```

#### 3. Module
Módulo de conteúdo.

```typescript
interface Module {
  id: string;
  owner: string;
  trackId: string;
  title: string;
  description: string;
  order: number;
  contents: Content[];
  createdAt: string;
  updatedAt: string;
}
```

#### 4. Content
Conteúdo de aprendizado.

```typescript
interface Content {
  id: string;
  owner: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'exercise' | 'quiz';
  url: string;
  duration: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

#### 5. StudySession
Sessão de estudo.

```typescript
interface StudySession {
  id: string;
  owner: string;
  type: 'ai_session' | 'quiz' | 'review' | 'reading' | 'practice';
  moduleId?: string;
  trackId?: string;
  contentId?: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  score?: number;
  xpEarned: number;
  tasksCompleted: number;
  notes?: string;
  createdAt: string;
}
```

#### 6. Quiz
Quiz interativo.

```typescript
interface Quiz {
  id: string;
  owner: string;
  moduleId?: string;
  contentId?: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}
```

#### 7. QuizAttempt
Tentativa de quiz.

```typescript
interface QuizAttempt {
  id: string;
  owner: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  createdAt: string;
}
```

#### 8. ReviewItem
Item para revisão espaçada.

```typescript
interface ReviewItem {
  id: string;
  owner: string;
  contentId: string;
  moduleId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReviewDate: string;
  reviewCount: number;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 9. Goal
Objetivo de aprendizado.

```typescript
interface Goal {
  id: string;
  owner: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  trackId?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 10. UserPlan
Plano de estudos do usuário.

```typescript
interface UserPlan {
  id: string;
  owner: string;
  goalId: string;
  weeklyHours: number;
  preferredDays: string[];
  preferredTimes: string[];
  tasks: DailyTask[];
  createdAt: string;
  updatedAt: string;
}
```

### AI Models (7)

#### 11. ResourceCatalog
Catálogo de recursos verificados.

```typescript
interface ResourceCatalog {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'docs' | 'repo' | 'playlist' | 'course';
  category: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'pt' | 'en';
  provider: string;
  verified: boolean;
  lastVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 12. AiUsage
Rastreamento de uso de IA.

```typescript
interface AiUsage {
  id: string;
  owner: string;
  feature: 'course_builder' | 'coach' | 'recommendations' | 'content_generation';
  tokensUsed: number;
  requestCount: number;
  periodDay: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}
```

#### 13. Subscription
Plano do usuário.

```typescript
interface Subscription {
  id: string;
  owner: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### 14. Course
Curso gerado por IA.

```typescript
interface Course {
  id: string;
  owner: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  modules: CourseModule[];
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### 15. CourseModule
Módulo de curso.

```typescript
interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  tasks: CourseTask[];
  resources: string[]; // URLs from ResourceCatalog
  createdAt: string;
  updatedAt: string;
}
```

#### 16. CourseTask
Tarefa de módulo.

```typescript
interface CourseTask {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'reading' | 'video' | 'exercise' | 'project' | 'quiz';
  estimatedMinutes: number;
  order: number;
  resources: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### 17. UserCourse
Inscrição em curso.

```typescript
interface UserCourse {
  id: string;
  owner: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedModules: string[];
  completedTasks: string[];
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔧 API Layer

### Padrão de API

Todas as APIs seguem o mesmo padrão:

```typescript
// src/api/[model].ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export const list[Model] = async () => {
  const result = await client.models.[Model].list();
  return result.data || [];
};

export const get[Model] = async (id: string) => {
  const result = await client.models.[Model].get({ id });
  return result.data;
};

export const create[Model] = async (input: Create[Model]Input) => {
  const result = await client.models.[Model].create(input);
  return result.data;
};

export const update[Model] = async (input: Update[Model]Input) => {
  const result = await client.models.[Model].update(input);
  return result.data;
};

export const delete[Model] = async (id: string) => {
  const result = await client.models.[Model].delete({ id });
  return result.data;
};
```

### APIs Disponíveis

1. **track.ts** - Trilhas
2. **module.ts** - Módulos
3. **content.ts** - Conteúdos
4. **study-session.ts** - Sessões
5. **quiz.ts** - Quizzes
6. **quiz-attempt.ts** - Tentativas
7. **review-item.ts** - Revisões
8. **goal.ts** - Objetivos
9. **user-plan.ts** - Planos
10. **calendar-event.ts** - Eventos
11. **ranking-entry.ts** - Ranking
12. **daily-task.ts** - Tarefas
13. **user-profile.ts** - Perfil
14. **resource-catalog.ts** - Recursos
15. **ai-usage.ts** - Uso de IA
16. **subscription.ts** - Assinaturas
17. **course.ts** - Cursos
18. **user-course.ts** - Inscrições

### API Especial: Resource Catalog Search

```typescript
// src/api/resource-catalog-search.ts

export interface ResourceSearchParams {
  tags?: string[];
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  language?: 'pt' | 'en';
  type?: 'video' | 'article' | 'docs' | 'repo' | 'playlist' | 'course';
  verified?: boolean;
  provider?: string;
}

export const searchResources = async (params: ResourceSearchParams) => {
  // Busca com filtros avançados
};

export const searchResourcesByKeyword = async (keyword: string, language: 'pt' | 'en' = 'pt') => {
  // Busca por palavra-chave
};

export const getResourcesByTags = async (tags: string[], language: 'pt' | 'en' = 'pt') => {
  // Busca por tags
};

export const getResourcesForTopic = async (
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  language: 'pt' | 'en' = 'pt',
  limit: number = 10
) => {
  // Busca por tópico e nível
};

export const getTeoMeWhyResources = async (topic?: string) => {
  // Recursos do TeoMeWhy
};

export const verifyUrl = async (url: string) => {
  // Verificar URL individual
};

export const verifyUrls = async (urls: string[]) => {
  // Verificar múltiplas URLs
};

export const getVerifiedResource = async (url: string) => {
  // Recurso com verificação
};
```

---

## 🪝 Hooks React Query

### Padrão de Hook

```typescript
// src/hooks/[model]/use-list-[model].ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { list[Model] } from "@/api/[model]";

export const list[Model]QueryOptions = () =>
  queryOptions({
    queryKey: ["[model]", "list"],
    queryFn: async () => {
      try {
        return await list[Model]();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useList[Model] = () => useQuery(list[Model]QueryOptions());
```

### Hooks Disponíveis (48 total)

#### Track Hooks (6)
- `useListTracks()` - Listar trilhas
- `useTrack(id)` - Obter trilha
- `useCreateTrack()` - Criar trilha
- `useUpdateTrack()` - Atualizar trilha
- `useDeleteTrack()` - Deletar trilha
- `useFavouriteTrack()` - Favoritar trilha

#### Module Hooks (6)
- `useListModules()` - Listar módulos
- `useModule(id)` - Obter módulo
- `useCreateModule()` - Criar módulo
- `useUpdateModule()` - Atualizar módulo
- `useDeleteModule()` - Deletar módulo
- `useCompleteModule()` - Completar módulo

#### Content Hooks (6)
- `useListContents()` - Listar conteúdos
- `useContent(id)` - Obter conteúdo
- `useCreateContent()` - Criar conteúdo
- `useUpdateContent()` - Atualizar conteúdo
- `useDeleteContent()` - Deletar conteúdo
- `useToggleContentCompletion()` - Toggle completado

#### Course Hooks (4)
- `useListCourses()` - Listar cursos
- `useCourse(id)` - Obter curso
- `useCreateCourse()` - Criar curso
- `useUpdateCourse()` - Atualizar curso

#### User Course Hooks (3)
- `useListUserCourses()` - Listar inscrições
- `useCreateUserCourse()` - Inscrever em curso
- `useUpdateUserCourse()` - Atualizar progresso

#### Resource Catalog Hooks (5)
- `useSearchResources(params)` - Buscar recursos
- `useSearchResourcesByKeyword(keyword)` - Buscar por keyword
- `useGetResourcesByTags(tags)` - Buscar por tags
- `useGetResourcesForTopic(topic, level)` - Buscar por tópico
- `useGetTeoMeWhyResources(topic?)` - Recursos TeoMeWhy

#### AI Usage Hooks (2)
- `useListAiUsage()` - Listar uso
- `useCreateAiUsage()` - Registrar uso

#### Subscription Hooks (2)
- `useListSubscriptions()` - Listar assinaturas
- `useCreateSubscription()` - Criar assinatura

#### AI Hooks (9)
- `useCheckPlanLimit(feature)` - Verificar limite
- `useGetUsageStats(feature)` - Estatísticas de uso
- `useCanUseFeature(feature)` - Pode usar feature
- `useGenerateCourse(input)` - Gerar curso
- `useEnrichCourseWithResources(course)` - Enriquecer curso
- `useValidateCourse(course)` - Validar curso
- `useGetRecommendations(context)` - Obter recomendações
- `useGetResourceRecommendations(topic, level)` - Recomendações de recursos
- `useGetNextSteps(userId)` - Próximos passos

#### Outros Hooks (5+)
- `useMyProfile()` - Perfil do usuário
- `useUpdateProfile()` - Atualizar perfil
- `useMyPlan()` - Plano do usuário
- `useUpdatePlan()` - Atualizar plano
- E mais...

---

## 🤖 Motor de IA

### Plan Guard

Middleware para verificação de limites de plano.

```typescript
// src/lib/ai/plan-guard.ts

export const checkPlanLimit = async (
  userId: string,
  feature: FeatureType,
  plan: PlanType
): Promise<PlanLimitCheckResult> => {
  // Verifica se usuário pode usar feature
  // Retorna: { allowed: boolean, usage: number, limit: number, resetAt: Date }
};

export const incrementUsage = async (
  userId: string,
  feature: FeatureType,
  amount: number = 1
): Promise<void> => {
  // Incrementa contador de uso
};

export const getUsageStats = async (
  userId: string,
  feature: FeatureType
): Promise<UsageStats> => {
  // Retorna estatísticas de uso
};
```

### Course Generator

Gerador de cursos com IA.

```typescript
// src/lib/ai/course-generator.ts

export interface CourseGenerationInput {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  userId: string;
}

export const generateCourse = async (
  input: CourseGenerationInput
): Promise<GeneratedCourse> => {
  // 1. Verificar limites do plano
  // 2. Gerar estrutura do curso com IA
  // 3. Enriquecer com recursos verificados
  // 4. Registrar uso
  // 5. Retornar curso gerado
};

export const enrichCourseWithResources = async (
  course: GeneratedCourse
): Promise<EnrichedCourse> => {
  // Adiciona recursos verificados do catálogo
};

export const validateCourse = (course: GeneratedCourse): ValidationResult => {
  // Valida estrutura do curso
};
```

### Recommendations

Sistema de recomendações.

```typescript
// src/lib/ai/recommendations.ts

export interface RecommendationContext {
  userId: string;
  currentTrack?: string;
  completedModules: string[];
  interests: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const getRecommendations = async (
  context: RecommendationContext
): Promise<Recommendation[]> => {
  // 1. Verificar limites do plano
  // 2. Analisar contexto do usuário
  // 3. Gerar recomendações com IA
  // 4. Enriquecer com recursos
  // 5. Registrar uso
  // 6. Retornar recomendações
};

export const getResourceRecommendations = async (
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  language: 'pt' | 'en' = 'pt'
): Promise<ResourceCatalog[]> => {
  // Recomendações de recursos do catálogo
};

export const getNextSteps = async (userId: string): Promise<NextStep[]> => {
  // Próximos passos recomendados
};
```

---

## ⚡ Limites e Rate Limiting

### Limites por Plano

```typescript
// amplify/data/config/plan-limits.ts

export const PLAN_LIMITS = {
  free: {
    courseDraftsPerWeek: 2,
    coursePublishPerMonth: 1,
    coachMessagesPerDay: 10,
    coachTokensPerDay: 50000,
    recommendationsPerDay: 5,
    contentGenerationsPerDay: 3,
    webSearchEnabled: false,
    maxTokensPerRequest: 4000,
    requestsPerMinute: 5,
  },
  pro: {
    courseDraftsPerWeek: 50,
    coursePublishPerMonth: 20,
    coachMessagesPerDay: 200,
    coachTokensPerDay: 1000000,
    recommendationsPerDay: 100,
    contentGenerationsPerDay: 50,
    webSearchEnabled: true,
    maxTokensPerRequest: 16000,
    requestsPerMinute: 30,
  },
};
```

### Verificação de Limites

```typescript
// Exemplo de uso
const result = await checkPlanLimit(userId, 'course_builder', 'free');

if (!result.allowed) {
  throw new Error(`Limite atingido: ${result.usage}/${result.limit}`);
}

// Prosseguir com operação
await generateCourse(input);

// Incrementar contador
await incrementUsage(userId, 'course_builder');
```

---

## ❌ Erros

### Códigos de Erro

```typescript
export const PLAN_LIMIT_ERRORS = {
  LIMIT_REACHED: 'PLAN_LIMIT_REACHED',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_PLAN: 'INVALID_PLAN',
};
```

### Estrutura de Erro

```typescript
interface PlanLimitError {
  code: PlanLimitErrorCode;
  message: string;
  feature: FeatureType;
  currentPlan: PlanType;
  limit: number;
  used: number;
  resetAt: string; // ISO timestamp
  upgradeCta: boolean;
}
```

### Tratamento de Erros

```typescript
try {
  await generateCourse(input);
} catch (error) {
  if (error.code === 'PLAN_LIMIT_REACHED') {
    // Mostrar mensagem de upgrade
    showUpgradeModal(error);
  } else {
    // Erro genérico
    showErrorToast(error.message);
  }
}
```

---

## 💡 Exemplos

### Exemplo 1: Criar Trilha

```typescript
import { useCreateTrack } from '@/hooks/track/use-create-track';

function CreateTrackForm() {
  const createTrack = useCreateTrack();

  const handleSubmit = async (data) => {
    try {
      await createTrack.mutateAsync({
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        estimatedHours: data.estimatedHours,
        tags: data.tags,
      });
      
      toast.success('Trilha criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar trilha');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Exemplo 2: Gerar Curso com IA

```typescript
import { useGenerateCourse } from '@/hooks/ai/use-course-generator';
import { useCheckPlanLimit } from '@/hooks/ai/use-plan-guard';

function CourseBuilderPage() {
  const generateCourse = useGenerateCourse();
  const { data: canUse } = useCheckPlanLimit('course_builder');

  const handleGenerate = async (input) => {
    if (!canUse?.allowed) {
      showUpgradeModal();
      return;
    }

    try {
      const course = await generateCourse.mutateAsync(input);
      setCoursePreview(course);
    } catch (error) {
      if (error.code === 'PLAN_LIMIT_REACHED') {
        showUpgradeModal();
      } else {
        toast.error('Erro ao gerar curso');
      }
    }
  };

  return <form onSubmit={handleGenerate}>...</form>;
}
```

### Exemplo 3: Buscar Recursos

```typescript
import { useSearchResourcesByKeyword } from '@/hooks/resource-catalog/use-search-resources';

function ResourcesPage() {
  const [keyword, setKeyword] = useState('python');
  const { data: resources, isLoading } = useSearchResourcesByKeyword(keyword);

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Buscar recursos..."
      />
      
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {resources?.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Exemplo 4: Verificar Progresso

```typescript
import { useMyProfile } from '@/hooks/user-profile/use-my-profile';
import { useListUserCourses } from '@/hooks/user-course/use-list-user-courses';

function DashboardPage() {
  const { data: profile } = useMyProfile();
  const { data: courses } = useListUserCourses();

  const totalProgress = courses?.reduce((sum, c) => sum + c.progress, 0) / courses?.length || 0;

  return (
    <div>
      <h1>Olá, {profile?.displayName}!</h1>
      <p>Nível: {profile?.level}</p>
      <p>XP: {profile?.xp}</p>
      <p>Streak: {profile?.streak} dias</p>
      <p>Progresso médio: {totalProgress.toFixed(1)}%</p>
    </div>
  );
}
```

---

## 📚 Recursos Adicionais

### Documentação Relacionada
- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Status da implementação
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Guia de testes
- [BUILD_VALIDATION.md](BUILD_VALIDATION.md) - Validação de build
- [README.md](README.md) - Documentação geral

### Links Externos
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [TanStack Query Docs](https://tanstack.com/query)
- [GraphQL Docs](https://graphql.org/learn/)

---

**Última Atualização:** 20/02/2026
**Versão:** 1.0.0
