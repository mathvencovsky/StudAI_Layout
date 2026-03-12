# 📝 Editores de Quiz e Exercício - Guia Completo

## 🎯 Visão Geral

Editores completos para criar quizzes e exercícios com perguntas, respostas, instruções e critérios de avaliação.

---

## 🧪 Editor de Quiz

### Funcionalidades

**Configurações Gerais:**
- ✅ Nota mínima para aprovação (%)
- ✅ Tempo limite (opcional)
- ✅ Permitir refazer
- ✅ Mostrar feedback imediato
- ✅ Embaralhar questões
- ✅ Embaralhar opções

**Tipos de Questões:**
1. **Múltipla Escolha** - Várias opções, uma correta
2. **Verdadeiro/Falso** - Duas opções
3. **Resposta Curta** - Texto livre
4. **Dissertativa** - Resposta longa

**Para Cada Questão:**
- ✅ Pergunta
- ✅ Tipo
- ✅ Pontos
- ✅ Opções de resposta (múltipla escolha)
- ✅ Resposta correta
- ✅ Explicação
- ✅ Reordenar (drag handle)
- ✅ Expandir/colapsar
- ✅ Excluir

### Como Usar

1. **Selecione "Quiz"** como tipo de conteúdo
2. **Configure o quiz**:
   - Nota mínima: 70%
   - Tempo limite: 30 minutos (opcional)
   - Ative/desative opções

3. **Adicione questões**:
   - Clique "+ Adicionar Questão"
   - Digite a pergunta
   - Escolha o tipo
   - Defina os pontos

4. **Configure as opções** (múltipla escolha):
   - Digite o texto de cada opção
   - Clique no círculo para marcar a correta (✓)
   - Adicione mais opções se necessário
   - Exclua opções extras

5. **Adicione explicação** (opcional):
   - Explique por que a resposta está correta
   - Será mostrada após o aluno responder

### Exemplo de Quiz

```
Título: Fundamentos de React
Nota Mínima: 70%
Tempo Limite: 20 minutos

Questão 1: O que é JSX? (2 pontos)
Tipo: Múltipla Escolha
Opções:
  ○ Uma linguagem de programação
  ● Uma extensão de sintaxe para JavaScript ✓
  ○ Um framework
  ○ Uma biblioteca CSS
Explicação: JSX é uma extensão de sintaxe que permite escrever HTML dentro do JavaScript.

Questão 2: React é uma biblioteca ou framework? (1 ponto)
Tipo: Resposta Curta
Resposta Correta: biblioteca
Explicação: React é uma biblioteca JavaScript para construir interfaces de usuário.
```

---

## 💪 Editor de Exercício

### Funcionalidades

**Configurações Gerais:**
- ✅ Tempo estimado (minutos)
- ✅ Dificuldade (iniciante/intermediário/avançado)
- ✅ Tipo de entrega (texto/arquivo/link/código)

**Instruções Passo a Passo:**
- ✅ Título do passo
- ✅ Descrição detalhada
- ✅ Ordem (drag handle)
- ✅ Adicionar/remover passos

**Recursos Necessários:**
- ✅ Título do recurso
- ✅ URL
- ✅ Tipo (link/arquivo/vídeo)
- ✅ Adicionar/remover recursos

**Critérios de Avaliação:**
- ✅ Descrição do critério
- ✅ Pontos
- ✅ Total de pontos calculado
- ✅ Adicionar/remover critérios

### Como Usar

1. **Selecione "Exercício"** como tipo de conteúdo

2. **Configure o exercício**:
   - Tempo estimado: 60 minutos
   - Dificuldade: Intermediário
   - Tipo de entrega: Código

3. **Adicione instruções**:
   - Clique "+ Adicionar Passo"
   - Passo 1: "Configure o ambiente"
   - Passo 2: "Implemente a função"
   - Passo 3: "Teste o código"

4. **Adicione recursos**:
   - Documentação oficial
   - Vídeo tutorial
   - Arquivo de exemplo

5. **Defina critérios de avaliação**:
   - "Código funcional" - 5 pontos
   - "Código bem estruturado" - 3 pontos
   - "Testes implementados" - 2 pontos
   - Total: 10 pontos

### Exemplo de Exercício

```
Título: Criar um Componente React
Tempo Estimado: 45 minutos
Dificuldade: Intermediário
Tipo de Entrega: Código

Instruções:
1. Configure o ambiente
   - Instale Node.js e npm
   - Crie um novo projeto React

2. Crie o componente
   - Crie um componente funcional
   - Adicione props e state

3. Estilize o componente
   - Use CSS modules
   - Torne responsivo

Recursos Necessários:
- Documentação React: https://react.dev
- Vídeo Tutorial: https://youtube.com/...
- Código Base: https://github.com/...

Critérios de Avaliação:
- Componente funcional (5 pontos)
- Props implementadas (3 pontos)
- Estilização adequada (2 pontos)
Total: 10 pontos
```

---

## 🎨 Interface

### Quiz Editor

