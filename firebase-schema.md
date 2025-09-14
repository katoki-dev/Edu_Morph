# Firebase Firestore Database Schema for EDU-MORPH

## Overview
This document outlines the Firebase Firestore database schema for the EDU-MORPH document-based AI generation system.

## Collections

### 1. Users Collection (`users`)
Stores user profile information and authentication data.

```javascript
{
  uid: string,                    // Firebase Auth UID (document ID)
  email: string,                  // User email address
  firstName: string,              // User's first name
  lastName: string,               // User's last name
  role: string,                   // 'student' or 'educator'
  avatarUrl: string,              // Optional profile picture URL
  createdAt: timestamp,           // Account creation date
  updatedAt: timestamp,           // Last profile update
  preferences: {                  // User preferences
    theme: string,                // 'light' or 'dark'
    notifications: boolean,       // Email notifications enabled
    language: string              // Preferred language
  }
}
```

### 2. Documents Collection (`documents`)
Stores uploaded documents and their metadata.

```javascript
{
  id: string,                     // Auto-generated document ID
  userId: string,                 // Reference to user who uploaded
  fileName: string,               // Original file name
  fileType: string,               // 'pdf', 'docx', 'txt', 'md'
  fileSize: number,               // File size in bytes
  downloadURL: string,            // Firebase Storage download URL
  storagePath: string,            // Path in Firebase Storage
  extractedText: string,          // Extracted text content
  processedText: string,          // Processed/cleaned text
  keyPoints: [string],            // Extracted key points
  wordCount: number,              // Word count
  characterCount: number,         // Character count
  subject: string,                // Detected or user-specified subject
  tags: [string],                 // User-defined tags
  isPublic: boolean,              // Whether document is public
  createdAt: timestamp,           // Upload date
  updatedAt: timestamp            // Last modification date
}
```

### 3. Generated Content Collection (`generatedContent`)
Stores AI-generated educational content.

```javascript
{
  id: string,                     // Auto-generated content ID
  userId: string,                 // Reference to user who generated
  documentId: string,             // Reference to source document (optional)
  type: string,                   // 'lesson-notes', 'quiz', 'flashcards', 'summary'
  subject: string,                // Subject area
  difficulty: string,             // 'beginner', 'intermediate', 'advanced'
  title: string,                  // Content title
  content: [                      // Array of generated items
    {
      id: number,                 // Item ID
      title: string,              // Item title
      content: string,            // Item content
      type: string                // Item type
    }
  ],
  metadata: {                     // Additional metadata
    wordCount: number,            // Total word count
    itemCount: number,            // Number of items generated
    generationTime: number,       // Time taken to generate (ms)
    aiModel: string,              // AI model used
    prompt: string                // Original prompt used
  },
  isPublic: boolean,              // Whether content is public
  tags: [string],                 // User-defined tags
  createdAt: timestamp,           // Generation date
  updatedAt: timestamp            // Last modification date
}
```

### 4. Test Questions Collection (`testQuestions`)
Stores generated test questions and quizzes.

```javascript
{
  id: string,                     // Auto-generated test ID
  userId: string,                 // Reference to user who created
  documentId: string,             // Reference to source document (optional)
  title: string,                  // Test title
  description: string,            // Test description
  subject: string,                // Subject area
  difficulty: string,             // 'beginner', 'intermediate', 'advanced'
  questions: [                    // Array of questions
    {
      id: number,                 // Question ID
      question: string,           // Question text
      type: string,               // 'multiple-choice', 'true-false', 'short-answer'
      options: [string],          // Answer options (for multiple choice)
      correctAnswer: string,      // Correct answer
      explanation: string,        // Answer explanation
      points: number,             // Point value
      timeLimit: number           // Time limit in seconds
    }
  ],
  settings: {                     // Test settings
    totalPoints: number,          // Total possible points
    timeLimit: number,            // Total time limit (minutes)
    shuffleQuestions: boolean,    // Whether to shuffle questions
    showCorrectAnswers: boolean,  // Whether to show correct answers
    allowRetake: boolean          // Whether retakes are allowed
  },
  isPublic: boolean,              // Whether test is public
  tags: [string],                 // User-defined tags
  createdAt: timestamp,           // Creation date
  updatedAt: timestamp            // Last modification date
}
```

### 5. User Progress Collection (`userProgress`)
Tracks user learning progress and analytics.

```javascript
{
  id: string,                     // Auto-generated progress ID
  userId: string,                 // Reference to user
  subject: string,                // Subject area
  activityType: string,           // 'content-generation', 'test-taking', 'study'
  activityId: string,             // Reference to specific activity
  score: number,                  // Score achieved (if applicable)
  maxScore: number,               // Maximum possible score
  timeSpent: number,              // Time spent in seconds
  completedAt: timestamp,         // Completion timestamp
  metadata: {                     // Additional progress data
    difficulty: string,           // Difficulty level
    accuracy: number,             // Accuracy percentage
    improvement: number           // Improvement from previous attempt
  }
}
```

### 6. Content Library Collection (`contentLibrary`)
Stores saved and shared educational content.

