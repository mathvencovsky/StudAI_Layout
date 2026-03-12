import { useState } from "react";
import { toast } from "sonner";
import { LessonPage } from "../pages/lesson-page";
import { ModulePage } from "../pages/module-page";
import { TrackPage } from "../pages/track-page";
import type { Track, Module, Lesson } from "@/types/learning";

// Mock data for demonstration
const mockTrack: Track = {
  id: "react-complete",
  title: "React Completo: Do Zero ao Avançado",
  description: "Domine React para desenvolvimento frontend moderno, desde conceitos básicos até técnicas avançadas de otimização e arquitetura.",
  objectives: [
    "Criar componentes React funcionais e de classe",
    "Gerenciar estado com hooks e Context API",
    "Implementar roteamento com React Router",
    "Otimizar performance com técnicas avançadas",
    "Desenvolver aplicações completas e escaláveis"
  ],
  prerequisites: [
    "Conhecimento básico de JavaScript ES6+",
    "Familiaridade com HTML e CSS",
    "Conceitos básicos de programação"
  ],
  estimatedHours: 40,
  totalXP: 2000,
  difficulty: "intermediate",
  modules: [],
  progress: {
    completedModules: 1,
    totalModules: 3,
    completedLessons: 5,
    totalLessons: 12,
    xpEarned: 750,
    totalXP: 2000,
    percentComplete: 42,
    timeSpent: 180, // 3 hours
    currentStreak: 5,
    lastStudyDate: new Date(),
    estimatedTimeRemaining: 1200 // 20 hours
  },
  certificate: {
    id: "cert-react-complete",
    trackId: "react-complete",
    title: "Certificado React Completo",
    description: "Certificado de conclusão da trilha React Completo"
  }
};

const mockModules: Module[] = [
  {
    id: "react-fundamentals",
    trackId: "react-complete",
    title: "Fundamentos do React",
    description: "Aprenda os conceitos básicos do React, incluindo componentes, JSX, props e estado.",
    objectives: [
      "Entender a filosofia do React",
      "Criar componentes funcionais",
      "Trabalhar com JSX",
      "Gerenciar props e estado básico"
    ],
    estimatedMinutes: 480, // 8 hours
    xpReward: 400,
    order: 1,
    lessons: [],
    progress: {
      completedLessons: 4,
      totalLessons: 4,
      xpEarned: 400,
      totalXP: 400,
      percentComplete: 100,
      timeSpent: 240,
      isCompleted: true,
      completedAt: new Date()
    },
    isLocked: false
  },
  {
    id: "react-advanced",
    trackId: "react-complete",
    title: "React Avançado",
    description: "Explore hooks, Context API, performance e padrões avançados de desenvolvimento.",
    objectives: [
      "Dominar hooks do React",
      "Implementar Context API",
      "Otimizar performance",
      "Aplicar padrões avançados"
    ],
    estimatedMinutes: 600, // 10 hours
    xpReward: 600,
    order: 2,
    lessons: [],
    progress: {
      completedLessons: 1,
      totalLessons: 4,
      xpEarned: 150,
      totalXP: 600,
      percentComplete: 25,
      timeSpent: 60,
      isCompleted: false
    },
    isLocked: false
  },
  {
    id: "react-project",
    trackId: "react-complete",
    title: "Projeto Final",
    description: "Desenvolva uma aplicação completa aplicando todos os conceitos aprendidos.",
    objectives: [
      "Planejar arquitetura da aplicação",
      "Implementar funcionalidades completas",
      "Aplicar boas práticas",
      "Fazer deploy da aplicação"
    ],
    estimatedMinutes: 720, // 12 hours
    xpReward: 1000,
    order: 3,
    lessons: [],
    progress: {
      completedLessons: 0,
      totalLessons: 4,
      xpEarned: 0,
      totalXP: 1000,
      percentComplete: 0,
      timeSpent: 0,
      isCompleted: false
    },
    isLocked: true
  }
];

