import { ContextType, ObjectiveType, LearningStyleType } from './types';

// ============================================================================
// INTEREST AREAS DEFINITIONS (Brazilian-focused)
// ============================================================================

export const INTEREST_AREAS = [
  {
    id: 'vestibular-enem',
    label: 'Vestibular & ENEM',
    description: 'Preparação para ENEM, vestibulares tradicionais e estratégias de prova',
    icon: '📚'
  },
  {
    id: 'concursos-publicos',
    label: 'Concursos Públicos',
    description: 'Preparação para concursos administrativos, tribunais, polícia e fiscais',
    icon: '🏛️'
  },
  {
    id: 'programming',
    label: 'Programação & Desenvolvimento',
    description: 'Desenvolvimento de software, web, mobile e automação',
    icon: '💻'
  },
  {
    id: 'data-ai',
    label: 'Dados & Inteligência Artificial',
    description: 'Análise de dados, ciência de dados, machine learning e IA',
    icon: '📊'
  },
  {
    id: 'technology-infra',
    label: 'Tecnologia & Infraestrutura',
    description: 'Cloud, DevOps, segurança, redes e administração de sistemas',
    icon: '⚙️'
  },
  {
    id: 'certifications',
    label: 'Certificações Profissionais',
    description: 'Certificações em cloud, redes, segurança, dados e gestão',
    icon: '🏆'
  },
  {
    id: 'languages',
    label: 'Idiomas',
    description: 'Inglês, espanhol, francês e outros idiomas para comunicação global',
    icon: '🌍'
  },
  {
    id: 'math-logic',
    label: 'Matemática & Raciocínio Lógico',
    description: 'Matemática básica, álgebra, geometria, estatística e RLM',
    icon: '🔢'
  },
  {
    id: 'productivity-tools',
    label: 'Ferramentas de Produtividade',
    description: 'Excel, PowerPoint, Notion, Git e automação de trabalho',
    icon: '🛠️'
  },
  {
    id: 'career-market',
    label: 'Carreira & Mercado',
    description: 'Desenvolvimento de carreira, entrevistas, networking e soft skills',
    icon: '👔'
  },
  {
    id: 'business-entrepreneurship',
    label: 'Negócios & Empreendedorismo',
    description: 'Administração, gestão de produtos, finanças e estratégia',
    icon: '💼'
  },
  {
    id: 'marketing-sales',
    label: 'Marketing & Vendas',
    description: 'Marketing digital, SEO, copywriting, vendas e analytics',
    icon: '📈'
  },
  {
    id: 'design-creative',
    label: 'Design & Conteúdo Criativo',
    description: 'UI/UX, design gráfico, motion design, 3D e criação de conteúdo',
    icon: '🎨'
  },
  {
    id: 'law',
    label: 'Direito',
    description: 'OAB, direito constitucional, administrativo, penal e civil',
    icon: '⚖️'
  }
];

// ============================================================================
// SCENARIO DEFINITIONS
// ============================================================================

export const CONTEXT_SCENARIOS = [
  {
    id: 'beginner' as ContextType,
    title: 'Iniciante Total',
    description: 'Estou começando do zero em uma nova área',
    icon: '🌱',
    keywords: ['iniciante', 'começando', 'zero', 'novo']
  },
  {
    id: 'career_change' as ContextType,
    title: 'Mudança de Carreira',
    description: 'Quero migrar para uma nova área profissional',
    icon: '🔄',
    keywords: ['mudança', 'transição', 'migrar', 'nova carreira']
  },
  {
    id: 'upskilling' as ContextType,
    title: 'Aprimorando Habilidades',
    description: 'Já trabalho na área e quero me especializar',
    icon: '📈',
    keywords: ['aprimorar', 'especializar', 'melhorar', 'avançar']
  },
  {
    id: 'job_prep' as ContextType,
    title: 'Preparação para Emprego',
    description: 'Preciso me preparar para processos seletivos',
    icon: '🎯',
    keywords: ['emprego', 'entrevista', 'seleção', 'vaga']
  },
  {
    id: 'academic' as ContextType,
    title: 'Complemento Acadêmico',
    description: 'Quero complementar meus estudos universitários',
    icon: '🎓',
    keywords: ['faculdade', 'universidade', 'acadêmico', 'complementar']
  },
  {
    id: 'personal_project' as ContextType,
    title: 'Projeto Pessoal',
    description: 'Tenho uma ideia e quero tirar do papel',
    icon: '💡',
    keywords: ['projeto', 'ideia', 'criar', 'desenvolver']
  }
];

