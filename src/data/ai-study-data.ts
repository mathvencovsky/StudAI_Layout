// ============================================================================
// AI STUDY ENGINE - Core logic for AI-guided study sessions
// ============================================================================

import { CFA_MODULES, CFA_QUIZZES } from "./cfa-mock-data";

// ============================================================================
// TYPES
// ============================================================================

export interface AIStudyRecommendation {
  id: string;
  type: "continue" | "new" | "review" | "quiz";
  moduleId: string;
  moduleName: string;
  competency: string;
  topic: string;
  estimatedMinutes: number;
  reason: string;
  priority: number;
  aiMessage: string;
}

export interface AISessionStep {
  id: string;
  type: "intro" | "content" | "example" | "exercise" | "quiz" | "feedback";
  title: string;
  content: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface AIStudySession {
  id: string;
  moduleId: string;
  moduleName: string;
  competency: string;
  startedAt: number;
  completedAt?: number;
  steps: AISessionStep[];
  currentStepIndex: number;
  confidenceRating?: 1 | 2 | 3 | 4 | 5;
  xpEarned: number;
}

export interface StudySessionHistory {
  id: string;
  moduleId: string;
  competency: string;
  date: string;
  durationMinutes: number;
  type: "ai_session" | "quiz" | "review" | "simulado";
  score?: number;
}

// ============================================================================
// MOCK SESSION HISTORY (localStorage)
// ============================================================================

const STORAGE_KEY_SESSIONS = "studai_session_history";
const STORAGE_KEY_CURRENT_SESSION = "studai_current_session";

export function getSessionHistory(): StudySessionHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!stored) return generateMockSessionHistory();
    return JSON.parse(stored);
  } catch {
    return generateMockSessionHistory();
  }
}

export function saveSessionHistory(sessions: StudySessionHistory[]): void {
  localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
}

export function getCurrentSession(): AIStudySession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT_SESSION);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveCurrentSession(session: AIStudySession | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEY_CURRENT_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_SESSION);
  }
}

// ============================================================================
// CORE AI LOGIC - getNextAIStudyAction
// ============================================================================

export function getNextAIStudyAction(): AIStudyRecommendation {
  const modules = CFA_MODULES;
  const quizzes = CFA_QUIZZES;
  const history = getSessionHistory();

  // 1. Check for in_progress module (highest priority)
  const inProgressModule = modules.find(m => m.status === "active" && m.progress > 0 && m.progress < 100);
  if (inProgressModule) {
    return {
      id: `rec-${inProgressModule.id}`,
      type: "continue",
      moduleId: inProgressModule.id,
      moduleName: inProgressModule.name,
      competency: inProgressModule.topic,
      topic: "Quantitative Methods",
      estimatedMinutes: Math.round((inProgressModule.totalLessons - inProgressModule.completedLessons) * 15),
      reason: "Você estava estudando este conteúdo",
      priority: 1,
      aiMessage: `Vamos continuar de onde você parou em "${inProgressModule.name}". Faltam ${inProgressModule.totalLessons - inProgressModule.completedLessons} lições para concluir este módulo.`
    };
  }

  // 2. Check for quiz that needs improvement (score < 70%)
  const lowScoreQuiz = quizzes.find(q => q.lastScore !== undefined && q.lastScore < 70);
  if (lowScoreQuiz) {
    const relatedModule = modules.find(m => m.id === lowScoreQuiz.moduleId);
    return {
      id: `rec-review-${lowScoreQuiz.id}`,
      type: "review",
      moduleId: lowScoreQuiz.moduleId,
      moduleName: lowScoreQuiz.moduleName,
      competency: relatedModule?.topic || "Quantitative Methods",
      topic: "Quantitative Methods",
      estimatedMinutes: 20,
      reason: "Sua última nota foi abaixo de 70%",
      priority: 2,
      aiMessage: `Identifiquei que sua nota em "${lowScoreQuiz.moduleName}" foi ${lowScoreQuiz.lastScore}%. Vamos revisar os conceitos-chave para melhorar seu desempenho.`
    };
  }

  // 3. Check most frequent module in last 3 sessions
  const last3Sessions = history.slice(-3);
  const moduleFrequency: Record<string, number> = {};
  last3Sessions.forEach(s => {
    moduleFrequency[s.moduleId] = (moduleFrequency[s.moduleId] || 0) + 1;
  });
  const mostFrequentModuleId = Object.entries(moduleFrequency).sort((a, b) => b[1] - a[1])[0]?.[0];
  
  if (mostFrequentModuleId) {
    const frequentModule = modules.find(m => m.id === mostFrequentModuleId);
    if (frequentModule && frequentModule.progress < 100) {
      return {
        id: `rec-freq-${frequentModule.id}`,
        type: "continue",
        moduleId: frequentModule.id,
        moduleName: frequentModule.name,
        competency: frequentModule.topic,
        topic: "Quantitative Methods",
        estimatedMinutes: 25,
        reason: "Você tem estudado este tema recentemente",
        priority: 3,
        aiMessage: `Você tem focado em "${frequentModule.name}" ultimamente. Manter a consistência é chave para a retenção!`
      };
    }
  }

  // 4. Find first not_started module
  const nextModule = modules.find(m => m.status === "active" && m.progress === 0) 
    || modules.find(m => m.status === "locked");
  
  if (nextModule) {
    return {
      id: `rec-new-${nextModule.id}`,
      type: "new",
      moduleId: nextModule.id,
      moduleName: nextModule.name,
      competency: nextModule.topic,
      topic: "Quantitative Methods",
      estimatedMinutes: nextModule.estimatedHours * 60 / nextModule.totalLessons,
      reason: "Próximo módulo na sua trilha",
      priority: 4,
      aiMessage: `Hora de começar algo novo! "${nextModule.name}" é o próximo passo na sua jornada CFA.`
    };
  }

  // Default fallback
  return {
    id: "rec-default",
    type: "review",
    moduleId: modules[0].id,
    moduleName: modules[0].name,
    competency: modules[0].topic,
    topic: "Quantitative Methods",
    estimatedMinutes: 30,
    reason: "Recomendação padrão da trilha",
    priority: 5,
    aiMessage: "Vamos revisar os fundamentos para manter o conhecimento fresco!"
  };
}

