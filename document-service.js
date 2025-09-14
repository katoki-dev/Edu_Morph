// Document Processing Service for Edu-Morph
class DocumentService {
    constructor() {
        this.supportedFormats = ['pdf', 'docx', 'txt', 'md'];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
    }

    // Validate uploaded file
    validateFile(file) {
        const errors = [];
        
        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push('File size must be less than 10MB');
        }
        
        // Check file type
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.supportedFormats.includes(extension)) {
            errors.push(`Unsupported file format. Supported formats: ${this.supportedFormats.join(', ')}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Extract text from different document formats
    async extractText(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        try {
            switch (extension) {
                case 'pdf':
                    return await this.extractFromPDF(file);
                case 'docx':
                    return await this.extractFromDocx(file);
                case 'txt':
                case 'md':
                    return await this.extractFromText(file);
                default:
                    throw new Error('Unsupported file format');
            }
        } catch (error) {
            console.error('Error extracting text:', error);
            throw new Error('Failed to extract text from document');
        }
    }

    // Extract text from PDF
    async extractFromPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    
                    // Check if PDF.js is available
                    if (typeof window.pdfjsLib === 'undefined') {
                        throw new Error('PDF.js library not loaded');
                    }
                    
                    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
                    let fullText = '';
                    
                    // Process pages sequentially to avoid memory issues
                    for (let i = 1; i <= pdf.numPages; i++) {
                        try {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items
                                .map(item => item.str)
                                .join(' ')
                                .trim();
                            
                            if (pageText) {
                                fullText += pageText + '\n\n';
                            }
                        } catch (pageError) {
                            console.warn(`Error processing page ${i}:`, pageError);
                            // Continue with other pages
                        }
                    }
                    
                    resolve(fullText.trim());
                } catch (error) {
                    console.error('PDF extraction error:', error);
                    reject(new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read PDF file'));
            reader.readAsArrayBuffer(file);
        });
    }

    // Extract text from DOCX
    async extractFromDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    resolve(result.value);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Extract text from plain text files
    async extractFromText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Process document for AI content generation
    processDocument(text, options = {}) {
        const {
            maxLength = 4000,
            preserveStructure = true,
            extractKeyPoints = true
        } = options;

        // Clean and normalize text
        let processedText = text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        // Truncate if too long
        if (processedText.length > maxLength) {
            processedText = processedText.substring(0, maxLength) + '...';
        }

        // Extract key points if requested
        let keyPoints = [];
        if (extractKeyPoints) {
            keyPoints = this.extractKeyPoints(processedText);
        }

        return {
            text: processedText,
            keyPoints: keyPoints,
            wordCount: processedText.split(' ').length,
            characterCount: processedText.length
        };
    }

    // Extract key points from text
    extractKeyPoints(text) {
        // Simple key point extraction
        // In production, you might use more sophisticated NLP techniques
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const keyPoints = sentences
            .filter(sentence => {
                const words = sentence.trim().split(' ');
                return words.length >= 5 && words.length <= 30;
            })
            .slice(0, 10) // Limit to 10 key points
            .map(sentence => sentence.trim());

        return keyPoints;
    }

    // Generate document summary
    generateSummary(text, maxLength = 200) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const summary = sentences.slice(0, 3).join('. ').trim();
        
        return summary.length > maxLength 
            ? summary.substring(0, maxLength) + '...'
            : summary;
    }

    // Save document to Firebase Storage
    async saveDocument(file, userId) {
        try {
            const storageRef = firebase.storage().ref();
            const fileName = `${userId}/${Date.now()}_${file.name}`;
            const fileRef = storageRef.child(fileName);
            
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            return {
                fileName: fileName,
                downloadURL: downloadURL,
                size: file.size,
                type: file.type
            };
        } catch (error) {
            console.error('Error saving document:', error);
            throw new Error('Failed to save document');
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentService;
} else {
    window.DocumentService = DocumentService;
}
