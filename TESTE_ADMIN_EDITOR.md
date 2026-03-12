# Guia de Teste - Editor de Trilhas Admin

## 🚀 Como Testar

### 1. Iniciar o Projeto

```bash
cd StudAI_Layout
npm install
npm run dev
```

### 2. Acessar o Editor

1. Abra o navegador em `http://localhost:5173`
2. Navegue para `/admin`
3. Clique em "Nova Trilha" ou "Editar Trilha de Exemplo"

## ✅ Checklist de Testes

### Navegação e Layout

- [ ] Header aparece fixo no topo
- [ ] Sidebar esquerda mostra estrutura da trilha
- [ ] Painel direito mostra propriedades
- [ ] Área central mostra conteúdo selecionado
- [ ] Breadcrumb funciona corretamente

### Gerenciamento de Módulos

- [ ] Clicar em "Adicionar Módulo" cria novo módulo
- [ ] Módulo aparece na árvore
- [ ] Clicar no módulo seleciona e mostra detalhes
- [ ] Editar título inline (duplo clique)
- [ ] Menu contextual (⋮) mostra opções
- [ ] Duplicar módulo funciona
- [ ] Excluir módulo funciona (com confirmação)

### Gerenciamento de Aulas

- [ ] Expandir módulo mostra botão "Adicionar Aula"
- [ ] Adicionar aula funciona
- [ ] Aula aparece na árvore
- [ ] Clicar na aula mostra editor
- [ ] Editar título inline funciona
- [ ] Duplicar aula funciona
- [ ] Excluir aula funciona

### Blocos de Conteúdo

#### Vídeo
- [ ] Botão "Adicionar Conteúdo" > "Vídeo" funciona
- [ ] Mostra placeholder "Selecione um vídeo"
- [ ] Configurações avançadas (início/fim) funcionam
- [ ] Notas do instrutor podem ser adicionadas

#### Texto
- [ ] Adicionar bloco de texto funciona
- [ ] Seletor de tipo (Normal, Callout, Nota, Destaque) funciona
- [ ] Textarea aceita conteúdo
- [ ] Preview mostra formatação correta
- [ ] Contador de caracteres/palavras funciona

#### Quiz
- [ ] Adicionar quiz funciona
- [ ] Configurações (título, nota de aprovação) funcionam
- [ ] Adicionar questão funciona
- [ ] Adicionar alternativas funciona
- [ ] Marcar resposta correta funciona
- [ ] Adicionar explicação funciona
- [ ] Excluir questão funciona

#### Exercício
- [ ] Adicionar exercício funciona
- [ ] Campos de título e descrição funcionam
- [ ] Instruções (múltiplas linhas) funcionam
- [ ] Tempo estimado funciona

#### Recursos
- [ ] Adicionar recursos funciona
- [ ] Adicionar link funciona
- [ ] Campos de título, URL e descrição funcionam
- [ ] Excluir link funciona

### Painel de Propriedades

#### Trilha Selecionada
- [ ] Mostra "Propriedades da Trilha"
- [ ] Editar título funciona
- [ ] Editar descrição funciona
- [ ] Seletor de nível funciona
- [ ] Duração estimada funciona
- [ ] Adicionar/remover tags funciona
- [ ] Mostra data de criação e última edição

#### Módulo Selecionado
- [ ] Mostra "Propriedades do Módulo"
- [ ] Editar título funciona
- [ ] Editar descrição funciona
- [ ] Duração estimada funciona
- [ ] Mostra status (Completo/Incompleto)
- [ ] Mostra contagem de aulas

#### Aula Selecionada
- [ ] Mostra "Propriedades da Aula"
- [ ] Editar título funciona
- [ ] Editar descrição funciona
- [ ] Duração estimada funciona
- [ ] Mostra status
- [ ] Lista blocos de conteúdo

### Overview da Trilha

- [ ] Cards de estatísticas mostram números corretos
- [ ] Barra de progresso funciona
- [ ] Lista de pendências aparece quando há problemas
- [ ] Mostra "Pronta para publicação" quando completa
- [ ] Últimas edições aparecem
- [ ] Informações (nível, status, tags) corretas

### Indicadores de Status

