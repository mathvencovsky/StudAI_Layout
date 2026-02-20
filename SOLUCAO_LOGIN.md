# 🔐 Solução Rápida - Problema de Login

## ⚡ Solução Imediata (2 minutos)

Você está vendo a mensagem de erro porque o AWS Amplify não está configurado. Vou te dar a solução mais rápida:

### Opção 1: Usar Mock (Sem AWS - Mais Rápido) ⚡

1. **Abra o arquivo** `src/main.tsx`

2. **Encontre esta linha** (linha 9):
```typescript
import { initializeAuthAdapter } from "@/lib/auth-adapter";
```

3. **Substitua por**:
```typescript
import { initializeMockAuthAdapter } from "@/lib/auth-adapter-mock";
```

4. **Encontre esta linha** (linha 12):
```typescript
initializeAuthAdapter();
```

5. **Substitua por**:
```typescript
initializeMockAuthAdapter();
```

6. **Salve o arquivo** e recarregue a página

7. **Pronto!** Agora você pode:
   - Criar uma conta
   - Fazer login
   - Testar toda a interface

**Nota**: Isso é apenas para desenvolvimento local. Os dados ficam salvos no navegador.

---

### Opção 2: Usar AWS Amplify (Produção) 🚀

Se você quer usar o AWS Amplify de verdade:

1. **Instale o Amplify CLI**:
```bash
npm install -g @aws-amplify/cli
```

2. **Configure suas credenciais AWS**:
```bash
amplify configure
```

3. **Inicie o Sandbox** (em um terminal separado):
```bash
cd StudAI_Layout
npx ampx sandbox
```

4. **Inicie o projeto** (em outro terminal):
```bash
npm run dev
```

5. **Pronto!** O login vai funcionar com AWS Cognito real.

---

## 🎯 Qual Opção Escolher?

### Use Mock se:
- ✅ Você quer testar AGORA
- ✅ Não tem conta AWS
- ✅ Está desenvolvendo localmente
- ✅ Quer ver a interface funcionando

### Use Amplify se:
- ✅ Você tem conta AWS
- ✅ Quer autenticação real
- ✅ Vai fazer deploy
- ✅ Precisa de produção

---

## 📝 Passo a Passo Detalhado (Mock)

### 1. Editar o arquivo main.tsx

Abra `StudAI_Layout/src/main.tsx` e faça as alterações:

**ANTES:**
```typescript
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
Amplify.configure(outputs);

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import "./i18n/i18n";
import { initZodI18n } from "@/i18n/zod-i18n";
import { initializeAuthAdapter } from "@/lib/auth-adapter";

initZodI18n();
initializeAuthAdapter();
```

**DEPOIS:**
```typescript
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
Amplify.configure(outputs);

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import "./i18n/i18n";
import { initZodI18n } from "@/i18n/zod-i18n";
import { initializeMockAuthAdapter } from "@/lib/auth-adapter-mock";

initZodI18n();
initializeMockAuthAdapter();
```

### 2. Salvar e recarregar

1. Salve o arquivo (Ctrl+S)
2. Recarregue a página no navegador (F5)
3. Você vai ver no console: "🎭 Mock Auth Adapter initialized"

### 3. Testar

1. Vá para a landing page
2. Clique em "Começar grátis" ou role até o formulário
3. Clique na aba "Criar conta"
4. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `123456`
   - Confirmar senha: `123456`
5. Clique em "Criar conta"
6. A página vai recarregar e você estará logado!

---

## 🐛 Troubleshooting

### Ainda aparece o erro?

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se salvou o arquivo main.tsx
3. Verifique se o servidor está rodando (`npm run dev`)
4. Abra o console (F12) e veja se há erros

### Erro: "Cannot find module"

Execute:
```bash
npm install
```

### Erro: "Mock Auth Adapter not found"

Verifique se o arquivo `src/lib/auth-adapter-mock.ts` existe.

### Login não funciona

1. Abra o console (F12)
2. Veja se aparece "🎭 Mock Auth Adapter initialized"
3. Se não aparecer, o arquivo main.tsx não foi salvo corretamente

---

## 🎉 Pronto!

Agora você pode:
- ✅ Criar contas
- ✅ Fazer login
- ✅ Testar toda a aplicação
- ✅ Ver o dashboard
- ✅ Usar todas as funcionalidades

**Lembre-se**: Isso é apenas para desenvolvimento. Para produção, use o AWS Amplify real.

---

## 📚 Mais Informações

- [CONFIGURAR_AMPLIFY.md](CONFIGURAR_AMPLIFY.md) - Guia completo de configuração do Amplify
- [COMO_INICIAR.md](COMO_INICIAR.md) - Guia geral do projeto

---

**Dúvidas?** Abra o console (F12) e veja as mensagens de log.