// ============================================================================
// AI SESSION BUILDER
// ============================================================================

export function createAIStudySession(recommendation: AIStudyRecommendation): AIStudySession {
  const sessionId = `session-${Date.now()}`;
  
  const steps: AISessionStep[] = [
    {
      id: `${sessionId}-intro`,
      type: "intro",
      title: "Introdução",
      content: `Olá! Hoje vamos trabalhar em **${recommendation.moduleName}**.\n\n${recommendation.aiMessage}\n\nEste módulo faz parte de ${recommendation.competency} e é fundamental para sua preparação CFA.`,
      estimatedMinutes: 2,
      completed: false,
    },
    {
      id: `${sessionId}-content`,
      type: "content",
      title: "Conceitos-Chave",
      content: getContentForModule(recommendation.moduleId),
      estimatedMinutes: 10,
      completed: false,
    },
    {
      id: `${sessionId}-example`,
      type: "example",
      title: "Exemplo Prático",
      content: getExampleForModule(recommendation.moduleId),
      estimatedMinutes: 5,
      completed: false,
    },
    {
      id: `${sessionId}-exercise`,
      type: "exercise",
      title: "Exercício Guiado",
      content: getExerciseForModule(recommendation.moduleId),
      estimatedMinutes: 8,
      completed: false,
    },
    {
      id: `${sessionId}-feedback`,
      type: "feedback",
      title: "Feedback",
      content: "Como você se sentiu nesta sessão? Sua avaliação nos ajuda a personalizar ainda mais seu aprendizado.",
      estimatedMinutes: 1,
      completed: false,
    },
  ];

  return {
    id: sessionId,
    moduleId: recommendation.moduleId,
    moduleName: recommendation.moduleName,
    competency: recommendation.competency,
    startedAt: Date.now(),
    steps,
    currentStepIndex: 0,
    xpEarned: 0,
  };
}

// ============================================================================
// RICH EDUCATIONAL CONTENT - All CFA Level I Quantitative Methods Modules
// ============================================================================

