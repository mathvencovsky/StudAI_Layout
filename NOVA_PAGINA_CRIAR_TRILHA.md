# Nova Página: Criar Trilha com IA

## Resumo

Foi criada uma nova página de questionário estruturado para criar trilhas de estudo personalizadas usando IA. A página coleta informações específicas do usuário através de um formulário multi-etapas antes de gerar a trilha.

## Integração na Home Page

A página está agora acessível diretamente da home page através de um card destacado chamado "Nova Sessão", posicionado logo após as estatísticas do usuário.

### Componente Criado
- **Arquivo**: `src/components/dashboard/new-session-card.tsx`
- **Descrição**: Card com visual destacado (gradiente primary) que convida o usuário a criar uma nova trilha com IA
- **Posição**: Logo após o `StatsCards` e antes do `NextActionCard` na home page

## Arquivos Criados/Modificados

### 1. Nova Rota
- **Arquivo**: `src/routes/criar-trilha.tsx`
- **Rota**: `/criar-trilha`
- **Descrição**: Rota que renderiza o componente de questionário para criar trilha com IA

### 2. Componente Atualizado
- **Arquivo**: `src/components/tracks/criar-trilha-page.tsx`
- **Mudanças**:
  - Adicionado suporte a i18n (internacionalização)
  - Todas as strings foram substituídas por chaves de tradução
  - Mantida a estrutura de questionário em 6 etapas

### 3. Novo Card na Home
- **Arquivo**: `src/components/dashboard/new-session-card.tsx`
- **Funcionalidade**: 
  - Botão call-to-action para criar trilha com IA
  - Visual destacado com gradiente e ícone Sparkles
  - Navegação direta para `/criar-trilha`

### 4. Home Page Atualizada
- **Arquivo**: `src/components/home/home-page.tsx`
- **Mudanças**:
  - Importado `NewSessionCard`
  - Adicionado card na posição de destaque (após stats, antes de AI recommendation)

### 5. Traduções Adicionadas

#### Português (pt-BR)
- **Arquivo**: `src/i18n/locales/pt-BR/common.ts`
- **Novas chaves**: 
  - 50+ chaves de tradução para o questionário
  - 3 chaves para o card "Nova Sessão"

#### Inglês (en)
- **Arquivo**: `src/i18n/locales/en/common.ts`
- **Novas chaves**: 
  - 50+ chaves de tradução para o questionário
  - 3 chaves para o card "Nova Sessão"

## Estrutura do Questionário

### Etapa 1: Assunto
- Campo de texto livre
- Pergunta: "O que você quer estudar?"
- Exemplos fornecidos para orientar o usuário

### Etapa 2: Objetivo
- Campo de texto longo (textarea)
- Pergunta: "Qual é o seu objetivo com este estudo?"
- Exemplos: conseguir emprego, passar em certificação, projeto pessoal

### Etapa 3: Nível de Conhecimento
- Seleção única (radio buttons)
- Opções:
  - Iniciante
  - Intermediário
  - Avançado

### Etapa 4: Tempo Disponível
- Seleção dropdown
- Opções:
  - 1-3 horas por semana
  - 4-7 horas por semana
  - 8-14 horas por semana
  - 15+ horas por semana

### Etapa 5: Estilo de Aprendizagem
- Seleção única (radio buttons)
- Opções:
  - Vídeos e aulas práticas
  - Leitura e documentação
  - Prática e projetos
  - Misto (todos os tipos)

### Etapa 6: Detalhes Finais (Opcional)
- Prazo (campo de texto)
- Tópicos específicos (textarea)

## Funcionalidades

### Navegação
- Botões "Voltar" e "Próximo" para navegar entre etapas
- Validação em cada etapa antes de permitir avançar
- Barra de progresso visual mostrando % de conclusão

### Resumo
- Na última etapa, exibe um card com resumo de todas as respostas
- Permite revisar antes de gerar a trilha

### Geração da Trilha
- Botão "Criar Trilha" na última etapa
- Estado de loading durante geração
- Feedback visual com toast de sucesso/erro
- Redirecionamento para `/explorar` após criação

