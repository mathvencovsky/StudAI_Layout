# Discovery Flow - Descoberta de Trilhas Guiada por IA

Uma experiência completa de descoberta de trilhas de estudo personalizada, sem chat livre, focada em decisões assistidas e interface visual progressiva.

## 🎯 Visão Geral

O Discovery Flow resolve o problema da "paralisia da página em branco" que muitos alunos enfrentam ao tentar definir seus objetivos de estudo. Em vez de um chat livre que exige habilidade de escrita, oferecemos um **Assistente de Descoberta Progressiva** que funciona como um consultor educacional digital.

### Princípios Fundamentais

- **Menos caixa de texto, mais decisões assistidas**
- **IA invisível**: Trabalha nos bastidores, manifesta-se através de recomendações visuais
- **Progressão guiada**: 7 etapas intuitivas com feedback imediato
- **Mobile-first**: Experiência otimizada para todos os dispositivos
- **Acessibilidade**: WCAG 2.1 AA compliant

## 🚀 Como Usar

### Uso Básico

```tsx
import { DiscoveryFlow } from '@/components/discovery';

function App() {
  return <DiscoveryFlow />;
}
```

### Como Página Completa

```tsx
import { DiscoveryPage } from '@/components/discovery';

function DiscoveryRoute() {
  return <DiscoveryPage />;
}
```

### Integração Customizada

```tsx
import { DiscoveryContainer } from '@/components/discovery';
import { MyLayout } from './MyLayout';

function CustomDiscovery() {
  return (
    <MyLayout>
      <DiscoveryContainer />
    </MyLayout>
  );
}
```

## 📋 Fluxo de Etapas

### 1. Contexto (Onde você está hoje)
- Seleção de cenários visuais
- Identificação do momento atual do aluno
- Cards clicáveis com situações concretas

### 2. Objetivos (Onde quer chegar)
- Chips de seleção múltipla
- Até 3 objetivos principais
- Priorização automática

### 3. Restrições (Seus recursos)
- Sliders de tempo disponível
- Seleção de orçamento
- Indicador de urgência

### 4. Preferências (Como você aprende)
- Estilos de aprendizado
- Comparações visuais (sliders)
- Personalização progressiva

### 5. Recomendações (Suas trilhas)
- 3 trilhas personalizadas
- Explicações transparentes
- Refinamento sem chat

## 🎨 Componentes Principais

### DiscoveryFlow
Componente principal que orquestra toda a experiência.

### StepNavigation
Navegação inteligente entre etapas com validação.

### ScenarioCard
Cards visuais para seleção de contexto.

```tsx
<ScenarioCard
  id="beginner"
  title="Iniciante Total"
  description="Estou começando do zero"
  icon="🌱"
  selected={selected}
  onClick={handleSelect}
/>
```

### PreferenceChips
Chips para seleção múltipla de preferências.

```tsx
<PreferenceChipsGroup
  chips={options}
  selectedIds={selected}
  onToggle={handleToggle}
  maxSelections={3}
/>
```

### ComparisonSlider
Sliders para comparações visuais.

```tsx
<ComparisonSlider
  label="Ritmo de aprendizado"
  leftLabel="Devagar e seguro"
  rightLabel="Rápido e direto"
  value={value}
  onChange={setValue}
/>
```

### TrailCard
Cards de recomendação de trilhas.

```tsx
<TrailCard
  recommendation={trail}
  variant="primary"
  onSelect={handleSelect}
  onViewDetails={handleDetails}
/>
```

## 🔧 Customização

### Temas e Estilos
O componente usa o sistema de design do projeto com CSS variables:

```css
:root {
  --primary: /* Cor principal */
  --accent-warm: /* Cor de destaque quente */
  --muted: /* Cor neutra */
}
```

### Configuração de Cenários
Customize os cenários disponíveis em `constants.ts`:

```tsx
export const CONTEXT_SCENARIOS = [
  {
    id: 'custom_scenario',
    title: 'Meu Cenário',
    description: 'Descrição personalizada',
    icon: '🎯',
    keywords: ['palavra', 'chave']
  }
];
```

### Opções de Objetivos
Adicione novos objetivos:

```tsx
export const OBJECTIVE_OPTIONS = [
  {
    id: 'new_objective',
    label: 'Novo Objetivo',
    icon: '🎯',
    description: 'Descrição do objetivo'
  }
];
```

## 📊 Analytics e Métricas

O sistema inclui tracking automático de eventos:

```tsx
// Eventos automáticos
- discovery_started
- step_completed
- recommendation_viewed
- trail_selected
- refinement_used
- discovery_completed
```

### Implementação Custom de Analytics

```tsx
import { useDiscoveryFlow } from '@/components/discovery';

function CustomDiscovery() {
  const { trackEvent } = useDiscoveryFlow();
  
  // Track eventos customizados
  trackEvent('custom_event', { data: 'value' });
}
```

## 🎯 Integração com IA

### Mock vs Produção
Por padrão, usa dados mock. Para produção, substitua em `useDiscoveryFlow.ts`:

```tsx
// Substituir esta função
async function simulateAIRecommendation(request: AIRecommendationRequest) {
  // Implementação mock atual
}

// Por chamada real da API
async function generateAIRecommendation(request: AIRecommendationRequest) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  return response.json();
}
```

### Formato da API

```typescript
interface AIRecommendationRequest {
  context: ContextType;
  objectives: ObjectiveType[];
  timePerWeek: number;
  totalDuration: number;
  budget: 'free' | 'paid';
  learningStyle: LearningStyleType[];
  urgency: number;
  experienceLevel: number;
}

interface AIRecommendationResponse {
  recommendations: Recommendation[];
  insights: ProfileInsight[];
  confidence: number;
  reasoning: string;
}
```

## 🔍 Troubleshooting

### Problemas Comuns

**1. Componentes não aparecem**
- Verifique se o Tailwind CSS está configurado
- Confirme se as dependências estão instaladas

**2. Animações não funcionam**
- Instale `framer-motion`: `npm install framer-motion`

**3. Ícones não aparecem**
- Instale `lucide-react`: `npm install lucide-react`

### Debug Mode

```tsx
import { DiscoveryFlow } from '@/components/discovery';

function App() {
  return (
    <div>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black text-white p-2 rounded">
          Debug Mode
        </div>
      )}
      <DiscoveryFlow />
    </div>
  );
}
```

## 📱 Responsividade

O componente é totalmente responsivo:

- **Mobile**: Layout em coluna única, navegação simplificada
- **Tablet**: Layout híbrido, sidebar colapsável
- **Desktop**: Layout completo com sidebar fixa

### Breakpoints

```css
/* Mobile first */
.discovery-container {
  @apply grid grid-cols-1;
}

/* Tablet */
@media (min-width: 768px) {
  .discovery-container {
    @apply grid-cols-2;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .discovery-container {
    @apply grid-cols-4;
  }
}
```

## 🚀 Performance

### Otimizações Implementadas

- **Lazy loading** de componentes pesados
- **Memoização** de cálculos complexos
- **Debounce** em inputs de usuário
- **Animações otimizadas** com `framer-motion`

### Bundle Size

- Core: ~45KB gzipped
- Com dependências: ~120KB gzipped
- Lazy chunks: ~15KB cada

## 🤝 Contribuindo

Para contribuir com melhorias:

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça suas alterações
4. Teste em diferentes dispositivos
5. Submeta um PR

### Padrões de Código

- Use TypeScript para type safety
- Siga os padrões ESLint configurados
- Adicione testes para novas funcionalidades
- Documente componentes complexos

## 📄 Licença

Este componente faz parte do projeto StudAI e segue a mesma licença do projeto principal.