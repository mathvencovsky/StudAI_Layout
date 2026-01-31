## StudAI - AI-Powered Learning Module Platform

StudAI is a learning management platform that allows users to create, organize, and track progress through educational content modules. The platform will leverage AI to provide personalized learning recommendations, content suggestions, and adaptive learning paths (coming soon).

## What is this app about?

StudAI helps learners organize their self-study journey by:

- **Creating Learning Modules**: Users can create modules containing curated educational content (YouTube videos, articles, quizzes, assignments, and labs)
- **Tracking Progress**: Track completion status of individual content items and overall module progress
- **Content Organization**: Organize content by category, difficulty level (beginner, intermediate, advanced), and duration
- **Community Voting**: Upvote/downvote modules to help surface quality learning paths
- **Learning Tracks**: Group related modules into structured learning tracks with parent-child relationships
- **Multi-language Support**: Available in English and Portuguese (pt-BR)

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **UI Components**: shadcn/ui
- **Backend**: AWS Amplify (Cognito, AppSync, DynamoDB)
- **Internationalization**: react-i18next

## Overview

This application is built with React+Vite and AWS Amplify, providing authentication, GraphQL API, and real-time database capabilities.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

## Troubleshooting

### AWS SSO Token Expired

If you see this error:

```
[InvalidCredentialError] Failed to load AWS credentials for profile 'default'
  ∟ Caused by: [CredentialsProviderError] Token is expired. To refresh this SSO session run 'aws sso login' with the corresponding profile.
```

Run `aws sso login` to refresh your SSO session.