## Integração com Preferências de Aprendizado

A página foi projetada para trabalhar em conjunto com as preferências de aprendizado já salvas no sistema (`LearningPreference` no schema):

```typescript
// Dados do questionário
interface QuestionnaireData {
  topic: string;              // Novo: assunto específico
  goal: string;               // Novo: objetivo do estudo
  currentKnowledge: string;   // Novo: nível atual
  timeAvailable: string;      // Complementa: minutesPerDay
  learningStyle: string;      // Complementa: formats
  deadline: string;           // Novo: prazo opcional
  specificTopics: string;     // Novo: tópicos específicos
}

// Preferências já salvas (LearningPreference)
{
  interests: string[];        // Áreas de interesse gerais
  minutesPerDay: number;      // Tempo diário disponível
  days: string[];            // Dias da semana disponíveis
  formats: string[];         // Formatos preferidos
  contentLength: string;     // Duração de conteúdo preferida
}
```

## Próximos Passos (TODO)

### 1. Implementar API de Geração
No método `handleGenerate()`, substituir o mock por chamada real à API:

```typescript
const handleGenerate = async () => {
  setIsGenerating(true);
  
  try {
    // 1. Buscar preferências de aprendizado salvas
    const preferences = await fetchLearningPreferences();
    
    // 2. Combinar com dados do questionário
    const trackRequest = {
      ...formData,
      preferences,
    };
    
    // 3. Chamar API de geração de trilha com IA
    const track = await generateTrackWithAI(trackRequest);
    
    // 4. Salvar trilha no banco
    await saveTrack(track);
    
    toast.success(t("questionnaire-track-created"));
    navigate({ to: `/explorar/${track.id}` });
  } catch (error) {
    toast.error(t("questionnaire-track-error"));
  } finally {
    setIsGenerating(false);
  }
};
```

### 2. Criar Hook Personalizado
Criar `use-create-track-with-ai.ts` para gerenciar a lógica de criação:

```typescript
export function useCreateTrackWithAI() {
  const mutation = useMutation({
    mutationFn: async (data: QuestionnaireData) => {
      // Lógica de geração
    },
  });
  
  return mutation;
}
```

### 3. Integrar com Sistema de IA
- Usar o `Chat` model do Amplify para gerar a estrutura da trilha
- Considerar os limites do plano do usuário (`AiUsage`)
- Aplicar as preferências salvas na geração

### 4. Adicionar Link na Navegação
Adicionar link para `/criar-trilha` no menu principal ou página de trilhas

## Benefícios da Abordagem

1. **Consistência**: Perguntas estruturadas garantem dados consistentes
2. **UX Melhor**: Questionário guiado é mais amigável que chat livre
3. **Validação**: Cada etapa valida os dados antes de avançar
4. **Contexto Rico**: Combina preferências gerais + contexto específico
5. **Internacionalização**: Suporte completo a múltiplos idiomas
6. **Acessibilidade**: Componentes UI acessíveis e semânticos

## Como Testar

1. Iniciar o servidor de desenvolvimento
2. Fazer login na aplicação
3. Na home page, você verá o card "Nova Sessão" logo após as estatísticas
4. Clicar no botão "Criar Trilha com IA"
5. Será redirecionado para `/criar-trilha`
6. Preencher o questionário em 6 etapas
7. Verificar validações em cada etapa
8. Revisar resumo na última etapa
9. Clicar em "Criar Trilha" (atualmente mock)

## Visual do Card na Home

O card "Nova Sessão" possui:
- Gradiente de fundo com cores primary (destaque visual)
- Ícone Sparkles (✨) indicando funcionalidade de IA
- Título: "Nova Sessão"
- Descrição: "Crie uma trilha de estudos personalizada com IA respondendo algumas perguntas"
- Botão grande: "Criar Trilha com IA" com ícone de seta

## Observações

- A página está totalmente funcional do ponto de vista de UI/UX
- A integração com a API de IA precisa ser implementada
- As preferências de aprendizado devem ser buscadas e combinadas com o questionário
- O redirecionamento após criação pode ser ajustado conforme necessário
