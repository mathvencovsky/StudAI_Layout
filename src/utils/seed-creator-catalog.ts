/**
 * Seed data for CreatorCatalog
 * Version: 1.0.0
 * 
 * Initial verified creators covering:
 * - Tech (TeoMeWhy, official organizations)
 * - ENEM/Vestibular (Brasil Escola, Khan Academy, INEP)
 * - Business English (British Council, Coursera, edX)
 * - Certifications (AWS, Microsoft, Google Cloud, PMI)
 */

import { createCreatorCatalog } from "@/api/creator-catalog";
import type { CreateCreatorCatalogInput } from "@/api/creator-catalog";

export const SEED_CREATORS: CreateCreatorCatalogInput[] = [
  // ============================================
  // TECH - BR
  // ============================================
  {
    name: "TeoMeWhy",
    areas: ["Dados", "Python", "IA", "Carreira"],
    languages: ["pt"],
    platforms: [
      { type: "youtube", url: "https://www.youtube.com/@TeoMeWhy" },
      { type: "website", url: "https://teomewhy.org" },
    ],
    tags: ["data-science", "python", "sql", "machine-learning", "carreira"],
    description:
      "Canal brasileiro focado em análise de dados, Python, SQL e carreira em dados. Fonte prioritária para conteúdo tech em PT-BR.",
    verified: true,
  },

  // ============================================
  // TECH - OFFICIAL DOCS
  // ============================================
  {
    name: "Python.org",
    areas: ["Programação", "Python"],
    languages: ["en", "pt"],
    platforms: [
      { type: "website", url: "https://www.python.org" },
      { type: "docs", url: "https://docs.python.org" },
    ],
    tags: ["python", "programming", "documentation"],
    description:
      "Organização oficial do Python. Documentação, tutoriais e recursos oficiais.",
    verified: true,
  },
  {
    name: "MDN Web Docs",
    areas: ["Web", "JavaScript", "Frontend"],
    languages: ["en", "pt"],
    platforms: [
      { type: "website", url: "https://developer.mozilla.org" },
    ],
    tags: ["javascript", "web", "html", "css", "frontend"],
    description:
      "Documentação web da Mozilla. Referência completa para desenvolvimento web.",
    verified: true,
  },
  {
    name: "React",
    areas: ["Web", "Frontend", "JavaScript"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://react.dev" },
    ],
    tags: ["react", "javascript", "frontend", "ui"],
    description:
      "Biblioteca oficial React. Documentação e recursos para desenvolvimento de interfaces.",
    verified: true,
  },

  // ============================================
  // ENEM/VESTIBULAR
  // ============================================
  {
    name: "Brasil Escola",
    areas: ["ENEM", "Vestibular", "Educação"],
    languages: ["pt"],
    platforms: [
      { type: "website", url: "https://brasilescola.uol.com.br" },
    ],
    tags: ["enem", "vestibular", "educacao", "todas-materias"],
    description:
      "Portal educacional completo para ENEM e vestibulares. Todas as disciplinas com conteúdo em português.",
    verified: true,
  },
  {
    name: "Khan Academy",
    areas: ["ENEM", "Matemática", "Ciências"],
    languages: ["pt", "en"],
    platforms: [
      { type: "website", url: "https://pt.khanacademy.org" },
    ],
    tags: ["matematica", "ciencias", "educacao", "gratuito"],
    description:
      "Plataforma educacional gratuita com cursos de matemática e ciências. Disponível em português.",
    verified: true,
  },
  {
    name: "INEP",
    areas: ["ENEM", "Vestibular"],
    languages: ["pt"],
    platforms: [
      { type: "website", url: "https://www.gov.br/inep" },
    ],
    tags: ["enem", "provas", "gabaritos", "oficial"],
    description:
      "Instituto Nacional de Estudos e Pesquisas Educacionais. Provas oficiais do ENEM e gabaritos.",
    verified: true,
  },

  // ============================================
  // BUSINESS ENGLISH
  // ============================================
  {
    name: "British Council",
    areas: ["Idiomas", "Inglês"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://learnenglish.britishcouncil.org" },
    ],
    tags: ["ingles", "business-english", "idiomas"],
    description:
      "Organização britânica de ensino de inglês. Cursos de Business English e recursos gratuitos.",
    verified: true,
  },
  {
    name: "Coursera",
    areas: ["Idiomas", "Certificações", "Educação"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://www.coursera.org" },
    ],
    tags: ["cursos", "certificacoes", "online", "universidades"],
    description:
      "Plataforma de cursos online de universidades. Cursos de Business English e certificações.",
    verified: true,
  },
  {
    name: "edX",
    areas: ["Idiomas", "Certificações", "Educação"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://www.edx.org" },
    ],
    tags: ["cursos", "certificacoes", "online", "universidades"],
    description:
      "Plataforma de cursos online de universidades. Cursos de Business English e tech.",
    verified: true,
  },

  // ============================================
  // CERTIFICAÇÕES - CLOUD
  // ============================================
  {
    name: "AWS",
    areas: ["Cloud", "Certificações", "DevOps"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://aws.amazon.com" },
      { type: "training", url: "https://aws.amazon.com/training" },
    ],
    tags: ["aws", "cloud", "certificacao", "devops"],
    description:
      "Amazon Web Services. Certificações oficiais de cloud computing e treinamentos gratuitos.",
    verified: true,
  },
  {
    name: "Microsoft",
    areas: ["Cloud", "Certificações", "DevOps"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://learn.microsoft.com" },
    ],
    tags: ["azure", "microsoft", "cloud", "certificacao"],
    description:
      "Microsoft Learn. Certificações Azure e treinamentos oficiais gratuitos.",
    verified: true,
  },
  {
    name: "Google Cloud",
    areas: ["Cloud", "Certificações", "DevOps"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://cloud.google.com" },
      { type: "training", url: "https://www.cloudskillsboost.google" },
    ],
    tags: ["gcp", "google-cloud", "certificacao", "cloud"],
    description:
      "Google Cloud Platform. Certificações oficiais e labs práticos gratuitos.",
    verified: true,
  },

  // ============================================
  // CERTIFICAÇÕES - PROJECT MANAGEMENT
  // ============================================
  {
    name: "PMI",
    areas: ["Certificações", "Gestão de Projetos"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://www.pmi.org" },
    ],
    tags: ["pmp", "gestao-projetos", "certificacao"],
    description:
      "Project Management Institute. Certificação PMP e recursos de gestão de projetos.",
    verified: true,
  },

  // ============================================
  // CERTIFICAÇÕES - IT & NETWORKING
  // ============================================
  {
    name: "CompTIA",
    areas: ["Certificações", "IT", "Segurança"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://www.comptia.org" },
      { type: "training", url: "https://www.comptia.org/training" },
    ],
    tags: ["comptia", "a+", "network+", "security+", "certificacao", "it"],
    description:
      "CompTIA. Certificações IT fundamentais (A+, Network+, Security+) e recursos de treinamento.",
    verified: true,
  },
  {
    name: "Cisco",
    areas: ["Certificações", "Networking", "Segurança"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://www.cisco.com" },
      { type: "training", url: "https://www.netacad.com" },
    ],
    tags: ["cisco", "ccna", "ccnp", "networking", "certificacao"],
    description:
      "Cisco Networking Academy. Certificações CCNA/CCNP e cursos de networking gratuitos.",
    verified: true,
  },

  // ============================================
  // CERTIFICAÇÕES - FINANCEIRO
  // ============================================
  {
    name: "ANBIMA",
    areas: ["Certificações", "Financeiro", "Investimentos"],
    languages: ["pt"],
    platforms: [
      { type: "website", url: "https://www.anbima.com.br" },
      { type: "certificacao", url: "https://www.anbima.com.br/pt_br/educar/certificacoes.htm" },
    ],
    tags: ["anbima", "cpa-10", "cpa-20", "cea", "certificacao", "financeiro"],
    description:
      "Associação Brasileira das Entidades dos Mercados Financeiro e de Capitais. Certificações CPA-10, CPA-20 e CEA.",
    verified: true,
  },

  // ============================================
  // DATA SCIENCE LIBRARIES
  // ============================================
  {
    name: "Pandas",
    areas: ["Dados", "Python"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://pandas.pydata.org" },
      { type: "docs", url: "https://pandas.pydata.org/docs" },
    ],
    tags: ["pandas", "python", "data-science"],
    description:
      "Biblioteca oficial Pandas. Documentação completa para análise de dados em Python.",
    verified: true,
  },
  {
    name: "Scikit-learn",
    areas: ["IA", "Machine Learning", "Python"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://scikit-learn.org" },
    ],
    tags: ["machine-learning", "python", "ai"],
    description:
      "Biblioteca oficial Scikit-learn. Machine learning em Python.",
    verified: true,
  },

  // ============================================
  // DEVOPS TOOLS
  // ============================================
  {
    name: "Git",
    areas: ["DevOps", "Programação"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://git-scm.com" },
    ],
    tags: ["git", "version-control", "devops"],
    description:
      "Sistema de controle de versão Git. Documentação oficial e recursos.",
    verified: true,
  },
  {
    name: "GitHub",
    areas: ["DevOps", "Programação", "Colaboração"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://github.com" },
      { type: "learning", url: "https://github.com/apps/github-learning-lab" },
    ],
    tags: ["github", "git", "collaboration", "open-source"],
    description:
      "Plataforma GitHub. Cursos interativos e recursos de colaboração.",
    verified: true,
  },
  {
    name: "Docker",
    areas: ["DevOps", "Cloud", "Containers"],
    languages: ["en"],
    platforms: [
      { type: "website", url: "https://www.docker.com" },
      { type: "docs", url: "https://docs.docker.com" },
    ],
    tags: ["docker", "containers", "devops"],
    description:
      "Plataforma Docker. Documentação oficial de containerização.",
    verified: true,
  },
];

/**
 * Seed the CreatorCatalog with initial verified creators
 */
export const seedCreatorCatalog = async (): Promise<void> => {
  console.log("Starting CreatorCatalog seed...");

  let successCount = 0;
  let errorCount = 0;

  for (const creator of SEED_CREATORS) {
    try {
      await createCreatorCatalog(creator);
      successCount++;
      console.log(`✓ Added: ${creator.name}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to add: ${creator.name}`, error);
    }
  }

  console.log(`\nSeed completed:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Total: ${SEED_CREATORS.length}`);
};

/**
 * Get seed creators by area
 */
export const getSeedCreatorsByArea = (
  area: string
): typeof SEED_CREATORS => {
  return SEED_CREATORS.filter((c) => c.areas?.includes(area));
};

/**
 * Get seed creators by language
 */
export const getSeedCreatorsByLanguage = (
  language: string
): typeof SEED_CREATORS => {
  return SEED_CREATORS.filter((c) => c.languages?.includes(language));
};

/**
 * Get TeoMeWhy seed creator
 */
export const getTeoMeWhySeedCreator = (): typeof SEED_CREATORS[0] | undefined => {
  return SEED_CREATORS.find((c) => c.name === "TeoMeWhy");
};
