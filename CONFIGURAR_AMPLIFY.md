# 🔐 Como Configurar a Autenticação (AWS Amplify)

## ⚠️ Problema Atual

Você está vendo a mensagem:
```
Integração de autenticação pendente. Configure __STUDAI_AUTH_ADAPTER__.
```

Isso acontece porque o AWS Amplify precisa ser configurado no seu ambiente.

---

## ✅ Solução Rápida (Desenvolvimento Local)

### Opção 1: Usar Amplify Sandbox (Recomendado)

O Amplify Sandbox cria um ambiente de desenvolvimento temporário na AWS.

#### 1. Instale o Amplify CLI globalmente

```bash
npm install -g @aws-amplify/cli
```

#### 2. Configure suas credenciais AWS

Se você ainda não tem credenciais AWS configuradas:

```bash
amplify configure
```

Isso vai:
- Abrir o console AWS no navegador
- Pedir para criar um usuário IAM
- Configurar as credenciais localmente

#### 3. Inicie o Sandbox

Na pasta do projeto:

```bash
cd StudAI_Layout
npx ampx sandbox
```

Isso vai:
- Criar recursos temporários na AWS (Cognito, DynamoDB, etc.)
- Gerar o arquivo `amplify_outputs.json` automaticamente
- Manter os recursos sincronizados enquanto você desenvolve

#### 4. Inicie o projeto em outro terminal

```bash
npm run dev
```

Agora o login deve funcionar! 🎉

---

### Opção 2: Usar Autenticação Mock (Desenvolvimento Offline)

Se você não quer configurar AWS agora, pode usar uma autenticação mock para testar a interface.

#### 1. Crie um arquivo de mock

Crie o arquivo `src/lib/auth-adapter-mock.ts`:

```typescript
export interface AuthAdapter {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

export const mockAuthAdapter: AuthAdapter = {
  async signIn(email: string, password: string): Promise<void> {
    console.log("Mock Sign In:", email);
    
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simula login bem-sucedido
    localStorage.setItem("mock_user", JSON.stringify({ email }));
    window.location.reload();
  },

  async signUp(email: string, password: string): Promise<void> {
    console.log("Mock Sign Up:", email);
    
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simula cadastro bem-sucedido
    alert("Conta criada com sucesso! Faça login.");
  },
};

export function initializeMockAuthAdapter(): void {
  if (typeof window !== "undefined") {
    (window as any).__STUDAI_AUTH_ADAPTER__ = mockAuthAdapter;
  }
}
```

#### 2. Atualize o main.tsx

Substitua:
```typescript
import { initializeAuthAdapter } from "@/lib/auth-adapter";
initializeAuthAdapter();
```

Por:
```typescript
import { initializeMockAuthAdapter } from "@/lib/auth-adapter-mock";
initializeMockAuthAdapter();
```

#### 3. Teste

Agora você pode testar a interface de login/cadastro sem AWS!

**Nota**: Isso é apenas para desenvolvimento. Use o Amplify real para produção.

---

## 🚀 Deploy para Produção

### 1. Crie uma conta AWS

Se ainda não tem: https://aws.amazon.com/

### 2. Configure o Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 3. Inicialize o projeto Amplify

```bash
cd StudAI_Layout
amplify init
```

Responda as perguntas:
- Environment name: `prod`
- Default editor: (escolha o seu)
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Distribution directory: `dist`
- Build command: `npm run build`
- Start command: `npm run dev`

### 4. Faça push dos recursos

```bash
amplify push
```

Isso vai criar:
- User Pool (Cognito) para autenticação
- AppSync API para GraphQL
- DynamoDB tables para dados
- Lambda functions para lógica de negócio

### 5. Deploy do frontend

Você pode usar:
- **Amplify Hosting**: `amplify add hosting`
- **Vercel**: Conecte seu repositório
- **Netlify**: Conecte seu repositório
- **S3 + CloudFront**: Deploy manual

---

## 🔧 Troubleshooting

### Erro: "amplify: command not found"

Instale o Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

### Erro: "No credentials found"

Configure suas credenciais AWS:
```bash
amplify configure
```

### Erro: "amplify_outputs.json not found"

Execute o sandbox:
```bash
npx ampx sandbox
```

Ou inicialize o Amplify:
```bash
amplify init
amplify push
```

### Erro: "User pool does not exist"

O Amplify ainda não foi configurado. Execute:
```bash
npx ampx sandbox
```

### Erro ao fazer login: "User does not exist"

Você precisa criar uma conta primeiro. Use o formulário de cadastro.

### Erro ao cadastrar: "Password does not meet requirements"

A senha precisa ter:
- Pelo menos 8 caracteres
- Letras maiúsculas e minúsculas
- Números
- Caracteres especiais (opcional)

---

## 📚 Recursos Úteis

### Documentação Oficial
- [AWS Amplify Gen 2](https://docs.amplify.aws/gen2/)
- [Amplify Auth](https://docs.amplify.aws/gen2/build-a-backend/auth/)
- [Amplify Sandbox](https://docs.amplify.aws/gen2/deploy-and-host/sandbox-environments/)

### Tutoriais
- [Getting Started with Amplify](https://docs.amplify.aws/start/)
- [Authentication with Amplify](https://docs.amplify.aws/lib/auth/getting-started/)

### Vídeos
- [AWS Amplify Tutorial](https://www.youtube.com/results?search_query=aws+amplify+tutorial)

---

## 🎯 Resumo

### Para Desenvolvimento Local (Rápido)

```bash
# Opção 1: Amplify Sandbox (recomendado)
npx ampx sandbox

# Em outro terminal
npm run dev
```

### Para Desenvolvimento Offline (Mock)

1. Crie `src/lib/auth-adapter-mock.ts` (código acima)
2. Atualize `src/main.tsx` para usar o mock
3. Execute `npm run dev`

### Para Produção

```bash
amplify init
amplify push
npm run build
```

---

## ✅ Checklist

- [ ] AWS CLI instalado
- [ ] Credenciais AWS configuradas
- [ ] Amplify Sandbox rodando (`npx ampx sandbox`)
- [ ] Projeto rodando (`npm run dev`)
- [ ] Login funcionando
- [ ] Cadastro funcionando

---

**Dica**: Use o Amplify Sandbox para desenvolvimento. É rápido, fácil e não requer configuração complexa!

**Importante**: O arquivo `amplify_outputs.json` é gerado automaticamente pelo Amplify. Não edite manualmente.

---

**Precisa de ajuda?** Consulte a [documentação oficial do Amplify](https://docs.amplify.aws/gen2/).