function getContentForModule(moduleId: string): string {
  const contents: Record<string, string> = {
    "qm-1": `## Time Value of Money (TVM)

O conceito de **valor do dinheiro no tempo** é um dos pilares fundamentais em finanças. A ideia central é que um real hoje vale mais do que um real no futuro, devido ao potencial de geração de rendimentos.

### Por que isso importa?

Imagine que você pode escolher entre receber R$ 1.000 hoje ou R$ 1.000 daqui a um ano. A escolha racional é receber hoje, pois você pode investir e ter mais de R$ 1.000 no futuro.

### Fórmulas Essenciais

**Valor Futuro (FV) - Juros Compostos:**
\`\`\`
FV = PV × (1 + r)^n
\`\`\`

**Valor Presente (PV):**
\`\`\`
PV = FV / (1 + r)^n
\`\`\`

**Onde:**
- **PV** = Valor Presente (Principal)
- **FV** = Valor Futuro
- **r** = Taxa de juros por período
- **n** = Número de períodos

### Tipos de Capitalização

| Tipo | Fórmula | Exemplo |
|------|---------|---------|
| Anual | FV = PV(1+r)^n | 10% ao ano |
| Semestral | FV = PV(1+r/2)^(2n) | 5% ao semestre |
| Mensal | FV = PV(1+r/12)^(12n) | 0.833% ao mês |
| Contínua | FV = PV × e^(rn) | Limite matemático |

### Taxa Efetiva vs. Nominal

A **taxa efetiva anual (EAR)** considera a capitalização:
\`\`\`
EAR = (1 + r/m)^m - 1
\`\`\`
Onde *m* é o número de períodos de capitalização por ano.

💡 **Insight CFA:** Questões frequentemente pedem para converter entre taxas nominais e efetivas. Pratique essa conversão!`,

    "qm-2": `## Organizing, Visualizing, and Describing Data

A análise de dados começa com organização e visualização adequadas. Este módulo cobre as ferramentas estatísticas fundamentais para análise de investimentos.

### Tipos de Dados

**Dados Categóricos (Qualitativos)**
- Nominais: Sem ordem (ex: setor da empresa)
- Ordinais: Com ordem (ex: rating de crédito AAA > AA > A)

**Dados Numéricos (Quantitativos)**
- Discretos: Valores contáveis (ex: número de ações)
- Contínuos: Qualquer valor em um intervalo (ex: retorno de um ativo)

### Medidas de Tendência Central

| Medida | Definição | Quando Usar |
|--------|-----------|-------------|
| **Média Aritmética** | Σx / n | Dados simétricos |
| **Média Ponderada** | Σ(w × x) / Σw | Retornos de portfólio |
| **Mediana** | Valor central | Dados com outliers |
| **Moda** | Valor mais frequente | Dados categóricos |

### Medidas de Dispersão

**Variância Amostral:**
\`\`\`
s² = Σ(xi - x̄)² / (n-1)
\`\`\`

**Desvio Padrão:**
\`\`\`
s = √s²
\`\`\`

**Coeficiente de Variação (CV):**
\`\`\`
CV = (s / x̄) × 100%
\`\`\`

O CV é essencial para comparar a dispersão relativa de ativos com médias diferentes.

### Outras Medidas Importantes

- **Skewness (Assimetria):** Positiva = cauda direita mais longa
- **Kurtosis (Curtose):** Excesso > 0 = caudas mais pesadas que normal

💡 **Insight CFA:** Em distribuições assimétricas, a média é "puxada" para o lado da cauda mais longa.`,

    "qm-3": `## Probability Concepts

A probabilidade quantifica a incerteza e é essencial para análise de investimentos, precificação de derivativos e gestão de risco.

### Conceitos Fundamentais

**Definições de Probabilidade:**
1. **Clássica:** Baseada em resultados igualmente prováveis
2. **Frequentista:** Baseada em frequência observada
3. **Subjetiva:** Baseada em julgamento pessoal

### Regras Básicas de Probabilidade

**Axiomas:**
- 0 ≤ P(A) ≤ 1 para qualquer evento A
- P(S) = 1, onde S é o espaço amostral
- Se A e B são mutuamente exclusivos: P(A ou B) = P(A) + P(B)

### Probabilidade Condicional

A probabilidade de A dado que B ocorreu:
\`\`\`
P(A|B) = P(A ∩ B) / P(B)
\`\`\`

### Independência de Eventos

Eventos A e B são independentes se e somente se:
\`\`\`
P(A ∩ B) = P(A) × P(B)
\`\`\`

### Teorema de Bayes

Atualiza probabilidades com nova informação:
\`\`\`
P(A|B) = [P(B|A) × P(A)] / P(B)
\`\`\`

**Aplicação em Finanças:** Atualizar a probabilidade de default de uma empresa após receber novas informações sobre resultados trimestrais.

### Valor Esperado e Variância

**Valor Esperado:**
\`\`\`
E(X) = Σ P(xi) × xi
\`\`\`

**Variância:**
\`\`\`
Var(X) = E[(X - μ)²] = E(X²) - [E(X)]²
\`\`\`

💡 **Insight CFA:** O Teorema de Bayes aparece frequentemente em questões sobre atualização de expectativas de investimento.`,

    "qm-4": `## Common Probability Distributions

Distribuições de probabilidade modelam o comportamento de variáveis aleatórias em finanças.

### Distribuições Discretas

**Distribuição Binomial**
- Modela o número de sucessos em n tentativas
- Parâmetros: n (tentativas), p (probabilidade de sucesso)
\`\`\`
P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
\`\`\`

**Aplicação:** Probabilidade de que 6 de 10 ações de um portfólio tenham retorno positivo.

### Distribuições Contínuas

**Distribuição Normal (Gaussiana)**

A distribuição mais importante em finanças, definida por:
- μ (média)
- σ (desvio padrão)

**Propriedades:**
- Simétrica em torno da média
- ~68.3% dos dados entre μ ± 1σ
- ~95.4% entre μ ± 2σ
- ~99.7% entre μ ± 3σ

### Z-Score (Padronização)

Transforma qualquer distribuição normal para a normal padrão (μ=0, σ=1):
\`\`\`
z = (X - μ) / σ
\`\`\`

**Exemplo:** Se um ativo tem retorno esperado de 10% e desvio padrão de 15%, qual é a probabilidade de retorno negativo?
\`\`\`
z = (0 - 10) / 15 = -0.67
P(Z < -0.67) ≈ 25.1%
\`\`\`

### Distribuição Lognormal

- Usada para modelar preços de ativos
- Sempre positiva (preços não podem ser negativos)
- Assimétrica à direita

\`\`\`
Se ln(X) ~ Normal, então X ~ Lognormal
\`\`\`

### Intervalo de Confiança

Para 95% de confiança: μ ± 1.96σ
Para 99% de confiança: μ ± 2.58σ

💡 **Insight CFA:** Preços de ações seguem distribuição lognormal; retornos log seguem distribuição normal.`,

    "qm-5": `## Sampling and Estimation

Este módulo cobre como fazer inferências sobre uma população a partir de uma amostra.

### Conceitos de Amostragem

**Tipos de Amostragem:**
- **Aleatória Simples:** Cada elemento tem igual probabilidade
- **Estratificada:** Divide em subgrupos e amostra de cada
- **Sistemática:** Seleciona a cada n-ésimo elemento

### Distribuição Amostral da Média

Se tiramos múltiplas amostras de tamanho n, a média amostral (x̄) terá:
- **Valor esperado:** E(x̄) = μ
- **Erro padrão:** SE = σ / √n

### Teorema do Limite Central (TLC)

**Fundamental:** Para amostras grandes (n ≥ 30), a distribuição da média amostral aproxima-se de uma normal, independente da distribuição original.

\`\`\`
x̄ ~ N(μ, σ²/n)
\`\`\`

### Estimadores

**Propriedades desejáveis:**
1. **Não-viesado:** E(estimador) = parâmetro verdadeiro
2. **Eficiente:** Menor variância entre estimadores não-viesados
3. **Consistente:** Converge para o valor verdadeiro quando n → ∞

### Intervalo de Confiança para a Média

**Com σ conhecido:**
\`\`\`
IC = x̄ ± z(α/2) × (σ/√n)
\`\`\`

**Com σ desconhecido (usar t):**
\`\`\`
IC = x̄ ± t(α/2, n-1) × (s/√n)
\`\`\`

### Distribuição t de Student

- Usada quando σ é desconhecido e n é pequeno
- Caudas mais pesadas que a normal
- Aproxima-se da normal quando n → ∞

💡 **Insight CFA:** Sempre verifique se o problema fornece σ populacional ou s amostral para escolher z ou t.`,

    "qm-6": `## Hypothesis Testing

Teste de hipóteses permite tomar decisões estatísticas sobre parâmetros populacionais.

### Estrutura do Teste

1. **Hipótese Nula (H₀):** A afirmação a ser testada (status quo)
2. **Hipótese Alternativa (H₁):** O que acreditamos ser verdadeiro

**Tipos de teste:**
- Bicaudal: H₁: μ ≠ μ₀
- Unicaudal à direita: H₁: μ > μ₀
- Unicaudal à esquerda: H₁: μ < μ₀

### Erros Possíveis

| | H₀ Verdadeira | H₀ Falsa |
|--|---------------|----------|
| Rejeitar H₀ | Erro Tipo I (α) | ✓ Decisão Correta |
| Não Rejeitar H₀ | ✓ Decisão Correta | Erro Tipo II (β) |

- **Nível de Significância (α):** Probabilidade de Erro Tipo I (geralmente 5% ou 1%)
- **Poder do Teste:** 1 - β (capacidade de detectar H₁ quando verdadeira)

### Procedimento de Teste

1. Definir H₀ e H₁
2. Escolher nível de significância α
3. Calcular estatística de teste
4. Comparar com valor crítico ou p-valor
5. Tomar decisão

### Estatística de Teste para Média

**σ conhecido:**
\`\`\`
z = (x̄ - μ₀) / (σ/√n)
\`\`\`

**σ desconhecido:**
\`\`\`
t = (x̄ - μ₀) / (s/√n)
\`\`\`

### P-Valor

A probabilidade de obter um resultado tão extremo quanto o observado, assumindo que H₀ é verdadeira.

- Se p-valor < α → Rejeitar H₀
- Se p-valor ≥ α → Não rejeitar H₀

💡 **Insight CFA:** "Não rejeitar H₀" não significa "aceitar H₀". Significa apenas que não há evidência suficiente para rejeitá-la.`,

    "qm-7": `## Introduction to Linear Regression

A regressão linear modela a relação entre variáveis, fundamental para análise de investimentos.

### Regressão Linear Simples

Modela a relação entre uma variável dependente (Y) e uma independente (X):

\`\`\`
Y = α + βX + ε
\`\`\`

**Onde:**
- α = Intercepto (Y quando X = 0)
- β = Coeficiente angular (mudança em Y para cada unidade de X)
- ε = Termo de erro

### Estimação por Mínimos Quadrados (OLS)

Minimiza a soma dos quadrados dos resíduos:

\`\`\`
β̂ = Cov(X,Y) / Var(X)
α̂ = ȳ - β̂x̄
\`\`\`

### Coeficiente de Determinação (R²)

Mede o poder explicativo do modelo:

\`\`\`
R² = SSR / SST = 1 - (SSE / SST)
\`\`\`

**Interpretação:**
- R² = 0.75 significa que 75% da variação em Y é explicada por X
- R² varia de 0 a 1

### Teste de Significância

**Teste t para β:**
\`\`\`
t = β̂ / SE(β̂)
\`\`\`

Se |t| > t-crítico, β é estatisticamente significativo.

### Análise de Variância (ANOVA)

| Fonte | SS | df | MS | F |
|-------|----|----|----|----|
| Regressão | SSR | 1 | MSR | MSR/MSE |
| Erro | SSE | n-2 | MSE | |
| Total | SST | n-1 | | |

### Premissas do Modelo

1. **Linearidade:** Relação linear entre X e Y
2. **Homocedasticidade:** Variância constante dos erros
3. **Independência:** Erros não correlacionados
4. **Normalidade:** Erros normalmente distribuídos

💡 **Insight CFA:** O CAPM é um exemplo de regressão linear: Ri = Rf + βi(Rm - Rf) + εi`,
  };

  return contents[moduleId] || contents["qm-1"];
}

