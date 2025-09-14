// Firebase Service for Edu-Morph
class FirebaseService {
    constructor() {
        this.db = null;
        this.auth = null;
        this.storage = null;
        this.initializeFirebase();
    }

    // Initialize Firebase
    initializeFirebase() {
        if (typeof firebase !== 'undefined') {
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.storage = firebase.storage();
        } else {
            console.warn('Firebase not loaded. Please include Firebase SDK.');
        }
    }

    // User Management
    async createUser(userData) {
        try {
            const { email, password, firstName, lastName, role } = userData;
            
            // Create user with email and password
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update user profile
            await user.updateProfile({
                displayName: `${firstName} ${lastName}`
            });
            
            // Save additional user data to Firestore
            await this.db.collection('users').doc(user.uid).set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return {
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: role
                }
            };
        } catch (error) {
            console.error('Error creating user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async signInUser(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get additional user data from Firestore
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            return {
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: userData.role,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                }
            };
        } catch (error) {
            console.error('Error signing in user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async signOutUser() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Error signing out user:', error);
            return { success: false, error: error.message };
        }
    }

    // Document Management
    async saveDocument(documentData) {
        try {
            const docRef = await this.db.collection('documents').add({
                ...documentData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return {
                success: true,
                documentId: docRef.id
            };
        } catch (error) {
            console.error('Error saving document:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getDocuments(userId) {
        try {
            const snapshot = await this.db.collection('documents')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return {
                success: true,
                documents: documents
            };
        } catch (error) {
            console.error('Error getting documents:', error);
            return {
                success: false,
                error: error.message,
                documents: []
            };
        }
    }

    async deleteDocument(documentId) {
        try {
            await this.db.collection('documents').doc(documentId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting document:', error);
            return { success: false, error: error.message };
        }
    }

    // Generated Content Management
    async saveGeneratedContent(contentData) {
        try {
            const docRef = await this.db.collection('generatedContent').add({
                ...contentData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return {
                success: true,
                contentId: docRef.id
            };
        } catch (error) {
            console.error('Error saving generated content:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getGeneratedContent(userId, contentType = null) {
        try {
            let query = this.db.collection('generatedContent')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc');
            
            if (contentType) {
                query = query.where('type', '==', contentType);
            }
            
            const snapshot = await query.get();
            
            const content = [];
            snapshot.forEach(doc => {
                content.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return {
                success: true,
                content: content
            };
        } catch (error) {
            console.error('Error getting generated content:', error);
            return {
                success: false,
                error: error.message,
                content: []
            };
        }
    }

    async deleteGeneratedContent(contentId) {
        try {
            await this.db.collection('generatedContent').doc(contentId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting generated content:', error);
            return { success: false, error: error.message };
        }
    }

    // Test Questions Management
    async saveTestQuestions(testData) {
        try {
            const docRef = await this.db.collection('testQuestions').add({
                ...testData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return {
                success: true,
                testId: docRef.id
            };
        } catch (error) {
            console.error('Error saving test questions:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getTestQuestions(userId) {
        try {
            const snapshot = await this.db.collection('testQuestions')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            const tests = [];
            snapshot.forEach(doc => {
                tests.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return {
                success: true,
                tests: tests
            };
        } catch (error) {
            console.error('Error getting test questions:', error);
            return {
                success: false,
                error: error.message,
                tests: []
            };
        }
    }

    // File Upload to Firebase Storage
    async uploadFile(file, path) {
        try {
            const storageRef = this.storage.ref();
            const fileRef = storageRef.child(path);
            
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            return {
                success: true,
                downloadURL: downloadURL,
                fileName: snapshot.ref.name,
                size: snapshot.totalBytes
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Analytics and Progress Tracking
    async saveUserProgress(progressData) {
        try {
            const docRef = await this.db.collection('userProgress').add({
                ...progressData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return {
                success: true,
                progressId: docRef.id
            };
        } catch (error) {
            console.error('Error saving user progress:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getUserProgress(userId, subject = null) {
        try {
            let query = this.db.collection('userProgress')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc');
            
            if (subject) {
                query = query.where('subject', '==', subject);
            }
            
            const snapshot = await query.get();
            
            const progress = [];
            snapshot.forEach(doc => {
                progress.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return {
                success: true,
                progress: progress
            };
        } catch (error) {
            console.error('Error getting user progress:', error);
            return {
                success: false,
                error: error.message,
                progress: []
            };
        }
    }

    // Real-time listeners
    onAuthStateChanged(callback) {
        if (this.auth) {
            this.auth.onAuthStateChanged(callback);
        }
    }

    // Utility methods
    getCurrentUser() {
        return this.auth ? this.auth.currentUser : null;
    }

    isUserSignedIn() {
        return this.getCurrentUser() !== null;
    }

    // Batch operations
    async batchSave(items, collection) {
        try {
            const batch = this.db.batch();
            
            items.forEach(item => {
                const docRef = this.db.collection(collection).doc();
                batch.set(docRef, {
                    ...item,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            return { success: true };
        } catch (error) {
            console.error('Error in batch save:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseService;
} else {
    window.FirebaseService = FirebaseService;
}
