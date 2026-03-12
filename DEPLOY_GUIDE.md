# StudAI - Guia de Deploy

## 🚀 Guia Completo de Deploy para Produção

Este guia cobre o deploy do StudAI em diferentes plataformas.

---

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de que:

- ✅ Build local passa sem erros (`npm run build`)
- ✅ Todas as variáveis de ambiente estão configuradas
- ✅ AWS Account está configurada
- ✅ Amplify backend está deployado
- ✅ Testes manuais foram executados

---

## 🔧 Preparação

### 1. Verificar Build Local

```bash
cd StudAI_Layout
npm run build
```

Deve completar sem erros em ~18s.

### 2. Configurar Variáveis de Ambiente

Crie arquivo `.env.production`:

```env
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=your-user-pool-id
VITE_AWS_USER_POOL_CLIENT_ID=your-client-id
VITE_AWS_APPSYNC_ENDPOINT=your-appsync-endpoint
VITE_AWS_APPSYNC_API_KEY=your-api-key
```

### 3. Atualizar package.json

Adicione script de deploy:

```json
{
  "scripts": {
    "deploy": "npm run build && amplify publish"
  }
}
```

---

## ☁️ Deploy para AWS Amplify (Recomendado)

### Opção 1: Amplify CLI

#### Passo 1: Instalar Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

#### Passo 2: Configurar Amplify

```bash
amplify configure
```

Siga as instruções para configurar suas credenciais AWS.

#### Passo 3: Inicializar Projeto

```bash
cd StudAI_Layout
amplify init
```

Responda as perguntas:
- Environment: `production`
- Editor: `Visual Studio Code`
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Distribution directory: `dist`
- Build command: `npm run build`
- Start command: `npm run dev`

#### Passo 4: Deploy Backend

```bash
amplify push
```

Isso irá:
- Criar recursos AWS (Cognito, AppSync, DynamoDB)
- Configurar autenticação
- Deploy dos modelos GraphQL
- Configurar permissões

#### Passo 5: Deploy Frontend

```bash
amplify publish
```

Isso irá:
- Build do projeto
- Upload para S3
- Configurar CloudFront
- Retornar URL de produção

#### Passo 6: Configurar Domínio Customizado (Opcional)

```bash
amplify add hosting
```

Escolha:
- Hosting with Amplify Console
- Manual deployment

Depois:
```bash
amplify publish
```

### Opção 2: Amplify Console (UI)

#### Passo 1: Acessar Amplify Console

