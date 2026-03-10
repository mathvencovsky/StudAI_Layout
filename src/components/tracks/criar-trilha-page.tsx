import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Search, MessageSquare, Loader2, Code, Palette, BarChart, Briefcase, Globe, Cpu, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useAIConversation } from "@/hooks/ai/use-ai-hooks";
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { useAiChat } from "@/hooks/ai/use-ai-chat";
import { markdownConfig } from "@/lib/markdown-config";
import { AiChatWaitlist } from "@/components/content/ai-chat-waitlist";

// Learning Areas Data - Brazilian-focused comprehensive structure
const LEARNING_AREAS = [
  {
    id: "vestibular-enem",
    title: "Vestibular & ENEM",
    description: "Preparação para ENEM, vestibulares tradicionais e estratégias de prova",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    examples: ["ENEM", "FUVEST", "UNICAMP", "Redação", "Estratégias"]
  },
  {
    id: "concursos-publicos",
    title: "Concursos Públicos",
    description: "Preparação para concursos administrativos, tribunais, polícia e fiscais",
    icon: Briefcase,
    color: "bg-green-100 text-green-800 border-green-200",
    examples: ["Administrativos", "Tribunais", "Policiais", "Fiscais", "Bancários"]
  },
  {
    id: "programming",
    title: "Programação & Desenvolvimento",
    description: "Desenvolvimento de software, web, mobile e automação",
    icon: Code,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    examples: ["Frontend", "Backend", "Full-Stack", "Mobile", "Games"]
  },
  {
    id: "data-ai",
    title: "Dados & Inteligência Artificial",
    description: "Análise de dados, ciência de dados, machine learning e IA",
    icon: BarChart,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    examples: ["Análise de Dados", "Data Science", "Machine Learning", "BI", "GenAI"]
  },
  {
    id: "technology-infra",
    title: "Tecnologia & Infraestrutura",
    description: "Cloud, DevOps, segurança, redes e administração de sistemas",
    icon: Cpu,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    examples: ["Cloud", "DevOps", "Segurança", "Linux", "Redes"]
  },
  {
    id: "certifications",
    title: "Certificações Profissionais",
    description: "Certificações em cloud, redes, segurança, dados e gestão",
    icon: Users,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    examples: ["AWS", "Azure", "CCNA", "Security+", "PMP"]
  },
  {
    id: "languages",
    title: "Idiomas",
    description: "Inglês, espanhol, francês e outros idiomas para comunicação global",
    icon: Globe,
    color: "bg-teal-100 text-teal-800 border-teal-200",
    examples: ["Inglês", "Espanhol", "Francês", "Português", "Libras"]
  },
  {
    id: "math-logic",
    title: "Matemática & Raciocínio Lógico",
    description: "Matemática básica, álgebra, geometria, estatística e RLM",
    icon: Palette,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    examples: ["Matemática Básica", "Álgebra", "Geometria", "Estatística", "RLM"]
  },
  {
    id: "productivity-tools",
    title: "Ferramentas de Produtividade",
    description: "Excel, PowerPoint, Notion, Git e automação de trabalho",
    icon: Search,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    examples: ["Excel", "PowerPoint", "Notion", "Git", "Automação"]
  },
  {
    id: "career-market",
    title: "Carreira & Mercado",
    description: "Desenvolvimento de carreira, entrevistas, networking e soft skills",
    icon: Users,
    color: "bg-red-100 text-red-800 border-red-200",
    examples: ["Carreira Tech", "Empregabilidade", "Liderança", "Entrevistas"]
  },
  {
    id: "business-entrepreneurship",
    title: "Negócios & Empreendedorismo",
    description: "Administração, gestão de produtos, finanças e estratégia",
    icon: Briefcase,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    examples: ["Administração", "Produto", "Finanças", "Estratégia"]
  },
  {
    id: "marketing-sales",
    title: "Marketing & Vendas",
    description: "Marketing digital, SEO, copywriting, vendas e analytics",
    icon: MessageSquare,
    color: "bg-lime-100 text-lime-800 border-lime-200",
    examples: ["Marketing Digital", "SEO", "Copywriting", "Vendas", "Analytics"]
  },
  {
    id: "design-creative",
    title: "Design & Conteúdo Criativo",
    description: "UI/UX, design gráfico, motion design, 3D e criação de conteúdo",
    icon: Palette,
    color: "bg-violet-100 text-violet-800 border-violet-200",
    examples: ["UI/UX", "Design Gráfico", "Motion", "3D", "Conteúdo"]
  },
  {
    id: "law",
    title: "Direito",
    description: "OAB, direito constitucional, administrativo, penal e civil",
    icon: BookOpen,
    color: "bg-slate-100 text-slate-800 border-slate-200",
    examples: ["OAB", "Constitucional", "Administrativo", "Penal", "Civil"]
  }
];
// Comprehensive Brazilian-focused specialties within each area
const AREA_SPECIALTIES = {
  "vestibular-enem": [
    {
      id: "enem-matematica",
      title: "ENEM - Matemática",
      description: "Funções, geometria, estatística/probabilidade, razão/proporção",
      examples: ["Funções", "Geometria", "Estatística", "Probabilidade", "Razão e Proporção"],
      icon: "📐"
    },
    {
      id: "enem-linguagens",
      title: "ENEM - Linguagens",
      description: "Interpretação de texto, gramática aplicada, literatura, inglês/espanhol",
      examples: ["Interpretação de Texto", "Gramática", "Literatura", "Inglês", "Espanhol"],
      icon: "📚"
    },
    {
      id: "enem-humanas",
      title: "ENEM - Ciências Humanas",
      description: "História do Brasil, história geral, geografia, sociologia/filosofia, atualidades",
      examples: ["História do Brasil", "História Geral", "Geografia", "Sociologia", "Filosofia"],
      icon: "🌍"
    },
    {
      id: "enem-natureza",
      title: "ENEM - Ciências da Natureza",
      description: "Física (mecânica/eletricidade), química (estequiometria/orgânica), biologia (ecologia/genética)",
      examples: ["Física", "Química", "Biologia", "Mecânica", "Genética"],
      icon: "🔬"
    },
    {
      id: "enem-redacao",
      title: "ENEM - Redação",
      description: "Repertório sociocultural, tese/argumentação, coesão/coerência",
      examples: ["Repertório Sociocultural", "Argumentação", "Coesão", "Coerência", "Tese"],
      icon: "✍️"
    },
    {
      id: "vestibulares-tradicionais",
      title: "Vestibulares Tradicionais",
      description: "FUVEST, UNICAMP, 2ª fase, obras literárias, questões discursivas",
      examples: ["FUVEST", "UNICAMP", "2ª Fase", "Obras Literárias", "Questões Discursivas"],
      icon: "🎓"
    },
    {
      id: "estrategias-prova",
      title: "Estratégias de Prova",
      description: "Gestão de tempo, simulados, revisão espaçada, análise de erros",
      examples: ["Gestão de Tempo", "Simulados", "Revisão Espaçada", "Análise de Erros"],
      icon: "⏰"
    }
  ],
  "concursos-publicos": [
    {
      id: "administrativos",
      title: "Concursos Administrativos",
      description: "Português, RLM, informática, administração pública, legislação básica",
      examples: ["Português", "RLM", "Informática", "Administração Pública", "Legislação"],
      icon: "🏛️"
    },
    {
      id: "tribunais",
      title: "Concursos de Tribunais",
      description: "Direito Constitucional, Administrativo, Civil, Processo, Penal, legislação específica",
      examples: ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Penal"],
      icon: "⚖️"
    },
    {
      id: "policiais",
      title: "Concursos Policiais",
      description: "Penal/Processo Penal, Constitucional, direitos humanos, legislação penal especial, TAF",
      examples: ["Direito Penal", "Processo Penal", "Direitos Humanos", "TAF", "Legislação Especial"],
      icon: "👮"
    },
    {
      id: "fiscais",
      title: "Concursos Fiscais",
      description: "Tributário, contabilidade, auditoria, TI aplicada, legislação",
      examples: ["Direito Tributário", "Contabilidade", "Auditoria", "TI Aplicada", "Legislação Fiscal"],
      icon: "💼"
    },
    {
      id: "bancarios",
      title: "Concursos Bancários",
      description: "Conhecimentos bancários, matemática financeira, atualidades, português, vendas/atendimento",
      examples: ["Conhecimentos Bancários", "Matemática Financeira", "Atualidades", "Vendas"],
      icon: "🏦"
    },
    {
      id: "ti-concursos",
      title: "Concursos de TI",
      description: "Redes, segurança, banco de dados, desenvolvimento, engenharia de software, governança",
      examples: ["Redes", "Segurança", "Banco de Dados", "Desenvolvimento", "ITIL", "COBIT"],
      icon: "💻"
    }
  ],
  programming: [
    {
      id: "frontend",
      title: "Frontend",
      description: "HTML/CSS, JavaScript, TypeScript, React, Vue, Angular, acessibilidade, performance, testes",
      examples: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Vue", "Angular"],
      icon: "🌐"
    },
    {
      id: "backend",
      title: "Backend",
      description: "APIs REST, autenticação (JWT/OAuth), bancos (SQL/NoSQL), cache/filas, microserviços",
      examples: ["APIs REST", "JWT/OAuth", "SQL/NoSQL", "Microserviços", "Cache"],
      icon: "⚙️"
    },
    {
      id: "fullstack",
      title: "Full Stack",
      description: "React + Node, React + Django/FastAPI, Next.js, arquitetura e deploy",
      examples: ["React + Node", "Django/FastAPI", "Next.js", "Arquitetura", "Deploy"],
      icon: "🔄"
    },
    {
      id: "mobile",
      title: "Mobile",
      description: "Android (Kotlin), iOS (Swift), Flutter, React Native",
      examples: ["Android", "iOS", "Flutter", "React Native", "Kotlin", "Swift"],
      icon: "📱"
    },
    {
      id: "games",
      title: "Games",
      description: "Unity (C#), Godot, lógica de gameplay, física, assets",
      examples: ["Unity", "Godot", "C#", "Gameplay", "Física", "Assets"],
      icon: "🎮"
    },
    {
      id: "automacao-scripts",
      title: "Automação/Scripts",
      description: "Python para automação, web scraping, bots, integração com planilhas/APIs",
      examples: ["Python", "Web Scraping", "Bots", "APIs", "Automação"],
      icon: "🤖"
    },
    {
      id: "sistemas-low-level",
      title: "Sistemas/Low-level",
      description: "C/C++, Rust, estrutura de dados, sistemas operacionais, redes, otimização",
      examples: ["C/C++", "Rust", "Estrutura de Dados", "Sistemas Operacionais", "Otimização"],
      icon: "🔧"
    }
  ],
  "data-ai": [
    {
      id: "analise-dados",
      title: "Análise de Dados",
      description: "Excel/Sheets, SQL, Power BI, estatística básica, storytelling com dados",
      examples: ["Excel", "SQL", "Power BI", "Estatística", "Storytelling"],
      icon: "📊"
    },
    {
      id: "business-intelligence",
      title: "BI (Business Intelligence)",
      description: "Modelagem dimensional, DAX (Power BI), indicadores (KPIs), dashboards",
      examples: ["Modelagem Dimensional", "DAX", "KPIs", "Dashboards", "Power BI"],
      icon: "📈"
    },
    {
      id: "ciencia-dados",
      title: "Ciência de Dados",
      description: "Python (Pandas/NumPy), EDA, features, validação, métricas, projetos de ponta a ponta",
      examples: ["Python", "Pandas", "NumPy", "EDA", "Features", "Validação"],
      icon: "🔬"
    },
    {
      id: "machine-learning",
      title: "Machine Learning",
      description: "Regressão/classificação, árvores/boosting, pipelines, avaliação e overfitting",
      examples: ["Regressão", "Classificação", "Árvores", "Boosting", "Pipelines"],
      icon: "🤖"
    },
    {
      id: "deep-learning",
      title: "Deep Learning",
      description: "Redes neurais, CNN, RNN/Transformers, fine-tuning",
      examples: ["Redes Neurais", "CNN", "RNN", "Transformers", "Fine-tuning"],
      icon: "🧠"
    },
    {
      id: "nlp",
      title: "NLP",
      description: "Tokenização, embeddings, classificação de texto, chatbots",
      examples: ["Tokenização", "Embeddings", "Classificação de Texto", "Chatbots"],
      icon: "💬"
    },
    {
      id: "visao-computacional",
      title: "Visão Computacional",
      description: "Detecção/classificação, segmentação, OCR",
      examples: ["Detecção", "Classificação", "Segmentação", "OCR"],
      icon: "👁️"
    },
    {
      id: "genai-llms",
      title: "GenAI / LLMs",
      description: "Prompt engineering, RAG, agentes, avaliação, segurança/guardrails",
      examples: ["Prompt Engineering", "RAG", "Agentes", "Avaliação", "Guardrails"],
      icon: "✨"
    },
    {
      id: "engenharia-dados",
      title: "Engenharia de Dados",
      description: "ETL/ELT, Airflow, Spark, data lake/warehouse, qualidade/linhagem",
      examples: ["ETL/ELT", "Airflow", "Spark", "Data Lake", "Data Warehouse"],
      icon: "🏗️"
    },
    {
      id: "mlops",
      title: "MLOps",
      description: "Versionamento, deploy, monitoramento, experiment tracking",
      examples: ["Versionamento", "Deploy", "Monitoramento", "Experiment Tracking"],
      icon: "🔄"
    }
  ]
};
// Continuação das especialidades para as outras áreas
const AREA_SPECIALTIES_EXTENDED = {
  ...AREA_SPECIALTIES,
  "technology-infra": [
    {
      id: "cloud",
      title: "Cloud",
      description: "AWS/Azure/GCP, IAM, redes, storage, compute, custos",
      examples: ["AWS", "Azure", "GCP", "IAM", "Storage", "Compute"],
      icon: "☁️"
    },
    {
      id: "devops",
      title: "DevOps",
      description: "CI/CD, Docker, Kubernetes, Terraform, observabilidade",
      examples: ["CI/CD", "Docker", "Kubernetes", "Terraform", "Observabilidade"],
      icon: "🔧"
    }
  ],
  certifications: [
    {
      id: "cloud-certs",
      title: "Cloud",
      description: "AWS Cloud Practitioner/SAA, Azure Fundamentals/AZ-104, Google Cloud Digital Leader",
      examples: ["AWS SAA", "Azure AZ-104", "Google Cloud", "Cloud Practitioner"],
      icon: "☁️"
    }
  ],
  languages: [
    {
      id: "ingles",
      title: "Inglês",
      description: "Conversação, leitura técnica, escrita, entrevistas, TOEFL/IELTS",
      examples: ["Conversação", "Leitura Técnica", "Escrita", "TOEFL", "IELTS"],
      icon: "🇺🇸"
    }
  ],
  "math-logic": [
    {
      id: "matematica-basica",
      title: "Matemática Básica",
      description: "Frações, porcentagem, regra de três, equações",
      examples: ["Frações", "Porcentagem", "Regra de Três", "Equações"],
      icon: "🔢"
    }
  ],
  "productivity-tools": [
    {
      id: "excel-sheets",
      title: "Excel/Google Sheets",
      description: "PROCV/XLOOKUP, Tabelas Dinâmicas, Power Query, gráficos",
      examples: ["PROCV", "XLOOKUP", "Tabelas Dinâmicas", "Power Query", "Gráficos"],
      icon: "📊"
    }
  ],
  "career-market": [
    {
      id: "carreira-tech",
      title: "Carreira em Tech",
      description: "Portfólio, currículo/LinkedIn, entrevistas, roadmap, soft skills",
      examples: ["Portfólio", "LinkedIn", "Entrevistas", "Roadmap", "Soft Skills"],
      icon: "💻"
    }
  ],
  "business-entrepreneurship": [
    {
      id: "administracao",
      title: "Administração",
      description: "Processos, indicadores, operações",
      examples: ["Processos", "Indicadores", "Operações", "Administração"],
      icon: "📋"
    }
  ],
  "marketing-sales": [
    {
      id: "marketing-digital",
      title: "Marketing Digital",
      description: "Tráfego pago, orgânico, social media",
      examples: ["Tráfego Pago", "Tráfego Orgânico", "Social Media", "Marketing Digital"],
      icon: "📱"
    }
  ],
  "design-creative": [
    {
      id: "ui-ux",
      title: "UI/UX",
      description: "Pesquisa, prototipagem, heurísticas, design system",
      examples: ["Pesquisa", "Prototipagem", "Heurísticas", "Design System"],
      icon: "🎨"
    }
  ],
  law: [
    {
      id: "oab",
      title: "OAB",
      description: "1ª fase (disciplinas), 2ª fase (peça e prática)",
      examples: ["1ª Fase", "2ª Fase", "Peça Prática", "OAB"],
      icon: "⚖️"
    }
  ]
};

