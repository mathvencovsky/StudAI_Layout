import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
  secret,
} from "@aws-amplify/backend";
import { defineConversationHandlerFunction } from "@aws-amplify/backend-ai/conversation";

export const chatHandler = defineConversationHandlerFunction({
  name: "chatHandler",
  entry: "./chat/handler.ts",
  models: [
    {
      modelId: a.ai.model("Amazon Nova Micro"),
    },
  ],
});

const youtubeProxyHandler = defineFunction({
  name: "youtube-proxy",
  entry: "./youtube-proxy/handler.ts",
  environment: {
    YOUTUBE_API_KEY: secret("YOUTUBE_API_KEY"),
  },
});

const schema = a.schema({
  // YouTube API custom types
  YouTubePageInfo: a.customType({
    totalResults: a.integer(),
    resultsPerPage: a.integer(),
  }),

  YouTubeThumbnail: a.customType({
    url: a.string(),
    width: a.integer(),
    height: a.integer(),
  }),

  YouTubeThumbnails: a.customType({
    default: a.ref("YouTubeThumbnail"),
    medium: a.ref("YouTubeThumbnail"),
    high: a.ref("YouTubeThumbnail"),
    standard: a.ref("YouTubeThumbnail"),
    maxres: a.ref("YouTubeThumbnail"),
  }),

  // Video types
  YouTubeVideoSnippet: a.customType({
    publishedAt: a.string(),
    channelId: a.string(),
    title: a.string(),
    description: a.string(),
    thumbnails: a.ref("YouTubeThumbnails"),
    channelTitle: a.string(),
    tags: a.string().array(),
    categoryId: a.string(),
    liveBroadcastContent: a.string(),
    defaultLanguage: a.string(),
    defaultAudioLanguage: a.string(),
  }),

  YouTubeVideoContentDetails: a.customType({
    duration: a.string(),
    dimension: a.string(),
    definition: a.string(),
    caption: a.string(),
    licensedContent: a.boolean(),
    projection: a.string(),
  }),

  YouTubeVideoStatistics: a.customType({
    viewCount: a.string(),
    likeCount: a.string(),
    favoriteCount: a.string(),
    commentCount: a.string(),
  }),

  YouTubeVideoStatus: a.customType({
    uploadStatus: a.string(),
    privacyStatus: a.string(),
    license: a.string(),
    embeddable: a.boolean(),
    publicStatsViewable: a.boolean(),
    madeForKids: a.boolean(),
  }),

  YouTubeVideoItem: a.customType({
    kind: a.string(),
    etag: a.string(),
    id: a.string(),
    snippet: a.ref("YouTubeVideoSnippet"),
    contentDetails: a.ref("YouTubeVideoContentDetails"),
    statistics: a.ref("YouTubeVideoStatistics"),
    status: a.ref("YouTubeVideoStatus"),
  }),

  YouTubeVideoListResponse: a.customType({
    kind: a.string(),
    etag: a.string(),
    nextPageToken: a.string(),
    prevPageToken: a.string(),
    pageInfo: a.ref("YouTubePageInfo"),
    items: a.ref("YouTubeVideoItem").array(),
  }),

  // Playlist types
  YouTubePlaylistSnippet: a.customType({
    publishedAt: a.string(),
    channelId: a.string(),
    title: a.string(),
    description: a.string(),
    thumbnails: a.ref("YouTubeThumbnails"),
    channelTitle: a.string(),
    defaultLanguage: a.string(),
  }),

  YouTubePlaylistContentDetails: a.customType({
    itemCount: a.integer(),
  }),

  YouTubePlaylistStatus: a.customType({
    privacyStatus: a.string(),
  }),

  YouTubePlaylistItem: a.customType({
    kind: a.string(),
    etag: a.string(),
    id: a.string(),
    snippet: a.ref("YouTubePlaylistSnippet"),
    contentDetails: a.ref("YouTubePlaylistContentDetails"),
    status: a.ref("YouTubePlaylistStatus"),
  }),

  YouTubePlaylistListResponse: a.customType({
    kind: a.string(),
    etag: a.string(),
    nextPageToken: a.string(),
    pageInfo: a.ref("YouTubePageInfo"),
    items: a.ref("YouTubePlaylistItem").array(),
  }),

  // PlaylistItem types (items inside a playlist)
  YouTubeResourceId: a.customType({
    kind: a.string(),
    videoId: a.string(),
  }),

  YouTubePlaylistItemSnippet: a.customType({
    publishedAt: a.string(),
    channelId: a.string(),
    title: a.string(),
    description: a.string(),
    thumbnails: a.ref("YouTubeThumbnails"),
    channelTitle: a.string(),
    playlistId: a.string(),
    position: a.integer(),
    resourceId: a.ref("YouTubeResourceId"),
  }),

  YouTubePlaylistItemContentDetails: a.customType({
    videoId: a.string(),
    videoPublishedAt: a.string(),
  }),

  YouTubePlaylistItemStatus: a.customType({
    privacyStatus: a.string(),
  }),

  YouTubePlaylistItemEntry: a.customType({
    kind: a.string(),
    etag: a.string(),
    id: a.string(),
    snippet: a.ref("YouTubePlaylistItemSnippet"),
    contentDetails: a.ref("YouTubePlaylistItemContentDetails"),
    status: a.ref("YouTubePlaylistItemStatus"),
  }),

  // Composite response type
  YouTubeFullPlaylistResponse: a.customType({
    playlist: a.ref("YouTubePlaylistListResponse"),
    items: a.ref("YouTubePlaylistItemEntry").array(),
  }),

  Category: a.enum([
    "web_development",
    "mobile_development",
    "data_science",
    "machine_learning",
    "cloud_computing",
    "devops",
    "cybersecurity",
    "databases",
    "ui_ux_design",
    "game_development",
    "blockchain",
    "embedded_systems",
    "vestibular_enem",
    "concursos_publicos",
    "certifications",
    "languages",
    "math_logic",
    "productivity_tools",
    "career_market",
    "business_entrepreneurship",
    "marketing_sales",
    "design_creative",
    "law",
  ]),

  LearningContext: a.enum([
    "beginner",
    "career_change",
    "upskilling",
    "job_prep",
    "academic",
    "personal_project",
  ]),

  Objective: a.enum([
    "employment",
    "career_change",
    "skill_improvement",
    "personal_project",
    "academic_growth",
  ]),

  Budget: a.enum(["free", "paid"]),

  LearningStyle: a.enum([
    "visual",
    "hands_on",
    "theoretical",
    "interactive",
    "self_paced",
    "structured",
  ]),

  ExperienceLevel: a.enum([
    "beginner",
    "intermediate",
    "advanced",
  ]),

  Content: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      type: a.enum(["youtube_video", "article", "quiz", "assignment", "lab"]),
      durationInSeconds: a.integer().required(),
      link: a.url().required(),
      category: a.string(),
      level: a.enum(["beginner", "intermediate", "advanced"]),
      thumbnailUrl: a.url(),
      author: a.string(),
      publishedAt: a.datetime(),
      language: a.string(),
      aiTranscript: a.string(),
      aiSummary: a.string(),
      moduleContents: a.hasMany("ModuleContent", "contentId"),
      userContentProgress: a.hasMany("UserContentProgress", "contentId"),
      favourites: a.hasMany("FavouriteContent", "contentId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  Module: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      upvoteCount: a.integer().default(0),
      downvoteCount: a.integer().default(0),
      moduleContents: a.hasMany("ModuleContent", "moduleId"),
      userModuleProgress: a.hasMany("UserModuleProgress", "moduleId"),
      userContentProgress: a.hasMany("UserContentProgress", "moduleId"),
      votes: a.hasMany("Vote", "moduleId"),
      favourites: a.hasMany("FavouriteModule", "moduleId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  FavouriteContent: a
    .model({
      contentId: a.id().required(),
      content: a.belongsTo("Content", "contentId"),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  FavouriteModule: a
    .model({
      moduleId: a.id().required(),
      module: a.belongsTo("Module", "moduleId"),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  ModuleContent: a
    .model({
      moduleId: a.id().required(),
      contentId: a.id().required(),
      position: a.integer().required(),
      isRequired: a.boolean().default(true),
      module: a.belongsTo("Module", "moduleId"),
      content: a.belongsTo("Content", "contentId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  UserModuleProgress: a
    .model({
      moduleId: a.id().required(),
      startDate: a.timestamp().required(),
      completionDate: a.timestamp(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      module: a.belongsTo("Module", "moduleId"),
    })
    .authorization((allow) => [allow.owner()]),

  UserContentProgress: a
    .model({
      moduleId: a.id().required(),
      contentId: a.id().required(),
      isCompleted: a.boolean().default(false),
      completionDate: a.timestamp(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      module: a.belongsTo("Module", "moduleId"),
      content: a.belongsTo("Content", "contentId"),
    })
    .authorization((allow) => [allow.owner()]),

  Vote: a
    .model({
      moduleId: a.id().required(),
      value: a.integer().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      module: a.belongsTo("Module", "moduleId"),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),

  Feedback: a
    .model({
      rating: a.integer().required(),
      comment: a.string(),
      url: a.url().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),

  Track: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      rootModuleId: a.id().required(),
      parentByModuleId: a.json().required(),
      positionByModuleId: a.json(),
      categories: a.ref("Category").required().array(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  UserTrackProgress: a
    .model({
      trackId: a.id().required(),
      startDate: a.timestamp().required(),
      completionDate: a.timestamp(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  UserLoginDay: a
    .model({
      date: a.string().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  Chat: a
    .conversation({
      aiModel: a.ai.model("Amazon Nova Micro"),
      systemPrompt: `Você é o assistente de aprendizado oficial da plataforma StudAI.

TOM DE VOZ:
- Motivador, humano e encorajador
- Orientado ao progresso do aluno
- Claro, direto e simples
- Nunca critica — sempre oferece alternativas

SEU PAPEL:
Ajudar o aluno a aprender de forma eficiente, personalizada e consistente. Você conhece o perfil do aluno (objetivo, nível, interesses) e usa isso para personalizar cada resposta.

COMPORTAMENTO OBRIGATÓRIO — LINKS E RECURSOS:
Sempre que o assunto envolver estudo, aprendizado, prática, carreira ou habilidades, inclua links reais e úteis.
Priorize SEMPRE fontes em português:
- YouTube: Hashtag Programação, Curso em Vídeo (Guanabara), Rafaella Ballerini, TeoMeWhy, Programador BR, Matheus Battisti
- TeoMeWhy (youtube.com/@TeoMeWhy): fonte prioritária para IA, Python, carreira tech e produtividade
- MDN Web Docs PT-BR, W3Schools, Documentação Python PT-BR
- Alura Blog (artigos gratuitos), DevMedia, Kenzie Academy Brasil
Se não houver boa fonte em português, use inglês e avise que o Chrome traduz automaticamente.

Formato dos links:
- Título do conteúdo
- Link real
- Uma frase explicando por que é útil

PRODUTIVIDADE E HÁBITOS (sempre ativo):
- Incentive constância: "consistência vence intensidade"
- Sugira micro-hábitos: 10-20 min/dia, revisão rápida, 1 tarefa pequena ao acordar
- Use técnicas: Pomodoro, Regra dos 2 minutos, Método Seinfeld (streaks)
- Divida tarefas grandes em pequenas
- Celebre pequenos avanços

GAMIFICAÇÃO (sempre ativo):
- Atribua pontos e XP às tarefas (+15 XP, Nível 2 em SQL)
- Sugira badges: "Primeiro Passo", "Streak de 7 dias", "Python Beginner"
- Crie mini desafios e missões diárias
- Transforme módulos em níveis e trilhas em jornadas
- Incentive streaks e sequências de estudo
- Use linguagem engajadora mas profissional

REGRAS GERAIS:
- Sempre inclua links mesmo quando o aluno não pedir
- Priorize conteúdo brasileiro
- Respostas em markdown quando útil
- Seja específico ao tema do aluno`,
      handler: chatHandler,
    })
    .authorization((allow) => allow.owner()),

  AiWaitlist: a
    .model({
      requestedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  LearningPreference: a
    .model({
      interests: a.ref("Category").required().array().required(),
      minutesPerDay: a.integer(),
      days: a.string().required().array().required(),
      formats: a.string().required().array().required(),
      contentLength: a.enum(["bite_sized", "short", "medium", "deep_dive"]),
      objectives: a.ref("Objective").required().array(),
      context: a.ref("LearningContext"),
      learningStyles: a.ref("LearningStyle").required().array(),
      preferencePace: a.integer(),
      preferenceDepth: a.integer(),
      preferenceStructure: a.integer(),
      preferenceChallenge: a.integer(),
      hoursPerWeek: a.integer(),
      totalWeeks: a.integer(),
      budget: a.ref("Budget"),
      urgency: a.integer(),
      experienceLevel: a.ref("ExperienceLevel"),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  UserProfile: a
    .model({
      locale: a.string().default("pt-BR"),
      theme: a.string().default("system"),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  StudySession: a
    .model({
      type: a.enum(["ai_session", "quiz", "review", "reading", "practice"]),
      moduleId: a.id(),
      trackId: a.id(),
      contentId: a.id(),
      startedAt: a.timestamp().required(),
      endedAt: a.timestamp(),
      durationMinutes: a.integer(),
      lastActiveAt: a.timestamp(),
      score: a.integer(),
      xpEarned: a.integer().default(0),
      tasksCompleted: a.string().required().array(),
      notes: a.string(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update", "delete"]),
    ]),

  Quiz: a
    .model({
      moduleId: a.id().required(),
      title: a.string().required(),
      description: a.string(),
      questions: a.json().required(),
      passingScore: a.integer().default(70),
      timeLimit: a.integer(),
      attempts: a.hasMany("QuizAttempt", "quizId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  QuizAttempt: a
    .model({
      quizId: a.id().required(),
      quiz: a.belongsTo("Quiz", "quizId"),
      score: a.integer().required(),
      answers: a.json().required(),
      startedAt: a.timestamp().required(),
      completedAt: a.timestamp().required(),
      passed: a.boolean().default(false),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  ReviewItem: a
    .model({
      topic: a.string().required(),
      moduleId: a.id(),
      contentId: a.id(),
      lastStudiedAt: a.timestamp().required(),
      nextDueAt: a.timestamp().required(),
      retention: a.integer().default(0),
      priority: a.enum(["low", "medium", "high"]),
      reviewCount: a.integer().default(0),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  Goal: a
    .model({
      title: a.string().required(),
      description: a.string(),
      trackId: a.id(),
      targetDate: a.timestamp(),
      startDate: a.timestamp(),
      status: a.enum(["active", "completed", "paused", "cancelled"]),
      isActive: a.boolean().default(false),
      progressPercentage: a.integer().default(0),
      hoursRemaining: a.integer(),
      minutesPerDay: a.integer(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  UserPlan: a
    .model({
      activeProgramId: a.id(),
      startDate: a.timestamp(),
      targetDate: a.timestamp(),
      modulesProgress: a.json(),
      completedHours: a.integer().default(0),
      tracks: a.json(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  CalendarEvent: a
    .model({
      title: a.string().required(),
      description: a.string(),
      eventType: a.enum(["session", "deadline", "exam", "reminder"]),
      startDate: a.timestamp().required(),
      endDate: a.timestamp(),
      moduleId: a.id(),
      trackId: a.id(),
      isCompleted: a.boolean().default(false),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  DailyTask: a
    .model({
      date: a.string().required(),
      taskType: a.enum(["reading", "practice", "quiz", "summary"]),
      isCompleted: a.boolean().default(false),
      durationMinutes: a.integer(),
      moduleId: a.id(),
      contentId: a.id(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  ResourceCatalog: a
    .model({
      title: a.string().required(),
      url: a.url().required(),
      language: a.enum(["pt", "en"]),
      type: a.enum(["video", "article", "docs", "repo", "playlist", "course"]),
      provider: a.string(),
      tags: a.string().required().array(),
      verified: a.boolean().default(false),
      category: a.string(),
      level: a.enum(["beginner", "intermediate", "advanced"]),
      description: a.string(),
      lastVerifiedAt: a.timestamp(),
      creatorId: a.id(),
      creator: a.belongsTo("CreatorCatalog", "creatorId"),
      isFree: a.boolean().default(true),
      httpStatus: a.integer(),
      finalUrl: a.url(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  CreatorCatalog: a
    .model({
      name: a.string().required(),
      areas: a.string().required().array(),
      languages: a.string().required().array(),
      platforms: a.json(),
      tags: a.string().required().array(),
      description: a.string(),
      verified: a.boolean().default(false),
      resources: a.hasMany("ResourceCatalog", "creatorId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  ContentEnginePrompt: a
    .model({
      name: a.string().required(),
      version: a.string().required(),
      promptText: a.string().required(),
      description: a.string(),
      isActive: a.boolean().default(false),
      promptType: a.enum([
        "system",
        "course_builder",
        "coach",
        "recommendations",
      ]),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  Assessment: a
    .model({
      title: a.string().required(),
      description: a.string(),
      questionCount: a.integer().required(),
      estimatedTimeMinutes: a.integer(),
      status: a.enum(["available", "in_progress", "completed"]),
      score: a.integer(),
      completedAt: a.timestamp(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  FeatureToggle: a
    .model({
      name: a.string().required(),
      description: a.string(),
      enabled: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  SavedItem: a
    .model({
      itemId: a.string().required(),
      itemType: a.enum(["track", "module", "content", "assessment"]),
      title: a.string().required(),
      thumbnail: a.url(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  Program: a
    .model({
      name: a.string().required(),
      category: a.string().required(),
      totalHours: a.integer().required(),
      modules: a.integer().required(),
      status: a.enum(["not_started", "in_progress", "completed"]),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("Admin").to(["create", "update", "delete"]),
    ]),

  UserProgramProgress: a
    .model({
      programId: a.id().required(),
      completedHours: a.integer().default(0),
      progress: a.integer().default(0),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  AiUsage: a
    .model({
      plan: a.enum(["free", "pro"]),
      periodDay: a.string().required(),
      requestsCount: a.integer().default(0),
      tokensIn: a.integer().default(0),
      tokensOut: a.integer().default(0),
      feature: a.enum([
        "course_builder",
        "coach",
        "recommendations",
        "content_generation",
      ]),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  UserSubscription: a
    .model({
      plan: a.enum(["free", "pro"]),
      status: a.enum(["active", "cancelled", "expired", "trial"]),
      startDate: a.timestamp().required(),
      endDate: a.timestamp(),
      autoRenew: a.boolean().default(false),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  Course: a
    .model({
      title: a.string().required(),
      summary: a.string(),
      category: a.string(),
      level: a.enum(["beginner", "intermediate", "advanced"]),
      estimatedHours: a.integer(),
      modules: a.json(),
      status: a.enum(["draft", "published", "archived"]),
      createdBy: a.string(),
      publishedAt: a.timestamp(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      courseModules: a.hasMany("CourseModule", "courseId"),
      userCourses: a.hasMany("UserCourse", "courseId"),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),

  CourseModule: a
    .model({
      courseId: a.id().required(),
      course: a.belongsTo("Course", "courseId"),
      title: a.string().required(),
      goals: a.string().required().array(),
      lessons: a.json(),
      tasks: a.json(),
      xpTotal: a.integer().default(0),
      position: a.integer().required(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "update", "delete"]),
    ]),

  CourseTask: a
    .model({
      moduleId: a.id().required(),
      title: a.string().required(),
      instructions: a.string(),
      estimatedMinutes: a.integer(),
      xp: a.integer().default(0),
      type: a.enum(["practice", "reading", "project", "quiz", "review"]),
      position: a.integer().required(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "update", "delete"]),
    ]),

  UserCourse: a
    .model({
      courseId: a.id().required(),
      course: a.belongsTo("Course", "courseId"),
      status: a.enum(["not_started", "in_progress", "completed", "paused"]),
      startDate: a.timestamp(),
      targetDate: a.timestamp(),
      progress: a.integer().default(0),
      streak: a.integer().default(0),
      xpEarned: a.integer().default(0),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  // YouTube proxy custom queries
  getYouTubeVideo: a
    .query()
    .arguments({ id: a.string().required() })
    .returns(a.ref("YouTubeVideoListResponse"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(youtubeProxyHandler)),

  getYouTubePlaylistFull: a
    .query()
    .arguments({ id: a.string().required() })
    .returns(a.ref("YouTubeFullPlaylistResponse"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(youtubeProxyHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
