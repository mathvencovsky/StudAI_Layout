# Teste Rápido - Site Rodando

## ✅ Servidor Iniciado

O servidor de desenvolvimento está rodando em:
🌐 **https://localhost:5174/**

---

## Testes Prioritários

### 1. Teste de Login Mock (2 minutos)

1. Abra o navegador em https://localhost:5174/
2. Você deve ver a landing page
3. Clique em "Entrar" ou navegue para `/login`
4. Use as credenciais mock:
   - **Email:** test@example.com
   - **Senha:** qualquer coisa (6+ caracteres)
5. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionado para `/home` (dashboard)
- ✅ Sidebar aparece com menu de navegação

---

### 2. Teste de Navegação nas Páginas (5 minutos)

Navegue pelas páginas integradas e verifique que todas carregam sem erros:

**Páginas Principais:**
- `/home` - Dashboard (deve mostrar cards com dados)
- `/explorar` - Trilhas (deve mostrar trilha ativa e catálogo)
- `/pesquisar` - Busca (deve ter campo de busca e filtros)
- `/estudar` - Estudar (deve mostrar sessão de estudo)

**Páginas de Progresso:**
- `/avaliacoes` - Avaliações (3 tabs: disponíveis, em progresso, concluídas)
- `/sessoes` - Sessões (histórico com estatísticas)
- `/calendario` - Calendário (eventos futuros)
- `/metas` - Metas (meta ativa)
- `/revisoes` - Revisões (pendentes e concluídas)
- `/relatorios` - Relatórios (2 tabs de período)
- `/metricas` - Métricas (3 tabs)
- `/atividade` - Atividade (feed com 3 tabs)

**Páginas de Dados:**
- `/salvos` - Salvos (4 tabs)
- `/admin` - Admin (se tiver permissão)
- `/configuracoes` - Configurações (preferências e conta)

**Resultado Esperado para TODAS as páginas:**
- ✅ Página carrega sem erros
- ✅ Dados aparecem (mesmo que sejam stubs)
- ✅ Estados de loading/error/empty funcionam
- ✅ Nenhum erro no console do navegador

---

### 3. Teste de Learning Preferences (10 minutos) ⭐ PRIORITÁRIO

Este é o teste principal para validar o fix implementado!

#### 3.1 Verificar Console
1. Abra DevTools (F12)
2. Vá para a aba Console
3. Recarregue a página
4. Procure por:
   ```
   🎭 Mock Auth Adapter initialized
   🎭 Mock Learning Preference Adapter initialized
   ```

**Status:** ⏳ Aguardando

#### 3.2 Acessar Learning Preferences
1. Navegue para `/learning-preferences`
2. Observe o console

**Resultado Esperado:**
- ✅ Página carrega sem erros
- ✅ Console mostra: `🎭 Using mock adapter for getMyLearningPreference`
- ✅ Console mostra: `🎭 Mock: Getting learning preference from localStorage`
- ✅ Formulário aparece (vazio na primeira vez)

**Status:** ⏳ Aguardando

#### 3.3 Salvar Preferências
1. Preencha o formulário:
   - Selecione alguns interesses
   - Escolha dias da semana
   - Defina minutos por dia
   - Selecione formatos
   - Escolha tamanho de conteúdo
2. Clique em "Salvar" ou "Concluir"
3. Observe console e toasts

**Resultado Esperado:**
- ✅ Console mostra: `🎭 Using mock adapter for createLearningPreference`
- ✅ Console mostra: `🎭 Mock: Creating learning preference in localStorage`
- ✅ Console mostra: `🎭 Mock learning preference saved to localStorage`
- ✅ Toast verde de sucesso aparece
- ✅ NENHUM erro no console

**Status:** ⏳ Aguardando

#### 3.4 Verificar localStorage
1. DevTools → Application → Local Storage
2. Procure por `studai_mock_learning_preference`

**Resultado Esperado:**
- ✅ Chave existe
- ✅ Valor é um JSON válido

**Status:** ⏳ Aguardando

#### 3.5 Testar Persistência
1. Recarregue a página (F5)
2. Navegue para `/learning-preferences` novamente

**Resultado Esperado:**
- ✅ Formulário carrega com dados salvos
- ✅ Todos os campos preenchidos corretamente

**Status:** ⏳ Aguardando

---

### 4. Teste de Estados UI (3 minutos)

Verifique que os estados de UI funcionam:

1. **Loading State:** Ao carregar páginas, deve aparecer spinner
2. **Empty State:** Páginas sem dados mostram mensagem amigável
3. **Error State:** Se forçar erro, deve mostrar mensagem com botão "Tentar novamente"

**Páginas boas para testar:**
- `/atividade` - Deve mostrar feed de atividades
- `/salvos` - Pode estar vazio (empty state)
- `/avaliacoes` - Deve mostrar avaliações

---

## Checklist Rápido

### Funcionalidade Básica
- [ ] Site carrega sem erros
- [ ] Login mock funciona
- [ ] Sidebar aparece após login
- [ ] Todas as 15 páginas carregam

### Learning Preferences (CRÍTICO)
- [ ] Mock adapters inicializam (console logs)
- [ ] Página `/learning-preferences` carrega
- [ ] Pode salvar preferências
- [ ] Toast de sucesso aparece
- [ ] Dados salvam no localStorage
- [ ] Dados persistem após reload
- [ ] NENHUM erro de Amplify no console

### UI/UX
- [ ] Loading states funcionam
- [ ] Empty states aparecem quando apropriado
- [ ] Traduções aparecem corretamente (PT-BR)
- [ ] Navegação entre páginas é fluida

---

## Problemas Comuns

### Se o site não carregar:
1. Verifique que está em https://localhost:5174/
2. Limpe cache do navegador (Ctrl+Shift+R)
3. Verifique console por erros

### Se login não funcionar:
1. Use email: test@example.com
2. Use senha com 6+ caracteres
3. Verifique console por erros

### Se learning preferences falhar:
1. Verifique console logs dos adapters
2. Verifique que `window.__STUDAI_LEARNING_PREFERENCE_ADAPTER__` existe
3. Limpe localStorage e tente novamente

---

## Reportar Resultados

Após os testes, reporte:

✅ **O que funcionou:**
- Liste as funcionalidades que funcionaram perfeitamente

❌ **O que não funcionou:**
- Liste erros encontrados
- Inclua mensagens de erro do console
- Inclua screenshots se possível

⚠️ **Observações:**
- Qualquer comportamento estranho
- Sugestões de melhoria

---

**Servidor rodando em:** https://localhost:5174/
**Data:** 20 de Fevereiro de 2026