function getExampleForModule(moduleId: string): string {
  const examples: Record<string, string> = {
    "qm-1": `### Exemplo: Planejamento de Aposentadoria

**Cenário:** Maria quer ter R$ 1.000.000 ao se aposentar em 25 anos. Se ela pode investir a 9% a.a., quanto precisa investir hoje (lump sum)?

**Cálculo do Valor Presente:**
\`\`\`
PV = FV / (1 + r)^n
PV = 1.000.000 / (1,09)^25
PV = 1.000.000 / 8,623
PV = R$ 115.968,21
\`\`\`

**Resposta:** Maria precisa investir aproximadamente R$ 116.000 hoje.

---

**Cenário Alternativo:** E se Maria preferir investir um valor fixo todo ano (anuidade)?

\`\`\`
PMT = FV × [r / ((1+r)^n - 1)]
PMT = 1.000.000 × [0,09 / ((1,09)^25 - 1)]
PMT = 1.000.000 × [0,09 / 7,623]
PMT = R$ 11.806,37 por ano
\`\`\`

💡 **Insight da IA:** Compare os dois cenários: R$ 116.000 hoje vs. ~R$ 295.000 total (25 × R$ 11.806). O valor presente único é mais eficiente, mas requer capital inicial maior.

**Ponto de Atenção CFA:** Anuidades ordinárias (pagamentos no final) vs. antecipadas (pagamentos no início) - a fórmula muda!`,

    "qm-2": `### Exemplo: Análise de Portfólio

**Cenário:** Você gerencia um portfólio com os seguintes retornos mensais nos últimos 6 meses:
3.2%, -1.5%, 2.8%, 4.1%, -0.8%, 2.4%

**Passo 1: Calcular a Média**
\`\`\`
x̄ = (3.2 - 1.5 + 2.8 + 4.1 - 0.8 + 2.4) / 6
x̄ = 10.2 / 6 = 1.7%
\`\`\`

**Passo 2: Calcular o Desvio Padrão**
\`\`\`
Desvios: 1.5, -3.2, 1.1, 2.4, -2.5, 0.7
Desvios²: 2.25, 10.24, 1.21, 5.76, 6.25, 0.49
Σ(x-x̄)² = 26.2

s² = 26.2 / (6-1) = 5.24
s = √5.24 = 2.29%
\`\`\`

**Passo 3: Coeficiente de Variação**
\`\`\`
CV = 2.29% / 1.7% = 1.35
\`\`\`

**Interpretação:** Para cada 1% de retorno esperado, o portfólio tem 1.35% de risco. Compare com benchmark!

💡 **Insight da IA:** O CV é especialmente útil para comparar ativos com retornos médios muito diferentes. Uma ação com retorno de 15% e desvio de 20% (CV=1.33) é mais eficiente em risco-retorno que uma com retorno de 5% e desvio de 10% (CV=2.0).`,

    "qm-3": `### Exemplo: Teorema de Bayes em Análise de Crédito

**Cenário:** Um analista avalia empresas para risco de default:
- 2% das empresas dão default (P(D) = 0.02)
- Se uma empresa vai dar default, há 90% de chance de ter lucro negativo no ano anterior (P(L⁻|D) = 0.90)
- Se uma empresa NÃO vai dar default, há 20% de chance de ter lucro negativo (P(L⁻|D') = 0.20)

**Pergunta:** Uma empresa teve lucro negativo. Qual a probabilidade de default?

**Solução com Bayes:**

**Passo 1:** Identificar o que queremos: P(D|L⁻)

**Passo 2:** Aplicar Bayes:
\`\`\`
P(D|L⁻) = P(L⁻|D) × P(D) / P(L⁻)
\`\`\`

**Passo 3:** Calcular P(L⁻) usando probabilidade total:
\`\`\`
P(L⁻) = P(L⁻|D)×P(D) + P(L⁻|D')×P(D')
P(L⁻) = (0.90)(0.02) + (0.20)(0.98)
P(L⁻) = 0.018 + 0.196 = 0.214
\`\`\`

**Passo 4:** Calcular resultado:
\`\`\`
P(D|L⁻) = (0.90 × 0.02) / 0.214
P(D|L⁻) = 0.018 / 0.214 = 8.4%
\`\`\`

**Interpretação:** Saber que a empresa teve prejuízo aumenta a probabilidade de default de 2% para 8.4% - um aumento de 4x!

💡 **Insight da IA:** Bayes é poderoso porque atualiza suas crenças com evidências. No CFA, isso aparece em análise de crédito, valuation e gestão de risco.`,

    "qm-4": `### Exemplo: Value at Risk (VaR) com Distribuição Normal

**Cenário:** Um portfólio de R$ 10 milhões tem retorno esperado diário de 0.05% e desvio padrão diário de 1.5%.

**Pergunta:** Qual é o VaR de 95% para um dia?

**Solução:**

**Passo 1:** Para 95% de confiança, precisamos do z para 5% na cauda esquerda:
\`\`\`
z(0.05) = -1.645
\`\`\`

**Passo 2:** Calcular o retorno mínimo com 95% de confiança:
\`\`\`
Retorno mínimo = μ + z × σ
Retorno mínimo = 0.05% + (-1.645)(1.5%)
Retorno mínimo = 0.05% - 2.47%
Retorno mínimo = -2.42%
\`\`\`

**Passo 3:** Converter para valor monetário:
\`\`\`
VaR = R$ 10.000.000 × 2.42% = R$ 242.000
\`\`\`

**Interpretação:** Com 95% de confiança, a perda máxima em um dia não excederá R$ 242.000.

---

**Extensão: VaR de 10 dias**
\`\`\`
VaR(10 dias) = VaR(1 dia) × √10
VaR(10 dias) = R$ 242.000 × 3.16 = R$ 765.000
\`\`\`

💡 **Insight da IA:** O VaR escala com a raiz quadrada do tempo porque a variância soma linearmente (assumindo independência dos retornos).`,

    "qm-5": `### Exemplo: Construção de Intervalo de Confiança

**Cenário:** Um analista coleta uma amostra de 36 retornos mensais de um fundo:
- Média amostral (x̄) = 1.2%
- Desvio padrão amostral (s) = 3.5%
- Nível de confiança desejado = 95%

**Pergunta:** Construa o intervalo de confiança para o retorno médio verdadeiro.

**Solução:**

**Passo 1:** Identificar a distribuição
- n = 36 (≥ 30, mas usamos t por não conhecer σ)
- gl = n - 1 = 35

**Passo 2:** Encontrar t-crítico
\`\`\`
t(0.025, 35) ≈ 2.03
\`\`\`

**Passo 3:** Calcular erro padrão
\`\`\`
SE = s / √n = 3.5% / √36 = 3.5% / 6 = 0.583%
\`\`\`

**Passo 4:** Construir o intervalo
\`\`\`
IC = x̄ ± t × SE
IC = 1.2% ± 2.03 × 0.583%
IC = 1.2% ± 1.18%
IC = [0.02%, 2.38%]
\`\`\`

**Interpretação:** Temos 95% de confiança de que o retorno médio verdadeiro do fundo está entre 0.02% e 2.38% ao mês.

💡 **Insight da IA:** Note que o intervalo inclui zero! Isso sugere que, estatisticamente, não podemos afirmar que o fundo gera alpha positivo com 95% de confiança.`,

    "qm-6": `### Exemplo: Teste de Hipóteses para Performance de Fundo

**Cenário:** Um gestor afirma que seu fundo supera o benchmark em 2% ao ano. Dados:
- Alpha observado: 1.5% (12 meses de dados)
- Desvio padrão do alpha: 3.0%
- n = 12 observações

**Pergunta:** Teste a afirmação do gestor com α = 5% (unicaudal).

**Solução:**

**Passo 1:** Definir hipóteses
- H₀: μ ≥ 2% (afirmação do gestor)
- H₁: μ < 2% (o fundo não supera por 2%)

**Passo 2:** Calcular estatística de teste
\`\`\`
SE = s / √n = 3.0% / √12 = 0.866%
t = (x̄ - μ₀) / SE = (1.5% - 2.0%) / 0.866%
t = -0.58
\`\`\`

**Passo 3:** Encontrar t-crítico
\`\`\`
t(0.05, 11) = -1.796 (unicaudal à esquerda)
\`\`\`

**Passo 4:** Decisão
\`\`\`
t-calculado (-0.58) > t-crítico (-1.796)
\`\`\`

**Conclusão:** Não rejeitamos H₀. Não há evidência estatística suficiente para afirmar que o fundo NÃO supera o benchmark em 2%.

⚠️ **Atenção:** Isso NÃO significa que o gestor está certo. Com apenas 12 observações e alta variabilidade, simplesmente não temos poder estatístico suficiente para detectar a diferença.

💡 **Insight da IA:** No CFA, sempre questione o tamanho da amostra. Um teste com baixo poder pode não rejeitar H₀ mesmo quando deveria.`,

    "qm-7": `### Exemplo: CAPM como Regressão Linear

**Cenário:** Você quer estimar o beta de uma ação usando 60 meses de dados:
- Retornos do ativo (Ri) e do mercado (Rm) disponíveis
- Taxa livre de risco (Rf) = 0.5% ao mês

**Modelo CAPM:**
\`\`\`
Ri - Rf = α + β(Rm - Rf) + ε
\`\`\`

**Resultados da Regressão:**
\`\`\`
α̂ = 0.3% (t = 1.8, p = 0.08)
β̂ = 1.25 (t = 8.5, p < 0.001)
R² = 0.55
SE(β̂) = 0.147
\`\`\`

**Análise dos Resultados:**

**1. Beta:**
- β = 1.25 significa que a ação é 25% mais volátil que o mercado
- t = 8.5 >> 2, então β é estatisticamente significativo

**2. Alpha (Jensen's Alpha):**
- α = 0.3% ao mês, mas p = 0.08 > 0.05
- O alpha NÃO é estatisticamente significativo
- Não há evidência de que o gestor gera retorno anormal

**3. R²:**
- 55% da variação nos retornos é explicada pelo mercado
- 45% é risco específico (diversificável)

**Intervalo de Confiança para Beta:**
\`\`\`
IC(95%) = β̂ ± t(0.025,58) × SE(β̂)
IC = 1.25 ± 2.00 × 0.147
IC = [0.96, 1.54]
\`\`\`

💡 **Insight da IA:** Este é um exemplo clássico de regressão no CFA. Lembre-se: beta significativo ≠ alpha significativo. A maioria dos fundos tem beta significativo, mas poucos têm alpha verdadeiro.`,
  };

  return examples[moduleId] || examples["qm-1"];
}

