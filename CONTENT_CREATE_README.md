# 📝 Criador de Conteúdo - Guia Completo

## 🎯 Visão Geral

Sistema completo para adicionar novos conteúdos à plataforma com extração automática de dados do YouTube.

---

## 🚀 Como Acessar

### Opção 1: Pelo Gerenciador de Conteúdo
1. Acesse: http://localhost:5173/admin/content-manager
2. Clique no botão "Novo Conteúdo"

### Opção 2: Acesso Direto
- URL: http://localhost:5173/admin/content-create

---

## ✨ Funcionalidades

### 📺 Extração Automática do YouTube

**Como usar:**
1. Selecione "Vídeo do YouTube" como tipo
2. Cole a URL do vídeo (qualquer formato):
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `https://www.youtube.com/embed/VIDEO_ID`
3. Clique em "Extrair Dados"
4. Os campos serão preenchidos automaticamente:
   - ✅ Título
   - ✅ Descrição
   - ✅ Autor (canal)
   - ✅ Duração
   - ✅ Thumbnail
   - ✅ Tags
   - ✅ Data de publicação

### 📋 Tipos de Conteúdo Suportados

1. **Vídeo do YouTube** 🎥
   - Extração automática de dados
   - Preview da thumbnail
   - Duração automática

2. **Artigo** 📄
   - URL do artigo
   - Conteúdo em texto

3. **Podcast** 🎙️
   - URL do podcast
   - Número do episódio

4. **Quiz** ✅
   - Questões e respostas
   - Pontuação

5. **Exercício** 💪
   - Prática guiada
   - Critérios de avaliação

6. **Documento** 📁
   - Upload de arquivos
   - PDFs, apresentações, etc.

---

## 📝 Formulário

### Campos Obrigatórios
- **Tipo**: Selecione o tipo de conteúdo
- **Título**: Nome do conteúdo

### Campos Opcionais
- **Descrição**: Detalhes sobre o conteúdo
- **Categoria**: Ex: Programação, Design, Marketing
- **Nível**: Iniciante, Intermediário, Avançado
- **Duração**: Em minutos
- **Autor**: Nome do criador
- **Idioma**: pt-BR, en, es
- **Tags**: Palavras-chave para busca

---

## 🔧 Configuração da API do YouTube

### Obter API Key (Opcional)

**Nota**: Se não configurar, o sistema usa dados mock para desenvolvimento.

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um novo projeto ou selecione um existente
3. Ative a "YouTube Data API v3"
4. Crie credenciais (API Key)
5. Copie a chave

