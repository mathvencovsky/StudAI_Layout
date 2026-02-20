# Teste Manual - Learning Preferences com Mock Auth

## Objetivo
Validar que a funcionalidade de Learning Preferences funciona corretamente com mock authentication usando localStorage.

## Pré-requisitos
- ✅ Mock auth adapter inicializado
- ✅ Mock learning preference adapter inicializado
- ✅ Aplicação rodando em modo desenvolvimento

## Teste 1: Verificar Inicialização

### Passos
1. Abra o navegador
2. Abra DevTools (F12)
3. Vá para a aba Console
4. Recarregue a página

### Resultado Esperado
Você deve ver no console:
```
🎭 Mock Auth Adapter initialized
🎭 Mock Learning Preference Adapter initialized
```

**Status:** ⏳ Aguardando teste

---

## Teste 2: Carregar Página de Learning Preferences (Primeira Vez)

### Passos
1. Faça login com mock auth (email: test@example.com, senha: qualquer)
2. Navegue para `/learning-preferences`
3. Observe o console

### Resultado Esperado
- ✅ Página carrega sem erros
- ✅ Formulário aparece vazio (primeira vez)
- ✅ Console mostra: `🎭 Using mock adapter for getMyLearningPreference`
- ✅ Console mostra: `🎭 Mock: Getting learning preference from localStorage`
- ✅ Nenhum erro de Amplify no console

**Status:** ⏳ Aguardando teste

---

## Teste 3: Salvar Learning Preferences

### Passos
1. Na página `/learning-preferences`, preencha o formulário:
   - Selecione alguns interesses
   - Escolha dias da semana
   - Defina minutos por dia (ex: 30)
   - Selecione formatos preferidos
   - Escolha tamanho de conteúdo
2. Clique em "Salvar" ou "Concluir"
3. Observe o console e os toasts

### Resultado Esperado
- ✅ Console mostra: `🎭 Using mock adapter for createLearningPreference`
- ✅ Console mostra: `🎭 Mock: Creating learning preference in localStorage`
- ✅ Console mostra: `🎭 Mock learning preference saved to localStorage`
- ✅ Toast de sucesso aparece: "Preferências salvas com sucesso"
- ✅ Nenhum erro no console
- ✅ Nenhuma tentativa de chamar Amplify API

**Status:** ⏳ Aguardando teste

---

## Teste 4: Verificar localStorage

### Passos
1. Após salvar, abra DevTools
2. Vá para Application → Local Storage
3. Procure pela chave `studai_mock_learning_preference`

### Resultado Esperado
- ✅ Chave existe no localStorage
- ✅ Valor é um JSON com estrutura:
```json
{
  "id": "mock-lp-1234567890",
  "userId": "mock-user-id",
  "studyTimePreference": "...",
  "difficultyLevel": "...",
  "learningStyle": "...",
  "notificationsEnabled": true/false,
  "createdAt": "2026-02-20T...",
  "updatedAt": "2026-02-20T..."
}
```

**Status:** ⏳ Aguardando teste

---

## Teste 5: Recarregar e Verificar Persistência

### Passos
1. Após salvar as preferências, recarregue a página (F5)
2. Navegue novamente para `/learning-preferences`
3. Observe o formulário

### Resultado Esperado
- ✅ Console mostra: `🎭 Using mock adapter for getMyLearningPreference`
- ✅ Console mostra: `🎭 Mock: Getting learning preference from localStorage`
- ✅ Formulário carrega com os dados salvos anteriormente
- ✅ Todos os campos preenchidos corretamente
- ✅ Nenhum erro no console

**Status:** ⏳ Aguardando teste

---

## Teste 6: Atualizar Learning Preferences

### Passos
1. Com preferências já salvas, modifique alguns campos
2. Clique em "Salvar"
3. Observe o console

