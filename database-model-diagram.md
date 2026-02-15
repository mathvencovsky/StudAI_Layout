# StudAI Database Model - Mermaid Diagram

Based on the comprehensive analysis of all specs in `.kiro/specs`, here is the complete data model for the StudAI application:

```mermaid
erDiagram
    %% Core Entities
    USERS {
        string uid PK "Firebase Auth UID"
        string email
        string displayName
        timestamp createdAt
        timestamp updatedAt
    }

    CONTENTS {
        string id PK "Auto-generated Firestore ID"
        string title "Content title"
        string description "Content description"
        string type "youtube_video | article | quiz | assignment | lab"
        number durationInSeconds "Duration in seconds (positive integer)"
        string link "URL to the content resource"
        string category "Content category"
        string level "beginner | intermediate | advanced"
        string createdAt "ISO timestamp"
        string updatedAt "ISO timestamp"
    }

    MODULES {
        string id PK "Auto-generated Firestore ID"
        string title "Module title"
        string description "Module description"
        number upvoteCount "Non-negative integer, maintained by Cloud Function"
        number downvoteCount "Non-negative integer, maintained by Cloud Function"
        string createdAt "ISO timestamp"
        string updatedAt "ISO timestamp"
        string createdBy "User ID who created the module"
    }

    MODULE_CONTENT {
        string id PK "Auto-generated Firestore ID"
        string moduleId FK "Reference to modules.id"
        string contentId FK "Reference to contents.id"
        number position "Order within module (0-based)"
        boolean isRequired "Default true for user-created modules"
    }

    %% Progress Tracking
    USER_MODULE_PROGRESS {
        string id PK "Auto-generated Firestore ID"
        string uid FK "Reference to users.uid"
        string moduleId FK "Reference to modules.id"
        string startDate "ISO timestamp when user started module"
        string completionDate "ISO timestamp when all content completed (optional)"
    }

    USER_CONTENT_PROGRESS {
        string id PK "Auto-generated Firestore ID"
        string uid FK "Reference to users.uid"
        string moduleId FK "Reference to modules.id"
        string contentId FK "Reference to contents.id"
        boolean isCompleted "Completion status"
        string completionDate "ISO timestamp when marked complete (optional)"
    }

    %% Voting System (Subcollection)
    VOTES {
        string uid PK "User ID (document ID in subcollection)"
        number value "1 for upvote, -1 for downvote"
        timestamp updatedAt "Server timestamp"
    }

    %% Feedback System
    FEEDBACK {
        string id PK "Auto-generated Firestore ID"
        string uid FK "Reference to users.uid"
        number rating "1-5 star rating"
        string comment "Optional feedback comment (nullable)"
        string url "Page URL where feedback was submitted"
        timestamp timestamp "Submission timestamp"
    }

    %% Relationships
    USERS ||--o{ MODULES : "creates"
    USERS ||--o{ USER_MODULE_PROGRESS : "tracks_module_progress"
    USERS ||--o{ USER_CONTENT_PROGRESS : "tracks_content_progress"
    USERS ||--o{ FEEDBACK : "submits"
    USERS ||--o{ VOTES : "casts_votes"

    MODULES ||--o{ MODULE_CONTENT : "contains"
    MODULES ||--o{ USER_MODULE_PROGRESS : "tracked_by_users"
    MODULES ||--o{ VOTES : "receives_votes"

    CONTENTS ||--o{ MODULE_CONTENT : "included_in_modules"
    CONTENTS ||--o{ USER_CONTENT_PROGRESS : "tracked_by_users"

    MODULE_CONTENT }o--|| MODULES : "belongs_to"
    MODULE_CONTENT }o--|| CONTENTS : "references"

    USER_MODULE_PROGRESS }o--|| USERS : "belongs_to"
    USER_MODULE_PROGRESS }o--|| MODULES : "tracks"

    USER_CONTENT_PROGRESS }o--|| USERS : "belongs_to"
    USER_CONTENT_PROGRESS }o--|| MODULES : "within_module"
    USER_CONTENT_PROGRESS }o--|| CONTENTS : "tracks"

    FEEDBACK }o--|| USERS : "submitted_by"

    %% Note: VOTES is a subcollection under MODULES
    %% Path: modules/{moduleId}/votes/{uid}
```

## Key Design Decisions & Relationships

### 1. **Content Management**

- **Contents**: Standalone learning resources with metadata, duration tracking, and YouTube video support
- **Modules**: Collections of ordered content items with voting capabilities
- **Module-Content Relationship**: Many-to-many through `MODULE_CONTENT` junction table with position ordering

### 2. **Progress Tracking**

- **Two-Level Progress**: Module-level (`USER_MODULE_PROGRESS`) and content-level (`USER_CONTENT_PROGRESS`)
- **Explicit Start**: Users must explicitly start a module before progress tracking begins
- **Completion Timestamps**: Both module and content completion dates are tracked

### 3. **Voting System**

- **Subcollection Design**: Votes stored as subcollection under modules (`modules/{moduleId}/votes/{uid}`)
- **Server-Side Integrity**: Vote counts maintained by Cloud Functions to prevent tampering
- **One Vote Per User**: Document ID is the user's UID, ensuring single vote per user per module

### 4. **User Feedback**

- **Contextual Capture**: Automatically captures page URL and user ID
- **Optional Comments**: Star rating required, comments optional
- **Global Feedback**: Not tied to specific modules/content, allows general app feedback

### 5. **Security & Data Integrity**

- **User Ownership**: Progress and votes tied to authenticated users
- **Firestore Rules**: Enforce user can only access their own progress/votes
- **Server-Side Validation**: Cloud Functions ensure vote count accuracy
- **Optimistic Updates**: UI updates immediately with server reconciliation

### 6. **Content Duration & Metadata**

- **Duration Tracking**: Content duration in seconds for time estimation
- **Metadata Extraction**: Preview metadata fetched from content URLs
- **Flexible Content Types**: Support for various content types (videos, articles, quizzes, etc.)

### 7. **Navigation & User Experience**

- **Module Context**: Content viewing maintains module context for navigation
- **Progress Indicators**: Visual feedback for completion status
- **Breadcrumb Navigation**: Support for hierarchical navigation
- **Language Support**: i18n ready with locale-specific content

This data model supports all the features specified in the requirements while maintaining data integrity, security, and scalability for the StudAI learning platform.
