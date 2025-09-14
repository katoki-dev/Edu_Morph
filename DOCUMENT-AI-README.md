# Document-Based AI Generation System - EDU-MORPH

## Overview
The Document-Based AI Generation System is an advanced feature of EDU-MORPH that allows users to upload documents and generate educational content using artificial intelligence. This system supports multiple document formats and can create various types of educational materials including lesson notes, quizzes, flashcards, and summaries.

## Features

### 📄 Document Upload & Processing
- **Supported Formats**: PDF, DOCX, TXT, MD
- **File Validation**: Size limits (10MB), format validation
- **Text Extraction**: Automatic text extraction from various document types
- **Document Preview**: Real-time preview of extracted content
- **Drag & Drop**: Intuitive file upload interface

### 🤖 AI Content Generation
- **Lesson Notes**: Comprehensive study materials with key concepts
- **Quiz Questions**: Multiple choice, true/false, and short answer questions
- **Flashcards**: Interactive learning cards with front/back content
- **Summaries**: Key points and concept overviews
- **Customizable**: Difficulty levels, subject areas, content count

### 🔥 Firebase Integration
- **Real-time Database**: Firestore for data storage
- **File Storage**: Firebase Storage for document files
- **Authentication**: Secure user management
- **Offline Support**: Works offline with data sync

### 📊 Analytics & Progress Tracking
- **Usage Analytics**: Track content generation and usage
- **Progress Monitoring**: User learning progress
- **Performance Metrics**: System performance tracking

## File Structure

```
edu-morph/
├── document-ai-generator.html    # Main document AI interface
├── test-document-ai.html         # Testing interface
├── firebase-config.js           # Firebase configuration
├── firebase-service.js          # Firebase service layer
├── document-service.js          # Document processing service
├── ai-service.js               # Enhanced AI service
├── firebase-schema.md          # Database schema documentation
└── DOCUMENT-AI-README.md       # This file
```

## Quick Start

### 1. Setup Firebase
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Storage
3. Update `firebase-config.js` with your project credentials
4. Deploy Firestore security rules from `firebase-schema.md`

### 2. Install Dependencies
```bash
npm install firebase pdf-parse mammoth
```

### 3. Configure API Keys
Update `config.js` with your API keys:
- Firebase configuration
- Hugging Face API key
- OpenAI API key (optional)

### 4. Run the Application
```bash
python -m http.server 8000
```
Open `http://localhost:8000/document-ai-generator.html`

## Usage Guide

### Document Upload
1. **Navigate** to the Document AI Generator page
2. **Upload** a document by dragging and dropping or clicking to browse
3. **Wait** for document processing to complete
4. **Preview** the extracted text and statistics

### Content Generation
1. **Select** content type (lesson notes, quiz, flashcards, summary)
2. **Choose** difficulty level (beginner, intermediate, advanced)
3. **Specify** subject area and number of items
4. **Click** "Generate Content" to create AI-powered content
5. **Review** and download or save the generated content

### Testing
1. **Open** `test-document-ai.html` for testing
2. **Load** sample document or upload your own
3. **Run** individual tests or complete test suite
4. **Monitor** test results and performance metrics

## API Reference

### DocumentService
```javascript
// Validate file
const validation = documentService.validateFile(file);

// Extract text from document
const text = await documentService.extractText(file);

// Process document
const processed = documentService.processDocument(text, options);
```

### AIService
```javascript
// Generate content from document
const content = await aiService.generateContentFromDocument(
    documentText, 
    options
);

// Generate test questions
const questions = await aiService.generateTestQuestionsFromDocument(
    documentText, 
    options
);
```

### FirebaseService
```javascript
// Save document
const result = await firebaseService.saveDocument(documentData);

// Get user documents
const documents = await firebaseService.getDocuments(userId);

// Save generated content
const content = await firebaseService.saveGeneratedContent(contentData);
```

## Configuration

### Document Processing Settings
```javascript
DOCUMENT_PROCESSING: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_FORMATS: ['pdf', 'docx', 'txt', 'md'],
    MAX_TEXT_LENGTH: 50000,
    EXTRACTION_TIMEOUT: 30000
}
```

### AI Generation Settings
```javascript
AI_GENERATION: {
    MAX_CONTENT_ITEMS: 20,
    DEFAULT_COUNT: 5,
    TIMEOUT: 60000,
    RETRY_ATTEMPTS: 3
}
```

## Database Schema

### Collections
- **users**: User profiles and authentication
- **documents**: Uploaded documents and metadata
- **generatedContent**: AI-generated educational content
- **testQuestions**: Generated quiz questions
- **userProgress**: Learning progress tracking
- **contentLibrary**: Saved and shared content
- **analytics**: System usage analytics

See `firebase-schema.md` for detailed schema documentation.

## Security

### Firestore Security Rules
- Users can only access their own data
- Public content is readable by all authenticated users
- Admin users have access to analytics
- File uploads are restricted by file type and size

### File Validation
- File size limits (10MB maximum)
- Format validation (PDF, DOCX, TXT, MD only)
- Content sanitization and processing
- Malware scanning (recommended for production)

## Performance Optimization

### Client-Side
- Lazy loading of document content
- Pagination for large content lists
- Caching of frequently accessed data
- Progressive file upload with progress indicators

### Server-Side
- Firestore indexes for efficient queries
- Batch operations for multiple documents
- Connection pooling for database operations
- CDN for static file delivery

## Error Handling

### Common Errors
- **File too large**: Reduce file size or use compression
- **Unsupported format**: Convert to supported format
- **AI generation timeout**: Reduce content count or try again
- **Network errors**: Check internet connection and retry

### Error Recovery
- Automatic retry for transient failures
- Fallback content generation
- User-friendly error messages
- Detailed logging for debugging

## Testing

### Unit Tests
- Document processing functions
- AI content generation
- File validation
- Content parsing

### Integration Tests
- End-to-end document upload flow
- AI generation with real documents
- Firebase integration
- User authentication

### Performance Tests
- Large document processing
- Concurrent user load
- AI generation speed
- Database query performance

## Deployment

### Development
```bash
# Install dependencies
npm install

# Start development server
python -m http.server 8000

# Access application
open http://localhost:8000
```

### Production
1. **Configure** Firebase project
2. **Deploy** Firestore security rules
3. **Upload** files to web server
4. **Configure** CDN for static assets
5. **Set up** monitoring and analytics

## Monitoring

### Key Metrics
- Document upload success rate
- AI generation success rate
- Average processing time
- User engagement metrics
- Error rates and types

### Alerts
- High error rates
- Slow response times
- Storage quota warnings
- API rate limit exceeded

## Troubleshooting

### Common Issues

#### Document Upload Fails
- Check file size and format
- Verify internet connection
- Check Firebase Storage permissions

#### AI Generation Fails
- Verify API keys are correct
- Check API rate limits
- Ensure document text is extracted properly

#### Firebase Connection Issues
- Verify Firebase configuration
- Check network connectivity
- Verify Firestore security rules

### Debug Mode
Enable debug mode by setting `DEBUG = true` in the console:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style
- Use ES6+ features
- Follow Vue.js best practices
- Add JSDoc comments for functions
- Use meaningful variable names

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## Changelog

### Version 1.0.0
- Initial release of document-based AI generation
- Support for PDF, DOCX, TXT, MD formats
- Firebase integration
- AI content generation for multiple content types
- Comprehensive testing suite

---

**Built with ❤️ for the future of education**

*Empowering educators with AI-driven document processing and content generation.*
