// AI-Powered Test Analytics and Curriculum Support System
class AITestAnalytics {
    constructor() {
        this.testData = [];
        this.studentProfiles = new Map();
        this.topicDifficulty = new Map();
        this.curriculumInsights = new Map();
        this.teacherRecommendations = [];
        this.initializeAnalytics();
    }

    // Initialize the analytics system
    initializeAnalytics() {
        this.loadTestData();
        this.initializeTopicTaxonomy();
        this.setupEventListeners();
    }

    // AI-powered test analysis with topic sorting
    async analyzeTest(testData) {
        try {
            const analysis = {
                testId: testData.id,
                testName: testData.name,
                subject: testData.subject,
                date: testData.date,
                totalQuestions: testData.questions.length,
                totalStudents: testData.students.length,
                topics: await this.analyzeTopics(testData.questions),
                difficultyAnalysis: await this.analyzeDifficulty(testData.questions),
                studentPerformance: await this.analyzeStudentPerformance(testData),
                insights: await this.generateInsights(testData),
                recommendations: await this.generateRecommendations(testData)
            };

            this.testData.push(analysis);
            this.updateStudentProfiles(analysis);
            this.updateTopicDifficulty(analysis);
            
            return analysis;
        } catch (error) {
            console.error('Error analyzing test:', error);
            throw new Error('Failed to analyze test data');
        }
    }

    // Analyze questions by topics using AI
    async analyzeTopics(questions) {
        const topicAnalysis = new Map();
        
        for (const question of questions) {
            const topic = await this.identifyTopic(question);
            const difficulty = await this.assessQuestionDifficulty(question);
            
            if (!topicAnalysis.has(topic)) {
                topicAnalysis.set(topic, {
                    name: topic,
                    questions: [],
                    totalQuestions: 0,
                    averageDifficulty: 0,
                    correctAnswers: 0,
                    incorrectAnswers: 0,
                    averageScore: 0,
                    timeSpent: 0,
                    commonMistakes: [],
                    learningObjectives: []
                });
            }

            const topicData = topicAnalysis.get(topic);
            topicData.questions.push({
                id: question.id,
                text: question.text,
                difficulty: difficulty,
                correctAnswers: question.correctAnswers || 0,
                totalAttempts: question.totalAttempts || 0,
                averageTime: question.averageTime || 0
            });
            topicData.totalQuestions++;
            topicData.correctAnswers += question.correctAnswers || 0;
            topicData.incorrectAnswers += (question.totalAttempts || 0) - (question.correctAnswers || 0);
            topicData.timeSpent += question.averageTime || 0;
        }

        // Calculate averages and percentages
        for (const [topic, data] of topicAnalysis) {
            data.averageDifficulty = data.questions.reduce((sum, q) => sum + q.difficulty, 0) / data.questions.length;
            data.averageScore = (data.correctAnswers / (data.correctAnswers + data.incorrectAnswers)) * 100;
            data.timeSpent = data.timeSpent / data.questions.length;
            data.commonMistakes = await this.identifyCommonMistakes(data.questions);
            data.learningObjectives = await this.extractLearningObjectives(data.questions);
        }

        return Array.from(topicAnalysis.values()).sort((a, b) => b.averageDifficulty - a.averageDifficulty);
    }

    // AI-powered topic identification
    async identifyTopic(question) {
        try {
            // Use AI to identify the topic based on question content
            const prompt = `Analyze this question and identify the main topic/subject area. Return only the topic name in 2-3 words.

Question: "${question.text}"

Topic:`;

            const response = await this.callAIProvider(prompt, {
                maxLength: 50,
                temperature: 0.3
            });

            return response.trim() || 'General';
        } catch (error) {
            console.warn('AI topic identification failed, using fallback:', error);
            return this.fallbackTopicIdentification(question);
        }
    }