### Resultado Esperado
- ✅ Console mostra: `🎭 Using mock adapter for updateLearningPreference`
- ✅ Console mostra: `🎭 Mock: Updating learning preference in localStorage`
- ✅ Console mostra: `🎭 Mock learning preference saved to localStorage`
- ✅ Toast de sucesso aparece
- ✅ Campo `updatedAt` no localStorage é atualizado
- ✅ Nenhum erro no console

**Status:** ⏳ Aguardando teste

---

## Teste 7: Limpar localStorage e Testar Novamente

### Passos
1. Abra DevTools → Application → Local Storage
2. Delete a chave `studai_mock_learning_preference`
3. Recarregue a página
4. Navegue para `/learning-preferences`

### Resultado Esperado
- ✅ Formulário aparece vazio (como primeira vez)
- ✅ Console mostra tentativa de ler do localStorage
- ✅ Nenhum erro no console
- ✅ Pode salvar novamente normalmente

**Status:** ⏳ Aguardando teste

---

## Teste 8: Verificar Que Amplify NÃO É Chamado

### Passos
1. Abra DevTools → Network
2. Filtre por "graphql" ou "appsync"
3. Execute os testes 2, 3 e 6 novamente
4. Observe a aba Network

### Resultado Esperado
- ✅ NENHUMA requisição para AWS Amplify/AppSync
- ✅ NENHUMA requisição GraphQL
- ✅ Todas as operações acontecem localmente
- ✅ Apenas requisições normais da aplicação (se houver)

**Status:** ⏳ Aguardando teste

---

## Checklist de Validação

### Funcionalidade
- [ ] Mock adapter inicializa corretamente
- [ ] Página carrega sem erros
- [ ] Pode salvar preferências (create)
- [ ] Pode atualizar preferências (update)
- [ ] Pode carregar preferências (get)
- [ ] Dados persistem no localStorage
- [ ] Dados persistem entre reloads

### Console Logs
- [ ] Logs de mock adapter aparecem
- [ ] Nenhum erro de Amplify
- [ ] Nenhum erro de GraphQL
- [ ] Nenhum erro de cliente não inicializado

### Network
- [ ] Nenhuma chamada para AWS Amplify
- [ ] Nenhuma chamada GraphQL
- [ ] Operações são 100% locais

### UI/UX
- [ ] Toast de sucesso aparece ao salvar
- [ ] Formulário carrega dados salvos
- [ ] Nenhum erro visível para o usuário
- [ ] Experiência fluida e sem travamentos

---

## Problemas Conhecidos

### Se o mock adapter não inicializar:
1. Verifique que `initializeMockLearningPreferenceAdapter()` está sendo chamado em `main.tsx`
2. Verifique que está antes da renderização do app
3. Recarregue a página completamente (Ctrl+Shift+R)

### Se ainda tentar chamar Amplify:
1. Verifique que `window.__STUDAI_LEARNING_PREFERENCE_ADAPTER__` existe no console
2. Verifique que as funções em `learning-preference.ts` têm a lógica condicional
3. Limpe o cache do navegador

### Se localStorage não persistir:
1. Verifique que não está em modo privado/anônimo
2. Verifique que localStorage não está desabilitado
3. Verifique que não há extensões bloqueando localStorage

---

## Próximos Passos Após Testes

Se todos os testes passarem:
1. ✅ Marcar task 2 como completa (testes de preservação não aplicáveis sem AWS real)
2. ✅ Marcar task 3.4 como completa (bug fix validado)
3. ✅ Marcar task 4 como completa (checkpoint)
4. ✅ Documentar resultados dos testes

Se algum teste falhar:
1. ❌ Documentar o erro específico
2. ❌ Verificar logs do console
3. ❌ Verificar código do adapter e API
4. ❌ Corrigir e testar novamente

---

## Notas

- Este teste é para **mock authentication** apenas
- Testes com **real AWS Amplify** requerem backend configurado
- A task 2 (preservation tests) não pode ser executada sem AWS real
- O comportamento de produção é preservado pela lógica condicional no código

**Data:** 20 de Fevereiro de 2026
