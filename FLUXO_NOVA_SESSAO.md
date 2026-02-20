# Fluxo: Nova Sessão - Criar Trilha com IA

## Visão Geral

Este documento descreve o fluxo completo da funcionalidade "Nova Sessão" que permite aos usuários criar trilhas de estudo personalizadas com IA.

## Fluxo do Usuário

### 1. Home Page
```
┌─────────────────────────────────────────────────────────┐
│ 👋 Olá, [Nome do Usuário]!                              │
├─────────────────────────────────────────────────────────┤
│ [Estatísticas do Usuário]                               │
│ • Horas Estudadas  • Dias Conectado  • Módulos         │
├─────────────────────────────────────────────────────────┤
│ ✨ Nova Sessão                                          │
│ Crie uma trilha de estudos personalizada com IA         │
│ respondendo algumas perguntas                           │
│                                                          │
│ [Criar Trilha com IA →]                                 │
├─────────────────────────────────────────────────────────┤
│ [Outras seções da home...]                              │
└─────────────────────────────────────────────────────────┘
```

### 2. Página de Questionário (/criar-trilha)

#### Etapa 1/6: Assunto
```
┌─────────────────────────────────────────────────────────┐
│ ✨ Criar Trilha Personalizada                           │
│ Responda algumas perguntas para que a IA crie uma       │
│ trilha de estudos perfeita para você                    │
├─────────────────────────────────────────────────────────┤
│ Etapa 1 de 6                              17% completo  │
│ [████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]             │
├─────────────────────────────────────────────────────────┤
│ O que você quer estudar?                                │
│ Seja específico. Ex: "React com TypeScript"             │
│                                                          │
│ [_____________________________________________]          │
│                                                          │
│ [← Voltar]                            [Próximo →]       │
└─────────────────────────────────────────────────────────┘
```

#### Etapa 2/6: Objetivo
```
┌─────────────────────────────────────────────────────────┐
│ Etapa 2 de 6                              33% completo  │
│ [████████████████░░░░░░░░░░░░░░░░░░░░░░░░]             │
├─────────────────────────────────────────────────────────┤
│ Qual é o seu objetivo com este estudo?                  │
│ Ex: "Conseguir um emprego", "Passar em certificação"    │
│                                                          │
│ [_____________________________________________]          │
│ [_____________________________________________]          │
│ [_____________________________________________]          │
│                                                          │
│ [← Voltar]                            [Próximo →]       │
└─────────────────────────────────────────────────────────┘
```

#### Etapa 3/6: Nível de Conhecimento
```
┌─────────────────────────────────────────────────────────┐
│ Etapa 3 de 6                              50% completo  │
│ [████████████████████████░░░░░░░░░░░░░░░░]             │
├─────────────────────────────────────────────────────────┤
│ Qual é o seu nível de conhecimento atual?               │
│                                                          │
│ ○ Iniciante                                             │
│   Nunca estudei ou tenho muito pouco conhecimento       │
│                                                          │
│ ○ Intermediário                                         │
│   Já tenho alguma experiência e conhecimento básico     │
│                                                          │
│ ○ Avançado                                              │
│   Tenho bastante experiência e quero me aprofundar      │
│                                                          │
│ [← Voltar]                            [Próximo →]       │
└─────────────────────────────────────────────────────────┘
```

#### Etapa 4/6: Tempo Disponível
```
┌─────────────────────────────────────────────────────────┐
│ Etapa 4 de 6                              67% completo  │
│ [████████████████████████████████░░░░░░░░]             │
├─────────────────────────────────────────────────────────┤
│ Quanto tempo você pode dedicar por semana?              │
│                                                          │
│ [Selecione o tempo disponível ▼]                        │
│   • 1-3 horas por semana                                │
│   • 4-7 horas por semana                                │
│   • 8-14 horas por semana                               │
│   • 15+ horas por semana                                │
│                                                          │
│ [← Voltar]                            [Próximo →]       │
└─────────────────────────────────────────────────────────┘
```