    // Fallback topic identification using keywords
    fallbackTopicIdentification(question) {
        const text = question.text.toLowerCase();
        const topicKeywords = {
            'Algebra': ['equation', 'variable', 'solve', 'algebra', 'polynomial'],
            'Geometry': ['angle', 'triangle', 'circle', 'area', 'perimeter', 'volume'],
            'Calculus': ['derivative', 'integral', 'limit', 'function', 'calculus'],
            'Statistics': ['mean', 'median', 'mode', 'probability', 'distribution'],
            'Physics': ['force', 'energy', 'motion', 'velocity', 'acceleration'],
            'Chemistry': ['molecule', 'atom', 'reaction', 'compound', 'element'],
            'Biology': ['cell', 'organism', 'evolution', 'genetics', 'ecosystem'],
            'Reading Comprehension': ['passage', 'main idea', 'inference', 'comprehension'],
            'Writing': ['essay', 'paragraph', 'grammar', 'sentence', 'composition'],
            'History': ['war', 'revolution', 'ancient', 'medieval', 'historical']
        };

        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return topic;
            }
        }

        return 'General';
    }

    // AI-powered difficulty assessment
    async assessQuestionDifficulty(question) {
        try {
            const prompt = `Rate the difficulty of this question on a scale of 1-10 (1=very easy, 10=very hard). Consider:
- Complexity of concepts
- Number of steps required
- Cognitive load
- Prerequisite knowledge

Question: "${question.text}"

Difficulty (1-10):`;

            const response = await this.callAIProvider(prompt, {
                maxLength: 10,
                temperature: 0.1
            });

            const difficulty = parseInt(response.trim());
            return isNaN(difficulty) ? 5 : Math.max(1, Math.min(10, difficulty));
        } catch (error) {
            console.warn('AI difficulty assessment failed, using fallback:', error);
            return this.fallbackDifficultyAssessment(question);
        }
    }

    // Fallback difficulty assessment
    fallbackDifficultyAssessment(question) {
        let difficulty = 5; // Base difficulty
        
        // Adjust based on question length
        if (question.text.length > 200) difficulty += 1;
        if (question.text.length < 50) difficulty -= 1;
        
        // Adjust based on question type
        if (question.type === 'essay') difficulty += 2;
        if (question.type === 'multiple_choice') difficulty -= 1;
        if (question.type === 'problem_solving') difficulty += 1;
        
        // Adjust based on keywords
        const complexKeywords = ['analyze', 'evaluate', 'synthesize', 'compare', 'contrast'];
        const simpleKeywords = ['define', 'identify', 'list', 'name', 'state'];
        
        if (complexKeywords.some(keyword => question.text.toLowerCase().includes(keyword))) {
            difficulty += 2;
        }
        if (simpleKeywords.some(keyword => question.text.toLowerCase().includes(keyword))) {
            difficulty -= 1;
        }
        
        return Math.max(1, Math.min(10, difficulty));
    }

    // Analyze student performance with AI insights
    async analyzeStudentPerformance(testData) {
        const studentAnalysis = [];
        
        for (const student of testData.students) {
            const analysis = {
                studentId: student.id,
                studentName: student.name,
                overallScore: student.score,
                totalQuestions: student.answers.length,
                correctAnswers: student.answers.filter(a => a.isCorrect).length,
                timeSpent: student.timeSpent,
                topics: await this.analyzeStudentTopics(student.answers, testData.questions),
                strengths: [],
                weaknesses: [],
                learningStyle: await this.identifyLearningStyle(student),
                recommendations: []
            };

            // Calculate topic performance
            analysis.topics = await this.analyzeStudentTopics(student.answers, testData.questions);
            
            // Identify strengths and weaknesses
            analysis.strengths = this.identifyStrengths(analysis.topics);
            analysis.weaknesses = this.identifyWeaknesses(analysis.topics);
            
            // Generate personalized recommendations
            analysis.recommendations = await this.generateStudentRecommendations(analysis);
            
            studentAnalysis.push(analysis);
            this.updateStudentProfile(analysis);
        }

        return studentAnalysis;
    }

    // Analyze student performance by topic
    async analyzeStudentTopics(studentAnswers, questions) {
        const topicPerformance = new Map();
        
        for (const answer of studentAnswers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) continue;
            
            const topic = await this.identifyTopic(question);
            
            if (!topicPerformance.has(topic)) {
                topicPerformance.set(topic, {
                    topic: topic,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    averageTime: 0,
                    difficulty: 0,
                    score: 0
                });
            }
            
            const topicData = topicPerformance.get(topic);
            topicData.totalQuestions++;
            topicData.correctAnswers += answer.isCorrect ? 1 : 0;
            topicData.averageTime += answer.timeSpent || 0;
            topicData.difficulty += await this.assessQuestionDifficulty(question);
        }
        
        // Calculate final metrics
        for (const [topic, data] of topicPerformance) {
            data.score = (data.correctAnswers / data.totalQuestions) * 100;
            data.averageTime = data.averageTime / data.totalQuestions;
            data.difficulty = data.difficulty / data.totalQuestions;
        }
        
        return Array.from(topicPerformance.values());
    }

    // Identify student strengths
    identifyStrengths(topicPerformance) {
        return topicPerformance
            .filter(topic => topic.score >= 80)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(topic => ({
                topic: topic.topic,
                score: topic.score,
                strength: this.getStrengthDescription(topic.score)
            }));
    }

    // Identify student weaknesses
    identifyWeaknesses(topicPerformance) {
        return topicPerformance
            .filter(topic => topic.score < 60)
            .sort((a, b) => a.score - b.score)
            .slice(0, 3)
            .map(topic => ({
                topic: topic.topic,
                score: topic.score,
                weakness: this.getWeaknessDescription(topic.score)
            }));
    }

    // AI-powered learning style identification
    async identifyLearningStyle(student) {
        try {
            const prompt = `Based on this student's performance data, identify their learning style:
- Visual: Prefers diagrams, charts, visual aids
- Auditory: Learns through listening, discussions
- Kinesthetic: Hands-on, practical learning
- Reading/Writing: Text-based learning

Student Performance:
- Average Score: ${student.overallScore}%
- Time Spent: ${student.timeSpent} minutes
- Answer Patterns: ${JSON.stringify(student.answers.slice(0, 5))}

Learning Style:`;

            const response = await this.callAIProvider(prompt, {
                maxLength: 20,
                temperature: 0.3
            });

            return response.trim().toLowerCase() || 'mixed';
        } catch (error) {
            console.warn('AI learning style identification failed:', error);
            return 'mixed';
        }
    }

    // Generate student-specific recommendations
    async generateStudentRecommendations(studentAnalysis) {
        const recommendations = [];
        
        // Study recommendations based on weaknesses
        for (const weakness of studentAnalysis.weaknesses) {
            recommendations.push({
                type: 'study',
                priority: 'high',
                topic: weakness.topic,
                action: `Focus on ${weakness.topic} - current score: ${weakness.score.toFixed(1)}%`,
                resources: await this.getTopicResources(weakness.topic),
                timeline: '2-3 weeks'
            });
        }
        
        // Practice recommendations
        if (studentAnalysis.overallScore < 70) {
            recommendations.push({
                type: 'practice',
                priority: 'high',
                action: 'Increase practice time and frequency',
                resources: ['Practice tests', 'Sample questions', 'Study groups'],
                timeline: '1-2 weeks'
            });
        }
        
        // Learning style recommendations
        const learningStyle = studentAnalysis.learningStyle;
        if (learningStyle === 'visual') {
            recommendations.push({
                type: 'learning_style',
                priority: 'medium',
                action: 'Use more visual aids and diagrams',
                resources: ['Infographics', 'Videos', 'Charts', 'Mind maps'],
                timeline: 'Ongoing'
            });
        }
        
        return recommendations;
    }

    // Generate curriculum insights and recommendations
    async generateCurriculumInsights(testAnalysis) {
        const insights = {
            overallPerformance: this.calculateOverallPerformance(testAnalysis),
            difficultTopics: this.identifyDifficultTopics(testAnalysis),
            teachingEffectiveness: await this.assessTeachingEffectiveness(testAnalysis),
            curriculumGaps: await this.identifyCurriculumGaps(testAnalysis),
            recommendations: await this.generateCurriculumRecommendations(testAnalysis)
        };
        
        return insights;
    }

    // Identify difficult topics across all students
    identifyDifficultTopics(testAnalysis) {
        const topicDifficulty = new Map();
        
        for (const topic of testAnalysis.topics) {
            const difficulty = {
                topic: topic.name,
                averageScore: topic.averageScore,
                difficulty: topic.averageDifficulty,
                studentCount: topic.questions.length,
                strugglingStudents: 0,
                recommendations: []
            };
            
            // Count struggling students
            for (const student of testAnalysis.studentPerformance) {
                const studentTopic = student.topics.find(t => t.topic === topic.name);
                if (studentTopic && studentTopic.score < 60) {
                    difficulty.strugglingStudents++;
                }
            }
            
            topicDifficulty.set(topic.name, difficulty);
        }
        
        return Array.from(topicDifficulty.values())
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, 5);
    }

    // Generate curriculum recommendations
    async generateCurriculumRecommendations(testAnalysis) {
        const recommendations = [];
        
        // Teaching method recommendations
        for (const difficultTopic of testAnalysis.difficultTopics) {
            recommendations.push({
                type: 'teaching_method',
                topic: difficultTopic.topic,
                currentScore: difficultTopic.averageScore,
                recommendation: await this.getTeachingRecommendation(difficultTopic),
                priority: 'high',
                timeline: 'Next 2-3 classes'
            });
        }
        
        // Resource recommendations
        recommendations.push({
            type: 'resources',
            recommendation: 'Provide additional practice materials for difficult topics',
            topics: testAnalysis.difficultTopics.map(t => t.topic),
            priority: 'medium',
            timeline: 'Within 1 week'
        });
        
        // Assessment recommendations
        recommendations.push({
            type: 'assessment',
            recommendation: 'Implement formative assessments for difficult topics',
            frequency: 'Weekly',
            priority: 'high',
            timeline: 'Immediate'
        });
        
        return recommendations;
    }

    // Get teaching recommendations for difficult topics
    async getTeachingRecommendation(difficultTopic) {
        const recommendations = {
            'Algebra': 'Use step-by-step problem solving with visual aids and real-world examples',
            'Geometry': 'Incorporate hands-on activities and geometric software',
            'Calculus': 'Break down complex concepts into smaller, manageable parts',
            'Physics': 'Use demonstrations and experiments to illustrate concepts',
            'Chemistry': 'Focus on molecular models and reaction mechanisms',
            'Biology': 'Use diagrams, models, and case studies',
            'Reading Comprehension': 'Practice with various text types and reading strategies',
            'Writing': 'Provide structured writing templates and peer review',
            'History': 'Use timelines, primary sources, and cause-effect relationships'
        };
        
        return recommendations[difficultTopic.topic] || 'Use varied teaching methods and provide additional support';
    }

    // Get topic-specific resources
    async getTopicResources(topic) {
        const resources = {
            'Algebra': ['Khan Academy Algebra', 'Practice worksheets', 'Online calculators'],
            'Geometry': ['Geometric software', 'Shape manipulatives', 'Visual proofs'],
            'Calculus': ['Graphing calculators', 'Step-by-step guides', 'Video tutorials'],
            'Physics': ['Simulation software', 'Lab experiments', 'Physics videos'],
            'Chemistry': ['Molecular models', 'Lab simulations', 'Periodic table apps'],
            'Biology': ['Microscopes', 'Anatomy models', 'Interactive diagrams'],
            'Reading Comprehension': ['Reading passages', 'Comprehension strategies', 'Vocabulary lists'],
            'Writing': ['Writing prompts', 'Grammar guides', 'Peer review forms'],
            'History': ['Timeline tools', 'Primary sources', 'Historical maps']
        };
        
        return resources[topic] || ['Textbooks', 'Online resources', 'Practice materials'];
    }

    // Call AI provider
    async callAIProvider(prompt, options = {}) {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
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
            return result[0]?.generated_text || result.generated_text || '';
        } catch (error) {
            console.error('AI provider error:', error);
            throw error;
        }
    }

    // Utility methods
    getStrengthDescription(score) {
        if (score >= 90) return 'Excellent mastery';
        if (score >= 80) return 'Strong understanding';
        if (score >= 70) return 'Good grasp';
        return 'Developing';
    }

    getWeaknessDescription(score) {
        if (score < 40) return 'Needs significant support';
        if (score < 60) return 'Requires additional practice';
        if (score < 70) return 'Needs reinforcement';
        return 'Room for improvement';
    }

    calculateOverallPerformance(testAnalysis) {
        const totalScore = testAnalysis.studentPerformance.reduce((sum, student) => sum + student.overallScore, 0);
        return totalScore / testAnalysis.studentPerformance.length;
    }

    // Update student profiles
    updateStudentProfile(studentAnalysis) {
        if (!this.studentProfiles.has(studentAnalysis.studentId)) {
            this.studentProfiles.set(studentAnalysis.studentId, {
                id: studentAnalysis.studentId,
                name: studentAnalysis.studentName,
                tests: [],
                overallPerformance: 0,
                strengths: [],
                weaknesses: [],
                learningStyle: 'mixed',
                progress: []
            });
        }
        
        const profile = this.studentProfiles.get(studentAnalysis.studentId);
        profile.tests.push(studentAnalysis);
        profile.overallPerformance = this.calculateStudentOverallPerformance(profile.tests);
        profile.strengths = this.consolidateStrengths(profile.tests);
        profile.weaknesses = this.consolidateWeaknesses(profile.tests);
        profile.learningStyle = studentAnalysis.learningStyle;
        profile.progress.push({
            date: new Date(),
            score: studentAnalysis.overallScore,
            topics: studentAnalysis.topics
        });
    }

    calculateStudentOverallPerformance(tests) {
        if (tests.length === 0) return 0;
        const totalScore = tests.reduce((sum, test) => sum + test.overallScore, 0);
        return totalScore / tests.length;
    }

    consolidateStrengths(tests) {
        const strengthMap = new Map();
        
        for (const test of tests) {
            for (const strength of test.strengths) {
                if (!strengthMap.has(strength.topic)) {
                    strengthMap.set(strength.topic, { topic: strength.topic, count: 0, totalScore: 0 });
                }
                const data = strengthMap.get(strength.topic);
                data.count++;
                data.totalScore += strength.score;
            }
        }
        
        return Array.from(strengthMap.values())
            .map(s => ({ ...s, averageScore: s.totalScore / s.count }))
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, 5);
    }

    consolidateWeaknesses(tests) {
        const weaknessMap = new Map();
        
        for (const test of tests) {
            for (const weakness of test.weaknesses) {
                if (!weaknessMap.has(weakness.topic)) {
                    weaknessMap.set(weakness.topic, { topic: weakness.topic, count: 0, totalScore: 0 });
                }
                const data = weaknessMap.get(weakness.topic);
                data.count++;
                data.totalScore += weakness.score;
            }
        }
        
        return Array.from(weaknessMap.values())
            .map(w => ({ ...w, averageScore: w.totalScore / w.count }))
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, 5);
    }

    // Initialize topic taxonomy
    initializeTopicTaxonomy() {
        this.topicTaxonomy = {
            'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
            'Science': ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
            'English': ['Reading Comprehension', 'Writing', 'Grammar', 'Literature'],
            'History': ['World History', 'US History', 'Ancient History', 'Modern History'],
            'Social Studies': ['Geography', 'Civics', 'Economics', 'Psychology']
        };
    }

    // Load test data
    loadTestData() {
        try {
            const saved = localStorage.getItem('test_analytics_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.testData = data.testData || [];
                this.studentProfiles = new Map(data.studentProfiles || []);
                this.topicDifficulty = new Map(data.topicDifficulty || []);
            }
        } catch (error) {
            console.warn('Could not load test analytics data:', error);
        }
    }

    // Save test data
    saveTestData() {
        try {
            const data = {
                testData: this.testData,
                studentProfiles: Array.from(this.studentProfiles.entries()),
                topicDifficulty: Array.from(this.topicDifficulty.entries())
            };
            localStorage.setItem('test_analytics_data', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save test analytics data:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        window.addEventListener('testAnalyzed', (event) => {
            this.saveTestData();
        });
    }

    // Public API methods
    async analyzeTestData(testData) {
        return await this.analyzeTest(testData);
    }

    getStudentProfile(studentId) {
        return this.studentProfiles.get(studentId);
    }

    getAllStudentProfiles() {
        return Array.from(this.studentProfiles.values());
    }

    getTopicDifficulty() {
        return Array.from(this.topicDifficulty.values());
    }

    getCurriculumInsights() {
        return this.curriculumInsights;
    }

    generateReport(testId) {
        const test = this.testData.find(t => t.testId === testId);
        if (!test) return null;
        
        return {
            testInfo: {
                name: test.testName,
                subject: test.subject,
                date: test.date,
                totalQuestions: test.totalQuestions,
                totalStudents: test.totalStudents
            },
            topicAnalysis: test.topics,
            studentPerformance: test.studentPerformance,
            insights: test.insights,
            recommendations: test.recommendations
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITestAnalytics;
} else {
    window.AITestAnalytics = AITestAnalytics;
}