1. Acesse [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Clique em "New app" → "Host web app"

#### Passo 2: Conectar Repositório

1. Escolha seu provider (GitHub, GitLab, Bitbucket)
2. Autorize o acesso
3. Selecione o repositório
4. Selecione a branch (`main` ou `production`)

#### Passo 3: Configurar Build

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci
        - npx amplify push --yes
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Passo 4: Configurar Variáveis de Ambiente

No Amplify Console:
1. App settings → Environment variables
2. Adicione todas as variáveis do `.env.production`

#### Passo 5: Deploy

1. Clique em "Save and deploy"
2. Aguarde o build (~5-10 minutos)
3. Acesse a URL fornecida

---

## 🌐 Deploy para Vercel

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login

```bash
vercel login
```

### Passo 3: Configurar Projeto

Crie `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_AWS_REGION": "@vite_aws_region",
    "VITE_AWS_USER_POOL_ID": "@vite_aws_user_pool_id",
    "VITE_AWS_USER_POOL_CLIENT_ID": "@vite_aws_user_pool_client_id",
    "VITE_AWS_APPSYNC_ENDPOINT": "@vite_aws_appsync_endpoint"
  }
}
```

### Passo 4: Adicionar Variáveis de Ambiente

```bash
vercel env add VITE_AWS_REGION
vercel env add VITE_AWS_USER_POOL_ID
vercel env add VITE_AWS_USER_POOL_CLIENT_ID
vercel env add VITE_AWS_APPSYNC_ENDPOINT
```

### Passo 5: Deploy

```bash
cd StudAI_Layout
vercel
```

Para produção:
```bash
vercel --prod
```

### Passo 6: Configurar Domínio (Opcional)

```bash
vercel domains add yourdomain.com
```

---

## 🔷 Deploy para Netlify

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login

```bash
netlify login
```

### Passo 3: Configurar Projeto

Crie `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.20.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Passo 4: Inicializar Site

```bash
cd StudAI_Layout
netlify init
```

### Passo 5: Configurar Variáveis de Ambiente

No Netlify UI:
1. Site settings → Environment variables
2. Adicione todas as variáveis

Ou via CLI:
```bash
netlify env:set VITE_AWS_REGION "us-east-1"
netlify env:set VITE_AWS_USER_POOL_ID "your-pool-id"
# ... outras variáveis
```

### Passo 6: Deploy

```bash
netlify deploy --prod
```

---

## 🐳 Deploy com Docker

### Passo 1: Criar Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Passo 2: Criar nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Passo 3: Build Image

```bash
docker build -t studai:latest .
```

### Passo 4: Run Container

```bash
docker run -d \
  -p 80:80 \
  -e VITE_AWS_REGION=us-east-1 \
  -e VITE_AWS_USER_POOL_ID=your-pool-id \
  --name studai \
  studai:latest
```

### Passo 5: Deploy para Registry

```bash
# Tag
docker tag studai:latest your-registry/studai:latest

# Push
docker push your-registry/studai:latest
```

---

## 🔐 Configuração de Segurança

### 1. HTTPS

Certifique-se de que HTTPS está habilitado:

- **AWS Amplify:** Automático
- **Vercel:** Automático
- **Netlify:** Automático
- **Custom:** Configure SSL/TLS certificate

### 2. Security Headers

Adicione headers de segurança:

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

### 3. CORS

Configure CORS no AWS AppSync:
- Allowed origins: `https://yourdomain.com`
- Allowed methods: `GET, POST, PUT, DELETE`
- Allowed headers: `Content-Type, Authorization`

### 4. Rate Limiting

Configure rate limiting no CloudFront ou API Gateway.

---

## 📊 Monitoramento

### AWS CloudWatch

```bash
# Habilitar logs
amplify add analytics

# Deploy
amplify push
```

### Sentry (Error Tracking)

```bash
npm install @sentry/react @sentry/vite-plugin
```

Configure em `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### Google Analytics

```bash
npm install react-ga4
```

Configure em `src/main.tsx`:

```typescript
import ReactGA from "react-ga4";

ReactGA.initialize("G-XXXXXXXXXX");
```

---

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          VITE_AWS_REGION: ${{ secrets.VITE_AWS_REGION }}
          VITE_AWS_USER_POOL_ID: ${{ secrets.VITE_AWS_USER_POOL_ID }}
          VITE_AWS_USER_POOL_CLIENT_ID: ${{ secrets.VITE_AWS_USER_POOL_CLIENT_ID }}
          VITE_AWS_APPSYNC_ENDPOINT: ${{ secrets.VITE_AWS_APPSYNC_ENDPOINT }}
          
      - name: Deploy to Amplify
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Publish
        run: npx amplify publish --yes
```

---

## ✅ Checklist de Deploy

### Pré-Deploy
- [ ] Build local passa sem erros
- [ ] Testes manuais executados
- [ ] Variáveis de ambiente configuradas
- [ ] AWS backend deployado
- [ ] Documentação atualizada

### Deploy
- [ ] Build de produção criado
- [ ] Assets uploadados
- [ ] DNS configurado (se aplicável)
- [ ] SSL/TLS configurado
- [ ] Security headers configurados

### Pós-Deploy
- [ ] Site acessível via HTTPS
- [ ] Autenticação funcionando
- [ ] APIs respondendo
- [ ] Monitoramento configurado
- [ ] Logs habilitados
- [ ] Backup configurado

---

## 🐛 Troubleshooting

### Build Falha

```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### Variáveis de Ambiente Não Carregam

Certifique-se de que:
- Variáveis começam com `VITE_`
- Estão no arquivo `.env.production`
- Foram adicionadas no provedor de hosting

### CORS Errors

Configure CORS no AWS AppSync:
```json
{
  "allowedOrigins": ["https://yourdomain.com"],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["Content-Type", "Authorization"]
}
```

### 404 em Rotas

Configure redirects:
- **Vercel:** Automático
- **Netlify:** `netlify.toml` (já configurado)
- **Nginx:** `try_files $uri /index.html`

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs do build
2. Consulte documentação do provedor
3. Verifique variáveis de ambiente
4. Teste localmente primeiro
5. Entre em contato: deploy@studai.com

---

**Última Atualização:** 20/02/2026  
**Status:** ✅ GUIA COMPLETO
