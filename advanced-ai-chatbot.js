// Advanced AI Chatbot Service for EDU-MORPH
class AdvancedAIChatbot {
    constructor() {
        this.conversationHistory = [];
        this.userContext = {
            currentSubject: null,
            learningLevel: 'intermediate',
            interests: [],
            recentTopics: []
        };
        this.knowledgeBases = {
            mathematics: this.getMathKnowledgeBase(),
            science: this.getScienceKnowledgeBase(),
            engineering: this.getEngineeringKnowledgeBase(),
            literature: this.getLiteratureKnowledgeBase(),
            history: this.getHistoryKnowledgeBase(),
            languages: this.getLanguageKnowledgeBase(),
            arts: this.getArtsKnowledgeBase(),
            business: this.getBusinessKnowledgeBase(),
            computer_science: this.getCSKnowledgeBase(),
            general: this.getGeneralKnowledgeBase()
        };
        this.aiProviders = {
            huggingface: {
                apiKey: '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',
                baseUrl: 'https://api-inference.huggingface.co/models',
                models: {
                    chat: 'microsoft/DialoGPT-medium',
                    text: 'gpt2',
                    qa: 'distilbert-base-uncased-distilled-squad'
                }
            },
            openai: {
                apiKey: null, // Will be set by user
                baseUrl: 'https://api.openai.com/v1',
                models: {
                    chat: 'gpt-3.5-turbo',
                    advanced: 'gpt-4'
                }
            }
        };
        this.currentProvider = 'huggingface';
        this.learningPaths = this.initializeLearningPaths();
        this.initializeChatbot();
    }

    // Initialize chatbot with enhanced capabilities
    initializeChatbot() {
        this.setupEventListeners();
        this.loadConversationHistory();
        this.initializeKnowledgeGraph();
    }

    // Enhanced AI response generation with multiple fallbacks
    async generateResponse(userInput, context = {}) {
        try {
            // Update user context
            this.updateUserContext(userInput, context);
            
            // Determine the best approach based on input
            const responseStrategy = this.determineResponseStrategy(userInput);
            
            let response;
            switch (responseStrategy) {
                case 'knowledge_base':
                    response = await this.getKnowledgeBaseResponse(userInput);
                    break;
                case 'learning_path':
                    response = await this.getLearningPathResponse(userInput);
                    break;
                case 'problem_solving':
                    response = await this.getProblemSolvingResponse(userInput);
                    break;
                case 'conversational':
                    response = await this.getConversationalResponse(userInput);
                    break;
                case 'creative':
                    response = await this.getCreativeResponse(userInput);
                    break;
                default:
                    response = await this.getGeneralResponse(userInput);
            }

            // Enhance response with additional context
            response = this.enhanceResponse(response, userInput, context);
            
            // Store in conversation history
            this.addToHistory(userInput, response);
            
            return response;
            
        } catch (error) {
            console.error('Error generating response:', error);
            return this.getFallbackResponse(userInput);
        }
    }

    // Determine the best response strategy
    determineResponseStrategy(input) {
        const lowerInput = input.toLowerCase();
        
        // Check for specific patterns
        if (this.isMathProblem(lowerInput)) return 'problem_solving';
        if (this.isLearningRequest(lowerInput)) return 'learning_path';
        if (this.isKnowledgeQuestion(lowerInput)) return 'knowledge_base';
        if (this.isCreativeRequest(lowerInput)) return 'creative';
        if (this.isConversational(lowerInput)) return 'conversational';
        
        return 'general';
    }

    // Knowledge base responses
    async getKnowledgeBaseResponse(input) {
        const subject = this.identifySubject(input);
        const knowledgeBase = this.knowledgeBases[subject] || this.knowledgeBases.general;
        
        // Try AI provider first
        try {
            const aiResponse = await this.callAIProvider(input, {
                context: `You are an expert in ${subject}. Provide a comprehensive, educational response.`,
                maxLength: 300
            });
            
            if (aiResponse && aiResponse.length > 50) {
                return this.formatKnowledgeResponse(aiResponse, subject);
            }
        } catch (error) {
            console.warn('AI provider failed, using knowledge base:', error);
        }
        
        // Fallback to knowledge base
        return this.searchKnowledgeBase(input, knowledgeBase, subject);
    }

