/**
 * Seed data for ResourceCatalog
 * Version: 2.0.0 - Multi-area expansion
 * 
 * Initial verified resources covering:
 * - Tech (TeoMeWhy, official docs)
 * - ENEM/Vestibular (all subjects)
 * - Business English
 * - Professional Certifications (AWS, Azure, GCP, PMI)
 * 
 * This file can be used to populate the catalog with verified resources.
 * Run this once to seed the database with initial content.
 */

import { createResourceCatalog } from "@/api/resource-catalog";
import type { CreateResourceCatalogInput } from "@/api/resource-catalog";

export const SEED_RESOURCES: Omit<CreateResourceCatalogInput, "id">[] = [
  // ============================================
  // TEOMEWHY - PYTHON & DATA SCIENCE (Tech BR)
  // ============================================
  {
    title: "Python para Análise de Dados - TeoMeWhy",
    url: "https://www.youtube.com/@TeoMeWhy",
    language: "pt",
    type: "playlist",
    provider: "TeoMeWhy",
    tags: ["python", "data-science", "analise-dados", "pandas", "cronologia:base"],
    verified: true,
    category: "Dados",
    level: "beginner",
    description:
      "Canal completo do TeoMeWhy com conteúdo de Python, análise de dados, machine learning e carreira em dados.",
  },
  {
    title: "Introdução ao Python - TeoMeWhy",
    url: "https://www.youtube.com/playlist?list=PLvlkVRRKOYFRXdquucikNbwYeFzzzYIGb",
    language: "pt",
    type: "playlist",
    provider: "TeoMeWhy",
    tags: ["python", "iniciante", "programacao", "cronologia:base"],
    verified: true,
    category: "Programação",
    level: "beginner",
    description:
      "Playlist completa de introdução ao Python para iniciantes, com exemplos práticos e projetos.",
  },
  {
    title: "Pandas do Zero - TeoMeWhy",
    url: "https://www.youtube.com/playlist?list=PLvlkVRRKOYFSl-XCxNQ1u3uOLvDnYxupG",
    language: "pt",
    type: "playlist",
    provider: "TeoMeWhy",
    tags: ["pandas", "python", "data-science", "analise-dados", "cronologia:aplicacao"],
    verified: true,
    category: "Dados",
    level: "intermediate",
    description:
      "Aprenda Pandas do zero com o TeoMeWhy. Manipulação de dados, DataFrames e análises práticas.",
  },
  {
    title: "SQL para Análise de Dados - TeoMeWhy",
    url: "https://www.youtube.com/playlist?list=PLvlkVRRKOYFTqPmzGrB7dOHwRrWJds-Ql",
    language: "pt",
    type: "playlist",
    provider: "TeoMeWhy",
    tags: ["sql", "database", "analise-dados", "cronologia:base"],
    verified: true,
    category: "Dados",
    level: "beginner",
    description:
      "SQL do básico ao avançado para análise de dados. Queries, joins, agregações e muito mais.",
  },
  {
    title: "Carreira em Dados - TeoMeWhy",
    url: "https://www.youtube.com/playlist?list=PLvlkVRRKOYFQFJQqZKqBN8fVqgFqVqKqL",
    language: "pt",
    type: "playlist",
    provider: "TeoMeWhy",
    tags: ["carreira", "dados", "mercado", "dicas", "cronologia:aplicacao"],
    verified: true,
    category: "Carreira",
    level: "beginner",
    description:
      "Dicas de carreira em dados pelo TeoMeWhy. Como entrar na área, portfolio, entrevistas e mais.",
  },

  // ============================================
  // ENEM/VESTIBULAR - MATEMÁTICA
  // ============================================
  {
    title: "Matemática Básica - Khan Academy",
    url: "https://pt.khanacademy.org/math/arithmetic",
    language: "pt",
    type: "course",
    provider: "Khan Academy",
    tags: ["matematica", "enem", "aritmetica", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Fundamentos de aritmética essenciais para ENEM. Operações básicas, frações, porcentagem.",
  },
  {
    title: "Álgebra para ENEM - Khan Academy",
    url: "https://pt.khanacademy.org/math/algebra",
    language: "pt",
    type: "course",
    provider: "Khan Academy",
    tags: ["matematica", "enem", "algebra", "cronologia:nucleo"],
    verified: true,
    category: "ENEM",
    level: "intermediate",
    description:
      "Álgebra completa para ENEM. Equações, inequações, sistemas lineares.",
  },
  {
    title: "Geometria ENEM - Brasil Escola",
    url: "https://brasilescola.uol.com.br/matematica/geometria.htm",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["matematica", "enem", "geometria", "cronologia:nucleo"],
    verified: true,
    category: "ENEM",
    level: "intermediate",
    description:
      "Geometria plana e espacial para ENEM. Áreas, volumes, teoremas.",
  },
  {
    title: "Questões ENEM Matemática - INEP",
    url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem",
    language: "pt",
    type: "docs",
    provider: "INEP",
    tags: ["matematica", "enem", "questoes", "simulado", "cronologia:pratica"],
    verified: true,
    category: "ENEM",
    level: "advanced",
    description:
      "Provas anteriores do ENEM com gabarito. Pratique com questões reais.",
  },

  // ============================================
  // ENEM/VESTIBULAR - REDAÇÃO
  // ============================================
  {
    title: "Redação ENEM - Guia Completo",
    url: "https://brasilescola.uol.com.br/redacao/redacao-enem.htm",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["redacao", "enem", "escrita", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Estrutura da redação ENEM: introdução, desenvolvimento, conclusão e proposta de intervenção.",
  },
  {
    title: "Repertório Sociocultural para Redação",
    url: "https://brasilescola.uol.com.br/redacao/repertorio-sociocultural.htm",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["redacao", "enem", "repertorio", "cronologia:nucleo"],
    verified: true,
    category: "ENEM",
    level: "intermediate",
    description:
      "Como usar repertório sociocultural na redação ENEM. Citações, dados, exemplos.",
  },
  {
    title: "Redações Nota 1000 - INEP",
    url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    language: "pt",
    type: "docs",
    provider: "INEP",
    tags: ["redacao", "enem", "exemplos", "cronologia:pratica"],
    verified: true,
    category: "ENEM",
    level: "advanced",
    description:
      "Redações que tiraram nota 1000 no ENEM. Analise e aprenda com os melhores.",
  },

  // ============================================
  // ENEM/VESTIBULAR - CIÊNCIAS DA NATUREZA
  // ============================================
  {
    title: "Física para ENEM - Brasil Escola",
    url: "https://brasilescola.uol.com.br/fisica",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["fisica", "enem", "ciencias-natureza", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Física completa para ENEM. Mecânica, termodinâmica, eletricidade, óptica.",
  },
  {
    title: "Química para ENEM - Brasil Escola",
    url: "https://brasilescola.uol.com.br/quimica",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["quimica", "enem", "ciencias-natureza", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Química completa para ENEM. Química geral, orgânica, físico-química.",
  },
  {
    title: "Biologia para ENEM - Brasil Escola",
    url: "https://brasilescola.uol.com.br/biologia",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["biologia", "enem", "ciencias-natureza", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Biologia completa para ENEM. Citologia, genética, ecologia, evolução.",
  },

  // ============================================
  // ENEM/VESTIBULAR - CIÊNCIAS HUMANAS
  // ============================================
  {
    title: "História do Brasil - Brasil Escola",
    url: "https://brasilescola.uol.com.br/historiab",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["historia", "enem", "ciencias-humanas", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "História do Brasil completa para ENEM. Colônia, Império, República.",
  },
  {
    title: "Geografia para ENEM - Brasil Escola",
    url: "https://brasilescola.uol.com.br/geografia",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["geografia", "enem", "ciencias-humanas", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Geografia completa para ENEM. Geografia física, humana, do Brasil e geral.",
  },
  {
    title: "Filosofia e Sociologia - Brasil Escola",
    url: "https://brasilescola.uol.com.br/filosofia",
    language: "pt",
    type: "article",
    provider: "Brasil Escola",
    tags: ["filosofia", "sociologia", "enem", "ciencias-humanas", "cronologia:base"],
    verified: true,
    category: "ENEM",
    level: "beginner",
    description:
      "Filosofia e Sociologia para ENEM. Principais pensadores e conceitos.",
  },

  // ============================================
  // BUSINESS ENGLISH
  // ============================================
  {
    title: "Business English Basics - British Council",
    url: "https://learnenglish.britishcouncil.org/business-english",
    language: "en",
    type: "course",
    provider: "British Council",
    tags: ["ingles", "business-english", "negocios", "cronologia:base"],
    verified: true,
    category: "Idiomas",
    level: "beginner",
    description:
      "Inglês para negócios do básico. Vocabulário essencial e frases comuns. Chrome traduz com 1 clique.",
  },
  {
    title: "Business Email Writing - Coursera",
    url: "https://www.coursera.org/learn/business-english-writing",
    language: "en",
    type: "course",
    provider: "Coursera",
    tags: ["ingles", "business-english", "email", "escrita", "cronologia:aplicacao"],
    verified: true,
    category: "Idiomas",
    level: "intermediate",
    description:
      "Como escrever e-mails profissionais em inglês. Estrutura, tom, etiqueta.",
  },
  {
    title: "Business Presentations - edX",
    url: "https://www.edx.org/learn/business-english",
    language: "en",
    type: "course",
    provider: "edX",
    tags: ["ingles", "business-english", "apresentacoes", "cronologia:aplicacao"],
    verified: true,
    category: "Idiomas",
    level: "intermediate",
    description:
      "Apresentações de negócios em inglês. Estrutura, linguagem, confiança.",
  },
  {
    title: "Job Interviews in English - FluentU",
    url: "https://www.fluentu.com/blog/english/job-interview-english/",
    language: "en",
    type: "article",
    provider: "FluentU",
    tags: ["ingles", "business-english", "entrevista", "cronologia:pratica"],
    verified: true,
    category: "Idiomas",
    level: "advanced",
    description:
      "Entrevistas de emprego em inglês. Perguntas comuns, respostas, dicas.",
  },

  // ============================================
  // CERTIFICAÇÕES - AWS
  // ============================================
  {
    title: "AWS Cloud Practitioner - Guia Oficial",
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    language: "en",
    type: "docs",
    provider: "AWS",
    tags: ["aws", "cloud", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Guia oficial da certificação AWS Cloud Practitioner. Blueprint e recursos.",
  },
  {
    title: "AWS Solutions Architect Associate - Guia",
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    language: "en",
    type: "docs",
    provider: "AWS",
    tags: ["aws", "cloud", "certificacao", "arquitetura", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "intermediate",
    description:
      "Guia oficial da certificação AWS Solutions Architect Associate.",
  },
  {
    title: "AWS Training - Cursos Gratuitos",
    url: "https://aws.amazon.com/training/",
    language: "en",
    type: "course",
    provider: "AWS",
    tags: ["aws", "cloud", "certificacao", "treinamento", "cronologia:base"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Cursos oficiais gratuitos da AWS. Fundamentos e preparação para certificações.",
  },

  // ============================================
  // CERTIFICAÇÕES - MICROSOFT
  // ============================================
  {
    title: "Microsoft Azure Fundamentals - AZ-900",
    url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/",
    language: "en",
    type: "docs",
    provider: "Microsoft",
    tags: ["azure", "cloud", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Certificação Azure Fundamentals. Guia oficial e recursos de estudo.",
  },
  {
    title: "Microsoft Learn - Treinamentos Gratuitos",
    url: "https://learn.microsoft.com/",
    language: "en",
    type: "course",
    provider: "Microsoft",
    tags: ["microsoft", "azure", "certificacao", "treinamento", "cronologia:base"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Plataforma oficial de treinamento Microsoft. Cursos gratuitos e labs práticos.",
  },

  // ============================================
  // CERTIFICAÇÕES - GOOGLE CLOUD
  // ============================================
  {
    title: "Google Cloud Digital Leader",
    url: "https://cloud.google.com/certification/cloud-digital-leader",
    language: "en",
    type: "docs",
    provider: "Google Cloud",
    tags: ["gcp", "cloud", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Certificação Google Cloud Digital Leader. Guia oficial e preparação.",
  },
  {
    title: "Google Cloud Skills Boost",
    url: "https://www.cloudskillsboost.google/",
    language: "en",
    type: "course",
    provider: "Google Cloud",
    tags: ["gcp", "cloud", "certificacao", "treinamento", "cronologia:base"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Plataforma de treinamento Google Cloud. Labs práticos e cursos gratuitos.",
  },

  // ============================================
  // CERTIFICAÇÕES - PMI
  // ============================================
  {
    title: "PMP Certification - PMI Official",
    url: "https://www.pmi.org/certifications/project-management-pmp",
    language: "en",
    type: "docs",
    provider: "PMI",
    tags: ["pmp", "gestao-projetos", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "advanced",
    description:
      "Certificação PMP oficial do PMI. Guia, requisitos e preparação.",
  },

  // ============================================
  // TECH - DOCUMENTAÇÕES OFICIAIS
  // ============================================
  {
    title: "Python Official Documentation",
    url: "https://docs.python.org/3/",
    language: "en",
    type: "docs",
    provider: "Python.org",
    tags: ["python", "documentation", "reference", "cronologia:base"],
    verified: true,
    category: "Programação",
    level: "intermediate",
    description:
      "Documentação oficial do Python. Referência completa da linguagem e bibliotecas padrão.",
  },
  {
    title: "Python Tutorial - Documentação Oficial",
    url: "https://docs.python.org/pt-br/3/tutorial/",
    language: "pt",
    type: "docs",
    provider: "Python.org",
    tags: ["python", "tutorial", "iniciante", "cronologia:base"],
    verified: true,
    category: "Programação",
    level: "beginner",
    description:
      "Tutorial oficial do Python em português. Perfeito para começar a aprender a linguagem.",
  },
  {
    title: "MDN Web Docs - JavaScript",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript",
    language: "pt",
    type: "docs",
    provider: "MDN",
    tags: ["javascript", "web", "frontend", "cronologia:base"],
    verified: true,
    category: "Web",
    level: "beginner",
    description:
      "Documentação completa de JavaScript pela MDN. Referência essencial para desenvolvimento web.",
  },
  {
    title: "React Documentation",
    url: "https://react.dev/",
    language: "en",
    type: "docs",
    provider: "React",
    tags: ["react", "javascript", "frontend", "web", "cronologia:aplicacao"],
    verified: true,
    category: "Web",
    level: "intermediate",
    description:
      "Documentação oficial do React. Aprenda a criar interfaces de usuário modernas.",
  },
  {
    title: "Pandas Documentation",
    url: "https://pandas.pydata.org/docs/",
    language: "en",
    type: "docs",
    provider: "Pandas",
    tags: ["pandas", "python", "data-science", "cronologia:aplicacao"],
    verified: true,
    category: "Dados",
    level: "intermediate",
    description:
      "Documentação oficial do Pandas. Biblioteca essencial para análise de dados em Python.",
  },
  {
    title: "Scikit-learn Documentation",
    url: "https://scikit-learn.org/stable/",
    language: "en",
    type: "docs",
    provider: "Scikit-learn",
    tags: ["machine-learning", "python", "ml", "ai", "cronologia:aplicacao"],
    verified: true,
    category: "IA",
    level: "advanced",
    description:
      "Documentação do Scikit-learn. Biblioteca de machine learning mais popular em Python.",
  },
  {
    title: "Git Documentation",
    url: "https://git-scm.com/doc",
    language: "en",
    type: "docs",
    provider: "Git",
    tags: ["git", "version-control", "devops", "cronologia:base"],
    verified: true,
    category: "DevOps",
    level: "beginner",
    description:
      "Documentação oficial do Git. Controle de versão essencial para todo desenvolvedor.",
  },
  {
    title: "GitHub Learning Lab",
    url: "https://github.com/apps/github-learning-lab",
    language: "en",
    type: "course",
    provider: "GitHub",
    tags: ["github", "git", "collaboration", "cronologia:pratica"],
    verified: true,
    category: "DevOps",
    level: "beginner",
    description:
      "Aprenda GitHub na prática com cursos interativos e projetos reais.",
  },
  {
    title: "Docker Documentation",
    url: "https://docs.docker.com/",
    language: "en",
    type: "docs",
    provider: "Docker",
    tags: ["docker", "containers", "devops", "cronologia:aplicacao"],
    verified: true,
    category: "DevOps",
    level: "intermediate",
    description:
      "Documentação oficial do Docker. Containerização de aplicações modernas.",
  },

  // ============================================
  // PRODUTIVIDADE
  // ============================================
  {
    title: "Deep Work - Cal Newport",
    url: "https://www.amazon.com.br/Deep-Work-Focused-Success-Distracted/dp/1455586692",
    language: "en",
    type: "article",
    provider: "Amazon",
    tags: ["produtividade", "foco", "deep-work", "cronologia:base"],
    verified: true,
    category: "Produtividade",
    level: "beginner",
    description:
      "Livro essencial sobre trabalho focado e produtividade em um mundo distraído.",
  },

  // ============================================
  // CERTIFICAÇÕES - COMPTIA
  // ============================================
  {
    title: "CompTIA A+ Certification",
    url: "https://www.comptia.org/certifications/a",
    language: "en",
    type: "course",
    provider: "CompTIA",
    tags: ["comptia", "a+", "it", "hardware", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Certificação fundamental de IT. Cobre hardware, software, troubleshooting e suporte técnico.",
  },
  {
    title: "CompTIA Network+ Certification",
    url: "https://www.comptia.org/certifications/network",
    language: "en",
    type: "course",
    provider: "CompTIA",
    tags: ["comptia", "network+", "networking", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "intermediate",
    description:
      "Certificação de networking. Fundamentos de redes, protocolos, segurança e troubleshooting.",
  },
  {
    title: "CompTIA Security+ Certification",
    url: "https://www.comptia.org/certifications/security",
    language: "en",
    type: "course",
    provider: "CompTIA",
    tags: ["comptia", "security+", "seguranca", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "intermediate",
    description:
      "Certificação de segurança. Cobre ameaças, vulnerabilidades, criptografia e compliance.",
  },

  // ============================================
  // CERTIFICAÇÕES - CISCO
  // ============================================
  {
    title: "Cisco CCNA Certification",
    url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
    language: "en",
    type: "course",
    provider: "Cisco",
    tags: ["cisco", "ccna", "networking", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "intermediate",
    description:
      "Certificação CCNA. Fundamentos de networking, routing, switching e segurança.",
  },
  {
    title: "Cisco Networking Academy",
    url: "https://www.netacad.com",
    language: "en",
    type: "course",
    provider: "Cisco",
    tags: ["cisco", "networking", "cursos-gratuitos", "cronologia:base"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Cursos gratuitos de networking da Cisco. Preparação para CCNA e outras certificações.",
  },

  // ============================================
  // CERTIFICAÇÕES - ANBIMA
  // ============================================
  {
    title: "ANBIMA CPA-10",
    url: "https://www.anbima.com.br/pt_br/educar/certificacoes/cpa-10.htm",
    language: "pt",
    type: "course",
    provider: "ANBIMA",
    tags: ["anbima", "cpa-10", "financeiro", "investimentos", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "beginner",
    description:
      "Certificação CPA-10. Conhecimentos básicos para profissionais que atuam na distribuição de produtos de investimento.",
  },
  {
    title: "ANBIMA CPA-20",
    url: "https://www.anbima.com.br/pt_br/educar/certificacoes/cpa-20.htm",
    language: "pt",
    type: "course",
    provider: "ANBIMA",
    tags: ["anbima", "cpa-20", "financeiro", "investimentos", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "intermediate",
    description:
      "Certificação CPA-20. Conhecimentos para profissionais que atuam na distribuição de produtos de investimento para clientes de alta renda.",
  },
  {
    title: "ANBIMA CEA",
    url: "https://www.anbima.com.br/pt_br/educar/certificacoes/cea.htm",
    language: "pt",
    type: "course",
    provider: "ANBIMA",
    tags: ["anbima", "cea", "financeiro", "investimentos", "certificacao", "cronologia:blueprint"],
    verified: true,
    category: "Certificações",
    level: "advanced",
    description:
      "Certificação CEA. Especialista em investimentos. Conhecimentos avançados para assessores de investimento.",
  },
];

/**
 * Seed the ResourceCatalog with initial verified resources
 * This should be run once to populate the database
 */
export const seedResourceCatalog = async (): Promise<void> => {
  console.log("Starting ResourceCatalog seed...");

  let successCount = 0;
  let errorCount = 0;

  for (const resource of SEED_RESOURCES) {
    try {
      await createResourceCatalog(resource);
      successCount++;
      console.log(`✓ Added: ${resource.title}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to add: ${resource.title}`, error);
    }
  }

  console.log(`\nSeed completed:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Total: ${SEED_RESOURCES.length}`);
};

/**
 * Get seed resources by category
 */
export const getSeedResourcesByCategory = (
  category: string
): typeof SEED_RESOURCES => {
  return SEED_RESOURCES.filter((r) => r.category === category);
};

/**
 * Get seed resources by provider
 */
export const getSeedResourcesByProvider = (
  provider: string
): typeof SEED_RESOURCES => {
  return SEED_RESOURCES.filter((r) => r.provider === provider);
};

/**
 * Get TeoMeWhy seed resources
 */
export const getTeoMeWhySeedResources = (): typeof SEED_RESOURCES => {
  return getSeedResourcesByProvider("TeoMeWhy");
};

/**
 * Get ENEM seed resources
 */
export const getENEMSeedResources = (): typeof SEED_RESOURCES => {
  return getSeedResourcesByCategory("ENEM");
};

/**
 * Get Business English seed resources
 */
export const getBusinessEnglishSeedResources = (): typeof SEED_RESOURCES => {
  return SEED_RESOURCES.filter((r) => r.tags?.includes("business-english"));
};

/**
 * Get Certification seed resources
 */
export const getCertificationSeedResources = (): typeof SEED_RESOURCES => {
  return getSeedResourcesByCategory("Certificações");
};

/**
 * Get resources by chronology tag
 */
export const getResourcesByChronology = (
  chronology: "base" | "nucleo" | "aplicacao" | "pratica" | "blueprint"
): typeof SEED_RESOURCES => {
  return SEED_RESOURCES.filter((r) =>
    r.tags?.includes(`cronologia:${chronology}`)
  );
};