#### Etapa 5/6: Estilo de Aprendizagem
```
┌─────────────────────────────────────────────────────────┐
│ Etapa 5 de 6                              83% completo  │
│ [████████████████████████████████████████░░]           │
├─────────────────────────────────────────────────────────┤
│ Como você prefere aprender?                             │
│                                                          │
│ ○ Vídeos e aulas práticas                               │
│   Prefiro assistir e acompanhar demonstrações           │
│                                                          │
│ ○ Leitura e documentação                                │
│   Prefiro ler artigos, livros e documentação            │
│                                                          │
│ ○ Prática e projetos                                    │
│   Prefiro aprender fazendo e construindo projetos       │
│                                                          │
│ ○ Misto (todos os tipos)                                │
│   Gosto de variar entre diferentes formatos             │
│                                                          │
│ [← Voltar]                            [Próximo →]       │
└─────────────────────────────────────────────────────────┘
```

#### Etapa 6/6: Detalhes Finais + Resumo
```
┌─────────────────────────────────────────────────────────┐
│ Etapa 6 de 6                             100% completo  │
│ [████████████████████████████████████████████]         │
├─────────────────────────────────────────────────────────┤
│ Você tem algum prazo? (Opcional)                        │
│ [_____________________________________________]          │
│                                                          │
│ Há algum tópico específico? (Opcional)                  │
│ [_____________________________________________]          │
│ [_____________________________________________]          │
├─────────────────────────────────────────────────────────┤
│ ✨ Resumo da sua trilha                                 │
│                                                          │
│ Assunto: React com TypeScript                           │
│ Objetivo: Conseguir emprego como dev frontend           │
│ Nível: Intermediário                                    │
│ Tempo semanal: 8-14 horas                               │
│ Estilo: Misto                                           │
│                                                          │
│ [← Voltar]                    [✓ Criar Trilha]          │
└─────────────────────────────────────────────────────────┘
```

### 3. Geração da Trilha
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│              [⟳ Gerando trilha...]                      │
│                                                          │
│     A IA está criando sua trilha personalizada          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 4. Redirecionamento
```
Após geração bem-sucedida:
→ Redireciona para /explorar
→ Toast de sucesso: "Trilha criada com sucesso!"
```

## Dados Coletados

### Do Questionário
```typescript
{
  topic: "React com TypeScript",
  goal: "Conseguir emprego como dev frontend",
  currentKnowledge: "intermediate",
  timeAvailable: "8-14",
  learningStyle: "mixed",
  deadline: "3 meses",
  specificTopics: "Hooks, Context API, TypeScript avançado"
}
```

### Das Preferências Salvas (LearningPreference)
```typescript
{
  interests: ["Web Development", "Mobile Development"],
  minutesPerDay: 60,
  days: ["monday", "wednesday", "friday"],
  formats: ["video", "hands-on"],
  contentLength: "medium"
}
```

### Combinação para IA
```typescript
{
  // Contexto específico do questionário
  topic: "React com TypeScript",
  goal: "Conseguir emprego como dev frontend",
  currentKnowledge: "intermediate",
  timeAvailable: "8-14 horas/semana",
  learningStyle: "mixed",
  deadline: "3 meses",
  specificTopics: ["Hooks", "Context API", "TypeScript avançado"],
  
  // Preferências gerais do usuário
  interests: ["Web Development", "Mobile Development"],
  dailyTime: 60,
  availableDays: ["monday", "wednesday", "friday"],
  preferredFormats: ["video", "hands-on"],
  contentLength: "medium"
}
```

## Benefícios da Integração na Home

1. **Visibilidade**: Card destacado na home aumenta descoberta da funcionalidade
2. **Acesso Rápido**: Um clique para iniciar criação de trilha
3. **Call-to-Action Claro**: Visual atraente convida à ação
4. **Contexto**: Usuário já está no mindset de aprendizado na home
5. **Fluxo Natural**: Após ver estatísticas, usuário pode criar nova trilha

## Próximos Passos

1. **Implementar API de Geração**
   - Integrar com modelo de IA (Amazon Nova Micro)
   - Processar dados do questionário + preferências
   - Gerar estrutura de trilha personalizada

2. **Salvar Trilha Gerada**
   - Criar registro no modelo `Track`
   - Associar módulos e conteúdos
   - Iniciar `UserTrackProgress`

3. **Melhorias de UX**
   - Animações de transição entre etapas
   - Preview da trilha antes de confirmar
   - Opção de editar trilha após geração

4. **Analytics**
   - Rastrear quantos usuários iniciam o questionário
   - Taxa de conclusão por etapa
   - Tipos de trilhas mais criadas