    // Learning path responses
    async getLearningPathResponse(input) {
        const subject = this.identifySubject(input);
        const level = this.assessLearningLevel(input);
        const learningPath = this.learningPaths[subject]?.[level];
        
        if (learningPath) {
            return this.generateLearningPathResponse(input, learningPath, subject, level);
        }
        
        return this.getGeneralLearningResponse(input);
    }

    // Problem solving responses
    async getProblemSolvingResponse(input) {
        const problemType = this.identifyProblemType(input);
        
        switch (problemType) {
            case 'math':
                return this.solveMathProblem(input);
            case 'science':
                return this.solveScienceProblem(input);
            case 'programming':
                return this.solveProgrammingProblem(input);
            case 'logic':
                return this.solveLogicProblem(input);
            default:
                return this.solveGeneralProblem(input);
        }
    }

    // Conversational responses
    async getConversationalResponse(input) {
        const context = this.buildConversationContext();
        
        try {
            const response = await this.callAIProvider(input, {
                context: `You are a friendly, knowledgeable educational assistant. ${context}`,
                maxLength: 200,
                temperature: 0.8
            });
            
            return response || this.getDefaultConversationalResponse(input);
        } catch (error) {
            return this.getDefaultConversationalResponse(input);
        }
    }

    // Creative responses
    async getCreativeResponse(input) {
        const creativeType = this.identifyCreativeType(input);
        
        switch (creativeType) {
            case 'story':
                return this.generateStory(input);
            case 'poem':
                return this.generatePoem(input);
            case 'essay':
                return this.generateEssay(input);
            case 'explanation':
                return this.generateCreativeExplanation(input);
            default:
                return this.generateGeneralCreative(input);
        }
    }

