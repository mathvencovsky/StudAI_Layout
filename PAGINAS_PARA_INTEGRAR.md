# Páginas para Integrar - Remover Mock Data

## Status: Em Progresso

Páginas que têm mock data hardcoded e precisam ser integradas com hooks/stubs reais.

---

## ✅ Já Corrigidas

1. **ExplorarTrilhasPage** - Erro do `.slice()` corrigido, stub atualizado

---

## 🔄 Próximas Páginas (Prioridade)

### Alta Prioridade (Páginas Principais)

1. **CalendarioPage** (`calendario-page.tsx`)
   - Mock: `upcomingEvents` hardcoded
   - Precisa: Hook + stub para eventos do calendário
   - Status: ⏳ Aguardando

2. **ConfiguracoesPage** (`configuracoes-page.tsx`)
   - Mock: Estados locais para notificações, tema, etc
   - Precisa: Hook para preferências do usuário
   - Status: ⏳ Aguardando

3. **PerfilPage** (`perfil.tsx`)
   - Mock: `UserProfile` em localStorage
   - Precisa: Hook para perfil do usuário
   - Status: ⏳ Aguardando

4. **MetasPage** (`metas.tsx`)
   - Mock: Array `goals` hardcoded
   - Precisa: Hook + stub para metas
   - Status: ⏳ Aguardando

### Média Prioridade

5. **SessõesPage** (`sessoes.tsx`)
   - Mock: `recentSessions` hardcoded
   - Precisa: Já tem hook `useListStudySessions` - só precisa integrar
   - Status: ⏳ Aguardando

6. **RevisõesPage** (`revisoes.tsx`)
   - Mock: `pendingReviews`, `completedToday` hardcoded
   - Precisa: Já tem hook `useListReviewItems` - só precisa integrar
   - Status: ⏳ Aguardando

7. **SalvosPage** (`salvos.tsx`)
   - Mock: `savedItems` hardcoded
   - Precisa: Já tem hook `useSavedItems` - só precisa integrar
   - Status: ⏳ Aguardando

### Baixa Prioridade (Páginas Complexas/Específicas)

8. **AdminPage** (`admin.tsx`)
   - Mock: Usa componentes `AdminContentsTab`, `AdminTracksTab`
   - Precisa: Já tem hooks admin - verificar integração
   - Status: ⏳ Aguardando

9. **ConteudosPage** (`conteudos.tsx`)
   - Mock: Usa `useContentsQuery` - parece já integrado
   - Precisa: Verificar se está funcionando
   - Status: ⏳ Aguardando

10. **EngajamentoPage** (`engajamento.tsx`)
    - Mock: `ENGAGEMENT_METRICS`, `WEEKLY_TREND` hardcoded
    - Precisa: Stub para métricas de engajamento
    - Status: ⏳ Aguardando

11. **ProgramasPage** (`programas.tsx`)
    - Mock: Array `programs` hardcoded
    - Precisa: Stub para programas ativos
    - Status: ⏳ Aguardando

12. **RankingPage** (`ranking.tsx`)
    - Mock: `MOCK_RANKING` hardcoded
    - Precisa: Stub para ranking
    - Status: ⏳ Aguardando

13. **RelatoriosPage** (`relatorios.tsx`)
    - Mock: Usa funções de `ai-study-data`
    - Precisa: Verificar se dados são reais ou mock
    - Status: ⏳ Aguardando

14. **ROIEstudoPage** (`roi-estudo.tsx`)
    - Mock: `roiMetrics`, `moduleEfficiency` hardcoded
    - Precisa: Stub para métricas de ROI
    - Status: ⏳ Aguardando

### Páginas Especiais (Requerem Análise)

15. **EstudarComIAPage** (`estudar-com-ia.tsx`)
    - Mock: Usa sistema complexo de sessões AI
    - Precisa: Análise detalhada do fluxo
    - Status: ⏳ Aguardando

16. **ExplorarTrilhasPage** (`explorar-trilhas.tsx`)
    - Mock: Usa `tracks-catalog-data`
    - Precisa: Verificar se é mock ou real
    - Status: ⏳ Aguardando

17. **MeuObjetivoPage** (`meu-objetivo-page.tsx`)
    - Mock: Usa `study-goals-data`
    - Precisa: Verificar se é mock ou real
    - Status: ⏳ Aguardando

18. **PesquisarTrilhasPage** (`pesquisar-trilhas.tsx`)
    - Mock: Função `aiSearchTracks` com lógica hardcoded
    - Precisa: Stub para busca de trilhas
    - Status: ⏳ Aguardando

19. **QuizSessionPage** (`quiz-session-page.tsx`)
    - Mock: Usa `CFA_QUIZZES`, `CFA_SIMULADOS`
    - Precisa: Stub para quizzes
    - Status: ⏳ Aguardando

20. **QuizzesPage** (`quizzes.tsx`)
    - Mock: Usa `CFA_QUIZZES`
    - Precisa: Stub para lista de quizzes
    - Status: ⏳ Aguardando

21. **TrackDetailPage** (`track-detail.tsx`)
    - Mock: Usa `tracks-catalog-data`
    - Precisa: Verificar se é mock ou real
    - Status: ⏳ Aguardando

22. **TrailOverviewPage** (`trail-overview.tsx`)
    - Mock: Usa `program-data`
    - Precisa: Verificar se é mock ou real
    - Status: ⏳ Aguardando

23. **TrilhaPage** (`trilha.tsx`)
    - Mock: Usa `trail-planning-data`
    - Precisa: Verificar se é mock ou real
    - Status: ⏳ Aguardando

---

## Estratégia de Integração

### Fase 1: Páginas Simples (1-7)
- Remover mock data hardcoded
- Criar stubs simples
- Integrar com hooks existentes ou criar novos
- Adicionar estados de loading/error/empty

### Fase 2: Páginas Complexas (8-14)
- Analisar dependências
- Criar stubs mais elaborados
- Integrar com sistema existente

### Fase 3: Páginas Especiais (15-23)
- Analisar arquitetura atual
- Decidir se mantém sistema de dados ou migra para stubs
- Integrar gradualmente

---

## Padrão de Integração

Para cada página:

1. ✅ Identificar mock data
2. ✅ Criar interface TypeScript
3. ✅ Criar stub em `src/api/stubs/`
4. ✅ Criar hook em `src/hooks/`
5. ✅ Atualizar página para usar hook
6. ✅ Adicionar LoadingState, ErrorState, EmptyState
7. ✅ Adicionar traduções necessárias
8. ✅ Testar no navegador

---

## Próximo Passo

Aguardando sua confirmação para começar a integração das páginas prioritárias.

**Sugestão:** Começar pelas 7 páginas de alta/média prioridade que são mais simples e já têm hooks parcialmente implementados.