### Configurar no Projeto

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env`:
   ```env
   VITE_YOUTUBE_API_KEY=sua_chave_aqui
   ```

3. Reinicie o servidor:
   ```bash
   npm run dev
   ```

### Dados Extraídos com API Real

Com a API configurada, você obtém:
- ✅ Título oficial
- ✅ Descrição completa
- ✅ Nome do canal
- ✅ Duração exata
- ✅ Thumbnail em alta resolução
- ✅ Data de publicação
- ✅ Visualizações
- ✅ Likes
- ✅ Tags originais

### Dados Mock (Sem API)

Sem a API, o sistema retorna dados de exemplo:
- ✅ Título genérico
- ✅ Descrição de exemplo
- ✅ Duração padrão (30 min)
- ✅ Thumbnail do YouTube
- ✅ Tags de exemplo

---

## 🎨 Interface

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ [← Voltar]                                              │
│                                                          │
│ Criar Novo Conteúdo                                     │
│ Adicione vídeos, artigos, podcasts...                  │
├─────────────────────────────────────────────────────────┤
│ TIPO DE CONTEÚDO                                        │
│ ┌────────┬────────┬────────┐                           │
│ │ 🎥     │ 📄     │ 🎙️     │                           │
│ │ Vídeo  │ Artigo │ Podcast│                           │
│ └────────┴────────┴────────┘                           │
├─────────────────────────────────────────────────────────┤
│ URL DO YOUTUBE (se vídeo)                               │
│ [https://youtube.com/...] [✨ Extrair Dados]          │
│ ✓ Dados extraídos com sucesso!                         │
│ [Preview da Thumbnail]                                  │
├─────────────────────────────────────────────────────────┤
│ INFORMAÇÕES BÁSICAS                                     │
│ Título: [_____________________]                         │
│ Descrição: [__________________]                         │
│ Categoria: [_____] Nível: [_____]                      │
│ Duração: [___] Autor: [_____]                          │
├─────────────────────────────────────────────────────────┤
│ TAGS                                                     │
│ [Digite uma tag] [Adicionar]                           │
│ [React ×] [JavaScript ×] [Tutorial ×]                  │
├─────────────────────────────────────────────────────────┤
│                          [Cancelar] [Criar Conteúdo]   │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Teste Rápido

### Teste 1: Criar Vídeo do YouTube

1. Acesse: http://localhost:5173/admin/content-create
2. Selecione "Vídeo do YouTube"
3. Cole uma URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. Clique "Extrair Dados"
5. Aguarde (1-2 segundos)
6. Veja os campos preenchidos automaticamente
7. Adicione tags se desejar
8. Clique "Criar Conteúdo"

### Teste 2: Criar Artigo

1. Selecione "Artigo"
2. Preencha título: "Como aprender React"
3. Preencha descrição
4. Selecione categoria e nível
5. Adicione tags
6. Clique "Criar Conteúdo"

### Teste 3: Validação

1. Tente criar sem título → Deve mostrar erro
2. Tente extrair URL inválida → Deve mostrar erro
3. Adicione tag duplicada → Não deve adicionar

---

## 🔄 Fluxo de Dados

### Com API do YouTube

```
1. Usuário cola URL
2. Sistema extrai videoId
3. Faz request para YouTube API
4. Recebe dados completos
5. Preenche formulário
6. Usuário revisa/edita
7. Submete formulário
8. Salva no banco de dados
```

### Sem API (Mock)

```
1. Usuário cola URL
2. Sistema extrai videoId
3. Retorna dados mock
4. Preenche formulário
5. Usuário revisa/edita
6. Submete formulário
7. Salva no banco de dados
```

---

## 📊 Estrutura de Dados

### ContentFormData

```typescript
{
  type: 'video' | 'article' | 'podcast' | 'quiz' | 'exercise' | 'document',
  title: string,
  description: string,
  category?: string,
  level?: 'beginner' | 'intermediate' | 'advanced',
  duration?: number, // minutos
  author?: string,
  language?: string,
  
  // Vídeo
  videoUrl?: string,
  videoId?: string,
  thumbnail?: string,
  
  // Artigo
  articleUrl?: string,
  articleContent?: string,
  
  // Podcast
  podcastUrl?: string,
  podcastEpisode?: string,
  
  // IA
  transcript?: string,
  summary?: string,
  
  // Metadados
  tags: string[],
  publishedAt?: Date,
}
```

---

## 🔜 Próximas Features

### Extração de Dados
- [ ] Extração de artigos (título, autor, conteúdo)
- [ ] Extração de podcasts (Spotify, Apple Podcasts)
- [ ] OCR para documentos PDF
- [ ] Transcrição automática de vídeos (IA)
- [ ] Resumo automático (IA)

### Validações
- [ ] Verificar se conteúdo já existe
- [ ] Validar URLs
- [ ] Verificar duplicatas
- [ ] Limites de caracteres

### Upload
- [ ] Upload de arquivos (PDF, DOCX, etc.)
- [ ] Upload de imagens
- [ ] Drag and drop
- [ ] Progress bar

### Integração
- [ ] Salvar no banco de dados
- [ ] Notificações de sucesso/erro
- [ ] Preview antes de publicar
- [ ] Rascunhos automáticos

---

## 🐛 Troubleshooting

### Extração não funciona

**Problema**: Botão "Extrair Dados" não faz nada

**Soluções**:
1. Verifique se a URL é válida
2. Verifique o console do navegador (F12)
3. Verifique se há API key configurada
4. Tente com dados mock (sem API key)

### Erro de CORS

**Problema**: Erro de CORS ao chamar YouTube API

**Solução**: 
- Em produção, mova a chamada para o backend
- Use proxy ou servidor intermediário
- Configure CORS no Google Cloud Console

### Campos não preenchem

**Problema**: Dados extraídos mas campos vazios

**Solução**:
1. Verifique o console para erros
2. Verifique se os dados foram retornados
3. Limpe o cache do navegador

---

## 📝 Notas Técnicas

### Arquivos Criados

1. **Rota**: `src/routes/admin.content-create.tsx`
2. **Página**: `src/components/admin/content-create/content-create-page.tsx`
3. **Tipos**: `src/types/content-create.ts`
4. **Extrator**: `src/lib/youtube-extractor.ts`
5. **Env**: `.env.example`

### Dependências

- React (formulário)
- TanStack Router (navegação)
- Shadcn/ui (componentes)
- Lucide Icons (ícones)
- YouTube Data API v3 (opcional)

### Segurança

⚠️ **IMPORTANTE**: Em produção:
1. Mova chamadas de API para o backend
2. Não exponha API keys no frontend
3. Valide dados no servidor
4. Sanitize inputs do usuário
5. Implemente rate limiting

---

## ✅ Checklist de Implementação

### Frontend (Completo)
- [x] Interface de criação
- [x] Seletor de tipos
- [x] Formulário completo
- [x] Extração do YouTube
- [x] Validações básicas
- [x] Preview de thumbnail
- [x] Sistema de tags
- [x] Responsividade

### Backend (Pendente)
- [ ] Endpoint POST /api/content
- [ ] Validações server-side
- [ ] Salvar no banco de dados
- [ ] Upload de arquivos
- [ ] Processamento assíncrono
- [ ] Notificações

### Integrações (Pendente)
- [ ] YouTube API (backend)
- [ ] Transcrição de vídeo
- [ ] Resumo com IA
- [ ] Extração de artigos
- [ ] Extração de podcasts

---

**Versão**: 1.0.0  
**Data**: Março 2026  
**Status**: ✅ Interface Completa - Backend Pendente

**Próximo Passo**: Integrar com API backend e banco de dados
