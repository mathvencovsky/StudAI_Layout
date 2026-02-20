# Erros Encontrados no Build

## Data: 20 de Fevereiro de 2026

---

## Resumo

Total de erros: ~150+
- Erros de tradução (chaves não registradas): ~140
- Erros de código (lógica/tipos): ~10

---

## Erros Críticos de Código (Prioridade Alta)

### 1. configuracoes-page.tsx
**Problemas:**
1. Import não utilizado: `Input` (linha 5)
2. Hook não existe: `useUpdateUserPreferences` (linha 10)
3. Hook não existe: `useDeleteAccount` (linha 11)
4. Tipo incorreto: `notifications` deveria ser objeto, não boolean (linha 37)
5. Propriedade não existe: `emailNotifications` em `UserPreferences` (linha 38)
6. Propriedade não existe: `plan` em `UserAccount` (linha 106)

**Solução:**
- Remover import `Input`
- Usar hooks corretos ou criar versões mock
- Corrigir estrutura de `notifications`

### 2. estudar-page.tsx
**Problemas:**
1. Import não utilizado: `Play` (linha 13)

**Solução:**
- Remover import

### 3. explorar-trilhas-page.tsx
**Problemas:**
1. Tipo de rota incorreto: `/estudar/${string}` não é rota válida (linha 132)

**Solução:**
- Usar `to` como string simples ou ajustar tipos de rota

---

## Erros de Tradução (Prioridade Média)

Todos os erros restantes são de chaves de tradução não registradas no sistema de tipos do i18next.

**Arquivos afetados:**
- pesquisar-page-integrated.tsx (~10 erros)
- pesquisar-page.tsx (~15 erros)
- sessoes-page.tsx (~20 erros)
- configuracoes-page.tsx (~50 erros)
- estudar-page.tsx (~2 erros)
- explorar-trilhas-page.tsx (~15 erros)
- avaliacoes-page.tsx (~1 erro - já corrigido)

**Causa:**
As chaves de tradução foram adicionadas aos arquivos de tradução, mas o TypeScript não as reconhece porque:
1. O servidor TypeScript precisa ser reiniciado
2. Os tipos de tradução precisam ser regenerados
3. Ou as traduções não foram adicionadas corretamente

**Solução:**
Duas opções:
1. **Opção A (Recomendada):** Substituir todas as traduções por strings hardcoded em português (temporário)
2. **Opção B:** Adicionar todas as traduções aos arquivos de tradução e regenerar tipos

---

## Estratégia de Correção

### Fase 1: Corrigir Erros Críticos de Código ✅
1. ✅ configuracoes-page.tsx - Corrigir imports e hooks
2. ✅ estudar-page.tsx - Remover import não utilizado
3. ✅ explorar-trilhas-page.tsx - Corrigir tipo de rota

### Fase 2: Corrigir Traduções
**Opção escolhida:** Substituir por strings hardcoded

Arquivos a corrigir:
1. pesquisar-page-integrated.tsx
2. pesquisar-page.tsx
3. sessoes-page.tsx
4. configuracoes-page.tsx
5. estudar-page.tsx
6. explorar-trilhas-page.tsx

---

## Próximos Passos

1. ✅ Corrigir erros críticos de código
2. ⚠️ Decidir estratégia para traduções
3. ⚠️ Aplicar c