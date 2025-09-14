// AI Service for Edu-Morph
class AIService {
    constructor() {
        this.hfApiKey = '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';
        this.baseUrl = 'https://api-inference.huggingface.co/models';
        this.openaiApiKey = 'your-openai-api-key'; // Add your OpenAI API key
    }

    // Generate test questions using AI
    async generateTestQuestions(subject, difficulty, count = 5) {
        try {
            const prompt = `Generate ${count} ${difficulty} level multiple choice questions about ${subject}. Format each question as:
            Q1: [Question text]
            A) [Option A]
            B) [Option B] 
            C) [Option C]
            D) [Option D]
            Answer: [Correct option letter]`;

            const response = await fetch(`${this.baseUrl}/gpt2`, {
                headers: {
                    'Authorization': `Bearer ${this.hfApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 1000,
                        temperature: 0.7,
                        do_sample: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return this.parseQuestions(result[0].generated_text);
        } catch (error) {
            console.error('Error generating questions:', error);
            return this.getFallbackQuestions(subject, difficulty, count);
        }
    }

    // Parse AI-generated questions
    parseQuestions(text) {
        const questions = [];
        const questionBlocks = text.split('Q').filter(block => block.trim());
        
        questionBlocks.forEach((block, index) => {
            if (block.includes('A)') && block.includes('B)')) {
                const lines = block.split('\n').filter(line => line.trim());
                const question = {
                    id: index + 1,
                    question: lines[0].replace(/^\d+:\s*/, '').trim(),
                    options: [],
                    correctAnswer: ''
                };

                lines.forEach(line => {
                    if (line.match(/^[A-D]\)/)) {
                        question.options.push(line.trim());
                    } else if (line.startsWith('Answer:')) {
                        question.correctAnswer = line.replace('Answer:', '').trim();
                    }
                });

                if (question.options.length >= 2) {
                    questions.push(question);
                }
            }
        });

        return questions.length > 0 ? questions : this.getFallbackQuestions('General', 'Medium', 3);
    }

    // Fallback questions if AI fails
    getFallbackQuestions(subject, difficulty, count) {
        const fallbackQuestions = [
            {
                id: 1,
                question: `What is the main topic of ${subject}?`,
                options: ['A) Basic concepts', 'B) Advanced theories', 'C) Practical applications', 'D) Historical background'],
                correctAnswer: 'A'
            },
            {
                id: 2,
                question: `Which of the following is most important in ${subject}?`,
                options: ['A) Memorization', 'B) Understanding', 'C) Speed', 'D) Creativity'],
                correctAnswer: 'B'
            },
            {
                id: 3,
                question: `How would you approach learning ${subject}?`,
                options: ['A) Read only', 'B) Practice regularly', 'C) Skip difficult parts', 'D) Ask for help'],
                correctAnswer: 'B'
            }
        ];
        return fallbackQuestions.slice(0, count);
    }

    // Enhanced chatbot functionality
    async chatWithBot(message, context = '') {
        try {
            // Use advanced chatbot if available
            if (window.AdvancedAIChatbot) {
                const advancedChatbot = new AdvancedAIChatbot();
                return await advancedChatbot.chat(message, { context });
            }

            // Fallback to original implementation
            const prompt = `You are an educational AI assistant. Help the student with their question: "${message}". Context: ${context}. Provide a helpful, educational response.`;

            const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-medium`, {
                headers: {
                    'Authorization': `Bearer ${this.hfApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 300,
                        temperature: 0.7,
                        do_sample: true,
                        top_p: 0.9,
                        repetition_penalty: 1.1
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result[0].generated_text || "I'm here to help! Could you please rephrase your question?";
        } catch (error) {
            console.error('Error with chatbot:', error);
            return "I'm having trouble connecting right now. Please try again later or contact your teacher for help.";
        }
    }

    // Advanced chatbot integration
    async generateAdvancedResponse(message, options = {}) {
        try {
            if (window.AdvancedAIChatbot) {
                const chatbot = new AdvancedAIChatbot();
                return await chatbot.generateResponse(message, options);
            }
            return await this.chatWithBot(message, options.context || '');
        } catch (error) {
            console.error('Error generating advanced response:', error);
            return this.getFallbackResponse(message);
        }
    }

    // Get fallback response
    getFallbackResponse(message) {
        const fallbackResponses = [
            "I understand you're looking for help with that topic. While I'm processing your request, could you provide more specific details about what you'd like to learn?",
            "That's an interesting question! I'd be happy to help you understand this better. Could you tell me more about your current level of knowledge on this topic?",
            "I'm here to help you learn! To give you the best possible response, could you clarify what specific aspect of this topic you'd like to explore?",
            "Great question! I want to make sure I provide you with the most helpful information. What's your main goal with this topic?",
            "I'd love to help you with that! To tailor my response to your needs, could you let me know what you already know about this subject?"
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // Generate test questions using AI
    async generateTestQuestions(options) {
        const {
            subject = 'General',
            topics = [],
            count = 10,
            difficulty = { easy: 30, medium: 50, hard: 20 },
            gradeLevel = 'High School'
        } = options;

        try {
            const prompt = this.buildTestGenerationPrompt(subject, topics, count, difficulty, gradeLevel);
            
            const response = await fetch(`${this.baseUrl}/gpt2`, {
                headers: {
                    'Authorization': `Bearer ${this.hfApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 2000,
                        temperature: 0.8,
                        do_sample: true,
                        top_p: 0.9,
                        repetition_penalty: 1.1
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return this.parseTestQuestions(result[0].generated_text, count, topics);
            
        } catch (error) {
            console.error('Error generating test questions:', error);
            return this.getFallbackTestQuestions(subject, topics, count);
        }
    }

    // Build test generation prompt
    buildTestGenerationPrompt(subject, topics, count, difficulty, gradeLevel) {
        const topicList = topics.length > 0 ? topics.join(', ') : 'general topics';
        const difficultyText = `Easy: ${difficulty.easy}%, Medium: ${difficulty.medium}%, Hard: ${difficulty.hard}%`;
        
        return `Generate ${count} test questions for ${gradeLevel} level ${subject} covering ${topicList}.
        
Difficulty distribution: ${difficultyText}

Format each question as:
Q[number]. [Question text]
A) [Option 1]
B) [Option 2]
C) [Option 3]
D) [Option 4]
Answer: [Correct option]

Include a mix of question types:
- Multiple choice questions
- Problem-solving questions
- Conceptual questions
- Application questions

Make questions appropriate for ${gradeLevel} level and cover the topics: ${topicList}.

Questions:`;
    }

    // Parse generated test questions
    parseTestQuestions(text, count, topics) {
        const questions = [];
        const questionBlocks = text.split(/Q\d+\./).filter(block => block.trim().length > 0);
        
        let questionId = 1;
        for (const block of questionBlocks.slice(0, count)) {
            try {
                const question = this.parseQuestionBlock(block, questionId, topics);
                if (question) {
                    questions.push(question);
                    questionId++;
                }
            } catch (error) {
                console.warn('Error parsing question block:', error);
            }
        }
        
        // Fill remaining questions with fallback if needed
        while (questions.length < count) {
            const fallbackQuestion = this.generateFallbackQuestion(questions.length + 1, topics);
            questions.push(fallbackQuestion);
        }
        
        return questions;
    }

    // Parse individual question block
    parseQuestionBlock(block, id, topics) {
        const lines = block.trim().split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length < 5) return null; // Need question + 4 options + answer
        
        const questionText = lines[0].trim();
        const options = [];
        let correctAnswer = 0;
        
        // Parse options
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.match(/^[A-D]\)/)) {
                options.push(line.substring(3).trim());
            } else if (line.startsWith('Answer:')) {
                const answerLetter = line.substring(7).trim().toUpperCase();
                correctAnswer = answerLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
            }
        }
        
        if (options.length < 4) return null;
        
        return {
            id: `q${id}`,
            text: questionText,
            type: 'multiple_choice',
            options: options.slice(0, 4),
            correctAnswer: correctAnswer,
            topic: this.assignTopic(questionText, topics),
            difficulty: this.assessQuestionDifficulty(questionText)
        };
    }

    // Assign topic to question
    assignTopic(questionText, topics) {
        if (topics.length === 0) return 'General';
        
        const text = questionText.toLowerCase();
        for (const topic of topics) {
            const topicKeywords = this.getTopicKeywords(topic);
            if (topicKeywords.some(keyword => text.includes(keyword.toLowerCase()))) {
                return topic;
            }
        }
        
        return topics[Math.floor(Math.random() * topics.length)];
    }

    // Get keywords for topic identification
    getTopicKeywords(topic) {
        const keywordMap = {
            'Algebra': ['equation', 'variable', 'solve', 'algebra', 'polynomial', 'quadratic'],
            'Geometry': ['angle', 'triangle', 'circle', 'area', 'perimeter', 'volume', 'shape'],
            'Calculus': ['derivative', 'integral', 'limit', 'function', 'calculus', 'differentiation'],
            'Statistics': ['mean', 'median', 'mode', 'probability', 'distribution', 'data'],
            'Physics': ['force', 'energy', 'motion', 'velocity', 'acceleration', 'mass'],
            'Chemistry': ['molecule', 'atom', 'reaction', 'compound', 'element', 'chemical'],
            'Biology': ['cell', 'organism', 'evolution', 'genetics', 'ecosystem', 'species']
        };
        
        return keywordMap[topic] || [topic.toLowerCase()];
    }

    // Assess question difficulty
    assessQuestionDifficulty(questionText) {
        let difficulty = 5; // Base difficulty
        
        // Adjust based on question length
        if (questionText.length > 100) difficulty += 1;
        if (questionText.length < 30) difficulty -= 1;
        
        // Adjust based on keywords
        const complexKeywords = ['analyze', 'evaluate', 'synthesize', 'compare', 'contrast', 'derive', 'calculate'];
        const simpleKeywords = ['define', 'identify', 'list', 'name', 'state', 'what is'];
        
        if (complexKeywords.some(keyword => questionText.toLowerCase().includes(keyword))) {
            difficulty += 2;
        }
        if (simpleKeywords.some(keyword => questionText.toLowerCase().includes(keyword))) {
            difficulty -= 1;
        }
        
        return Math.max(1, Math.min(10, difficulty));
    }

    // Generate fallback test questions
    getFallbackTestQuestions(subject, topics, count) {
        const fallbackQuestions = {
            'Mathematics': [
                {
                    text: 'What is the value of x in the equation 2x + 5 = 13?',
                    options: ['4', '6', '8', '9'],
                    correctAnswer: 0,
                    topic: 'Algebra',
                    difficulty: 3
                },
                {
                    text: 'Calculate the area of a circle with radius 7 cm.',
                    options: ['49π cm²', '14π cm²', '154π cm²', '22π cm²'],
                    correctAnswer: 2,
                    topic: 'Geometry',
                    difficulty: 4
                },
                {
                    text: 'What is the derivative of x²?',
                    options: ['x', '2x', 'x²', '2x²'],
                    correctAnswer: 1,
                    topic: 'Calculus',
                    difficulty: 6
                }
            ],
            'Science': [
                {
                    text: 'What is the chemical symbol for water?',
                    options: ['H2O', 'CO2', 'NaCl', 'O2'],
                    correctAnswer: 0,
                    topic: 'Chemistry',
                    difficulty: 2
                },
                {
                    text: 'What is the unit of force?',
                    options: ['Newton', 'Joule', 'Watt', 'Pascal'],
                    correctAnswer: 0,
                    topic: 'Physics',
                    difficulty: 4
                }
            ],
            'English': [
                {
                    text: 'What is a noun?',
                    options: ['A word that describes an action', 'A word that names a person, place, or thing', 'A word that describes a noun', 'A word that connects words'],
                    correctAnswer: 1,
                    topic: 'Grammar',
                    difficulty: 2
                }
            ]
        };
        
        const subjectQuestions = fallbackQuestions[subject] || fallbackQuestions['Mathematics'];
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            const baseQuestion = subjectQuestions[i % subjectQuestions.length];
            questions.push({
                id: `q${i + 1}`,
                text: baseQuestion.text,
                type: 'multiple_choice',
                options: baseQuestion.options,
                correctAnswer: baseQuestion.correctAnswer,
                topic: baseQuestion.topic,
                difficulty: baseQuestion.difficulty
            });
        }
        
        return questions;
    }

    // Generate fallback question
    generateFallbackQuestion(id, topics) {
        const topic = topics.length > 0 ? topics[Math.floor(Math.random() * topics.length)] : 'General';
        
        return {
            id: `q${id}`,
            text: `Sample question about ${topic}. What is the main concept?`,
            type: 'multiple_choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            topic: topic,
            difficulty: 5
        };
    }

    // Generate study materials
    async generateStudyMaterial(topic, type = 'summary') {
        try {
            const prompt = `Create a ${type} about ${topic} for students. Make it clear and educational.`;

            const response = await fetch(`${this.baseUrl}/gpt2`, {
                headers: {
                    'Authorization': `Bearer ${this.hfApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 500,
                        temperature: 0.6,
                        do_sample: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result[0].generated_text || `Here's a basic overview of ${topic}: This topic covers fundamental concepts that are important for understanding the subject matter.`;
        } catch (error) {
            console.error('Error generating study material:', error);
            return `Study Material for ${topic}: This is a placeholder. Please refer to your textbooks and class notes for detailed information.`;
        }
    }

    // Generate content from document
    async generateContentFromDocument(documentText, options = {}) {
        const {
            contentType = 'lesson-notes',
            difficulty = 'intermediate',
            count = 5,
            subject = 'General'
        } = options;

        // Validate inputs
        if (!documentText || documentText.trim().length === 0) {
            throw new Error('Document text is required for content generation');
        }

        if (count < 1 || count > 20) {
            throw new Error('Content count must be between 1 and 20');
        }

        try {
            const prompt = this.buildDocumentPrompt(documentText, contentType, difficulty, count, subject);
            
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(`${this.baseUrl}/gpt2`, {
                headers: {
                    'Authorization': `Bearer ${this.hfApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 2000,
                        temperature: 0.7,
                        do_sample: true,
                        top_p: 0.9,
                        repetition_penalty: 1.1
                    }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('API rate limit exceeded. Please try again later.');
                } else if (response.status === 503) {
                    throw new Error('AI service temporarily unavailable. Please try again later.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const result = await response.json();
            
            if (!result || !result[0] || !result[0].generated_text) {
                throw new Error('Invalid response from AI service');
            }

            const content = this.parseDocumentContent(result[0].generated_text, contentType);
            
            // Validate generated content
            if (content.length === 0) {
                console.warn('No content generated, using fallback');
                return this.getFallbackDocumentContent(documentText, contentType, count);
            }

            return content;
        } catch (error) {
            console.error('Error generating content from document:', error);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again with a shorter document.');
            }
            
            // Return fallback content instead of throwing
            return this.getFallbackDocumentContent(documentText, contentType, count);
        }
    }

    // Build prompt for document-based content generation
    buildDocumentPrompt(documentText, contentType, difficulty, count, subject) {
        const truncatedText = documentText.substring(0, 2000); // Limit document text
        
        switch (contentType) {
            case 'lesson-notes':
                return `Based on the following document about ${subject}, create ${count} comprehensive lesson notes at ${difficulty} level. Focus on key concepts and provide clear explanations.

Document content: ${truncatedText}

Format each lesson note as:
## Lesson Note [Number]: [Topic]
### Key Concepts
- [Concept 1]
- [Concept 2]
### Explanation
[Detailed explanation]
### Examples
[Practical examples]
### Summary
[Key takeaways]`;

            case 'quiz':
                return `Based on the following document about ${subject}, create ${count} ${difficulty} level multiple choice questions. Each question should test understanding of the document content.

Document content: ${truncatedText}

Format each question as:
Q[Number]: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Answer: [Correct option]
Explanation: [Why this is correct]`;

            case 'flashcards':
                return `Based on the following document about ${subject}, create ${count} flashcards at ${difficulty} level. Each flashcard should have a clear front and back.

Document content: ${truncatedText}

Format each flashcard as:
**Front:** [Question or term]
**Back:** [Answer or definition]
**Example:** [Practical example]
**Related:** [Related concepts]`;

            case 'summary':
                return `Based on the following document about ${subject}, create a comprehensive summary highlighting the main points and key concepts.

Document content: ${truncatedText}

Format as:
# Summary: [Subject]
## Main Points
- [Point 1]
- [Point 2]
## Key Concepts
- [Concept 1]
- [Concept 2]
## Important Details
[Important information]
## Conclusion
[Summary conclusion]`;

            default:
                return `Based on the following document, create educational content: ${truncatedText}`;
        }
    }

    // Parse generated content from document
    parseDocumentContent(text, contentType) {
        const content = [];
        
        if (contentType === 'lesson-notes') {
            const notes = text.split('## Lesson Note').filter(note => note.trim());
            notes.forEach((note, index) => {
                if (note.trim()) {
                    content.push({
                        id: index + 1,
                        title: this.extractTitle(note),
                        content: note.trim(),
                        type: 'lesson-note'
                    });
                }
            });
        } else if (contentType === 'quiz') {
            const questions = text.split('Q').filter(q => q.trim());
            questions.forEach((question, index) => {
                if (question.trim()) {
                    content.push({
                        id: index + 1,
                        title: `Question ${index + 1}`,
                        content: question.trim(),
                        type: 'quiz-question'
                    });
                }
            });
        } else if (contentType === 'flashcards') {
            const cards = text.split('**Front:**').filter(card => card.trim());
            cards.forEach((card, index) => {
                if (card.trim()) {
                    content.push({
                        id: index + 1,
                        title: `Flashcard ${index + 1}`,
                        content: card.trim(),
                        type: 'flashcard'
                    });
                }
            });
        } else {
            content.push({
                id: 1,
                title: 'Document Summary',
                content: text.trim(),
                type: 'summary'
            });
        }
        
        return content;
    }

    // Extract title from content
    extractTitle(content) {
        const lines = content.split('\n');
        const titleLine = lines.find(line => line.trim().startsWith('##') || line.trim().startsWith('**'));
        if (titleLine) {
            return titleLine.replace(/^#+\s*|\*\*|\*\s*/g, '').trim();
        }
        return 'Generated Content';
    }

    // Fallback content generation
    getFallbackDocumentContent(documentText, contentType, count) {
        const content = [];
        const keyPoints = this.extractKeyPoints(documentText);
        
        for (let i = 0; i < Math.min(count, keyPoints.length); i++) {
            content.push({
                id: i + 1,
                title: `Generated ${contentType} ${i + 1}`,
                content: this.generateFallbackContent(keyPoints[i], contentType),
                type: contentType
            });
        }
        
        return content;
    }

    // Extract key points from document
    extractKeyPoints(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        return sentences.slice(0, 10);
    }

    // Generate fallback content
    generateFallbackContent(keyPoint, contentType) {
        switch (contentType) {
            case 'lesson-notes':
                return `## Key Concept\n\n${keyPoint}\n\n### Explanation\nThis concept is important for understanding the topic. It relates to the main themes discussed in the document.\n\n### Application\nThis concept can be applied in various practical scenarios.\n\n### Summary\nKey takeaway: ${keyPoint}`;
            
            case 'quiz':
                return `**Question:** What is the main idea behind: ${keyPoint}?\n\n**Options:**\nA) Basic concept\nB) Advanced theory\nC) Practical application\nD) Historical context\n\n**Answer:** A\n\n**Explanation:** This question tests understanding of the fundamental concept.`;
            
            case 'flashcards':
                return `**Front:** ${keyPoint}\n\n**Back:** This is a key concept from the document that requires understanding and application.\n\n**Example:** This concept can be seen in various real-world scenarios.\n\n**Related:** Related concepts and applications.`;
            
            default:
                return keyPoint;
        }
    }

    // Generate test questions from document
    async generateTestQuestionsFromDocument(documentText, options = {}) {
        const {
            difficulty = 'intermediate',
            count = 5,
            questionTypes = ['multiple-choice', 'true-false', 'short-answer']
        } = options;

        try {
            const prompt = `Based on the following document, create ${count} ${difficulty} level test questions. Include different question types: ${questionTypes.join(', ')}.

Document content: ${documentText.substring(0, 2000)}

Format each question as:
Q[Number]: [Question text]
Type: [Question type]
Options: [If multiple choice: A) B) C) D)]
Answer: [Correct answer]
Explanation: [Why this is correct]`;

            const response = await fetch(`${this.baseUrl}/gpt2`, {
                headers: {
                    'Authorization': `Bearer ${this.hfApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 3000,
                        temperature: 0.7,
                        do_sample: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return this.parseTestQuestions(result[0].generated_text);
        } catch (error) {
            console.error('Error generating test questions from document:', error);
            return this.getFallbackTestQuestions(documentText, count);
        }
    }

    // Parse test questions
    parseTestQuestions(text) {
        const questions = [];
        const questionBlocks = text.split('Q').filter(block => block.trim());
        
        questionBlocks.forEach((block, index) => {
            if (block.trim()) {
                const lines = block.split('\n').filter(line => line.trim());
                const question = {
                    id: index + 1,
                    question: lines[0].replace(/^\d+:\s*/, '').trim(),
                    type: this.extractQuestionType(block),
                    options: this.extractOptions(block),
                    answer: this.extractAnswer(block),
                    explanation: this.extractExplanation(block)
                };
                
                if (question.question) {
                    questions.push(question);
                }
            }
        });
        
        return questions;
    }

    // Extract question type
    extractQuestionType(block) {
        const typeMatch = block.match(/Type:\s*(.+)/i);
        return typeMatch ? typeMatch[1].trim() : 'multiple-choice';
    }

    // Extract options
    extractOptions(block) {
        const options = [];
        const lines = block.split('\n');
        
        lines.forEach(line => {
            if (line.match(/^[A-D]\)/)) {
                options.push(line.trim());
            }
        });
        
        return options;
    }

    // Extract answer
    extractAnswer(block) {
        const answerMatch = block.match(/Answer:\s*(.+)/i);
        return answerMatch ? answerMatch[1].trim() : '';
    }

    // Extract explanation
    extractExplanation(block) {
        const explanationMatch = block.match(/Explanation:\s*(.+)/i);
        return explanationMatch ? explanationMatch[1].trim() : '';
    }

    // Fallback test questions
    getFallbackTestQuestions(documentText, count) {
        const questions = [];
        const keyPoints = this.extractKeyPoints(documentText);
        
        for (let i = 0; i < Math.min(count, keyPoints.length); i++) {
            questions.push({
                id: i + 1,
                question: `What is the main concept discussed in: "${keyPoints[i].substring(0, 100)}..."?`,
                type: 'multiple-choice',
                options: [
                    'A) Basic concept',
                    'B) Advanced theory', 
                    'C) Practical application',
                    'D) Historical context'
                ],
                answer: 'A',
                explanation: 'This question tests understanding of the fundamental concept from the document.'
            });
        }
        
        return questions;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
} else {
    window.AIService = AIService;
}
