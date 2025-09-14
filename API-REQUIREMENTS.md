# API Requirements for Edu-Morph Modules

## Overview
This document outlines the API requirements and LLM integrations needed to implement the role-specific modules in the Edu-Morph platform.

## Educator Modules

### 1. AI Test Paper Making
**Purpose**: Generate intelligent test papers using AI
**Required APIs**:
- **OpenAI GPT-4** or **Anthropic Claude** for question generation
- **Supabase** for storing generated tests
- **PDF Generation API** (jsPDF or similar) for test paper creation

**API Key Required**: OpenAI API Key or Anthropic API Key
**Features**:
- Generate questions based on subject, difficulty level, and topic
- Multiple choice, short answer, and essay questions
- Automatic answer key generation
- PDF export functionality

### 2. Performance Analysis
**Purpose**: Analyze student performance and provide insights
**Required APIs**:
- **Chart.js** (already integrated) for data visualization
- **Supabase** for storing and retrieving performance data
- **Statistical analysis libraries** (optional)

**No API Key Required**: Uses existing database and charting
**Features**:
- Student performance trends
- Class average comparisons
- Weak topic identification
- Progress tracking over time

### 3. Student Management
**Purpose**: Manage and track student progress
**Required APIs**:
- **Supabase** for student data management
- **Email API** (SendGrid, Mailgun) for notifications

**API Key Required**: Email service API key
**Features**:
- Student roster management
- Progress tracking
- Communication tools
- Grade management

### 4. Course Planner
**Purpose**: Plan next courses and classes
**Required APIs**:
- **Supabase** for storing course plans
- **Calendar API** (Google Calendar) for scheduling

**API Key Required**: Google Calendar API key
**Features**:
- Course scheduling
- Resource planning
- Timeline management
- Integration with calendar

### 5. Resource Upload
**Purpose**: Upload and manage educational resources
**Required APIs**:
- **Supabase Storage** for file storage
- **File processing APIs** for different file types

**No API Key Required**: Uses Supabase Storage
**Features**:
- File upload and storage
- File type validation
- Resource categorization
- Access control

## Student Modules

### 1. Flash Cards
**Purpose**: Interactive learning with flash cards
**Required APIs**:
- **Supabase** for storing flash card sets
- **Spaced repetition algorithm** (custom implementation)

**No API Key Required**: Uses existing database
**Features**:
- Create and manage flash card sets
- Spaced repetition learning
- Progress tracking
- Customizable difficulty

### 2. Test Page
**Purpose**: Take tests assigned by educators
**Required APIs**:
- **Supabase** for test data and submissions
- **Timer functionality** (client-side)

**No API Key Required**: Uses existing database
**Features**:
- Test taking interface
- Timer functionality
- Auto-save progress
- Submit answers

### 3. Result Page
**Purpose**: View test results and progress
**Required APIs**:
- **Supabase** for retrieving results
- **Chart.js** for progress visualization

**No API Key Required**: Uses existing database and charting
**Features**:
- Test result display
- Performance analytics
- Historical progress
- Grade breakdown

### 4. Resources
**Purpose**: Access learning materials and resources
**Required APIs**:
- **Supabase** for resource metadata
- **Supabase Storage** for file access

**No API Key Required**: Uses Supabase Storage
**Features**:
- Browse available resources
- Download materials
- Search and filter
- Bookmark favorites

### 5. AI Chatbot
**Purpose**: Get instant help with AI assistant
**Required APIs**:
- **OpenAI GPT-4** or **Anthropic Claude** for chat functionality
- **Supabase** for chat history storage

**API Key Required**: OpenAI API Key or Anthropic API Key
**Features**:
- Conversational AI assistance
- Subject-specific help
- Chat history
- Context-aware responses

## Implementation Priority

### Phase 1 (No API Keys Required)
1. Flash Cards
2. Test Page
3. Result Page
4. Resources
5. Performance Analysis

### Phase 2 (Requires API Keys)
1. AI Test Paper Making
2. AI Chatbot
3. Student Management (email notifications)
4. Course Planner (calendar integration)

## API Key Setup Instructions

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Add to environment variables or config

### Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Generate API key
4. Add to environment variables or config

### Google Calendar API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create credentials (OAuth 2.0)
5. Add to environment variables or config

### Email Service API
1. **SendGrid**: Sign up at [SendGrid](https://sendgrid.com/)
2. **Mailgun**: Sign up at [Mailgun](https://www.mailgun.com/)
3. Get API key from dashboard
4. Add to environment variables or config

## Cost Estimates

### OpenAI GPT-4
- **Input**: $0.03 per 1K tokens
- **Output**: $0.06 per 1K tokens
- **Estimated monthly cost**: $10-50 (depending on usage)

### Anthropic Claude
- **Input**: $0.008 per 1K tokens
- **Output**: $0.024 per 1K tokens
- **Estimated monthly cost**: $5-30 (depending on usage)

### Email Service
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)

### Google Calendar API
- **Free tier**: 1M requests/day
- **No additional cost** for most use cases

## Next Steps

1. **Choose AI Provider**: Decide between OpenAI and Anthropic
2. **Set up API Keys**: Get the required API keys
3. **Implement Phase 1**: Start with modules that don't require API keys
4. **Add AI Features**: Integrate AI-powered modules
5. **Test and Deploy**: Test all modules and deploy to production

## Security Considerations

1. **API Key Security**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement rate limiting for API calls
3. **User Authentication**: Ensure proper user authentication
4. **Data Privacy**: Follow data privacy regulations
5. **Input Validation**: Validate all user inputs before API calls

## Support

For implementation support or questions about API integration, please refer to the respective API documentation or contact the development team.
