# StudAI - Guia de Implementação do Motor de IA

## ✅ PARTE 1 COMPLETA: Modelos de Dados

### O que foi feito:
1. ✅ 7 novos modelos GraphQL adicionados ao Amplify
2. ✅ 7 tipos TypeScript criados
3. ✅ 5 arquivos de API criados
4. ✅ 12 hooks React Query criados
5. ✅ Sistema de prompts canônicos definido
6. ✅ Configuração de limites por plano (Free vs Pro)
7. ✅ Build passando sem erros

### Arquivos Criados:

**Modelos GraphQL:**
- `amplify/data/resource.ts` - ResourceCatalog, AiUsage, Subscription, Course, CourseModule, CourseTask, UserCourse

**Tipos TypeScript:**
- `src/model/resource-catalog.ts`
- `src/model/ai-usage.ts`
- `src/model/subscription.ts`
- `src/model/course.ts`
- `src/model/course-module.ts`
- `src/model/course-task.ts`
- `src/model/user-course.ts`

**API Layer:**
- `src/api/resource-catalog.ts`
- `src/api/ai-usage.ts`
- `src/api/subscription.ts`
- `src/api/course.ts`
- `src/api/user-course.ts`

**Hooks:**
- `src/hooks/resource-catalog/use-list-resource-catalog.ts`
- `src/hooks/ai-usage/use-list-ai-usage.ts`
- `src/hooks/ai-usage/use-create-ai-usage.ts`
- `src/hooks/subscription/use-list-subscriptions.ts`
- `src/hooks/subscription/use-create-subscription.ts`
- `src/hooks/course/use-list-courses.ts`
- `src/hooks/course/use-course.ts`
- `src/hooks/course/use-create-course.ts`
- `src/hooks/course/use-update-course.ts`
- `src/hooks/user-course/use-list-user-courses.ts`
- `src/hooks/user-course/use-create-user-course.ts`
- `src/hooks/user-course/use-update-user-course.ts`

**Configuração:**
- `amplify/data/chat/system-prompt.ts` - Prompts canônicos versionados
- `amplify/data/config/plan-limits.ts` - Limites por plano

---

## 📋 PRÓXIMOS PASSOS

### PARTE 2: Sistema de Verificação de Links

**Objetivo:** Garantir que todos os links retornados pela IA sejam reais e funcionais.

#### 2.1. Criar Serviço de Verificação de Links
**Arquivo:** `amplify/functions/link-verifier/handler.ts`

```typescript
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  const { url } = JSON.parse(event.body);
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        url,
        verified: response.ok,
        status: response.status,
        lastVerifiedAt: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        url,
        verified: false,
        error: error.message
      })
    };
  }
};
```

#### 2.2. Criar API de Busca no ResourceCatalog
**Arquivo:** `src/api/resource-catalog-search.ts`

```typescript
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface ResourceSearchParams {
  tags?: string[];
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  language?: "pt" | "en";
  type?: string;
  verified?: boolean;
}

export const searchResources = async (
  params: ResourceSearchParams
): Promise<Schema["ResourceCatalog"]["type"][]> => {
  // Implementar busca com filtros
  const result = await client.models.ResourceCatalog.list();
  
  if (!result.data) {
    return [];
  }
  
  // Filtrar resultados
  let filtered = result.data;
  
  if (params.verified !== undefined) {
    filtered = filtered.filter(r => r.verified === params.verified);
  }
  
  if (params.language) {
    filtered = filtered.filter(r => r.language === params.language);
  }
  
  if (params.level) {
    filtered = filtered.filter(r => r.level === params.level);
  }
  
  if (params.category) {
    filtered = filtered.filter(r => r.category === params.category);
  }
  
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter(r => 
      r.tags?.some(tag => params.tags!.includes(tag))
    );
  }
  
  return filtered;
};
```

#### 2.3. Criar Hook de Busca
**Arquivo:** `src/hooks/resource-catalog/use-search-resources.ts`

```typescript
import { useQuery, queryOptions } from "@tanstack/react-query";
import { searchResources, ResourceSearchParams } from "@/api/resource-catalog-search";

export const searchResourcesQueryOptions = (params: ResourceSearchParams) =>
  queryOptions({
    queryKey: ["resource-catalog", "search", params],
    queryFn: async () => {
      try {
        return await searchResources(params);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useSearchResources = (params: ResourceSearchParams) =>
  useQuery(searchResourcesQueryOptions(params));
```

---

### PARTE 3: Endpoints de IA + Middleware de Plano

**Objetivo:** Criar endpoints para geração de conteúdo com IA e enforcement de limites por plano.