// ============================================================================
// OBJECTIVE DEFINITIONS
// ============================================================================

export const OBJECTIVE_OPTIONS = [
  {
    id: 'employment' as ObjectiveType,
    label: 'Conseguir um emprego',
    icon: '💼',
    description: 'Foco em habilidades que o mercado valoriza'
  },
  {
    id: 'career_change' as ObjectiveType,
    label: 'Mudar de carreira',
    icon: '🔄',
    description: 'Transição suave para nova área'
  },
  {
    id: 'skill_improvement' as ObjectiveType,
    label: 'Melhorar no trabalho atual',
    icon: '📊',
    description: 'Crescer na posição que já ocupo'
  },
  {
    id: 'personal_project' as ObjectiveType,
    label: 'Realizar projeto pessoal',
    icon: '🚀',
    description: 'Tirar uma ideia do papel'
  },
  {
    id: 'academic_growth' as ObjectiveType,
    label: 'Crescimento acadêmico',
    icon: '📚',
    description: 'Complementar formação universitária'
  },
  {
    id: 'certification' as ObjectiveType,
    label: 'Obter certificação',
    icon: '🏆',
    description: 'Conquistar credenciais reconhecidas'
  },
  {
    id: 'entrepreneurship' as ObjectiveType,
    label: 'Empreender',
    icon: '💡',
    description: 'Criar meu próprio negócio'
  }
];

// ============================================================================
// LEARNING STYLE DEFINITIONS
// ============================================================================

export const LEARNING_STYLE_OPTIONS = [
  {
    id: 'visual' as LearningStyleType,
    label: 'Visual',
    description: 'Aprendo melhor com diagramas, vídeos e imagens',
    icon: '👁️'
  },
  {
    id: 'hands_on' as LearningStyleType,
    label: 'Mão na massa',
    description: 'Prefiro aprender fazendo e praticando',
    icon: '🛠️'
  },
  {
    id: 'theoretical' as LearningStyleType,
    label: 'Teórico',
    description: 'Gosto de entender os fundamentos primeiro',
    icon: '📖'
  },
  {
    id: 'interactive' as LearningStyleType,
    label: 'Interativo',
    description: 'Aprendo melhor em discussões e grupos',
    icon: '💬'
  },
  {
    id: 'self_paced' as LearningStyleType,
    label: 'No meu ritmo',
    description: 'Prefiro controlar minha velocidade de aprendizado',
    icon: '⏰'
  },
  {
    id: 'structured' as LearningStyleType,
    label: 'Estruturado',
    description: 'Gosto de um caminho claro e organizado',
    icon: '📋'
  }
];

// ============================================================================
// STEP CONFIGURATION
// ============================================================================

export const STEP_CONFIG = [
  {
    id: 'context',
    title: 'Onde você está hoje',
    description: 'Vamos entender seu momento atual',
    progress: 16
  },
  {
    id: 'interest_areas',
    title: 'Suas áreas de interesse',
    description: 'Quais assuntos despertam sua curiosidade',
    progress: 32
  },
  {
    id: 'objectives',
    title: 'Onde quer chegar',
    description: 'Quais são seus objetivos principais',
    progress: 48
  },
  {
    id: 'constraints',
    title: 'Seus recursos',
    description: 'Tempo e preferências disponíveis',
    progress: 64
  },
  {
    id: 'preferences',
    title: 'Como você aprende',
    description: 'Seu estilo de aprendizado ideal',
    progress: 80
  },
  {
    id: 'recommendations',
    title: 'Suas recomendações',
    description: 'Trilhas personalizadas para você',
    progress: 100
  }
];

// ============================================================================
// REFINEMENT OPTIONS
// ============================================================================