interface QuestionnaireData {
  topic: string;
  goal: string;
  currentKnowledge: string;
  timeAvailable: string;
  learningStyle: string;
  deadline: string;
  specificTopics: string;
}

export function CriarTrilhaPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 6;

  // AI Chat functionality
  const { isAiUser, isLoading: isCheckingAiUser } = useIsAiUser();
  const [aiInput, setAiInput] = useState("");
  const [{ data: aiData, isLoading: isAiLoading }, sendAiMessage] = useAIConversation("TrackCreation");
  useAiChat({ showIcon: true });

  // AI Area Selection
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [showSpecialtySelection, setShowSpecialtySelection] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  // Debug: Log para verificar se os dados estão carregados
  console.log("Debug - Dados carregados:", {
    learningAreasCount: LEARNING_AREAS.length,
    specialtiesKeys: Object.keys(AREA_SPECIALTIES_EXTENDED),
    activeTab,
    isAiUser,
    isCheckingAiUser,
    showSpecialtySelection,
    showAiChat
  });

  const [formData, setFormData] = useState<QuestionnaireData>({
    topic: "",
    goal: "",
    currentKnowledge: "beginner",
    timeAvailable: "",
    learningStyle: "",
    deadline: "",
    specificTopics: "",
  });

  const updateFormData = (field: keyof QuestionnaireData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.topic.trim().length > 0;
      case 2:
        return formData.goal.trim().length > 0;
      case 3:
        return formData.currentKnowledge.length > 0;
      case 4:
        return formData.timeAvailable.length > 0;
      case 5:
        return formData.learningStyle.length > 0;
      case 6:
        return true; // Última etapa é opcional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAreaSelect = (areaId: string) => {
    setSelectedArea(areaId);
    setSelectedSpecialty("");
    setShowSpecialtySelection(true);
    setShowAiChat(false);
    const area = LEARNING_AREAS.find(a => a.id === areaId);
    if (area) {
      toast.success(`Área selecionada: ${area.title}`);
    }
  };

  const handleSpecialtySelect = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    setShowAiChat(true);
    const specialty = AREA_SPECIALTIES_EXTENDED[selectedArea as keyof typeof AREA_SPECIALTIES_EXTENDED]?.find(s => s.id === specialtyId);
    if (specialty) {
      toast.success(`Especialidade selecionada: ${specialty.title}`);
    }
  };

  const handleBackToAreaSelection = () => {
    setShowAiChat(false);
    setShowSpecialtySelection(false);
    setSelectedArea("");
    setSelectedSpecialty("");
  };

  const handleBackToSpecialtySelection = () => {
    setShowAiChat(false);
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    
    const selectedAreaData = LEARNING_AREAS.find(a => a.id === selectedArea);
    const selectedSpecialtyData = AREA_SPECIALTIES_EXTENDED[selectedArea as keyof typeof AREA_SPECIALTIES_EXTENDED]?.find(s => s.id === selectedSpecialty);
    
    const aiContext = aiData.messages.length === 0 
      ? { 
          purpose: "track_creation",
          selectedArea: selectedAreaData?.title || "",
          selectedSpecialty: selectedSpecialtyData?.title || "",
          specialtyDescription: selectedSpecialtyData?.description || "",
          specialtyExamples: selectedSpecialtyData?.examples.join(", ") || "",
          instructions: `Você é um assistente especializado em criar trilhas de aprendizado personalizadas na área de "${selectedAreaData?.title}", especificamente em "${selectedSpecialtyData?.title}".`
        }
      : undefined;
    
    sendAiMessage({ content: [{ text: aiInput }], aiContext });
    setAiInput("");
  };

  const handleCreateFromAi = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Trilha criada com sucesso usando IA!");
      navigate({ to: "/explorar" });
    } catch (error) {
      toast.error("Erro ao criar trilha com IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t("questionnaire-track-created"));
      navigate({ to: "/explorar" });
    } catch (error) {
      toast.error(t("questionnaire-track-error"));
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{t("create-track-with-ai")}</h1>
        </div>
        <p className="text-muted-foreground">
          {t("create-track-with-ai-description")}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="questionnaire" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Questionário Guiado
          </TabsTrigger>
          <TabsTrigger value="ai-search" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Busca com IA
          </TabsTrigger>
        </TabsList>

        {/* Questionnaire Tab */}
        <TabsContent value="questionnaire" className="space-y-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Questionário em desenvolvimento...</p>
          </div>
        </TabsContent>

        {/* AI Search Tab */}
        <TabsContent value="ai-search" className="space-y-6">
          {isCheckingAiUser ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !isAiUser ? (
            <AiChatWaitlist />
          ) : !showSpecialtySelection && !showAiChat ? (
            /* Area Selection Step */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Passo 1: Escolha sua Área de Interesse
                  </CardTitle>
                  <CardDescription>
                    Selecione a área que você quer estudar para que nossa IA possa criar uma trilha mais direcionada e eficiente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {LEARNING_AREAS.map((area) => {
                      const Icon = area.icon;
                      const isSelected = selectedArea === area.id;
                      
                      return (
                        <Card
                          key={area.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected 
                              ? "ring-2 ring-primary border-primary bg-primary/5" 
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleAreaSelect(area.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${area.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm mb-1">{area.title}</h3>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {area.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-1">
                                  {area.examples.slice(0, 3).map((example, index) => (
                                    <span
                                      key={index}
                                      className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                  {area.examples.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                      +{area.examples.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Why Area Selection Helps */}
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                    🎯 Por que escolher uma área?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-700 dark:text-blue-300">
                  <ul className="space-y-2">
                    <li>• <strong>Trilhas mais direcionadas:</strong> A IA conhece as especificidades de cada área</li>
                    <li>• <strong>Recursos especializados:</strong> Sugestões de ferramentas e materiais específicos</li>
                    <li>• <strong>Progressão lógica:</strong> Sequência de aprendizado otimizada para a área</li>
                    <li>• <strong>Projetos práticos:</strong> Exercícios relevantes para sua área de interesse</li>
                    <li>• <strong>Mercado de trabalho:</strong> Orientações sobre oportunidades na área</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : showSpecialtySelection && !showAiChat ? (
            /* Specialty Selection Step */
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      <div>
                        <CardTitle>Passo 2: Escolha sua Especialidade</CardTitle>
                        <CardDescription>
                          Área: <span className="font-medium text-foreground">
                            {LEARNING_AREAS.find(a => a.id === selectedArea)?.title}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBackToAreaSelection}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {AREA_SPECIALTIES_EXTENDED[selectedArea as keyof typeof AREA_SPECIALTIES_EXTENDED]?.map((specialty) => {
                      const isSelected = selectedSpecialty === specialty.id;
                      
                      return (
                        <Card
                          key={specialty.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected 
                              ? "ring-2 ring-primary border-primary bg-primary/5" 
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleSpecialtySelect(specialty.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{specialty.icon}</div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm mb-1">{specialty.title}</h3>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {specialty.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-1">
                                  {specialty.examples.slice(0, 4).map((example, index) => (
                                    <span
                                      key={index}
                                      className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                  {specialty.examples.length > 4 && (
                                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                      +{specialty.examples.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Specialty Selection Tips */}
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 dark:text-green-200">
                    💡 Escolha a especialidade mais próxima do seu objetivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-700 dark:text-green-300">
                  <p className="mb-2">
                    Não se preocupe se não encontrar uma especialidade exata - a IA pode ajudar a personalizar ainda mais sua trilha durante a conversa.
                  </p>
                  <ul className="space-y-1">
                    <li>• Pense no seu objetivo principal (emprego, projeto pessoal, certificação)</li>
                    <li>• Considere seu nível atual de conhecimento na área</li>
                    <li>• Escolha a especialidade que mais se aproxima do que você quer aprender</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            /* AI Chat Step */
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      <div>
                        <CardTitle>Passo 3: Criar Trilha com IA</CardTitle>
                        <CardDescription>
                          <span className="font-medium text-foreground">
                            {LEARNING_AREAS.find(a => a.id === selectedArea)?.title}
                          </span>
                          {" → "}
                          <span className="font-medium text-foreground">
                            {AREA_SPECIALTIES_EXTENDED[selectedArea as keyof typeof AREA_SPECIALTIES_EXTENDED]?.find(s => s.id === selectedSpecialty)?.title}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBackToSpecialtySelection}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Trocar Especialidade
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* AI Conversation */}
                    <div className="border rounded-lg">
                      <ScrollArea className="h-96 p-4">
                        {aiData.messages.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Comece sua conversa com a IA</p>
                            <p className="text-sm mb-4">
                              Nossa IA especializada em <strong>{AREA_SPECIALTIES_EXTENDED[selectedArea as keyof typeof AREA_SPECIALTIES_EXTENDED]?.find(s => s.id === selectedSpecialty)?.title}</strong> está pronta para te ajudar!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {aiData.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                              >
                                <div className={`p-3 rounded-lg max-w-[80%] ${
                                  msg.role === "user" 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted"
                                }`}>
                                  <div className="prose prose-sm dark:prose-invert max-w-none [&_*]:break-words [&_code]:break-all [&_pre]:overflow-x-auto">
                                    <ReactMarkdown {...markdownConfig}>
                                      {msg.content[0].text}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>

                    {/* Input Area */}
                    <div className="space-y-2">
                      <Textarea
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder={`Descreva o que você quer aprender sobre ${AREA_SPECIALTIES_EXTENDED[selectedArea as keyof typeof AREA_SPECIALTIES_EXTENDED]?.find(s => s.id === selectedSpecialty)?.title || LEARNING_AREAS.find(a => a.id === selectedArea)?.title.toLowerCase()}...`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAiSend();
                          }
                        }}
                        rows={3}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Pressione Enter para enviar, Shift+Enter para nova linha
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleAiSend} 
                            disabled={isAiLoading || !aiInput.trim()}
                            size="sm"
                          >
                            {isAiLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Enviar"
                            )}
                          </Button>
                          {aiData.messages.length > 0 && (
                            <Button
                              onClick={handleCreateFromAi}
                              disabled={isGenerating}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Criando...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  Criar Trilha
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}