# Technical Spec: <feature name>

> _Text in italic can be remove when generating the final document_

## 0. Summary

_Provide a brief overview of the feature including the main goal and what is explicitly out of scope._

**Goal:** <one sentence outcome>  
**Out of scope:** <one sentence>

## 1. Technical Design

### 1.1 Amplify schema changes

_List all models and fields to add, modify, or remove in the Amplify data schema with code samples. Include field types and any authorization rules._

### 1.2 Type definitions

_Define new TypeScript types or modifications to existing types in model files. Follow the guideline of inferring types from schema when possible._

### 1.3 API / Data fetching changes

_Describe changes, with code samples, to React Query hooks, query options, selection sets, or Amplify client calls needed to fetch or mutate the new data._

### 1.4 Page changes

_List all pages that need modification, their routes, and a brief description and code samples of what changes are required._

### 1.5 Component changes

_List components to add or modify, including their props interface and a brief description of the changes with code samples_

### 1.6 Translation keys

_List all new i18n keys and for what they will be used_

## 2. Acceptance Criteria

_Define testable acceptance criteria using Given/When/Then format. Include edge cases that need to be handled._

### AC1: <title>

**Given** ...  
**When** ...  
**Then** ...

### Edge cases

- E1:
- E2:

## 3. Implementation Tasks

_Break down the implementation into specific file-level tasks. Each task should include the file path, a title, description, and code snippets showing what to add or change._

### 3.1 `path/to/file.ts` - <title>

Description of changes.

```ts
// Code to add/change
```

### 3.2 `path/to/file.ts` - <title>

- Specific change 1
- Specific change 2

```ts
// Code to add/change
```

## 4. Execution Order

_List the order in which implementation tasks should be executed, considering dependencies between changes._

- [] Task 1
- [] Task 2
- [] Task 3

## 5. Side Navigation

_Does this feature require a new side nav item? If yes, describe the label, icon, route, and placement._

## 6. Open Questions and missing details

_List any unresolved questions or missing details that need clarification before or during implementation._

- Q1:
- Q2:
