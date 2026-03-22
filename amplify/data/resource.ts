import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
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

const schema = a.schema({
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
      systemPrompt: "You are a helpful learning assistant for StudAI.",
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
    .authorization((allow) => [allow.owner().to(["create", "read", "update", "delete"])]),

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