```
┌─────────────────────────────────────────────────────┐
│ CONFIGURAÇÕES DO QUIZ                               │
│ Nota Mínima: [70%]  Tempo Limite: [30 min]        │
│ ☑ Permitir Refazer  ☑ Feedback Imediato           │
│ ☐ Embaralhar Questões  ☐ Embaralhar Opções        │
├─────────────────────────────────────────────────────┤
│ QUESTÕES (3)                    [+ Adicionar]      │
│                                                     │
│ ┌─ Questão 1 ─────────────────────────────┐       │
│ │ ≡ [Questão 1] [2 pontos]        [▼] [×] │       │
│ │                                           │       │
│ │ Pergunta: [O que é JSX?]                 │       │
│ │ Tipo: [Múltipla Escolha ▼]  Pontos: [2] │       │
│ │                                           │       │
│ │ Opções:                                   │       │
│ │ ○ [Uma linguagem]                         │       │
│ │ ● [Extensão de sintaxe] ✓                │       │
│ │ ○ [Um framework]                          │       │
│ │ [+ Adicionar Opção]                       │       │
│ │                                           │       │
│ │ Explicação: [JSX é...]                   │       │
│ └───────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### Exercise Editor

```
┌─────────────────────────────────────────────────────┐
│ CONFIGURAÇÕES DO EXERCÍCIO                          │
│ Tempo: [60 min]  Dificuldade: [Intermediário ▼]   │
│ Tipo de Entrega: [Código ▼]                       │
├─────────────────────────────────────────────────────┤
│ INSTRUÇÕES (3)                  [+ Adicionar]      │
│ ┌─ Passo 1 ───────────────────────────────┐       │
│ │ ≡ Título: [Configure o ambiente]    [×] │       │
│ │   Descrição: [Instale Node.js...]       │       │
│ └──────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────┤
│ RECURSOS (2)                    [+ Adicionar]      │
│ ┌─────────────────────────────────────────┐       │
│ │ Título: [Documentação React]        [×] │       │
│ │ URL: [https://react.dev]                │       │
│ └─────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────┤
│ CRITÉRIOS DE AVALIAÇÃO          [+ Adicionar]      │
│ Total: 10 pontos                                    │
│ [Código funcional]              [5]  [×]           │
│ [Bem estruturado]               [3]  [×]           │
│ [Testes implementados]          [2]  [×]           │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Teste Rápido

### Teste 1: Criar Quiz

1. Acesse: http://localhost:5173/admin/content-create
2. Selecione "Quiz"
3. Configure:
   - Nota mínima: 70%
   - Ative "Permitir Refazer"
4. Adicione questão:
   - Pergunta: "O que é React?"
   - Tipo: Múltipla Escolha
   - Adicione 4 opções
   - Marque a correta
5. Adicione explicação
6. Clique "Criar Conteúdo"

### Teste 2: Criar Exercício

1. Selecione "Exercício"
2. Configure:
   - Tempo: 45 minutos
   - Dificuldade: Intermediário
3. Adicione 3 passos
4. Adicione 2 recursos
5. Adicione 3 critérios de avaliação
6. Clique "Criar Conteúdo"

---

## 📊 Estrutura de Dados

### Quiz

```typescript
{
  title: string,
  passingScore: number,
  timeLimit?: number,
  allowRetry: boolean,
  showFeedbackImmediately: boolean,
  shuffleQuestions: boolean,
  shuffleOptions: boolean,
  questions: [
    {
      id: string,
      type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay',
      question: string,
      points: number,
      options: [
        { id: string, text: string, isCorrect: boolean, explanation?: string }
      ],
      correctAnswer?: string,
      explanation?: string,
      order: number
    }
  ]
}
```

### Exercise

```typescript
{
  title: string,
  description: string,
  estimatedMinutes: number,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  submissionType: 'text' | 'file' | 'link' | 'code',
  instructions: [
    { id: string, title: string, description: string, order: number }
  ],
  requiredResources: [
    { id: string, title: string, url: string, type: 'link' | 'file' | 'video' }
  ],
  evaluationCriteria: [
    { id: string, criterion: string, points: number }
  ]
}
```

---

## ✅ Funcionalidades Implementadas

### Quiz Editor
- [x] Configurações gerais
- [x] Adicionar/remover questões
- [x] 4 tipos de questões
- [x] Múltiplas opções
- [x] Marcar resposta correta
- [x] Explicações
- [x] Expandir/colapsar
- [x] Pontuação por questão

### Exercise Editor
- [x] Configurações gerais
- [x] Instruções passo a passo
- [x] Recursos necessários
- [x] Critérios de avaliação
- [x] Cálculo de pontos total
- [x] Adicionar/remover itens

---

## 🔜 Próximas Features

- [ ] Drag and drop para reordenar
- [ ] Preview do quiz/exercício
- [ ] Importar questões de arquivo
- [ ] Banco de questões
- [ ] Templates prontos
- [ ] Validação avançada
- [ ] Estatísticas de dificuldade

---

**Versão**: 1.0.0  
**Data**: Março 2026  
**Status**: ✅ Completo e Funcional

**Teste agora**: http://localhost:5173/admin/content-create