const mockLessons: Lesson[] = [
  {
    id: "hooks-fundamentals",
    moduleId: "react-advanced",
    title: "Fundamentos dos Hooks",
    description: "Aprenda useState, useEffect e outros hooks essenciais do React.",
    objectives: [
      "Entender o conceito de hooks",
      "Usar useState para gerenciar estado",
      "Implementar useEffect para efeitos colaterais",
      "Aplicar hooks em componentes práticos"
    ],
    estimatedMinutes: 45,
    xpReward: 150,
    order: 1,
    content: {
      type: "video",
      videoUrl: "https://example.com/video.mp4",
      chapters: [
        {
          id: "intro-hooks",
          title: "Introdução aos Hooks",
          startTime: 0,
          endTime: 300,
          description: "O que são hooks e por que usar"
        },
        {
          id: "usestate-practice",
          title: "useState na Prática",
          startTime: 300,
          endTime: 600,
          description: "Exemplos práticos de useState"
        },
        {
          id: "useeffect-lifecycle",
          title: "useEffect e Ciclo de Vida",
          startTime: 600,
          endTime: 900,
          description: "Gerenciando efeitos colaterais"
        }
      ],
      textContent: `
        <h2>Hooks do React</h2>
        <p>Os Hooks são uma adição ao React 16.8 que permite usar estado e outras funcionalidades do React sem escrever uma classe.</p>
        
        <h3>useState</h3>
        <p>O hook useState permite adicionar estado a componentes funcionais:</p>
        <pre><code>const [count, setCount] = useState(0);</code></pre>
        
        <h3>useEffect</h3>
        <p>O useEffect permite executar efeitos colaterais em componentes funcionais:</p>
        <pre><code>useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);</code></pre>
      `
    },
    checkpoints: [
      {
        id: "checkpoint-1",
        lessonId: "hooks-fundamentals",
        title: "Checkpoint: useState",
        question: "Qual hook você usaria para gerenciar estado local em um componente funcional?",
        options: [
          { id: "opt-1", text: "useEffect", isCorrect: false },
          { id: "opt-2", text: "useState", isCorrect: true },
          { id: "opt-3", text: "useContext", isCorrect: false },
          { id: "opt-4", text: "useReducer", isCorrect: false }
        ],
        correctAnswer: "opt-2",
        explanation: "O useState é o hook usado para adicionar estado local a componentes funcionais. Ele retorna um array com o valor atual do estado e uma função para atualizá-lo.",
        xpReward: 25,
        order: 1,
        isCompleted: false
      }
    ],
    exercises: [
      {
        id: "exercise-counter",
        lessonId: "hooks-fundamentals",
        title: "Contador com useState",
        description: "Crie um componente contador usando o hook useState",
        type: "code",
        instructions: "Implemente um contador que pode ser incrementado e decrementado usando useState",
        starterCode: `import React, { useState } from 'react';

function Counter() {
  // Seu código aqui
  
  return (
    <div>
      <p>Contador: {/* mostrar valor */}</p>
      <button onClick={/* função para incrementar */}>+1</button>
      <button onClick={/* função para decrementar */}>-1</button>
    </div>
  );
}

export default Counter;`,
        solution: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}

export default Counter;`,
        testCases: [
          {
            input: "Clique no botão +1",
            expectedOutput: "Contador deve incrementar",
            description: "Teste de incremento"
          }
        ],
        xpReward: 75,
        isCompleted: false
      }
    ],
    resources: [
      {
        id: "react-hooks-docs",
        title: "Documentação Oficial dos Hooks",
        type: "documentation",
        url: "https://reactjs.org/docs/hooks-intro.html",
        description: "Documentação completa sobre hooks do React"
      },
      {
        id: "hooks-examples",
        title: "Exemplos de Código",
        type: "code",
        url: "https://github.com/example/react-hooks-examples",
        description: "Repositório com exemplos práticos de hooks"
      },
      {
        id: "hooks-tutorial",
        title: "Tutorial Interativo de Hooks",
        type: "article",
        url: "https://example.com/hooks-tutorial",
        description: "Tutorial passo a passo para dominar hooks"
      },
      {
        id: "hooks-cheatsheet",
        title: "Cheat Sheet de Hooks",
        type: "external",
        url: "https://example.com/hooks-cheatsheet",
        description: "Referência rápida com todos os hooks principais"
      },
      {
        id: "hooks-video",
        title: "Vídeo: Hooks na Prática",
        type: "external",
        url: "https://youtube.com/watch?v=example",
        description: "Vídeo complementar mostrando hooks em ação"
      }
    ],
    progress: {
      isStarted: true,
      isCompleted: false,
      timeSpent: 25,
      videoProgress: 65,
      completedCheckpoints: [],
      completedExercises: [],
      xpEarned: 0,
      lastPosition: 450
    },
    isLocked: false
  }
];

// Update references
mockTrack.modules = mockModules;
mockModules[1].lessons = mockLessons;

interface LearningDemoProps {
  initialView?: 'track' | 'module' | 'lesson';
  moduleId?: string;
  lessonId?: string;
}

export function LearningDemo({ 
  initialView = 'track',
  moduleId,
  lessonId 
}: LearningDemoProps = {}) {
  const [currentView, setCurrentView] = useState<'track' | 'module' | 'lesson'>(initialView);
  const [currentTrack, setCurrentTrack] = useState(mockTrack);
  const [currentModule, setCurrentModule] = useState(() => {
    if (moduleId) {
      return mockModules.find(m => m.id === moduleId) || mockModules[1];
    }
    return mockModules[1];
  });
  const [currentLesson, setCurrentLesson] = useState(() => {
    if (lessonId) {
      return mockLessons.find(l => l.id === lessonId) || mockLessons[0];
    }
    return mockLessons[0];
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLessonSelect = (lessonId: string) => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const lesson = mockLessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setCurrentView('lesson');
        
        // Update lesson as started if not already
        if (!lesson.progress.isStarted) {
          lesson.progress.isStarted = true;
          toast.success(`📖 Aula "${lesson.title}" iniciada!`);
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const handleModuleSelect = (moduleId: string) => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const module = mockModules.find(m => m.id === moduleId);
      if (module) {
        setCurrentModule(module);
        setCurrentView('module');
        toast.success(`📚 Módulo "${module.title}" carregado!`);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleLessonComplete = (lessonId: string) => {
    // Simulate lesson completion
    const lessonIndex = mockLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex !== -1) {
      mockLessons[lessonIndex].progress.isCompleted = true;
      mockLessons[lessonIndex].progress.completedAt = new Date();
      mockLessons[lessonIndex].progress.xpEarned = mockLessons[lessonIndex].xpReward;
      
      // Update module progress
      const moduleIndex = mockModules.findIndex(m => m.id === mockLessons[lessonIndex].moduleId);
      if (moduleIndex !== -1) {
        mockModules[moduleIndex].progress.completedLessons += 1;
        mockModules[moduleIndex].progress.xpEarned += mockLessons[lessonIndex].xpReward;
        mockModules[moduleIndex].progress.percentComplete = 
          (mockModules[moduleIndex].progress.completedLessons / mockModules[moduleIndex].lessons.length) * 100;
        
        if (mockModules[moduleIndex].progress.completedLessons === mockModules[moduleIndex].lessons.length) {
          mockModules[moduleIndex].progress.isCompleted = true;
          mockModules[moduleIndex].progress.completedAt = new Date();
          
          // Show module completion bonus
          toast.success(`🎊 Módulo "${mockModules[moduleIndex].title}" concluído! Bônus: +50 XP!`);
        }
      }
      
      // Update track progress
      mockTrack.progress.completedLessons += 1;
      mockTrack.progress.xpEarned += mockLessons[lessonIndex].xpReward;
      mockTrack.progress.percentComplete = 
        (mockTrack.progress.completedLessons / mockTrack.progress.totalLessons) * 100;
      
      // Check if track is completed
      if (mockTrack.progress.completedLessons === mockTrack.progress.totalLessons) {
        toast.success(`🏆 TRILHA COMPLETA! Parabéns! Você ganhou um certificado!`);
      } else {
        // Show lesson completion
        toast.success(`🎉 Aula "${mockLessons[lessonIndex].title}" concluída! +${mockLessons[lessonIndex].xpReward} XP`);
      }
      
      // Update current track state
      setCurrentTrack({ ...mockTrack });
    }
  };

  const handleCheckpointComplete = (checkpointId: string, isCorrect: boolean) => {
    // Simulate checkpoint completion
    const checkpoint = mockLessons[0].checkpoints.find(c => c.id === checkpointId);
    if (checkpoint) {
      checkpoint.isCompleted = true;
      if (isCorrect) {
        toast.success(`✅ Correto! Você ganhou ${checkpoint.xpReward} XP!`);
      } else {
        toast.error("❌ Resposta incorreta. Tente novamente!");
      }
    }
  };

  const handleExerciseComplete = (exerciseId: string, solution: string) => {
    // Simulate exercise completion
    const exercise = mockLessons[0].exercises.find(e => e.id === exerciseId);
    if (exercise) {
      exercise.isCompleted = true;
      toast.success(`💻 Exercício completado! Você ganhou ${exercise.xpReward} XP!`);
    }
  };

  const handleStartTrack = () => {
    setIsLoading(true);
    
    // Simulate starting track
    setTimeout(() => {
      // Start with first available lesson
      const firstModule = mockModules.find(m => !m.isLocked);
      if (firstModule) {
        const firstLesson = firstModule.lessons.find(l => !l.isLocked);
        if (firstLesson) {
          setCurrentModule(firstModule);
          setCurrentLesson(firstLesson);
          setCurrentView('lesson');
          
          // Mark lesson as started
          firstLesson.progress.isStarted = true;
          
          // Update track progress
          const updatedTrack = { ...currentTrack };
          updatedTrack.progress.lastStudyDate = new Date();
          setCurrentTrack(updatedTrack);
          
          toast.success(`🚀 Trilha "${mockTrack.title}" iniciada! Primeira aula: "${firstLesson.title}"`);
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const handleContinueTrack = () => {
    setIsLoading(true);
    
    // Simulate continuing track
    setTimeout(() => {
      // Find next incomplete lesson
      for (const module of mockModules) {
        if (!module.isLocked) {
          for (const lesson of module.lessons) {
            if (!lesson.isLocked && !lesson.progress.isCompleted) {
              setCurrentModule(module);
              setCurrentLesson(lesson);
              setCurrentView('lesson');
              
              // Mark lesson as started if not already
              if (!lesson.progress.isStarted) {
                lesson.progress.isStarted = true;
              }
              
              // Update track progress
              const updatedTrack = { ...currentTrack };
              updatedTrack.progress.lastStudyDate = new Date();
              setCurrentTrack(updatedTrack);
              
              toast.success(`📚 Continuando de onde você parou: "${lesson.title}"`);
              setIsLoading(false);
              return;
            }
          }
        }
      }
      toast.success(`🎉 Parabéns! Você completou toda a trilha!`);
      setIsLoading(false);
    }, 600);
  };

  const handleStartModule = () => {
    setIsLoading(true);
    
    // Simulate starting module
    setTimeout(() => {
      // Start with first lesson of current module
      const firstLesson = currentModule.lessons.find(l => !l.isLocked);
      if (firstLesson) {
        setCurrentLesson(firstLesson);
        setCurrentView('lesson');
        
        // Mark lesson as started
        firstLesson.progress.isStarted = true;
        
        toast.success(`📖 Módulo "${currentModule.title}" iniciado! Primeira aula: "${firstLesson.title}"`);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleContinueModule = () => {
    setIsLoading(true);
    
    // Simulate continuing module
    setTimeout(() => {
      // Find next incomplete lesson in current module
      const nextLesson = currentModule.lessons.find(l => !l.isLocked && !l.progress.isCompleted);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
        setCurrentView('lesson');
        
        // Mark lesson as started if not already
        if (!nextLesson.progress.isStarted) {
          nextLesson.progress.isStarted = true;
        }
        
        toast.success(`📚 Continuando módulo: "${nextLesson.title}"`);
      } else {
        toast.success(`✅ Módulo "${currentModule.title}" já foi completado!`);
      }
      setIsLoading(false);
    }, 400);
  };

  if (currentView === 'lesson') {
    return (
      <LessonPage
        track={currentTrack}
        module={currentModule}
        lesson={currentLesson}
        onLessonSelect={handleLessonSelect}
        onModuleSelect={handleModuleSelect}
        onLessonComplete={handleLessonComplete}
        onCheckpointComplete={handleCheckpointComplete}
        onExerciseComplete={handleExerciseComplete}
      />
    );
  }

  if (currentView === 'module') {
    return (
      <ModulePage
        track={currentTrack}
        module={currentModule}
        onLessonSelect={handleLessonSelect}
        onModuleSelect={handleModuleSelect}
        onStartModule={handleStartModule}
        onContinueModule={handleContinueModule}
        isLoading={isLoading}
      />
    );
  }

  return (
    <TrackPage
      track={currentTrack}
      onLessonSelect={handleLessonSelect}
      onModuleSelect={handleModuleSelect}
      onStartTrack={handleStartTrack}
      onContinueTrack={handleContinueTrack}
      isLoading={isLoading}
    />
  );
}