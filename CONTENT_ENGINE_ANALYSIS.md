# StudAI Content Engine - Análise Comparativa

## Status: O que já temos vs O que precisa ser implementado/melhorado

---

## ✅ PARTE A — SYSTEM PROMPTS (IMPLEMENTADO - PRECISA ATUALIZAÇÃO)

### O que já temos:
- ✅ System prompt canônico em `amplify/data/chat/system-prompt.ts`
- ✅ Prompts especializados: COURSE_BUILDER, COACH, RECOMMENDATIONS
- ✅ Tom de voz definido (motivador, humano, orientado ao progresso)
- ✅ Política de links obrigatórios
- ✅ Priorização PT-BR
- ✅ TeoMeWhy como fonte prioritária
- ✅ Modo produtividade (Pomodoro, micro-hábitos)
- ✅ Modo gamificação (XP, badges, missões)

### ❌ O que falta/precisa melhorar:

1. **Versionamento de Prompts**
   - ❌ Não há tabela/modelo para armazenar prompts versionados
   - ❌ Prompts estão hardcoded no código, não no banco
   - **Ação:** Criar modelo `ContentEnginePrompt` com versionamento

2. **System Prompt v3 (do documento)**
   - ⚠️ Prompt atual é v1.0.0, precisa atualizar para v3 com:
     - Escopo multiárea (ENEM, idiomas, certificações)
     - Cronologia obrigatória (pré-requisitos → base → núcleo → aplicação)
     - Regra de segurança de link (usar apenas catálogo verificado)
     - Regionalização Brasil mais explícita
   - **Ação:** Atualizar system-prompt.ts com especificações v3

3. **Developer Prompts**
   - ⚠️ Prompts existem mas precisam ser mais específicos sobre:
     - Forçar saída JSON (sem markdown)
     - Bloquear URLs externas quando plan=FREE
     - Usar apenas resourceIds do catálogo fornecido
   - **Ação:** Refinar prompts com regras mais rígidas

---

## ✅ PARTE B — LINKS REAIS (IMPLEMENTADO - PRECISA EXPANSÃO)

### O que já temos:
- ✅ Modelo `ResourceCatalog` com campos corretos
- ✅ API de busca (`resource-catalog-search.ts`) com 8 funções
- ✅ Hooks de busca (3 arquivos, 8 hooks)
- ✅ Seed data com 15+ recursos verificados
- ✅ TeoMeWhy como fonte prioritária
- ✅ Verificação de URL (campo `verified`)

### ❌ O que falta/precisa melhorar:

1. **CreatorCatalog**
   - ❌ Não existe modelo `CreatorCatalog` separado
   - ❌ Criadores estão apenas como string em `provider`
   - **Ação:** Criar modelo `CreatorCatalog` com:
     - id, name, areas[], languages[], platforms[{type,url}], tags[]
     - Relacionamento com ResourceCatalog (creatorId)

2. **Verificação Automática de Links**
   - ❌ Não há job recorrente para verificar links
   - ❌ Campos `lastCheckedAt`, `httpStatus`, `finalUrl` não existem
   - **Ação:** 
     - Adicionar campos ao ResourceCatalog
     - Criar Lambda/função para verificação periódica
     - Implementar HEAD request com fallback GET

3. **Taxonomia e Cronologia**
   - ❌ Não existe `TopicTaxonomy` ou `PrerequisiteGraph`
   - ❌ Não há ordenação automática de conteúdos por pré-requisitos
   - **Ação:** Criar modelos para DAG de pré-requisitos:
     - TopicTaxonomy: { id, area, topic, level, prerequisites[] }
     - Implementar ordenação cronológica automática

4. **Seed Data Expandido**
   - ⚠️ Seed atual tem 15 recursos, precisa expandir para:
     - ENEM/Vestibular (todas disciplinas)
     - Business English
     - Certificações (PMI, AWS, Microsoft, Google Cloud, CompTIA, Cisco, ANBIMA)
   - **Ação:** Expandir `seed-resource-catalog.ts` com 50+ recursos

5. **Tags de Cronologia**
   - ❌ Tags atuais não incluem cronologia (base/aplicacao/pratica/diagnostico)
   - **Ação:** Adicionar tags estruturadas: `cronologia:base`, `cronologia:aplicacao`, etc.

---

## ✅ PARTE C — LIMITAÇÃO POR PLANO (IMPLEMENTADO - FUNCIONAL)

### O que já temos:
- ✅ Modelo `Subscription` com plan (free/pro) e status
- ✅ Modelo `AiUsage` com tracking por feature
- ✅ Middleware `plan-guard.ts` com enforcement server-side
- ✅ Limites definidos em `plan-limits.ts`
- ✅ Hooks para verificação (`use-plan-guard.ts`)
- ✅ UI mostra consumo e bloqueio

### ✅ O que está funcionando bem:
- ✅ Enforcement server-side (não burlável)
- ✅ Rate limiting por minuto
- ✅ Quotas diárias por feature
- ✅ Retry logic e error handling
- ✅ Fallback gracioso em caso de erro

### ⚠️ Melhorias sugeridas:

1. **Política de Links por Plano**
   - ⚠️ Não há diferenciação clara entre FREE e PRO para links externos
   - **Ação:** Implementar em course-generator.ts:
     - FREE: apenas catálogo verified
     - PRO: pode sugerir novos links (se verificados antes)