function getExerciseForModule(moduleId: string): string {
  const exercises: Record<string, string> = {
    "qm-1": `### Exercício Guiado: Escolha de Investimentos

**Problema:** Você tem R$ 50.000 para investir e duas opções:

**Opção A:** Título que paga 6% a.a. com capitalização anual por 10 anos
**Opção B:** Título que paga 5.8% a.a. com capitalização mensal por 10 anos

**Perguntas:**
1. Qual é o valor futuro de cada opção?
2. Qual é a taxa efetiva anual de cada opção?
3. Qual você escolheria?

---

**Resolva antes de ver a resposta!**

<details>
<summary>💡 Clique para ver a solução</summary>

**Opção A:**
\`\`\`
FV = 50.000 × (1,06)^10 = R$ 89.542,38
EAR = 6% (já é taxa efetiva)
\`\`\`

**Opção B:**
\`\`\`
FV = 50.000 × (1 + 0.058/12)^(12×10)
FV = 50.000 × (1,00483)^120 = R$ 89.068,22

EAR = (1 + 0.058/12)^12 - 1 = 5.96%
\`\`\`

**Resposta:** Opção A é melhor! Apesar de capitalização mais frequente, a taxa nominal menor da Opção B resulta em valor futuro inferior.

</details>`,

    "qm-2": `### Exercício Guiado: Comparação de Fundos

**Dados de dois fundos (retornos anuais dos últimos 5 anos):**

| Ano | Fundo Alpha | Fundo Beta |
|-----|-------------|------------|
| 1 | 12% | 8% |
| 2 | -5% | 4% |
| 3 | 18% | 10% |
| 4 | 8% | 6% |
| 5 | -2% | 7% |

**Calcule para cada fundo:**
1. Retorno médio
2. Desvio padrão
3. Coeficiente de variação
4. Qual fundo você recomendaria para um investidor avesso ao risco?

---

<details>
<summary>💡 Clique para ver a solução</summary>

**Fundo Alpha:**
\`\`\`
Média = (12 - 5 + 18 + 8 - 2) / 5 = 6.2%
Variância = [(5.8² + 11.2² + 11.8² + 1.8² + 8.2²)] / 4 = 80.7
Desvio Padrão = 8.98%
CV = 8.98 / 6.2 = 1.45
\`\`\`

**Fundo Beta:**
\`\`\`
Média = (8 + 4 + 10 + 6 + 7) / 5 = 7.0%
Variância = [(1² + 3² + 3² + 1² + 0²)] / 4 = 5.0
Desvio Padrão = 2.24%
CV = 2.24 / 7.0 = 0.32
\`\`\`

**Recomendação:** Fundo Beta! Maior retorno médio (7% vs 6.2%) com muito menos risco (CV de 0.32 vs 1.45).

</details>`,

    "qm-3": `### Exercício Guiado: Probabilidade em Seleção de Ações

**Cenário:** Em um universo de 200 ações:
- 60 são de tecnologia (T)
- 80 são de consumo (C)  
- 60 são de saúde (S)

Das ações de tecnologia, 40% superaram o índice no último ano.
Das ações de consumo, 25% superaram o índice.
Das ações de saúde, 35% superaram o índice.

**Perguntas:**
1. Qual a probabilidade de uma ação aleatória ter superado o índice?
2. Se uma ação superou o índice, qual a probabilidade de ser de tecnologia?

---

<details>
<summary>💡 Clique para ver a solução</summary>

**1. Probabilidade total de superar:**
\`\`\`
P(Supera) = P(S|T)P(T) + P(S|C)P(C) + P(S|S)P(S)
P(Supera) = (0.40)(0.30) + (0.25)(0.40) + (0.35)(0.30)
P(Supera) = 0.12 + 0.10 + 0.105 = 0.325 = 32.5%
\`\`\`

**2. Bayes - P(T|Supera):**
\`\`\`
P(T|Supera) = P(Supera|T) × P(T) / P(Supera)
P(T|Supera) = (0.40 × 0.30) / 0.325
P(T|Supera) = 0.12 / 0.325 = 36.9%
\`\`\`

Tecnologia representa 30% das ações, mas 36.9% das que superaram!

</details>`,

    "qm-4": `### Exercício Guiado: Análise de Risco com Distribuição Normal

**Cenário:** Um portfólio tem as seguintes características:
- Retorno esperado anual: μ = 12%
- Desvio padrão anual: σ = 18%
- Assuma distribuição normal

**Perguntas:**
1. Qual a probabilidade de retorno negativo?
2. Qual a probabilidade de retorno acima de 30%?
3. Qual retorno você tem 90% de certeza de superar?

---

<details>
<summary>💡 Clique para ver a solução</summary>

**1. P(Retorno < 0):**
\`\`\`
z = (0 - 12) / 18 = -0.67
P(Z < -0.67) = 25.1%
\`\`\`

**2. P(Retorno > 30%):**
\`\`\`
z = (30 - 12) / 18 = 1.0
P(Z > 1.0) = 1 - 0.8413 = 15.87%
\`\`\`

**3. Retorno com 90% de probabilidade de superar:**
\`\`\`
Queremos o percentil 10 (10% abaixo)
z(0.10) = -1.28
X = μ + zσ = 12 + (-1.28)(18) = -11.04%
\`\`\`

Você tem 90% de certeza de obter retorno acima de -11.04%.

</details>`,

    "qm-5": `### Exercício Guiado: Tamanho de Amostra e Erro

**Cenário:** Você quer estimar o retorno médio de um setor com:
- Erro máximo desejado: 1%
- Nível de confiança: 95%
- Desvio padrão estimado do setor: 4%

**Perguntas:**
1. Quantas ações você precisa amostrar?
2. Se você tiver apenas 25 ações disponíveis, qual será a margem de erro?

---

<details>
<summary>💡 Clique para ver a solução</summary>

**1. Tamanho de amostra necessário:**
\`\`\`
n = (z × σ / E)²
n = (1.96 × 4% / 1%)²
n = (7.84)²
n = 61.5 ≈ 62 ações
\`\`\`

**2. Margem de erro com n = 25:**
\`\`\`
E = z × σ / √n
E = 1.96 × 4% / √25
E = 1.96 × 4% / 5
E = 1.57%
\`\`\`

Com apenas 25 ações, seu erro será de ±1.57% em vez de ±1%.

</details>`,

    "qm-6": `### Exercício Guiado: Avaliação de Estratégia de Trading

**Cenário:** Um trader afirma que sua estratégia gera retorno médio de 0.5% por operação. Você testa com 50 operações:
- Retorno médio observado: 0.35%
- Desvio padrão: 0.8%

**Perguntas:**
1. Teste se a afirmação do trader é verdadeira (α = 5%, bicaudal)
2. Calcule o p-valor
3. Qual sua conclusão?

---

<details>
<summary>💡 Clique para ver a solução</summary>

**Hipóteses:**
- H₀: μ = 0.5%
- H₁: μ ≠ 0.5%

**Estatística de teste:**
\`\`\`
SE = 0.8% / √50 = 0.113%
t = (0.35% - 0.5%) / 0.113% = -1.33
\`\`\`

**t-crítico (gl=49, bicaudal):**
\`\`\`
t(0.025, 49) ≈ ±2.01
\`\`\`

**Decisão:**
\`\`\`
|t| = 1.33 < 2.01
p-valor ≈ 0.19 > 0.05
\`\`\`

**Conclusão:** Não rejeitamos H₀. Não há evidência estatística de que o retorno real seja diferente de 0.5%. Porém, isso não prova que a estratégia funciona!

</details>`,

    "qm-7": `### Exercício Guiado: Análise de Regressão

**Cenário:** Regressão do retorno de uma ação contra o mercado (60 meses):

| Estatística | Valor |
|-------------|-------|
| Intercepto (α) | 0.4% |
| Beta (β) | 1.15 |
| R² | 0.62 |
| Erro padrão de β | 0.12 |
| Erro padrão de α | 0.25% |

**Perguntas:**
1. O beta é estatisticamente significativo (α = 5%)?
2. O alpha é estatisticamente significativo?
3. Interprete o R²
4. Construa IC 95% para beta

---

<details>
<summary>💡 Clique para ver a solução</summary>

**1. Teste para Beta:**
\`\`\`
t = β / SE(β) = 1.15 / 0.12 = 9.58
t-crítico (gl=58) ≈ 2.00
|9.58| > 2.00 → Beta é SIGNIFICATIVO ✓
\`\`\`

**2. Teste para Alpha:**
\`\`\`
t = α / SE(α) = 0.4% / 0.25% = 1.60
|1.60| < 2.00 → Alpha NÃO é significativo ✗
\`\`\`

**3. Interpretação do R²:**
62% da variação nos retornos da ação é explicada pelo mercado. 38% é risco específico (idiossincrático).

**4. IC para Beta:**
\`\`\`
IC = 1.15 ± 2.00 × 0.12
IC = [0.91, 1.39]
\`\`\`

Com 95% de confiança, o beta verdadeiro está entre 0.91 e 1.39.

</details>`,
  };

  return exercises[moduleId] || exercises["qm-1"];
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

function generateMockSessionHistory(): StudySessionHistory[] {
  const history: StudySessionHistory[] = [];
  const today = new Date();
  
  // Generate 30 days of mock history
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random chance of studying each day (70%)
    if (Math.random() < 0.7) {
      const sessionCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < sessionCount; j++) {
        const moduleIndex = Math.floor(Math.random() * 4);
        const modules = ["qm-1", "qm-2", "qm-3", "qm-4"];
        const types: ("ai_session" | "quiz" | "review")[] = ["ai_session", "quiz", "review"];
        
        history.push({
          id: `hist-${i}-${j}`,
          moduleId: modules[moduleIndex],
          competency: "Quantitative Methods",
          date: date.toISOString().split("t")[0],
          durationMinutes: Math.floor(Math.random() * 45) + 15,
          type: types[Math.floor(Math.random() * types.length)],
          score: Math.random() < 0.5 ? Math.floor(Math.random() * 30) + 70 : undefined,
        });
      }
    }
  }
  
  saveSessionHistory(history);
  return history;
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