```javascript
{
  id: string,                     // Auto-generated library ID
  userId: string,                 // Reference to user who saved
  contentId: string,              // Reference to generated content
  contentType: string,            // Type of content
  title: string,                  // Library item title
  description: string,            // Item description
  subject: string,                // Subject area
  difficulty: string,             // Difficulty level
  tags: [string],                 // User-defined tags
  isPublic: boolean,              // Whether item is public
  isShared: boolean,              // Whether item is shared
  shareCode: string,              // Share code for public access
  downloadCount: number,          // Number of downloads
  rating: number,                 // Average rating (1-5)
  reviews: [                      // User reviews
    {
      userId: string,             // Reviewer user ID
      rating: number,             // Rating (1-5)
      comment: string,            // Review comment
      createdAt: timestamp        // Review date
    }
  ],
  createdAt: timestamp,           // Save date
  updatedAt: timestamp            // Last modification date
}
```

### 7. Analytics Collection (`analytics`)
Stores system analytics and usage statistics.

```javascript
{
  id: string,                     // Auto-generated analytics ID
  date: string,                   // Date (YYYY-MM-DD)
  metrics: {                      // Daily metrics
    totalUsers: number,           // Total registered users
    activeUsers: number,          // Active users today
    documentsUploaded: number,    // Documents uploaded today
    contentGenerated: number,     // Content items generated today
    testsCreated: number,         // Tests created today
    apiCalls: number,             // API calls made today
    storageUsed: number           // Storage used in bytes
  },
  breakdown: {                    // Detailed breakdown
    bySubject: {                  // Usage by subject
      [subject]: number           // Count per subject
    },
    byContentType: {              // Usage by content type
      [type]: number              // Count per type
    },
    byDifficulty: {               // Usage by difficulty
      [difficulty]: number        // Count per difficulty
    }
  },
  createdAt: timestamp            // Analytics generation date
}
```

## Security Rules

### Users Collection
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Documents Collection
```javascript
match /documents/{documentId} {
  allow read, write: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     resource.data.isPublic == true);
}
```

### Generated Content Collection
```javascript
match /generatedContent/{contentId} {
  allow read, write: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     resource.data.isPublic == true);
}
```

### Test Questions Collection
```javascript
match /testQuestions/{testId} {
  allow read, write: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     resource.data.isPublic == true);
}
```

### User Progress Collection
```javascript
match /userProgress/{progressId} {
  allow read, write: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

### Content Library Collection
```javascript
match /contentLibrary/{libraryId} {
  allow read: if resource.data.isPublic == true;
  allow write: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

### Analytics Collection
```javascript
match /analytics/{analyticsId} {
  allow read: if request.auth != null && 
    request.auth.token.role == 'admin';
  allow write: if false; // Only server-side writes allowed
}
```

## Indexes

### Composite Indexes
1. `documents` collection:
   - `userId` (Ascending) + `createdAt` (Descending)
   - `subject` (Ascending) + `createdAt` (Descending)
   - `isPublic` (Ascending) + `createdAt` (Descending)

2. `generatedContent` collection:
   - `userId` (Ascending) + `type` (Ascending) + `createdAt` (Descending)
   - `subject` (Ascending) + `difficulty` (Ascending) + `createdAt` (Descending)
   - `isPublic` (Ascending) + `type` (Ascending) + `createdAt` (Descending)

3. `testQuestions` collection:
   - `userId` (Ascending) + `subject` (Ascending) + `createdAt` (Descending)
   - `isPublic` (Ascending) + `difficulty` (Ascending) + `createdAt` (Descending)

4. `userProgress` collection:
   - `userId` (Ascending) + `subject` (Ascending) + `completedAt` (Descending)
   - `userId` (Ascending) + `activityType` (Ascending) + `completedAt` (Descending)

## Storage Structure

### Firebase Storage
```
/edu-morph/
├── documents/
│   └── {userId}/
│       └── {timestamp}_{filename}
├── generated-content/
│   └── {userId}/
│       └── {contentId}/
│           └── {filename}
└── shared-content/
    └── {shareCode}/
        └── {filename}
```

## Data Migration

### From Supabase to Firebase
1. Export data from Supabase tables
2. Transform data to match Firebase schema
3. Import data to Firebase Firestore
4. Update application code to use Firebase SDK
5. Test data integrity and functionality

## Performance Considerations

1. **Pagination**: Use `limit()` and `startAfter()` for large collections
2. **Caching**: Implement client-side caching for frequently accessed data
3. **Batch Operations**: Use batch writes for multiple document operations
4. **Offline Support**: Enable offline persistence for better user experience
5. **Indexing**: Create appropriate indexes for query patterns
6. **Data Archiving**: Archive old data to reduce collection size

## Monitoring and Alerts

1. **Document Upload Failures**: Monitor failed uploads
2. **AI Generation Errors**: Track AI service failures
3. **Storage Usage**: Monitor storage consumption
4. **API Rate Limits**: Track API usage and limits
5. **User Activity**: Monitor user engagement metrics
