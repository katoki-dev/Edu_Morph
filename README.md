# 🎓 EDU-MORPH: AI-Powered Educational Content Creator

A modern, AI-powered educational platform that revolutionizes content creation for educators and enhances learning for students. Built with Vue.js, Tailwind CSS, and Supabase.

## ✨ Key Features

### 🎯 **For Educators**
- **🤖 AI Content Generator**: Create lesson notes, quizzes, and flashcards instantly
- **📊 Student Management**: Track and manage student progress
- **📝 Custom Test Creator**: Build comprehensive assessments
- **📚 Resource Library**: Upload and organize educational materials
- **📈 Analytics Dashboard**: Monitor teaching effectiveness

### 🎓 **For Students**
- **🃏 Interactive Flashcards**: 3D flip animations with image support
- **📝 Study Modes**: Review and Test modes with progress tracking
- **🧠 Spaced Repetition**: Smart learning algorithms
- **📊 Progress Analytics**: Track learning achievements
- **🤖 AI Chatbot**: Get instant help and explanations

## 🚀 Quick Start

### Prerequisites
- Python 3.x (for local server)
- Modern web browser
- Internet connection (for Supabase integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Srujana_hackathon_Edu-Morph
   ```

2. **Start the development server**
   ```bash
   python3 -m http.server 3000
   ```

3. **Access the application**
   - Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
Srujana_hackathon_Edu-Morph/
├── index.html                    # Landing page with AI content generator
├── signup-final.html            # User registration with Supabase integration
├── login-simple.html            # User authentication
├── dashboard-simple.html        # Main dashboard with student/educator tools
├── test-supabase.html          # Supabase connection testing
├── create-simple-users-table.sql # Database schema
├── database-schema.sql         # Extended database schema
├── styles.css                  # Custom styles
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 🎯 Core Pages

### 1. **Landing Page** (`index.html`)
- **AI Content Generator**: Create educational content with AI
- **Modern Hero Section**: Gradient design with floating animations
- **Feature Showcase**: Interactive project demonstrations
- **Team Information**: Meet the development team

### 2. **Authentication** (`signup-final.html`, `login-simple.html`)
- **Dual Database Support**: Supabase primary with localStorage fallback
- **Role Selection**: Student or Educator registration
- **Real-time Validation**: Form validation and error handling
- **Session Management**: Secure user authentication

### 3. **Dashboard** (`dashboard-simple.html`)
- **Role-based Interface**: Different tools for students and educators
- **Interactive Analytics**: Progress tracking and performance metrics
- **Modern UI Components**: Cards, modals, and responsive design

## 🃏 Enhanced Flashcard System

### **Interactive Features**
- **🔄 3D Flip Animation**: Smooth card transitions with CSS 3D transforms
- **📊 Progress Tracking**: Visual progress bar and study statistics
- **🎮 Study Modes**: Review mode and Test mode with difficulty rating
- **🔀 Smart Shuffling**: Fisher-Yates algorithm for varied learning
- **⭐ Difficulty Rating**: 1-3 star difficulty system

### **Image Support**
- **📸 Image Upload**: Separate images for questions and answers
- **🖼️ Real-time Preview**: Instant image preview during creation
- **📏 File Validation**: Size and type validation (max 5MB)
- **🎨 Responsive Display**: Optimized image rendering

### **Rich Content**
- **📋 Metadata**: Card type, difficulty, explanations, related terms
- **🛠️ Creator Tool**: Complete flashcard creation interface
- **📚 Sample Content**: Pre-loaded educational flashcards
- **💾 Local Storage**: Persistent flashcard collections

## 🤖 AI Content Generation

### **Supported Content Types**
- **📝 Lesson Notes**: Comprehensive study materials
- **❓ Quizzes**: Multiple choice questions with explanations
- **🃏 Flashcards**: Interactive learning cards
- **📊 Summaries**: Key concept overviews

### **Customization Options**
- **🎯 Difficulty Levels**: Beginner, Intermediate, Advanced
- **📚 Subject Areas**: Physics, Chemistry, Mathematics, Biology, etc.
- **🔢 Content Count**: Generate 1-20 items per request
- **🎨 Visual Enhancement**: Image integration support

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3, Tailwind CSS, Chart.js
- **Backend**: Supabase (PostgreSQL) with localStorage fallback
- **Authentication**: Custom implementation with dual database support
- **Charts**: Chart.js for data visualization
- **Icons**: Heroicons and custom SVG icons
- **Animations**: CSS 3D transforms and transitions

## 🔧 Database Architecture

### **Primary Database (Supabase)**
```sql
CREATE TABLE simple_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'educator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Fallback Storage (localStorage)**
- Automatic fallback when Supabase is unavailable
- Seamless user experience regardless of connectivity
- Data persistence across browser sessions

## 🎨 Design Features

- **🌈 Gradient Themes**: Blue to purple gradients throughout
- **🌙 Dark Mode**: Modern dark theme for better focus
- **📱 Responsive Design**: Mobile-first approach
- **✨ Smooth Animations**: CSS transitions and hover effects
- **📊 Interactive Charts**: Real-time data visualization
- **🎭 3D Effects**: Card flip animations and depth

## 🔐 Security & Performance

- **🛡️ Input Validation**: Client-side and server-side validation
- **🔒 Session Management**: Secure localStorage-based sessions
- **👥 Role-based Access**: Different interfaces for different user types
- **🧹 Data Sanitization**: Proper handling of user inputs
- **⚡ Performance**: Optimized loading and rendering
- **🔄 Error Handling**: Graceful degradation and user feedback

## 🚀 Deployment Options

### **Local Development**
```bash
python3 -m http.server 3000
# Access at http://localhost:3000
```

### **Production Deployment**
1. Upload files to your web server
2. Configure Supabase project
3. Update API keys in HTML files
4. Set up domain and SSL certificate

## 📱 Cross-Platform Support

The application works seamlessly on:
- **💻 Desktop**: Full feature set with keyboard shortcuts
- **📱 Mobile**: Touch-optimized interface
- **📟 Tablet**: Responsive layout adaptation
- **🌐 All Browsers**: Modern browser compatibility

## 🎯 Student Tools

### **Interactive Flashcards**
- Create and study with image support
- Multiple study modes and progress tracking
- Difficulty-based learning algorithms

### **Test Taking**
- Join tests with educator-provided codes
- Real-time progress tracking
- Instant feedback and results

### **AI Chatbot**
- Get instant help with questions
- Subject-specific assistance
- Learning support and explanations

## 👨‍🏫 Educator Tools

### **AI Content Generator**
- Create lesson notes, quizzes, and flashcards
- Customize difficulty and content type
- Download generated materials

### **Student Management**
- Track student progress and performance
- Create and assign tests
- Monitor learning analytics

### **Resource Library**
- Upload and organize educational materials
- Share resources with students
- Categorize content by subject and difficulty

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Demo & Testing

### **Test the Application**
1. Visit `http://localhost:3000`
2. Create a new account (Student or Educator)
3. Explore the interactive features
4. Try the AI content generator
5. Test the enhanced flashcard system

### **Sample Features to Try**
- Create flashcards with images
- Switch between study modes
- Generate AI content
- Test the 3D card flip animations
- Explore the progress tracking

## 🏆 Hackathon Project

**EDU-MORPH** was built for the Srujana Hackathon, focusing on:
- **Innovation**: AI-powered content creation
- **User Experience**: Modern, interactive interface
- **Accessibility**: Cross-platform compatibility
- **Scalability**: Robust database architecture

---

**Built with ❤️ for the future of education**

*Empowering educators with AI-driven tools and enhancing student learning through interactive technology.*