#### 3.1. Criar Middleware de Verificação de Plano
**Arquivo:** `amplify/functions/middleware/plan-guard.ts`

```typescript
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../data/resource";
import {
  getPlanLimits,
  getDailyLimit,
  createPlanLimitError,
  getResetTime,
  getPeriodDay,
  PLAN_LIMIT_ERRORS,
  type PlanType,
  type FeatureType,
} from "../../../data/config/plan-limits";

const client = generateClient<Schema>();

export interface PlanGuardResult {
  allowed: boolean;
  error?: any;
  usage?: Schema["AiUsage"]["type"];
}

export async function checkPlanLimit(
  userId: string,
  feature: FeatureType
): Promise<PlanGuardResult> {
  // 1. Buscar subscription do usuário
  const subscriptions = await client.models.Subscription.list({
    filter: { owner: { eq: userId } },
  });

  const activeSub = subscriptions.data?.find(
    (s) => s.status === "active" || s.status === "trial"
  );

  const plan: PlanType = activeSub?.plan || "free";
  const limits = getPlanLimits(plan);
  const dailyLimit = getDailyLimit(plan, feature);

  // 2. Buscar uso do dia
  const today = getPeriodDay();
  const usageRecords = await client.models.AiUsage.list({
    filter: {
      owner: { eq: userId },
      periodDay: { eq: today },
      feature: { eq: feature },
    },
  });

  const todayUsage = usageRecords.data?.[0];
  const currentCount = todayUsage?.requestsCount || 0;

  // 3. Verificar limite
  if (currentCount >= dailyLimit) {
    return {
      allowed: false,
      error: createPlanLimitError(
        PLAN_LIMIT_ERRORS.LIMIT_REACHED,
        feature,
        plan,
        currentCount,
        getResetTime()
      ),
    };
  }

  return {
    allowed: true,
    usage: todayUsage || undefined,
  };
}

export async function incrementUsage(
  userId: string,
  feature: FeatureType,
  tokensIn: number,
  tokensOut: number
): Promise<void> {
  const today = getPeriodDay();

  // Buscar subscription
  const subscriptions = await client.models.Subscription.list({
    filter: { owner: { eq: userId } },
  });

  const activeSub = subscriptions.data?.find(
    (s) => s.status === "active" || s.status === "trial"
  );

  const plan: PlanType = activeSub?.plan || "free";

  // Buscar ou criar registro de uso
  const usageRecords = await client.models.AiUsage.list({
    filter: {
      owner: { eq: userId },
      periodDay: { eq: today },
      feature: { eq: feature },
    },
  });

  const existing = usageRecords.data?.[0];

  if (existing) {
    // Atualizar
    await client.models.AiUsage.update({
      id: existing.id,
      requestsCount: (existing.requestsCount || 0) + 1,
      tokensIn: (existing.tokensIn || 0) + tokensIn,
      tokensOut: (existing.tokensOut || 0) + tokensOut,
    });
  } else {
    // Criar
    await client.models.AiUsage.create({
      plan,
      periodDay: today,
      requestsCount: 1,
      tokensIn,
      tokensOut,
      feature,
    });
  }
}
```

#### 3.2. Criar Endpoint de Course Builder
**Arquivo:** `amplify/functions/ai/course-builder/handler.ts`

```typescript
import { Handler } from 'aws-lambda';
import { checkPlanLimit, incrementUsage } from '../../middleware/plan-guard';
import { COURSE_BUILDER_PROMPT } from '../../../data/chat/system-prompt';

export const handler: Handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const { objetivo, nivel, tempoDisponivel, prazo, area, idioma } = JSON.parse(event.body);
  
  // 1. Verificar limite do plano
  const guardResult = await checkPlanLimit(userId, 'course_builder');
  
  if (!guardResult.allowed) {
    return {
      statusCode: 402,
      body: JSON.stringify(guardResult.error)
    };
  }
  
  // 2. Chamar IA (Amazon Nova Micro ou outro modelo)
  // TODO: Implementar chamada real para o modelo
  const prompt = `${COURSE_BUILDER_PROMPT}

Inputs:
- Objetivo: ${objetivo}
- Nível: ${nivel}
- Tempo disponível: ${tempoDisponivel} min/dia
- Prazo: ${prazo}
- Área: ${area}
- Idioma: ${idioma}

