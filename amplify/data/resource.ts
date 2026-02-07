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
  Content: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      type: a.enum(["youtube_video", "article", "quiz", "assignment", "lab"]),
      durationInSeconds: a.integer().required(),
      link: a.url().required(),
      category: a.string().required(),
      level: a.enum(["beginner", "intermediate", "advanced"]),
      thumbnailUrl: a.url(),
      author: a.string(),
      publishedAt: a.datetime(),
      language: a.string(),
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
