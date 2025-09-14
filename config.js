// API Configuration for Edu-Morph
const API_CONFIG = {
    // Hugging Face API (for AI features)
    HUGGING_FACE: {
        API_KEY: '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',
        BASE_URL: 'https://api-inference.huggingface.co/models',
        MODELS: {
            CHATBOT: 'microsoft/DialoGPT-medium',
            TEXT_GENERATION: 'gpt2',
            QUESTION_GENERATION: 'distilbert-base-uncased'
        }
    },
    
    // EmailJS (for email notifications)
    EMAILJS: {
        SERVICE_ID: 'service_odb6xxq',
        PUBLIC_KEY: 'your_public_key_here', // You'll need to get this from EmailJS dashboard
        TEMPLATE_ID: 'template_contact' // You'll need to create this template
    },
    
    // Google Calendar API
    GOOGLE_CALENDAR: {
        CLIENT_ID: '331493948616-6rhsgma7f0v9t6i8219kl4qdn81t303r.apps.googleusercontent.com',
        API_KEY: 'your_google_api_key_here', // You'll need to get this from Google Cloud Console
        DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        SCOPES: 'https://www.googleapis.com/auth/calendar'
    },
    
    // Supabase (legacy - being replaced by Firebase)
    SUPABASE: {
        URL: 'https://cebrqzdpjksxozfqbetd.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYnJxemRwamtzeG96ZnFiZXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTIxMzcsImV4cCI6MjA3MzM2ODEzN30._kdp2jItLixL0LRiBjYYCIJvBYRg4VaF2ZgtwDfiEd0'
    },
    
    // Firebase Configuration
    FIREBASE: {
        apiKey: "your-firebase-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-firebase-app-id"
    },
    
    // Document Processing
    DOCUMENT_PROCESSING: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        SUPPORTED_FORMATS: ['pdf', 'docx', 'txt', 'md'],
        MAX_TEXT_LENGTH: 50000, // Maximum text length for processing
        EXTRACTION_TIMEOUT: 30000 // 30 seconds
    },
    
    // AI Generation
    AI_GENERATION: {
        MAX_CONTENT_ITEMS: 20,
        DEFAULT_COUNT: 5,
        TIMEOUT: 60000, // 60 seconds
        RETRY_ATTEMPTS: 3
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} else {
    window.API_CONFIG = API_CONFIG;
}
