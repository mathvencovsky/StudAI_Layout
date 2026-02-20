# Plano de Correção: Páginas da Sidebar

## Status Atual

**15 páginas mapeadas:**
- ✅ 14 páginas funcionais
- ⚠️ 1 página com erros (Atividade)

## Problemas Identificados

### 1. Página de Atividade (/atividade)
- **Problema**: Faltam 34 traduções i18n
- **Impacto**: Erros de tipo TypeScript
- **Solução**: Adicionar traduções faltantes

### 2. Inconsistência de Dados
- **Problema**: Algumas páginas usam mock quando poderiam usar dados reais
- **Impacto**: Experiência inconsistente
- **Solução**: Padronizar uso de dados

### 3. Páginas sem Integração Completa
- Algumas páginas não usam os hooks React Query disponíveis
- Faltam estados de loading/error/empty em algumas páginas

## Plano de Ação

### Fase 1: Correções Críticas (Prioridade Alta)
1. ✅ Adicionar traduções faltantes para página de Atividade
2. ✅ Verificar e corrigir erros de tipo
3. ✅ Testar todas as rotas

### Fase 2: Padronização (Prioridade Média)
4. Garantir que todas as páginas usem:
   - LoadingState
   - ErrorState  
   - EmptyState
   - Traduções i18n
5. Padronizar layout e estrutura

### Fase 3: Melhorias (Prioridade Baixa)
6. Adicionar filtros avançados onde aplicável
7. Melhorar feedback visual
8. Otimizar performance

## Execução

Vou começar pela Fase 1, corrigindo os problemas críticos.
