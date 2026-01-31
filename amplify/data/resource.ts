import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Core Entities
  Content: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      type: a.enum(["youtube_video", "article", "quiz", "assignment", "lab"]),
      durationInSeconds: a.integer().required(),
      link: a.url().required(),
      category: a.string().required(),
      level: a.enum(["beginner", "intermediate", "advanced"]),
      createdAt: a.timestamp().required(),
      updatedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),

      // Relationships
      moduleContents: a.hasMany("ModuleContent", "contentId"),
      userContentProgress: a.hasMany("UserContentProgress", "contentId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "update", "delete"]),
    ]),

  Module: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      upvoteCount: a.integer().default(0),
      downvoteCount: a.integer().default(0),
      createdAt: a.timestamp().required(),
      updatedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),

      // Relationships
      moduleContents: a.hasMany("ModuleContent", "moduleId"),
      userModuleProgress: a.hasMany("UserModuleProgress", "moduleId"),
      userContentProgress: a.hasMany("UserContentProgress", "moduleId"),
      votes: a.hasMany("Vote", "moduleId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "update", "delete"]),
    ]),

  ModuleContent: a
    .model({
      moduleId: a.id().required(),
      contentId: a.id().required(),
      position: a.integer().required(),
      isRequired: a.boolean().default(true),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),

      // Relationships
      module: a.belongsTo("Module", "moduleId"),
      content: a.belongsTo("Content", "contentId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "update", "delete"]),
    ]),

  // Progress Tracking
  UserModuleProgress: a
    .model({
      moduleId: a.id().required(),
      startDate: a.timestamp().required(),
      completionDate: a.timestamp(),
      createdAt: a.timestamp().required(),
      updatedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),

      // Relationships
      module: a.belongsTo("Module", "moduleId"),
    })
    .authorization((allow) => [allow.owner()]),

  UserContentProgress: a
    .model({
      moduleId: a.id().required(),
      contentId: a.id().required(),
      isCompleted: a.boolean().default(false),
      completionDate: a.timestamp(),
      createdAt: a.timestamp().required(),
      updatedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),

      // Relationships
      module: a.belongsTo("Module", "moduleId"),
      content: a.belongsTo("Content", "contentId"),
    })
    .authorization((allow) => [allow.owner()]),

  // Voting System
  Vote: a
    .model({
      moduleId: a.id().required(),
      value: a.integer().required(),
      createdAt: a.timestamp().required(),
      updatedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),

      // Relationships
      module: a.belongsTo("Module", "moduleId"),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),

  // Feedback System
  Feedback: a
    .model({
      rating: a.integer().required(),
      comment: a.string(),
      url: a.url().required(),
      createdAt: a.timestamp().required(),
      updatedAt: a.timestamp().required(),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
