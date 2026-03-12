import { useState, useCallback, useEffect } from 'react';
import { DiscoveryState, UserProfile, Recommendation, ProfileInsight, AIRecommendationRequest } from '../types';
import { STEP_CONFIG } from '../constants';

// ============================================================================
// DISCOVERY FLOW HOOK
// ============================================================================

const initialState: DiscoveryState = {
  currentStep: 0,
  userProfile: {},
  recommendations: [],
  isLoading: false,
  error: null,
  insights: []
};

export function useDiscoveryFlow() {
  const [state, setState] = useState<DiscoveryState>(initialState);

  // ============================================================================
  // STEP NAVIGATION
  // ============================================================================

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEP_CONFIG.length) {
      setState(prev => ({ ...prev, currentStep: stepIndex }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, STEP_CONFIG.length - 1)
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  }, []);

  // ============================================================================
  // PROFILE MANAGEMENT
  // ============================================================================

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...updates }
    }));

    // Generate insights based on profile updates
    generateInsights({ ...state.userProfile, ...updates });
  }, [state.userProfile]);

  const resetProfile = useCallback(() => {
    setState(initialState);
  }, []);

  // ============================================================================
  // AI RECOMMENDATIONS
  // ============================================================================

  const generateRecommendations = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const request: AIRecommendationRequest = {
        context: state.userProfile.context!,
        objectives: state.userProfile.objectives || [],
        timePerWeek: state.userProfile.timePerWeek || 5,
        totalDuration: state.userProfile.totalDuration || 6,
        budget: state.userProfile.budget || 'free',
        learningStyle: state.userProfile.learningStyle || [],
        urgency: state.userProfile.urgency || 3,
        experienceLevel: state.userProfile.experienceLevel || 1,
        preferences: state.userProfile.preferences,
        // Include interest areas in the request
        ...(state.userProfile.interestAreas && { interestAreas: state.userProfile.interestAreas })
      };

      // Simulate AI API call - replace with actual API
      const response = await simulateAIRecommendation(request);

      setState(prev => ({
        ...prev,
        recommendations: response.recommendations,
        insights: [...prev.insights, ...response.insights],
        isLoading: false
      }));

      // Track analytics
      trackEvent('recommendations_generated', {
        profile: request,
        recommendationCount: response.recommendations.length,
        confidence: response.confidence
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Não foi possível gerar recomendações. Tente novamente.',
        isLoading: false
      }));

      trackEvent('recommendations_error', { error: error.message });
    }
  }, [state.userProfile]);

  const refineRecommendations = useCallback(async (refinementOptions: any) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Apply refinements to current profile
      const refinedProfile = applyRefinements(state.userProfile, refinementOptions);
      
      // Generate new recommendations
      const request: AIRecommendationRequest = {
        context: refinedProfile.context!,
        objectives: refinedProfile.objectives || [],
        timePerWeek: refinedProfile.timePerWeek || 5,
        totalDuration: refinedProfile.totalDuration || 6,
        budget: refinedProfile.budget || 'free',
        learningStyle: refinedProfile.learningStyle || [],
        urgency: refinedProfile.urgency || 3,
        experienceLevel: refinedProfile.experienceLevel || 1,
        preferences: refinedProfile.preferences,
        // Include interest areas in the request
        ...(refinedProfile.interestAreas && { interestAreas: refinedProfile.interestAreas })
      };

      const response = await simulateAIRecommendation(request);

      setState(prev => ({
        ...prev,
        userProfile: refinedProfile,
        recommendations: response.recommendations,
        isLoading: false
      }));

      trackEvent('recommendations_refined', {
        refinementOptions,
        newRecommendationCount: response.recommendations.length
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Não foi possível refinar as recomendações. Tente novamente.',
        isLoading: false
      }));
    }
  }, [state.userProfile]);

  // ============================================================================
  // INSIGHTS GENERATION
  // ============================================================================

  const generateInsights = useCallback((profile: Partial<UserProfile>) => {
    const insights: ProfileInsight[] = [];

    // Analyze learning style
    if (profile.learningStyle?.includes('hands_on')) {
      insights.push({
        id: 'hands_on',
        icon: '🛠️',
        text: 'Aprende melhor fazendo',
        confidence: 0.9
      });
    }

    // Analyze time constraints
    if (profile.timePerWeek && profile.timePerWeek < 5) {
      insights.push({
        id: 'time_constrained',
        icon: '⏰',
        text: 'Tempo limitado disponível',
        confidence: 0.8
      });
    }

    // Analyze urgency
    if (profile.urgency && profile.urgency > 3) {
      insights.push({
        id: 'fast_paced',
        icon: '⚡',
        text: 'Prefere ritmo acelerado',
        confidence: 0.7
      });
    }

    // Analyze objectives
    if (profile.objectives?.includes('employment')) {
      insights.push({
        id: 'career_focused',
        icon: '🎯',
        text: 'Foco em resultados práticos',
        confidence: 0.85
      });
    }

    setState(prev => ({ ...prev, insights }));
  }, []);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const canProceedToNextStep = useCallback(() => {
    const { currentStep, userProfile } = state;
    
    switch (currentStep) {
      case 0: // Context step
        return !!userProfile.context;
      case 1: // Interest Areas step
        return userProfile.interestAreas && userProfile.interestAreas.length > 0;
      case 2: // Objectives step
        return userProfile.objectives && userProfile.objectives.length > 0;
      case 3: // Constraints step
        return userProfile.timePerWeek && userProfile.totalDuration;
      case 4: // Preferences step
        return userProfile.learningStyle && userProfile.learningStyle.length > 0;
      default:
        return true;
    }
  }, [state]);

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  const trackEvent = useCallback((event: string, properties: any) => {
    // Implement analytics tracking here
    console.log('Analytics Event:', event, properties);
    
    // Example: Send to analytics service
    // analytics.track(event, {
    //   ...properties,
    //   timestamp: new Date(),
    //   userId: user?.id,
    //   sessionId: sessionId
    // });
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Auto-generate recommendations when reaching the final step
  useEffect(() => {
    if (state.currentStep === 5 && state.recommendations.length === 0 && !state.isLoading) {
      generateRecommendations();
    }
  }, [state.currentStep, state.recommendations.length, state.isLoading, generateRecommendations]);

  // Track step completion
  useEffect(() => {
    if (state.currentStep > 0) {
      trackEvent('step_completed', {
        step: state.currentStep - 1,
        stepName: STEP_CONFIG[state.currentStep - 1]?.id,
        profile: state.userProfile
      });
    }
  }, [state.currentStep, trackEvent, state.userProfile]);

  return {
    // State
    ...state,
    currentStepConfig: STEP_CONFIG[state.currentStep],
    canProceed: canProceedToNextStep(),
    
    // Actions
    goToStep,
    nextStep,
    prevStep,
    updateProfile,
    resetProfile,
    generateRecommendations,
    refineRecommendations,
    trackEvent
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function simulateAIRecommendation(request: AIRecommendationRequest) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate personalized recommendations based on user profile
  const recommendations = generatePersonalizedTrails(request);
  const insights = generateProfileInsights(request);

  return {
    recommendations,
    insights,
    confidence: calculateConfidence(request),
    reasoning: 'Baseado no seu perfil e objetivos'
  };
}

// ============================================================================
// PERSONALIZED TRAIL GENERATION
// ============================================================================

function generatePersonalizedTrails(request: AIRecommendationRequest): Recommendation[] {
  const { context, objectives, learningStyle, timePerWeek, totalDuration } = request;
  const interestAreas = (request as any).interestAreas || [];
  
  // Base trail templates organized by interest areas
  const trailTemplates = getTrailTemplatesByInterestAreas();
  
  // Filter trails based on interest areas
  let relevantTrails = [];
  
  if (interestAreas.length > 0) {
    for (const area of interestAreas) {
      if (trailTemplates[area]) {
        relevantTrails.push(...trailTemplates[area]);
      }
    }
  } else {
    // If no interest areas selected, use general trails
    relevantTrails = Object.values(trailTemplates).flat();
  }
  
  // Score and personalize trails based on user profile
  const scoredTrails = relevantTrails.map(trail => 
    personalizeTrail(trail, request)
  );
  
  // Sort by score and return top 3-5 recommendations
  const finalRecommendations = scoredTrails
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(5, scoredTrails.length));
    
  return finalRecommendations;
}

function getTrailTemplatesByInterestAreas() {
  return {
    'vestibular-enem': [
      {
        id: 'enem-completo',
        title: 'ENEM Completo - Todas as Áreas',
        description: 'Preparação completa para o ENEM com foco em todas as disciplinas',
        baseScore: 0.9,
        duration: '8 meses',
        effort: 4,
        outcomes: ['Domínio das 4 áreas do ENEM', 'Redação nota 900+', 'Estratégias de prova'],
        format: 'structured',
        level: 'intermediate',
        tags: ['ENEM', 'Vestibular', 'Redação', 'Matemática', 'Ciências'],
        estimatedHours: 200,
        category: 'academic'
      },
      {
        id: 'redacao-enem',
        title: 'Redação ENEM - Nota 1000',
        description: 'Especialização em redação para alcançar a nota máxima',
        baseScore: 0.85,
        duration: '4 meses',
        effort: 3,
        outcomes: ['Técnicas de argumentação', 'Repertório sociocultural', 'Correção de redações'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Redação', 'ENEM', 'Argumentação', 'Português'],
        estimatedHours: 80,
        category: 'academic'
      },
      {
        id: 'matematica-enem',
        title: 'Matemática ENEM - Do Básico ao Avançado',
        description: 'Domine todos os tópicos de matemática do ENEM',
        baseScore: 0.83,
        duration: '6 meses',
        effort: 4,
        outcomes: ['Funções', 'Geometria', 'Estatística', 'Resolução de problemas'],
        format: 'structured',
        level: 'intermediate',
        tags: ['Matemática', 'ENEM', 'Funções', 'Geometria'],
        estimatedHours: 120,
        category: 'academic'
      }
    ],
    'concursos-publicos': [
      {
        id: 'concurso-administrativo',
        title: 'Concursos Administrativos',
        description: 'Preparação para concursos públicos administrativos',
        baseScore: 0.88,
        duration: '10 meses',
        effort: 4,
        outcomes: ['Português avançado', 'RLM', 'Direito Administrativo', 'Informática'],
        format: 'structured',
        level: 'intermediate',
        tags: ['Concursos', 'Português', 'RLM', 'Direito'],
        estimatedHours: 300,
        category: 'career'
      },
      {
        id: 'concurso-tribunais',
        title: 'Concursos de Tribunais',
        description: 'Especialização para concursos de tribunais e área jurídica',
        baseScore: 0.86,
        duration: '12 meses',
        effort: 5,
        outcomes: ['Direito Constitucional', 'Direito Administrativo', 'Processo Civil'],
        format: 'theoretical',
        level: 'advanced',
        tags: ['Tribunais', 'Direito', 'Jurisprudência'],
        estimatedHours: 400,
        category: 'career'
      },
      {
        id: 'concurso-bancario',
        title: 'Concursos Bancários',
        description: 'Preparação específica para bancos públicos e privados',
        baseScore: 0.84,
        duration: '8 meses',
        effort: 3,
        outcomes: ['Conhecimentos bancários', 'Matemática financeira', 'Atendimento'],
        format: 'structured',
        level: 'intermediate',
        tags: ['Bancários', 'Matemática Financeira', 'Atendimento'],
        estimatedHours: 200,
        category: 'career'
      }
    ],
    'programming': [
      {
        id: 'frontend-react',
        title: 'Desenvolvedor Frontend com React',
        description: 'Torne-se um desenvolvedor frontend completo com React e TypeScript',
        baseScore: 0.89,
        duration: '6 meses',
        effort: 3,
        outcomes: ['Portfolio profissional', 'Domínio do React', 'Preparação para entrevistas'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['React', 'TypeScript', 'Frontend', 'JavaScript'],
        estimatedHours: 150,
        category: 'tech'
      },
      {
        id: 'fullstack-javascript',
        title: 'Desenvolvedor Full-Stack JavaScript',
        description: 'Domine frontend e backend com JavaScript/Node.js',
        baseScore: 0.87,
        duration: '8 meses',
        effort: 4,
        outcomes: ['Aplicações completas', 'APIs REST', 'Deploy em produção'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
        estimatedHours: 200,
        category: 'tech'
      },
      {
        id: 'python-backend',
        title: 'Backend Python com Django',
        description: 'Desenvolva APIs robustas e aplicações web com Python',
        baseScore: 0.84,
        duration: '6 meses',
        effort: 3,
        outcomes: ['APIs REST', 'Banco de dados', 'Autenticação', 'Deploy'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Python', 'Django', 'API', 'PostgreSQL'],
        estimatedHours: 140,
        category: 'tech'
      },
      {
        id: 'mobile-react-native',
        title: 'Desenvolvedor Mobile com React Native',
        description: 'Crie apps para iOS e Android com uma única base de código',
        baseScore: 0.82,
        duration: '7 meses',
        effort: 4,
        outcomes: ['Apps nativos', 'Publicação nas stores', 'Integração com APIs'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['React Native', 'Mobile', 'iOS', 'Android'],
        estimatedHours: 170,
        category: 'tech'
      }
    ],
    'data-ai': [
      {
        id: 'data-science-python',
        title: 'Cientista de Dados com Python',
        description: 'Análise de dados, machine learning e visualizações',
        baseScore: 0.86,
        duration: '7 meses',
        effort: 4,
        outcomes: ['Análise exploratória', 'Modelos ML', 'Dashboards', 'Portfolio'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
        estimatedHours: 180,
        category: 'tech'
      },
      {
        id: 'business-intelligence',
        title: 'Analista de BI com Power BI',
        description: 'Dashboards profissionais e análise de negócios',
        baseScore: 0.83,
        duration: '4 meses',
        effort: 2,
        outcomes: ['Dashboards interativos', 'DAX avançado', 'Modelagem de dados'],
        format: 'visual',
        level: 'beginner',
        tags: ['Power BI', 'Excel', 'SQL', 'DAX'],
        estimatedHours: 100,
        category: 'business'
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning Aplicado',
        description: 'Modelos preditivos e inteligência artificial prática',
        baseScore: 0.85,
        duration: '8 meses',
        effort: 4,
        outcomes: ['Modelos preditivos', 'Deep Learning', 'Deploy de modelos'],
        format: 'hands_on',
        level: 'advanced',
        tags: ['Machine Learning', 'TensorFlow', 'Scikit-learn', 'AI'],
        estimatedHours: 200,
        category: 'tech'
      }
    ],
    'design-creative': [
      {
        id: 'ux-ui-design',
        title: 'UX/UI Designer Completo',
        description: 'Design de experiências e interfaces digitais',
        baseScore: 0.82,
        duration: '5 meses',
        effort: 3,
        outcomes: ['Portfolio de design', 'Prototipagem', 'Pesquisa com usuários'],
        format: 'visual',
        level: 'beginner',
        tags: ['UX', 'UI', 'Figma', 'Design System'],
        estimatedHours: 120,
        category: 'creative'
      }
    ],
    'marketing-sales': [
      {
        id: 'marketing-digital',
        title: 'Especialista em Marketing Digital',
        description: 'Tráfego, conversão e growth para negócios digitais',
        baseScore: 0.81,
        duration: '5 meses',
        effort: 3,
        outcomes: ['Campanhas de tráfego', 'Funis de conversão', 'Analytics'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Google Ads', 'Facebook Ads', 'Analytics', 'SEO'],
        estimatedHours: 110,
        category: 'business'
      }
    ],
    'technology-infra': [
      {
        id: 'devops-aws',
        title: 'DevOps com AWS',
        description: 'Infraestrutura como código, CI/CD e automação na nuvem',
        baseScore: 0.87,
        duration: '6 meses',
        effort: 4,
        outcomes: ['Deploy automatizado', 'Infraestrutura escalável', 'Monitoramento'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['AWS', 'DevOps', 'Docker', 'Kubernetes'],
        estimatedHours: 160,
        category: 'tech'
      },
      {
        id: 'cybersecurity',
        title: 'Segurança Cibernética',
        description: 'Proteção de sistemas, redes e análise de vulnerabilidades',
        baseScore: 0.85,
        duration: '8 meses',
        effort: 4,
        outcomes: ['Análise de vulnerabilidades', 'Resposta a incidentes', 'Compliance'],
        format: 'structured',
        level: 'advanced',
        tags: ['Segurança', 'Redes', 'Compliance', 'Ethical Hacking'],
        estimatedHours: 200,
        category: 'tech'
      },
      {
        id: 'cloud-architect',
        title: 'Arquiteto de Soluções Cloud',
        description: 'Design e implementação de arquiteturas escaláveis na nuvem',
        baseScore: 0.84,
        duration: '7 meses',
        effort: 4,
        outcomes: ['Arquiteturas resilientes', 'Otimização de custos', 'Multi-cloud'],
        format: 'hands_on',
        level: 'advanced',
        tags: ['Cloud', 'Arquitetura', 'AWS', 'Azure'],
        estimatedHours: 180,
        category: 'tech'
      }
    ],
    'certifications': [
      {
        id: 'aws-solutions-architect',
        title: 'AWS Solutions Architect Associate',
        description: 'Certificação oficial AWS para arquitetos de soluções',
        baseScore: 0.89,
        duration: '4 meses',
        effort: 3,
        outcomes: ['Certificação AWS', 'Design de arquiteturas', 'Preparação para exame'],
        format: 'structured',
        level: 'intermediate',
        tags: ['AWS', 'Certificação', 'Cloud', 'Arquitetura'],
        estimatedHours: 120,
        category: 'certification'
      },
      {
        id: 'google-cloud-professional',
        title: 'Google Cloud Professional',
        description: 'Certificação Google Cloud para profissionais de dados',
        baseScore: 0.86,
        duration: '5 meses',
        effort: 3,
        outcomes: ['Certificação GCP', 'Big Data', 'Machine Learning'],
        format: 'structured',
        level: 'intermediate',
        tags: ['Google Cloud', 'Certificação', 'Big Data', 'ML'],
        estimatedHours: 140,
        category: 'certification'
      },
      {
        id: 'pmp-project-management',
        title: 'PMP - Project Management Professional',
        description: 'Certificação internacional em gestão de projetos',
        baseScore: 0.83,
        duration: '6 meses',
        effort: 2,
        outcomes: ['Certificação PMP', 'Metodologias ágeis', 'Liderança'],
        format: 'theoretical',
        level: 'intermediate',
        tags: ['PMP', 'Gestão', 'Projetos', 'Liderança'],
        estimatedHours: 150,
        category: 'management'
      }
    ],
    'languages': [
      {
        id: 'ingles-business',
        title: 'Inglês para Negócios',
        description: 'Inglês focado em comunicação profissional e entrevistas',
        baseScore: 0.78,
        duration: '6 meses',
        effort: 2,
        outcomes: ['Conversação fluente', 'Apresentações', 'Entrevistas em inglês'],
        format: 'interactive',
        level: 'intermediate',
        tags: ['Inglês', 'Business', 'Conversação', 'Entrevistas'],
        estimatedHours: 120,
        category: 'language'
      },
      {
        id: 'ingles-tech',
        title: 'Inglês Técnico para Desenvolvedores',
        description: 'Inglês especializado para área de tecnologia',
        baseScore: 0.82,
        duration: '4 meses',
        effort: 2,
        outcomes: ['Documentação técnica', 'Code reviews', 'Reuniões internacionais'],
        format: 'interactive',
        level: 'intermediate',
        tags: ['Inglês', 'Tech', 'Programação', 'Documentação'],
        estimatedHours: 80,
        category: 'language'
      }
    ],
    'math-logic': [
      {
        id: 'matematica-financeira',
        title: 'Matemática Financeira Aplicada',
        description: 'Juros, investimentos, financiamentos e análise de viabilidade',
        baseScore: 0.82,
        duration: '4 meses',
        effort: 2,
        outcomes: ['Cálculos financeiros', 'Análise de investimentos', 'Planilhas avançadas'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Matemática', 'Finanças', 'Excel', 'Investimentos'],
        estimatedHours: 80,
        category: 'business'
      },
      {
        id: 'estatistica-data-analysis',
        title: 'Estatística para Análise de Dados',
        description: 'Estatística descritiva, inferencial e análise exploratória',
        baseScore: 0.84,
        duration: '5 meses',
        effort: 3,
        outcomes: ['Análise estatística', 'Testes de hipóteses', 'Visualizações'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Estatística', 'Dados', 'Python', 'R'],
        estimatedHours: 100,
        category: 'tech'
      },
      {
        id: 'raciocinio-logico-concursos',
        title: 'Raciocínio Lógico para Concursos',
        description: 'RLM, sequências, problemas lógicos e matemática básica',
        baseScore: 0.85,
        duration: '3 meses',
        effort: 3,
        outcomes: ['Resolução de problemas', 'Sequências lógicas', 'Matemática básica'],
        format: 'structured',
        level: 'intermediate',
        tags: ['RLM', 'Concursos', 'Lógica', 'Matemática'],
        estimatedHours: 90,
        category: 'academic'
      }
    ],
    'productivity-tools': [
      {
        id: 'excel-power-user',
        title: 'Excel Avançado - Power User',
        description: 'Fórmulas avançadas, macros, Power Query e dashboards',
        baseScore: 0.85,
        duration: '3 meses',
        effort: 2,
        outcomes: ['Automação de planilhas', 'Dashboards interativos', 'Macros VBA'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Excel', 'VBA', 'Power Query', 'Dashboards'],
        estimatedHours: 60,
        category: 'productivity'
      },
      {
        id: 'notion-workspace',
        title: 'Notion para Produtividade',
        description: 'Organização pessoal e profissional com Notion',
        baseScore: 0.78,
        duration: '2 meses',
        effort: 1,
        outcomes: ['Workspace organizado', 'Automações', 'Templates personalizados'],
        format: 'hands_on',
        level: 'beginner',
        tags: ['Notion', 'Produtividade', 'Organização', 'Templates'],
        estimatedHours: 40,
        category: 'productivity'
      },
      {
        id: 'git-github-workflow',
        title: 'Git e GitHub para Produtividade',
        description: 'Controle de versão e colaboração em projetos',
        baseScore: 0.83,
        duration: '2 meses',
        effort: 2,
        outcomes: ['Versionamento de código', 'Colaboração em equipe', 'CI/CD básico'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Git', 'GitHub', 'Versionamento', 'Colaboração'],
        estimatedHours: 50,
        category: 'productivity'
      }
    ],
    'career-market': [
      {
        id: 'soft-skills-leadership',
        title: 'Soft Skills e Liderança',
        description: 'Comunicação, liderança, trabalho em equipe e inteligência emocional',
        baseScore: 0.81,
        duration: '4 meses',
        effort: 2,
        outcomes: ['Comunicação eficaz', 'Liderança de equipes', 'Networking'],
        format: 'interactive',
        level: 'intermediate',
        tags: ['Liderança', 'Comunicação', 'Soft Skills', 'Networking'],
        estimatedHours: 80,
        category: 'career'
      },
      {
        id: 'interview-preparation',
        title: 'Preparação para Entrevistas Tech',
        description: 'Algoritmos, estruturas de dados e entrevistas comportamentais',
        baseScore: 0.88,
        duration: '3 meses',
        effort: 3,
        outcomes: ['Algoritmos e estruturas', 'Entrevistas técnicas', 'Negociação salarial'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Entrevistas', 'Algoritmos', 'Tech', 'Carreira'],
        estimatedHours: 90,
        category: 'career'
      },
      {
        id: 'linkedin-personal-branding',
        title: 'LinkedIn e Personal Branding',
        description: 'Construa sua marca pessoal e expanda sua rede profissional',
        baseScore: 0.79,
        duration: '2 meses',
        effort: 1,
        outcomes: ['Perfil otimizado', 'Networking estratégico', 'Visibilidade profissional'],
        format: 'interactive',
        level: 'beginner',
        tags: ['LinkedIn', 'Networking', 'Personal Branding', 'Carreira'],
        estimatedHours: 40,
        category: 'career'
      }
    ],
    'business-entrepreneurship': [
      {
        id: 'startup-mvp',
        title: 'Do Idea ao MVP',
        description: 'Validação de ideias, desenvolvimento de MVP e primeiros clientes',
        baseScore: 0.83,
        duration: '6 meses',
        effort: 3,
        outcomes: ['MVP funcional', 'Validação de mercado', 'Primeiros clientes'],
        format: 'hands_on',
        level: 'intermediate',
        tags: ['Startup', 'MVP', 'Empreendedorismo', 'Validação'],
        estimatedHours: 150,
        category: 'business'
      },
      {
        id: 'product-management',
        title: 'Gestão de Produtos Digitais',
        description: 'Product discovery, roadmaps, métricas e growth',
        baseScore: 0.85,
        duration: '5 meses',
        effort: 3,
        outcomes: ['Product roadmap', 'Métricas de produto', 'Growth hacking'],
        format: 'structured',
        level: 'intermediate',
        tags: ['Product Management', 'Growth', 'Métricas', 'Roadmap'],
        estimatedHours: 120,
        category: 'business'
      },
      {
        id: 'business-plan-financeiro',
        title: 'Plano de Negócios e Modelagem Financeira',
        description: 'Estruture seu negócio e projete a viabilidade financeira',
        baseScore: 0.82,
        duration: '4 meses',
        effort: 2,
        outcomes: ['Plano de negócios', 'Projeções financeiras', 'Pitch deck'],
        format: 'structured',
        level: 'intermediate',
        tags: ['Plano de Negócios', 'Finanças', 'Pitch', 'Empreendedorismo'],
        estimatedHours: 100,
        category: 'business'
      }
    ],
    'law': [
      {
        id: 'oab-primeira-fase',
        title: 'OAB - Primeira Fase',
        description: 'Preparação completa para a primeira fase do exame da OAB',
        baseScore: 0.87,
        duration: '8 meses',
        effort: 4,
        outcomes: ['Todas as disciplinas OAB', 'Simulados', 'Estratégias de prova'],
        format: 'structured',
        level: 'intermediate',
        tags: ['OAB', 'Direito', 'Exame', 'Advocacia'],
        estimatedHours: 250,
        category: 'legal'
      },
      {
        id: 'direito-digital',
        title: 'Direito Digital e LGPD',
        description: 'Marco civil da internet, LGPD e proteção de dados',
        baseScore: 0.84,
        duration: '4 meses',
        effort: 2,
        outcomes: ['Compliance LGPD', 'Contratos digitais', 'Privacidade'],
        format: 'theoretical',
        level: 'intermediate',
        tags: ['LGPD', 'Direito Digital', 'Privacidade', 'Compliance'],
        estimatedHours: 80,
        category: 'legal'
      },
      {
        id: 'direito-trabalhista',
        title: 'Direito Trabalhista Aplicado',
        description: 'CLT, relações trabalhistas e departamento pessoal',
        baseScore: 0.81,
        duration: '5 meses',
        effort: 3,
        outcomes: ['CLT atualizada', 'Cálculos trabalhistas', 'eSocial'],
        format: 'structured',
        level: 'intermediate',
        tags: ['CLT', 'Trabalhista', 'eSocial', 'Departamento Pessoal'],
        estimatedHours: 120,
        category: 'legal'
      }
    ]
  };
}

function personalizeTrail(trail: any, request: AIRecommendationRequest): Recommendation {
  let score = trail.baseScore;
  const reasoning = [];
  const interestAreas = (request as any).interestAreas || [];
  
  // Strong boost for matching interest areas
  if (interestAreas.length > 0) {
    const hasMatchingArea = interestAreas.some(area => {
      // Check if trail belongs to selected interest area
      if (area === 'vestibular-enem' && trail.category === 'academic') return true;
      if (area === 'concursos-publicos' && trail.tags.some(tag => ['Concursos', 'Tribunais', 'Bancários', 'RLM'].includes(tag))) return true;
      if (area === 'programming' && trail.category === 'tech' && trail.tags.some(tag => ['React', 'JavaScript', 'Python', 'Mobile'].includes(tag))) return true;
      if (area === 'data-ai' && trail.tags.some(tag => ['Python', 'Machine Learning', 'Power BI', 'Dados', 'AI'].includes(tag))) return true;
      if (area === 'technology-infra' && trail.tags.some(tag => ['AWS', 'DevOps', 'Cloud', 'Segurança'].includes(tag))) return true;
      if (area === 'certifications' && trail.category === 'certification') return true;
      if (area === 'languages' && trail.category === 'language') return true;
      if (area === 'math-logic' && trail.tags.some(tag => ['Matemática', 'Estatística', 'RLM', 'Lógica'].includes(tag))) return true;
      if (area === 'productivity-tools' && trail.category === 'productivity') return true;
      if (area === 'career-market' && trail.category === 'career') return true;
      if (area === 'business-entrepreneurship' && trail.category === 'business') return true;
      if (area === 'marketing-sales' && trail.tags.some(tag => ['Marketing', 'Google Ads', 'SEO', 'Analytics'].includes(tag))) return true;
      if (area === 'design-creative' && trail.category === 'creative') return true;
      if (area === 'law' && trail.category === 'legal') return true;
      return false;
    });
    
    if (hasMatchingArea) {
      score += 0.15;
      reasoning.push('Alinhado com suas áreas de interesse');
    } else {
      // Penalize trails that don't match selected areas
      score -= 0.1;
    }
  }
  
  // Adjust score based on context
  if (request.context === 'career_change') {
    if (trail.category === 'tech' || trail.category === 'business') {
      score += 0.1;
      reasoning.push('Ideal para mudança de carreira');
    }
    if (trail.tags.includes('Entrevistas')) {
      score += 0.08;
      reasoning.push('Inclui preparação para entrevistas');
    }
  }
  
  if (request.context === 'job_prep') {
    if (trail.tags.includes('Entrevistas') || trail.tags.includes('Carreira')) {
      score += 0.15;
      reasoning.push('Preparação específica para emprego');
    }
    if (trail.category === 'career') {
      score += 0.1;
      reasoning.push('Foco em desenvolvimento profissional');
    }
  }
  
  if (request.context === 'beginner') {
    if (trail.level === 'beginner') {
      score += 0.12;
      reasoning.push('Adequado para iniciantes');
    } else if (trail.level === 'advanced') {
      score -= 0.08;
    }
  }
  
  if (request.context === 'upskilling') {
    if (trail.level === 'intermediate' || trail.level === 'advanced') {
      score += 0.08;
      reasoning.push('Aprofunda conhecimentos existentes');
    }
  }
  
  // Adjust based on objectives
  if (request.objectives.includes('employment')) {
    if (trail.category === 'tech' || trail.category === 'business') {
      score += 0.1;
      reasoning.push('Alta demanda no mercado');
    }
    if (trail.tags.includes('Portfolio') || trail.outcomes.includes('Portfolio profissional')) {
      score += 0.08;
      reasoning.push('Inclui desenvolvimento de portfolio');
    }
  }
  
  if (request.objectives.includes('certification')) {
    if (trail.category === 'certification' || trail.tags.includes('Certificação')) {
      score += 0.15;
      reasoning.push('Inclui certificações reconhecidas');
    }
  }
  
  if (request.objectives.includes('entrepreneurship')) {
    if (trail.category === 'business' || trail.tags.includes('Empreendedorismo')) {
      score += 0.12;
      reasoning.push('Foco em empreendedorismo');
    }
  }
  
  if (request.objectives.includes('academic_growth')) {
    if (trail.category === 'academic') {
      score += 0.1;
      reasoning.push('Complementa formação acadêmica');
    }
  }
  
  // Adjust based on learning style
  if (request.learningStyle.includes('hands_on') && trail.format === 'hands_on') {
    score += 0.1;
    reasoning.push('Combina com seu estilo prático');
  }
  
  if (request.learningStyle.includes('visual') && trail.format === 'visual') {
    score += 0.1;
    reasoning.push('Conteúdo visual e interativo');
  }
  
  if (request.learningStyle.includes('structured') && trail.format === 'structured') {
    score += 0.1;
    reasoning.push('Estrutura bem definida');
  }
  
  if (request.learningStyle.includes('theoretical') && trail.format === 'theoretical') {
    score += 0.08;
    reasoning.push('Foco em fundamentos teóricos');
  }
  
  if (request.learningStyle.includes('interactive') && trail.format === 'interactive') {
    score += 0.08;
    reasoning.push('Aprendizado interativo');
  }
  
  // Adjust based on time constraints
  const trailDurationMonths = parseInt(trail.duration);
  if (request.totalDuration) {
    const durationDiff = Math.abs(trailDurationMonths - request.totalDuration);
    if (durationDiff <= 1) {
      score += 0.08;
      reasoning.push('Duração ideal para seu cronograma');
    } else if (durationDiff <= 2) {
      score += 0.04;
      reasoning.push('Duração adequada ao seu tempo');
    } else if (durationDiff > 4) {
      score -= 0.05;
    }
  }
  
  // Adjust based on effort level vs time available
  if (request.timePerWeek) {
    if (request.timePerWeek >= 15 && trail.effort >= 4) {
      score += 0.06;
      reasoning.push('Aproveita bem seu tempo disponível');
    } else if (request.timePerWeek >= 10 && trail.effort >= 3) {
      score += 0.04;
      reasoning.push('Bom uso do tempo disponível');
    } else if (request.timePerWeek <= 5 && trail.effort <= 2) {
      score += 0.06;
      reasoning.push('Adequado ao seu tempo limitado');
    } else if (request.timePerWeek <= 5 && trail.effort >= 4) {
      score -= 0.08;
    }
  }
  
  // Budget considerations
  if (request.budget === 'free' && trail.tags.includes('Gratuito')) {
    score += 0.05;
    reasoning.push('Opção gratuita disponível');
  }
  
  // Experience level matching
  if (request.experienceLevel <= 2 && trail.level === 'beginner') {
    score += 0.06;
    reasoning.push('Nível adequado para iniciantes');
  } else if (request.experienceLevel >= 4 && trail.level === 'advanced') {
    score += 0.06;
    reasoning.push('Desafio adequado para seu nível');
  } else if (request.experienceLevel === 3 && trail.level === 'intermediate') {
    score += 0.04;
    reasoning.push('Nível intermediário ideal');
  }
  
  // Urgency considerations
  if (request.urgency >= 4) {
    if (trail.effort >= 3 && trailDurationMonths <= 6) {
      score += 0.05;
      reasoning.push('Ritmo acelerado para resultados rápidos');
    }
  } else if (request.urgency <= 2) {
    if (trail.effort <= 2) {
      score += 0.03;
      reasoning.push('Ritmo tranquilo e sustentável');
    }
  }
  
  // Ensure score doesn't exceed 1.0 or go below 0.1
  score = Math.max(0.1, Math.min(score, 1.0));
  
  // Add default reasoning if none was added
  if (reasoning.length === 0) {
    reasoning.push('Boa opção para seu perfil');
  }
  
  return {
    id: trail.id,
    title: trail.title,
    description: trail.description,
    score: Math.round(score * 100) / 100,
    duration: trail.duration,
    effort: trail.effort,
    outcomes: trail.outcomes,
    reasoning,
    format: trail.format,
    level: trail.level,
    tags: trail.tags,
    estimatedHours: trail.estimatedHours,
    successRate: calculateSuccessRate(trail, request)
  };
}

function generateProfileInsights(request: AIRecommendationRequest): ProfileInsight[] {
  const insights: ProfileInsight[] = [];
  const interestAreas = (request as any).interestAreas || [];
  
  // Context-based insights
  if (request.context === 'career_change') {
    insights.push({
      id: 'career_transition',
      icon: '🔄',
      text: 'Foco em transição de carreira',
      confidence: 0.9
    });
  }
  
  if (request.context === 'beginner') {
    insights.push({
      id: 'beginner_friendly',
      icon: '🌱',
      text: 'Trilhas adaptadas para iniciantes',
      confidence: 0.85
    });
  }
  
  if (request.context === 'job_prep') {
    insights.push({
      id: 'employment_focused',
      icon: '🎯',
      text: 'Preparação para o mercado de trabalho',
      confidence: 0.88
    });
  }
  
  // Learning style insights
  if (request.learningStyle.includes('hands_on')) {
    insights.push({
      id: 'practical_focus',
      icon: '🛠️',
      text: 'Aprende melhor com prática',
      confidence: 0.9
    });
  }
  
  if (request.learningStyle.includes('visual')) {
    insights.push({
      id: 'visual_learner',
      icon: '👁️',
      text: 'Prefere conteúdo visual',
      confidence: 0.85
    });
  }
  
  if (request.learningStyle.includes('structured')) {
    insights.push({
      id: 'structured_approach',
      icon: '📋',
      text: 'Funciona melhor com estrutura',
      confidence: 0.82
    });
  }
  
  // Interest area specific insights
  if (interestAreas.includes('programming')) {
    insights.push({
      id: 'tech_interest',
      icon: '💻',
      text: 'Interesse em programação',
      confidence: 0.95
    });
  }
  
  if (interestAreas.includes('data-ai')) {
    insights.push({
      id: 'data_focus',
      icon: '📊',
      text: 'Foco em dados e IA',
      confidence: 0.9
    });
  }
  
  if (interestAreas.includes('vestibular-enem')) {
    insights.push({
      id: 'academic_prep',
      icon: '📚',
      text: 'Preparação acadêmica',
      confidence: 0.92
    });
  }
  
  if (interestAreas.includes('concursos-publicos')) {
    insights.push({
      id: 'public_sector',
      icon: '🏛️',
      text: 'Interesse em setor público',
      confidence: 0.88
    });
  }
  
  if (interestAreas.includes('business-entrepreneurship')) {
    insights.push({
      id: 'business_minded',
      icon: '💼',
      text: 'Mentalidade empreendedora',
      confidence: 0.87
    });
  }
  
  if (interestAreas.includes('design-creative')) {
    insights.push({
      id: 'creative_focus',
      icon: '🎨',
      text: 'Interesse em design e criatividade',
      confidence: 0.85
    });
  }
  
  if (interestAreas.includes('certifications')) {
    insights.push({
      id: 'certification_focused',
      icon: '🏆',
      text: 'Busca por certificações',
      confidence: 0.9
    });
  }
  
  // Objective-based insights
  if (request.objectives.includes('employment')) {
    insights.push({
      id: 'job_focused',
      icon: '💼',
      text: 'Foco em empregabilidade',
      confidence: 0.9
    });
  }
  
  if (request.objectives.includes('entrepreneurship')) {
    insights.push({
      id: 'entrepreneur_mindset',
      icon: '🚀',
      text: 'Mentalidade empreendedora',
      confidence: 0.88
    });
  }
  
  // Time-based insights
  if (request.timePerWeek && request.timePerWeek >= 15) {
    insights.push({
      id: 'high_commitment',
      icon: '⚡',
      text: 'Alto comprometimento de tempo',
      confidence: 0.8
    });
  } else if (request.timePerWeek && request.timePerWeek <= 5) {
    insights.push({
      id: 'time_constrained',
      icon: '⏰',
      text: 'Tempo limitado disponível',
      confidence: 0.85
    });
  }
  
  // Urgency insights
  if (request.urgency >= 4) {
    insights.push({
      id: 'fast_paced',
      icon: '⚡',
      text: 'Prefere ritmo acelerado',
      confidence: 0.8
    });
  }
  
  return insights;
}

function calculateConfidence(request: AIRecommendationRequest): number {
  let confidence = 0.7; // Base confidence
  
  // Increase confidence based on completeness of profile
  if (request.context) confidence += 0.05;
  if (request.objectives && request.objectives.length > 0) confidence += 0.05;
  if (request.learningStyle && request.learningStyle.length > 0) confidence += 0.05;
  if ((request as any).interestAreas && (request as any).interestAreas.length > 0) confidence += 0.1;
  if (request.timePerWeek) confidence += 0.03;
  if (request.totalDuration) confidence += 0.02;
  
  return Math.min(confidence, 0.95);
}

function calculateSuccessRate(trail: any, request: AIRecommendationRequest): number {
  let baseRate = 0.75; // Base success rate
  
  // Adjust based on alignment with user profile
  if (request.learningStyle.includes(trail.format)) {
    baseRate += 0.1;
  }
  
  if (request.context === 'beginner' && trail.level === 'beginner') {
    baseRate += 0.05;
  }
  
  if (request.timePerWeek && request.timePerWeek >= trail.effort * 3) {
    baseRate += 0.05;
  }
  
  return Math.min(baseRate, 0.95);
}

function applyRefinements(profile: Partial<UserProfile>, refinements: any): Partial<UserProfile> {
  const refined = { ...profile };

  // Apply refinement logic here
  if (refinements.action === 'adjust_duration') {
    const currentDuration = refined.totalDuration || 6;
    refined.totalDuration = Math.max(1, Math.round(currentDuration * (1 + refinements.value)));
  }

  if (refinements.action === 'adjust_difficulty') {
    refined.experienceLevel = Math.max(1, Math.min(5, (refined.experienceLevel || 1) + refinements.value));
  }

  return refined;
}