export interface StudyAnalytics {
  totalMinutes7d: number;
  totalMinutes30d: number;
  totalMinutes90d: number;
  activeDays7d: number;
  activeDays30d: number;
  averageMinutesPerDay: number;
  sessionsCount: number;
  formatDistribution: {
    ai_session: number;
    quiz: number;
    review: number;
    simulado: number;
  };
  weeklyHeatmap: number[]; // 7 values for each day of week
  streakCurrent: number;
  streakBest: number;
}

export function calculateStudyAnalytics(): StudyAnalytics {
  const history = getSessionHistory();
  const today = new Date();
  
  const last7d = history.filter(s => {
    const sessionDate = new Date(s.date);
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  
  const last30d = history.filter(s => {
    const sessionDate = new Date(s.date);
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });
  
  const last90d = history.filter(s => {
    const sessionDate = new Date(s.date);
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  });

  const uniqueDays7d = new Set(last7d.map(s => s.date)).size;
  const uniqueDays30d = new Set(last30d.map(s => s.date)).size;

  const formatDist = { ai_session: 0, quiz: 0, review: 0, simulado: 0 };
  last30d.forEach(s => {
    formatDist[s.type] = (formatDist[s.type] || 0) + s.durationMinutes;
  });

  // Weekly heatmap (0 = Sunday, 6 = Saturday)
  const weeklyHeatmap = [0, 0, 0, 0, 0, 0, 0];
  last30d.forEach(s => {
    const day = new Date(s.date).getDay();
    weeklyHeatmap[day] += s.durationMinutes;
  });

  return {
    totalMinutes7d: last7d.reduce((sum, s) => sum + s.durationMinutes, 0),
    totalMinutes30d: last30d.reduce((sum, s) => sum + s.durationMinutes, 0),
    totalMinutes90d: last90d.reduce((sum, s) => sum + s.durationMinutes, 0),
    activeDays7d: uniqueDays7d,
    activeDays30d: uniqueDays30d,
    averageMinutesPerDay: Math.round(last30d.reduce((sum, s) => sum + s.durationMinutes, 0) / 30),
    sessionsCount: last30d.length,
    formatDistribution: formatDist,
    weeklyHeatmap,
    streakCurrent: 12, // TODO: Calculate from history
    streakBest: 21,
  };
}

// ROI metrics
export interface StudyROI {
  minutesPerProgressPercent: number;
  weeklyProgressRate: number;
  projectedCompletionWeeks: number;
  efficiency: "high" | "medium" | "low";
}

export function calculateStudyROI(): StudyROI {
  const analytics = calculateStudyAnalytics();
  const progress = 42; // Current progress percent from trail
  const remaining = 100 - progress;
  
  const minutesPerPercent = progress > 0 ? Math.round(analytics.totalMinutes30d / progress) : 0;
  const weeklyMinutes = Math.round(analytics.totalMinutes7d);
  const weeklyProgressRate = minutesPerPercent > 0 ? weeklyMinutes / minutesPerPercent : 0;
  const weeksToComplete = remaining / Math.max(weeklyProgressRate, 0.1);
  
  return {
    minutesPerProgressPercent: minutesPerPercent,
    weeklyProgressRate: Math.round(weeklyProgressRate * 10) / 10,
    projectedCompletionWeeks: Math.round(weeksToComplete),
    efficiency: weeklyProgressRate > 5 ? "high" : weeklyProgressRate > 2 ? "medium" : "low",
  };
}