    // Call AI provider with enhanced error handling
    async callAIProvider(input, options = {}) {
        const provider = this.aiProviders[this.currentProvider];
        const model = options.model || provider.models.chat;
        
        try {
            const response = await fetch(`${provider.baseUrl}/${model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: input,
                    parameters: {
                        max_length: options.maxLength || 200,
                        temperature: options.temperature || 0.7,
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
            return result[0]?.generated_text || result.generated_text || null;
            
        } catch (error) {
            console.error('AI provider error:', error);
            throw error;
        }
    }

    // Knowledge base implementations
    getMathKnowledgeBase() {
        return {
            topics: {
                algebra: {
                    concepts: ['variables', 'equations', 'inequalities', 'functions', 'polynomials'],
                    formulas: {
                        'quadratic': 'ax² + bx + c = 0',
                        'slope': 'm = (y₂ - y₁)/(x₂ - x₁)',
                        'distance': 'd = √[(x₂-x₁)² + (y₂-y₁)²]'
                    },
                    examples: [
                        'Solve: 2x + 5 = 13',
                        'Find slope of line through (1,2) and (3,8)',
                        'Factor: x² - 5x + 6'
                    ]
                },
                calculus: {
                    concepts: ['limits', 'derivatives', 'integrals', 'series', 'differential equations'],
                    formulas: {
                        'derivative': 'd/dx[f(x)] = lim[h→0] (f(x+h) - f(x))/h',
                        'chain_rule': 'd/dx[f(g(x))] = f\'(g(x)) × g\'(x)',
                        'product_rule': 'd/dx[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)'
                    }
                },
                geometry: {
                    concepts: ['angles', 'triangles', 'circles', 'polygons', '3D shapes'],
                    formulas: {
                        'area_triangle': 'A = ½bh',
                        'area_circle': 'A = πr²',
                        'volume_sphere': 'V = (4/3)πr³'
                    }
                }
            }
        };
    }

    getScienceKnowledgeBase() {
        return {
            physics: {
                mechanics: {
                    laws: ['Newton\'s Laws', 'Conservation of Energy', 'Conservation of Momentum'],
                    formulas: {
                        'force': 'F = ma',
                        'kinetic_energy': 'KE = ½mv²',
                        'potential_energy': 'PE = mgh',
                        'momentum': 'p = mv'
                    }
                },
                thermodynamics: {
                    laws: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'],
                    concepts: ['heat', 'temperature', 'entropy', 'work']
                }
            },
            chemistry: {
                atomic_structure: {
                    concepts: ['protons', 'neutrons', 'electrons', 'orbitals', 'quantum numbers'],
                    periodic_trends: ['atomic radius', 'ionization energy', 'electronegativity']
                },
                bonding: {
                    types: ['ionic', 'covalent', 'metallic', 'hydrogen'],
                    concepts: ['valence electrons', 'Lewis structures', 'VSEPR theory']
                }
            },
            biology: {
                cell_biology: {
                    organelles: ['nucleus', 'mitochondria', 'ribosomes', 'endoplasmic reticulum'],
                    processes: ['photosynthesis', 'cellular respiration', 'protein synthesis']
                },
                genetics: {
                    concepts: ['DNA', 'RNA', 'genes', 'alleles', 'chromosomes'],
                    laws: ['Mendel\'s Laws', 'Law of Segregation', 'Law of Independent Assortment']
                }
            }
        };
    }

    getEngineeringKnowledgeBase() {
        return {
            mechanical: {
                statics: ['force analysis', 'moment calculations', 'equilibrium'],
                dynamics: ['kinematics', 'kinetics', 'energy methods'],
                materials: ['stress', 'strain', 'elasticity', 'plasticity']
            },
            electrical: {
                circuits: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'AC/DC analysis'],
                electronics: ['diodes', 'transistors', 'amplifiers', 'digital circuits'],
                power: ['generation', 'transmission', 'distribution']
            },
            civil: {
                structures: ['beams', 'columns', 'foundations', 'load analysis'],
                materials: ['concrete', 'steel', 'timber', 'composites'],
                design: ['codes', 'standards', 'safety factors']
            }
        };
    }

    getLiteratureKnowledgeBase() {
        return {
            genres: {
                fiction: ['novel', 'short story', 'drama', 'poetry'],
                non_fiction: ['essay', 'biography', 'autobiography', 'memoir'],
                academic: ['research paper', 'thesis', 'dissertation']
            },
            elements: {
                plot: ['exposition', 'rising action', 'climax', 'falling action', 'resolution'],
                character: ['protagonist', 'antagonist', 'round', 'flat', 'dynamic', 'static'],
                theme: ['central idea', 'universal truth', 'message']
            },
            periods: {
                classical: ['Greek', 'Roman', 'Medieval'],
                renaissance: ['Elizabethan', 'Baroque'],
                modern: ['Romanticism', 'Realism', 'Modernism', 'Postmodernism']
            }
        };
    }

    getHistoryKnowledgeBase() {
        return {
            ancient: {
                civilizations: ['Mesopotamia', 'Egypt', 'Greece', 'Rome', 'China', 'India'],
                key_events: ['Agricultural Revolution', 'Bronze Age', 'Iron Age'],
                figures: ['Hammurabi', 'Alexander the Great', 'Julius Caesar', 'Confucius']
            },
            medieval: {
                periods: ['Early Middle Ages', 'High Middle Ages', 'Late Middle Ages'],
                events: ['Fall of Rome', 'Crusades', 'Black Death', 'Renaissance'],
                systems: ['Feudalism', 'Manorialism', 'Guild system']
            },
            modern: {
                revolutions: ['American', 'French', 'Industrial', 'Russian'],
                wars: ['World War I', 'World War II', 'Cold War'],
                movements: ['Enlightenment', 'Romanticism', 'Nationalism', 'Imperialism']
            }
        };
    }

    getLanguageKnowledgeBase() {
        return {
            grammar: {
                parts_of_speech: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'],
                sentence_structure: ['subject', 'predicate', 'clause', 'phrase'],
                tenses: ['present', 'past', 'future', 'perfect', 'progressive']
            },
            writing: {
                styles: ['narrative', 'descriptive', 'expository', 'persuasive'],
                techniques: ['metaphor', 'simile', 'alliteration', 'personification'],
                structure: ['introduction', 'body', 'conclusion', 'thesis statement']
            },
            communication: {
                speaking: ['pronunciation', 'intonation', 'fluency', 'clarity'],
                listening: ['comprehension', 'note-taking', 'active listening'],
                reading: ['skimming', 'scanning', 'critical reading', 'analysis']
            }
        };
    }

    getArtsKnowledgeBase() {
        return {
            visual_arts: {
                elements: ['line', 'shape', 'color', 'texture', 'space', 'form', 'value'],
                principles: ['balance', 'contrast', 'emphasis', 'movement', 'pattern', 'rhythm', 'unity'],
                media: ['painting', 'sculpture', 'drawing', 'photography', 'digital art']
            },
            performing_arts: {
                music: ['melody', 'harmony', 'rhythm', 'timbre', 'dynamics'],
                dance: ['technique', 'choreography', 'expression', 'movement'],
                theater: ['acting', 'directing', 'stage design', 'lighting']
            },
            art_history: {
                periods: ['Renaissance', 'Baroque', 'Romanticism', 'Impressionism', 'Modernism'],
                movements: ['Cubism', 'Surrealism', 'Abstract Expressionism', 'Pop Art']
            }
        };
    }

    getBusinessKnowledgeBase() {
        return {
            management: {
                functions: ['planning', 'organizing', 'leading', 'controlling'],
                theories: ['Scientific Management', 'Human Relations', 'Systems Theory'],
                skills: ['communication', 'leadership', 'decision-making', 'problem-solving']
            },
            marketing: {
                mix: ['product', 'price', 'place', 'promotion'],
                strategies: ['segmentation', 'targeting', 'positioning'],
                concepts: ['branding', 'customer value', 'market research']
            },
            finance: {
                concepts: ['time value of money', 'risk and return', 'capital structure'],
                tools: ['financial statements', 'ratio analysis', 'budgeting'],
                markets: ['stocks', 'bonds', 'derivatives', 'foreign exchange']
            }
        };
    }

    getCSKnowledgeBase() {
        return {
            programming: {
                languages: ['Python', 'Java', 'C++', 'JavaScript', 'SQL'],
                paradigms: ['object-oriented', 'functional', 'procedural', 'declarative'],
                concepts: ['algorithms', 'data structures', 'recursion', 'iteration']
            },
            computer_systems: {
                hardware: ['CPU', 'memory', 'storage', 'networking'],
                software: ['operating systems', 'databases', 'compilers'],
                architecture: ['client-server', 'distributed', 'cloud', 'microservices']
            },
            algorithms: {
                sorting: ['bubble sort', 'merge sort', 'quick sort', 'heap sort'],
                searching: ['linear search', 'binary search', 'hash tables'],
                complexity: ['big O notation', 'time complexity', 'space complexity']
            }
        };
    }

    getGeneralKnowledgeBase() {
        return {
            study_skills: {
                techniques: ['active recall', 'spaced repetition', 'mind mapping', 'summarization'],
                time_management: ['pomodoro technique', 'time blocking', 'priority matrix'],
                note_taking: ['cornell method', 'outline method', 'charting method']
            },
            critical_thinking: {
                skills: ['analysis', 'evaluation', 'inference', 'interpretation'],
                fallacies: ['ad hominem', 'straw man', 'false dilemma', 'appeal to authority'],
                processes: ['problem identification', 'solution generation', 'evaluation']
            },
            communication: {
                verbal: ['clarity', 'conciseness', 'persuasion', 'active listening'],
                written: ['structure', 'grammar', 'style', 'tone'],
                presentation: ['visual aids', 'body language', 'audience engagement']
            }
        };
    }

    // Initialize learning paths for different subjects and levels
    initializeLearningPaths() {
        return {
            mathematics: {
                beginner: [
                    'Basic arithmetic operations',
                    'Introduction to algebra',
                    'Geometry fundamentals',
                    'Introduction to statistics'
                ],
                intermediate: [
                    'Advanced algebra',
                    'Trigonometry',
                    'Pre-calculus',
                    'Probability and statistics'
                ],
                advanced: [
                    'Calculus I and II',
                    'Linear algebra',
                    'Differential equations',
                    'Advanced statistics'
                ]
            },
            science: {
                beginner: [
                    'Scientific method',
                    'Basic physics concepts',
                    'Introduction to chemistry',
                    'Cell biology basics'
                ],
                intermediate: [
                    'Mechanics and thermodynamics',
                    'Organic chemistry',
                    'Genetics and evolution',
                    'Earth science'
                ],
                advanced: [
                    'Quantum mechanics',
                    'Biochemistry',
                    'Molecular biology',
                    'Environmental science'
                ]
            },
            programming: {
                beginner: [
                    'Programming fundamentals',
                    'Basic syntax and data types',
                    'Control structures',
                    'Functions and modules'
                ],
                intermediate: [
                    'Object-oriented programming',
                    'Data structures',
                    'Algorithms',
                    'Database concepts'
                ],
                advanced: [
                    'Software engineering',
                    'System design',
                    'Machine learning',
                    'Distributed systems'
                ]
            }
        };
    }

    // Utility methods
    identifySubject(input) {
        const lowerInput = input.toLowerCase();
        const subjectKeywords = {
            mathematics: ['math', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics'],
            science: ['science', 'physics', 'chemistry', 'biology', 'earth science'],
            engineering: ['engineering', 'mechanical', 'electrical', 'civil', 'computer engineering'],
            literature: ['literature', 'english', 'writing', 'poetry', 'novel', 'essay'],
            history: ['history', 'historical', 'ancient', 'medieval', 'modern'],
            languages: ['language', 'grammar', 'writing', 'speaking', 'communication'],
            arts: ['art', 'painting', 'music', 'dance', 'theater', 'creative'],
            business: ['business', 'management', 'marketing', 'finance', 'economics'],
            computer_science: ['programming', 'coding', 'software', 'computer science', 'algorithm']
        };

        for (const [subject, keywords] of Object.entries(subjectKeywords)) {
            if (keywords.some(keyword => lowerInput.includes(keyword))) {
                return subject;
            }
        }
        return 'general';
    }

    assessLearningLevel(input) {
        const lowerInput = input.toLowerCase();
        const advancedKeywords = ['advanced', 'complex', 'sophisticated', 'graduate', 'expert'];
        const beginnerKeywords = ['beginner', 'basic', 'intro', 'simple', 'elementary'];
        
        if (advancedKeywords.some(keyword => lowerInput.includes(keyword))) {
            return 'advanced';
        } else if (beginnerKeywords.some(keyword => lowerInput.includes(keyword))) {
            return 'beginner';
        }
        return 'intermediate';
    }

    isMathProblem(input) {
        const mathPatterns = [
            /\d+\s*[+\-*/]\s*\d+/,  // Basic arithmetic
            /solve|equation|formula|calculate|compute/,  // Problem solving words
            /derivative|integral|limit|function/,  // Calculus
            /angle|triangle|circle|area|volume/  // Geometry
        ];
        return mathPatterns.some(pattern => pattern.test(input));
    }

    isLearningRequest(input) {
        const learningKeywords = ['learn', 'study', 'understand', 'explain', 'teach', 'how to'];
        return learningKeywords.some(keyword => input.includes(keyword));
    }

    isKnowledgeQuestion(input) {
        const questionWords = ['what', 'why', 'how', 'when', 'where', 'who', 'which'];
        return questionWords.some(word => input.toLowerCase().startsWith(word));
    }

    isCreativeRequest(input) {
        const creativeKeywords = ['write', 'create', 'generate', 'story', 'poem', 'essay', 'creative'];
        return creativeKeywords.some(keyword => input.includes(keyword));
    }

    isConversational(input) {
        const conversationalKeywords = ['hello', 'hi', 'hey', 'thanks', 'thank you', 'good morning', 'good afternoon'];
        return conversationalKeywords.some(keyword => input.toLowerCase().includes(keyword));
    }

    // Response enhancement
    enhanceResponse(response, input, context) {
        // Add subject-specific context
        const subject = this.identifySubject(input);
        if (subject !== 'general') {
            response = this.addSubjectContext(response, subject);
        }

        // Add learning level context
        const level = this.assessLearningLevel(input);
        if (level !== 'intermediate') {
            response = this.addLevelContext(response, level);
        }

        // Add follow-up suggestions
        response = this.addFollowUpSuggestions(response, subject, level);

        return response;
    }

    addSubjectContext(response, subject) {
        const subjectContexts = {
            mathematics: '\n\n💡 Math Tip: Practice with similar problems to reinforce your understanding!',
            science: '\n\n🔬 Science Insight: Try to relate this concept to real-world applications!',
            engineering: '\n\n⚙️ Engineering Note: Consider the practical implications and design constraints!',
            literature: '\n\n📚 Literature Note: Pay attention to themes, symbols, and literary devices!',
            history: '\n\n📜 Historical Context: Understanding the timeline and cause-effect relationships is key!',
            programming: '\n\n💻 Coding Tip: Try implementing this concept in a small project!'
        };

        return response + (subjectContexts[subject] || '');
    }

    addLevelContext(response, level) {
        const levelContexts = {
            beginner: '\n\n🌱 Beginner Friendly: Take your time to understand each step!',
            advanced: '\n\n🚀 Advanced Level: This builds on previous knowledge and prepares you for higher concepts!'
        };

        return response + (levelContexts[level] || '');
    }

    addFollowUpSuggestions(response, subject, level) {
        const suggestions = this.generateFollowUpSuggestions(subject, level);
        if (suggestions.length > 0) {
            response += '\n\n🤔 You might also want to ask about:';
            suggestions.forEach(suggestion => {
                response += `\n• ${suggestion}`;
            });
        }
        return response;
    }

    generateFollowUpSuggestions(subject, level) {
        const suggestions = {
            mathematics: {
                beginner: ['How to solve quadratic equations', 'Basic geometry formulas', 'Introduction to fractions'],
                intermediate: ['Trigonometric identities', 'Calculus derivatives', 'Statistical analysis'],
                advanced: ['Differential equations', 'Linear algebra concepts', 'Advanced calculus topics']
            },
            science: {
                beginner: ['Basic physics laws', 'Chemical bonding', 'Cell structure'],
                intermediate: ['Thermodynamics', 'Organic chemistry', 'Genetics'],
                advanced: ['Quantum mechanics', 'Biochemistry pathways', 'Molecular biology']
            },
            programming: {
                beginner: ['Basic syntax', 'Variables and data types', 'Control structures'],
                intermediate: ['Object-oriented programming', 'Data structures', 'Algorithms'],
                advanced: ['System design', 'Machine learning', 'Distributed systems']
            }
        };

        return suggestions[subject]?.[level] || [];
    }

    // Fallback response system
    getFallbackResponse(input) {
        const fallbackResponses = [
            "I understand you're looking for help with that topic. While I'm processing your request, could you provide more specific details about what you'd like to learn?",
            "That's an interesting question! I'd be happy to help you understand this better. Could you tell me more about your current level of knowledge on this topic?",
            "I'm here to help you learn! To give you the best possible response, could you clarify what specific aspect of this topic you'd like to explore?",
            "Great question! I want to make sure I provide you with the most helpful information. What's your main goal with this topic?",
            "I'd love to help you with that! To tailor my response to your needs, could you let me know what you already know about this subject?"
        ];

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // Conversation history management
    addToHistory(input, response) {
        this.conversationHistory.push({
            timestamp: new Date(),
            user: input,
            assistant: response,
            subject: this.identifySubject(input),
            level: this.assessLearningLevel(input)
        });

        // Keep only last 50 conversations
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }

        this.saveConversationHistory();
    }

    buildConversationContext() {
        if (this.conversationHistory.length === 0) return '';
        
        const recent = this.conversationHistory.slice(-3);
        let context = 'Recent conversation context: ';
        recent.forEach((conv, index) => {
            context += `[${index + 1}] User: ${conv.user} | Assistant: ${conv.assistant.substring(0, 100)}... `;
        });
        
        return context;
    }

    updateUserContext(input, context) {
        const subject = this.identifySubject(input);
        if (subject !== 'general') {
            this.userContext.currentSubject = subject;
        }

        const level = this.assessLearningLevel(input);
        this.userContext.learningLevel = level;

        // Update recent topics
        this.userContext.recentTopics.unshift(subject);
        if (this.userContext.recentTopics.length > 5) {
            this.userContext.recentTopics = this.userContext.recentTopics.slice(0, 5);
        }
    }

    // Storage methods
    saveConversationHistory() {
        try {
            localStorage.setItem('chatbot_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.warn('Could not save conversation history:', error);
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('chatbot_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load conversation history:', error);
        }
    }

    // Event listeners
    setupEventListeners() {
        // Listen for provider changes
        window.addEventListener('chatbotProviderChange', (event) => {
            this.currentProvider = event.detail.provider;
        });

        // Listen for context updates
        window.addEventListener('chatbotContextUpdate', (event) => {
            this.userContext = { ...this.userContext, ...event.detail };
        });
    }

    // Public API methods
    async chat(input, context = {}) {
        return await this.generateResponse(input, context);
    }

    getConversationHistory() {
        return this.conversationHistory;
    }

    clearHistory() {
        this.conversationHistory = [];
        this.saveConversationHistory();
    }

    setProvider(provider) {
        if (this.aiProviders[provider]) {
            this.currentProvider = provider;
        }
    }

    getAvailableProviders() {
        return Object.keys(this.aiProviders);
    }

    getUserContext() {
        return this.userContext;
    }

    updateUserContext(updates) {
        this.userContext = { ...this.userContext, ...updates };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAIChatbot;
} else {
    window.AdvancedAIChatbot = AdvancedAIChatbot;
}