export const REFINEMENT_OPTIONS = [
  {
    id: 'faster',
    label: 'Mais rápido',
    description: 'Reduzir duração total',
    action: 'adjust_duration' as const,
    value: -0.3
  },
  {
    id: 'slower',
    label: 'Mais devagar',
    description: 'Aumentar duração para melhor absorção',
    action: 'adjust_duration' as const,
    value: 0.5
  },
  {
    id: 'easier',
    label: 'Mais básico',
    description: 'Começar com conceitos mais simples',
    action: 'adjust_difficulty' as const,
    value: -1
  },
  {
    id: 'harder',
    label: 'Mais avançado',
    description: 'Pular conceitos básicos',
    action: 'adjust_difficulty' as const,
    value: 1
  },
  {
    id: 'practical',
    label: 'Mais prático',
    description: 'Focar em projetos e aplicação',
    action: 'adjust_format' as const,
    value: 'hands_on'
  },
  {
    id: 'theoretical',
    label: 'Mais teórico',
    description: 'Focar em fundamentos e conceitos',
    action: 'adjust_format' as const,
    value: 'theoretical'
  },
  {
    id: 'career_focused',
    label: 'Foco em carreira',
    description: 'Priorizar habilidades valorizadas pelo mercado',
    action: 'adjust_focus' as const,
    value: 'employment'
  },
  {
    id: 'project_focused',
    label: 'Foco em projetos',
    description: 'Priorizar criação de portfolio',
    action: 'adjust_focus' as const,
    value: 'portfolio'
  }
];

// ============================================================================
// MICROCOPY
// ============================================================================

export const MICROCOPY = {
  // Títulos principais
  pageTitle: 'Descubra sua próxima trilha de estudo',
  pageSubtitle: 'Vamos encontrar juntos o caminho ideal para seus objetivos',
  
  // CTAs
  primaryCTA: 'Começar descoberta',
  secondaryCTA: 'Ver exemplo de trilha',
  continueCTA: 'Continuar',
  backCTA: 'Voltar',
  startTrailCTA: 'Começar esta trilha',
  viewDetailsCTA: 'Ver detalhes',
  refineRecommendationCTA: 'Ajustar recomendação',
  
  // Mensagens de ajuda
  helpMessages: {
    context: 'Não tem problema não saber a resposta exata. Escolha a opção mais próxima.',
    objectives: 'Você pode selecionar mais de um objetivo. Vamos priorizar o mais importante.',
    constraints: 'Seja realista com seu tempo disponível. É melhor começar devagar.',
    preferences: 'Suas preferências nos ajudam a personalizar o conteúdo para você.',
    canGoBack: 'Você pode voltar e alterar qualquer resposta depois.'
  },
  
  // Mensagens de erro
  errorMessages: {
    selectOption: 'Selecione pelo menos uma opção para continuar.',
    networkError: 'Algo deu errado. Que tal tentar novamente?',
    noRecommendations: 'Não conseguimos gerar recomendações. Vamos tentar com outras preferências?'
  },
  
  // Empty states
  emptyStates: {
    noRecommendations: 'Ainda não temos trilhas para esse perfil específico, mas podemos sugerir alternativas próximas.',
    loading: 'Analisando seu perfil e preparando recomendações personalizadas...'
  },
  
  // Feedback de recomendação
  recommendationFeedback: {
    found: 'Com base no seu perfil, encontramos {count} trilhas que fazem sentido para você.',
    compatibility: 'Esta trilha tem {score}% de compatibilidade com seus objetivos.',
    whyRecommended: 'Por que recomendamos isso?',
    alternatives: 'Outras opções para você'
  },
  
  // Tela final
  completion: {
    title: 'Perfeito! Sua trilha personalizada está pronta.',
    subtitle: 'Você pode começar agora ou salvar para depois.',
    startNow: 'Começar agora',
    saveLater: 'Salvar para depois'
  },
  
  // Insights do perfil
  profileInsights: {
    analyzing: 'Entendendo seu perfil...',
    focusResults: 'Foco em resultados práticos',
    fastPaced: 'Prefere ritmo acelerado',
    learnByDoing: 'Aprende melhor fazendo',
    needsStructure: 'Funciona melhor com estrutura',
    timeConstrained: 'Tempo limitado disponível',
    careerFocused: 'Orientado para carreira'
  }
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  context: {
    required: true,
    message: 'Selecione uma situação que mais se parece com você'
  },
  objectives: {
    required: true,
    minItems: 1,
    maxItems: 3,
    message: 'Selecione pelo menos um objetivo'
  },
  timePerWeek: {
    min: 1,
    max: 40,
    message: 'Selecione entre 1 e 40 horas por semana'
  },
  totalDuration: {
    min: 1,
    max: 24,
    message: 'Selecione entre 1 e 24 meses'
  },
  learningStyle: {
    required: true,
    minItems: 1,
    maxItems: 3,
    message: 'Selecione pelo menos um estilo de aprendizado'
  }
};