Gere um curso completo em JSON.`;

  // Simulação (substituir por chamada real)
  const aiResponse = {
    title: "Curso Gerado",
    summary: "Resumo do curso",
    // ... resto do JSON
  };
  
  const tokensIn = 1000; // Calcular real
  const tokensOut = 2000; // Calcular real
  
  // 3. Incrementar uso
  await incrementUsage(userId, 'course_builder', tokensIn, tokensOut);
  
  // 4. Retornar resultado
  return {
    statusCode: 200,
    body: JSON.stringify({
      course: aiResponse,
      usage: {
        tokensIn,
        tokensOut,
        remaining: guardResult.usage ? 
          (guardResult.usage.requestsCount || 0) + 1 : 1
      }
    })
  };
};
```

#### 3.3. Criar Endpoints Adicionais
- `amplify/functions/ai/coach/handler.ts` - Chat com Coach IA
- `amplify/functions/ai/recommendations/handler.ts` - Recomendações personalizadas
- `amplify/functions/ai/content-generation/handler.ts` - Geração de conteúdo

---

### PARTE 4: UI do Course Builder

**Objetivo:** Criar interface para usuário gerar cursos com IA.

#### 4.1. Criar Rota /criar-curso
**Arquivo:** `src/routes/criar-curso.tsx`

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { CourseBuilderPage } from "@/components/course-builder/course-builder-page";

export const Route = createFileRoute("/criar-curso")({
  component: CourseBuilderPage,
});
```

#### 4.2. Criar Componente CourseBuilderPage
**Arquivo:** `src/components/course-builder/course-builder-page.tsx`

```typescript
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function CourseBuilderPage() {
  const [formData, setFormData] = useState({
    objetivo: "",
    nivel: "beginner",
    tempoDisponivel: 30,
    prazo: "",
    area: "",
    idioma: "pt",
  });

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Chamar endpoint /ai/course-builder
      const response = await fetch("/ai/course-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 402) {
        const errorData = await response.json();
        setError(errorData);
        return;
      }

      const data = await response.json();
      setCourse(data.course);
    } catch (err) {
      setError({ message: "Erro ao gerar curso" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Curso com IA</h1>

      {error && error.code === "PLAN_LIMIT_REACHED" && (
        <Card className="p-4 mb-6 bg-yellow-50">
          <p className="text-yellow-800">{error.message}</p>
          <Button className="mt-2">Fazer Upgrade para Pro</Button>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        {/* Formulário com campos */}
        <Button type="submit" disabled={loading}>
          {loading ? "Gerando..." : "Gerar Curso"}
        </Button>
      </form>

      {course && (
        <div className="mt-8">
          {/* Preview do curso */}
        </div>
      )}
    </div>
  );
}
```

#### 4.3. Criar Outras Páginas
- `/meus-cursos` - Lista de cursos criados
- `/curso/:id` - Visualização de curso
- `/curso/:id/editar` - Edição de curso

---

### PARTE 5: Footer Global + Páginas Públicas

**Objetivo:** Criar footer e páginas institucionais.

#### 5.1. Criar Componente Footer
**Arquivo:** `src/components/layout/global-footer.tsx`

```typescript
import { Link } from "@tanstack/react-router";

export function GlobalFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/how-it-works">How it Works</Link></li>
              <li><Link to="/plans">Plans</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/support">Talk to Support</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/security">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-between items-center">
          <div>
            <p className="font-bold">StudAI</p>
            <p className="text-sm text-gray-400">Aprenda com IA, evolua com consistência</p>
          </div>
          
          <div>
            <select className="bg-gray-800 px-4 py-2 rounded">
              <option value="pt-BR">🇧🇷 Português</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>support@studai.app</p>
        </div>
      </div>
    </footer>
  );
}
```

#### 5.2. Criar Páginas Públicas
Criar rotas e componentes para:
- `/resources` - Catálogo de recursos
- `/how-it-works` - Como funciona
- `/plans` - Planos (Free vs Pro)
- `/faq` - Perguntas frequentes
- `/about` - Sobre nós
- `/contact` - Contato
- `/support` - Suporte
- `/security` - Segurança
- `/privacy` - Privacidade
- `/terms` - Termos de uso

---

## 🎯 RESUMO DO QUE FALTA

1. ✅ Modelos de dados (COMPLETO)
2. ⏳ Sistema de verificação de links
3. ⏳ Endpoints de IA + middleware
4. ⏳ UI do Course Builder
5. ⏳ Footer + páginas públicas

## 📝 NOTAS IMPORTANTES

- Todos os endpoints de IA devem usar o middleware de verificação de plano
- Links devem sempre vir do ResourceCatalog verificado
- Erros de limite devem retornar HTTP 402 com payload estruturado
- UI deve mostrar uso atual e limite do plano
- Implementar i18n básico (PT-BR e EN)
- Seguir tom de voz: motivador, claro, orientado ao progresso