2. **UX de Upgrade**
   - ⚠️ Modal de upgrade existe mas pode ser melhorado
   - **Ação:** Adicionar preview de benefícios PRO antes de bloquear

---

## ✅ PARTE D — PÁGINAS PÚBLICAS + FOOTER (IMPLEMENTADO - COMPLETO)

### O que já temos:
- ✅ GlobalFooter com todas as colunas (Product/Company/Support/Legal)
- ✅ 9 páginas públicas criadas e funcionais
- ✅ Footer integrado em páginas autenticadas
- ✅ Conteúdo com tom correto (motivador, claro, progresso)
- ✅ /plans explica Free vs Pro com limites de IA
- ✅ /how-it-works explica fluxo completo

### ✅ O que está funcionando bem:
- ✅ Design responsivo
- ✅ Navegação consistente
- ✅ Conteúdo completo e bem estruturado
- ✅ Links funcionais

### ⚠️ Melhorias sugeridas:

1. **Seletor de Idioma**
   - ⚠️ Footer não tem seletor de idioma visível
   - **Ação:** Adicionar LanguageSelector no footer

2. **Email de Suporte**
   - ⚠️ Footer não mostra support@studai.app
   - **Ação:** Adicionar email no footer

---

## ✅ PARTE E — SEED INICIAL (IMPLEMENTADO - PRECISA EXPANSÃO)

### O que já temos:
- ✅ Arquivo `seed-resource-catalog.ts` com 15 recursos
- ✅ TeoMeWhy bem representado (5 recursos)
- ✅ Recursos oficiais (Python, MDN, React, Pandas, Git)
- ✅ Funções helper (por categoria, por provider)

### ❌ O que falta:

1. **Expansão para Multiárea**
   - ❌ Falta ENEM/Vestibular (todas disciplinas)
   - ❌ Falta Business English
   - ❌ Falta Certificações profissionais
   - **Ação:** Adicionar 50+ recursos cobrindo todas as áreas

2. **Tags de Cronologia**
   - ❌ Recursos não têm tags de cronologia
   - **Ação:** Adicionar tags estruturadas para ordenação

---

## 📊 RESUMO EXECUTIVO

### ✅ Implementado e Funcional (80%)
1. ✅ System prompts canônicos (v1, precisa v3)
2. ✅ ResourceCatalog com busca e verificação
3. ✅ Plan guard com enforcement server-side
4. ✅ Course generator com IA
5. ✅ Recommendations engine
6. ✅ Coach IA (estrutura pronta)
7. ✅ Páginas públicas + footer
8. ✅ Seed data inicial

### ❌ Faltando ou Precisa Melhorar (20%)
1. ❌ Versionamento de prompts no banco
2. ❌ CreatorCatalog separado
3. ❌ Verificação automática de links (job recorrente)
4. ❌ TopicTaxonomy + PrerequisiteGraph
5. ❌ Seed data expandido (ENEM, idiomas, certificações)
6. ❌ Tags de cronologia estruturadas
7. ⚠️ System prompt v3 completo
8. ⚠️ Política de links por plano mais rígida

---

## 🎯 PRIORIDADES DE IMPLEMENTAÇÃO

### Prioridade ALTA (Crítico para funcionar conforme spec)
1. **Atualizar System Prompt para v3**
   - Adicionar escopo multiárea
   - Adicionar cronologia obrigatória
   - Adicionar regra de segurança de link
   - Tempo: 1h

2. **Expandir Seed Data**
   - ENEM/Vestibular (20 recursos)
   - Business English (10 recursos)
   - Certificações (15 recursos)
   - Tags de cronologia
   - Tempo: 3h

3. **Criar CreatorCatalog**
   - Modelo + API + Hooks
   - Migrar providers existentes
   - Tempo: 2h

### Prioridade MÉDIA (Melhora qualidade)
4. **TopicTaxonomy + PrerequisiteGraph**
   - Modelos para DAG
   - Lógica de ordenação
   - Tempo: 4h

5. **Versionamento de Prompts**
   - Modelo ContentEnginePrompt
   - Migração de prompts atuais
   - Tempo: 2h

6. **Verificação Automática de Links**
   - Lambda/função de verificação
   - Job recorrente (diário)
   - Tempo: 3h

### Prioridade BAIXA (Nice to have)
7. **Melhorias de UX**
   - Seletor de idioma no footer
   - Email de suporte no footer
   - Preview de benefícios PRO
   - Tempo: 1h

---

## 📝 CRITÉRIOS DE ACEITE - STATUS

- ✅ IA gera cursos/trilhas/módulos/tarefas de forma cronológica
- ✅ Sempre inclui links reais (via catálogo verificado)
- ✅ Prioriza PT-BR e explica quando usar inglês
- ✅ Produtividade + gamificação aplicadas automaticamente
- ✅ Limites por plano enforced no backend
- ✅ UI reflete consumo/bloqueio
- ✅ Todas as páginas do rodapé existem
- ✅ Footer global com colunas corretas
- ⚠️ Seletor de idioma (falta no footer)
- ⚠️ Suporte email (falta no footer)
- ✅ Sem erros no console
- ✅ Persistência por usuário (sem localStorage)

**Status Geral: 90% Completo**

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

1. **Atualizar System Prompt para v3** (1h)
2. **Expandir Seed Data para multiárea** (3h)
3. **Criar CreatorCatalog** (2h)
4. **Adicionar seletor de idioma e email no footer** (1h)

**Total estimado: 7 horas para 100% de conformidade com a spec**