- [ ] ✓ (verde) para itens completos
- [ ] ⚠ (amarelo) para itens incompletos
- [ ] ⭕ (cinza) para itens vazios
- [ ] Barra de progresso por módulo funciona
- [ ] Contador de aulas completas funciona

### Busca

- [ ] Campo de busca na sidebar funciona
- [ ] Busca por título de módulo funciona
- [ ] Busca por título de aula funciona
- [ ] Resultados são destacados
- [ ] Módulos com resultados expandem automaticamente

### Header e Ações

- [ ] Indicador de autosave mostra status
- [ ] Botão "Preview" abre menu
- [ ] Botão "Publicar" está visível
- [ ] Menu de opções (⋮) funciona
- [ ] Breadcrumb é clicável

### Responsividade

- [ ] Layout funciona em desktop (>1280px)
- [ ] Layout funciona em tablet (768-1280px)
- [ ] Layout funciona em mobile (<768px)
- [ ] Sidebar colapsa em telas pequenas
- [ ] Painel de propriedades colapsa em telas pequenas

## 🐛 Bugs Conhecidos para Verificar

1. **Drag-and-Drop**: Não implementado ainda (apenas visual)
2. **Autosave**: Não conectado ao backend
3. **Biblioteca de Vídeos**: Modal placeholder
4. **Validação de Publicação**: Não implementada completamente

## 📊 Testes de Performance

- [ ] Trilha com 10 módulos carrega rápido
- [ ] Trilha com 50 aulas carrega rápido
- [ ] Adicionar 20 blocos de conteúdo não trava
- [ ] Busca em trilha grande é instantânea
- [ ] Scroll na árvore é suave

## 🎯 Cenários de Uso Real

### Cenário 1: Criar Trilha do Zero
1. Clicar em "Nova Trilha"
2. Editar título e descrição no painel direito
3. Adicionar 3 módulos
4. Adicionar 2 aulas em cada módulo
5. Adicionar conteúdo em cada aula
6. Verificar overview mostra progresso

### Cenário 2: Editar Trilha Existente
1. Clicar em "Editar Trilha de Exemplo"
2. Navegar pela estrutura
3. Editar uma aula existente
4. Adicionar novo bloco de conteúdo
5. Verificar mudanças refletem na árvore

### Cenário 3: Criar Quiz Completo
1. Selecionar uma aula
2. Adicionar bloco de quiz
3. Configurar título e nota de aprovação
4. Adicionar 5 questões
5. Cada questão com 4 alternativas
6. Marcar respostas corretas
7. Adicionar explicações
8. Verificar validação

### Cenário 4: Organizar Estrutura
1. Criar 5 módulos
2. Adicionar aulas em ordem aleatória
3. Usar árvore para visualizar estrutura
4. Duplicar módulo
5. Excluir módulo
6. Verificar ordem atualiza

## 📝 Notas de Teste

### O Que Funciona
- ✅ Criação de trilhas, módulos e aulas
- ✅ Todos os tipos de blocos de conteúdo
- ✅ Edição de propriedades
- ✅ Navegação pela estrutura
- ✅ Indicadores de status
- ✅ Validações básicas
- ✅ Interface responsiva

### O Que Precisa de Backend
- ⚠️ Autosave real
- ⚠️ Biblioteca de vídeos
- ⚠️ Publicação
- ⚠️ Versionamento
- ⚠️ Permissões
- ⚠️ Analytics

### O Que Precisa de Bibliotecas Externas
- ⚠️ Drag-and-drop (react-dnd ou dnd-kit)
- ⚠️ Editor de texto rico (Tiptap)
- ⚠️ Upload de imagens
- ⚠️ Player de vídeo customizado

## 🎉 Resultado Esperado

Ao final dos testes, você deve ter:
- Uma trilha completa criada
- Múltiplos módulos e aulas
- Diversos tipos de blocos de conteúdo
- Estrutura organizada e navegável
- Interface fluida e responsiva

## 📞 Reportar Problemas

Se encontrar bugs ou problemas:
1. Anote o cenário exato
2. Tire screenshot se possível
3. Verifique o console do navegador
4. Verifique o Zustand DevTools

---

**Boa sorte nos testes!** 🚀
