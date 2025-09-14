// Email Service for Edu-Morph
class EmailService {
    constructor() {
        this.serviceId = 'service_odb6xxq';
        this.publicKey = 'your_public_key_here'; // You'll need to get this from EmailJS dashboard
        this.templateId = 'template_contact';
        this.isInitialized = false;
    }

    // Initialize EmailJS
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Load EmailJS script if not already loaded
            if (!window.emailjs) {
                await this.loadEmailJSScript();
            }
            
            // Initialize EmailJS
            emailjs.init(this.publicKey);
            this.isInitialized = true;
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    }

    // Load EmailJS script dynamically
    loadEmailJSScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Send welcome email to new students
    async sendWelcomeEmail(studentEmail, studentName, educatorName) {
        try {
            await this.init();
            
            const templateParams = {
                to_email: studentEmail,
                to_name: studentName,
                educator_name: educatorName,
                message: `Welcome to Edu-Morph! Your educator ${educatorName} has added you to their class. You can now access your dashboard and start learning.`
            };

            const response = await emailjs.send(
                this.serviceId,
                'template_welcome', // You'll need to create this template
                templateParams
            );

            console.log('Welcome email sent:', response);
            return { success: true, message: 'Welcome email sent successfully' };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, message: 'Failed to send welcome email' };
        }
    }

    // Send test notification
    async sendTestNotification(studentEmail, studentName, testTitle, educatorName) {
        try {
            await this.init();
            
            const templateParams = {
                to_email: studentEmail,
                to_name: studentName,
                test_title: testTitle,
                educator_name: educatorName,
                message: `A new test "${testTitle}" has been assigned by ${educatorName}. Please log in to take the test.`
            };

            const response = await emailjs.send(
                this.serviceId,
                'template_test_notification', // You'll need to create this template
                templateParams
            );

            console.log('Test notification sent:', response);
            return { success: true, message: 'Test notification sent successfully' };
        } catch (error) {
            console.error('Error sending test notification:', error);
            return { success: false, message: 'Failed to send test notification' };
        }
    }

    // Send result notification
    async sendResultNotification(studentEmail, studentName, testTitle, score, totalQuestions) {
        try {
            await this.init();
            
            const percentage = Math.round((score / totalQuestions) * 100);
            const templateParams = {
                to_email: studentEmail,
                to_name: studentName,
                test_title: testTitle,
                score: score,
                total_questions: totalQuestions,
                percentage: percentage,
                message: `Your test results for "${testTitle}": ${score}/${totalQuestions} (${percentage}%). ${percentage >= 70 ? 'Great job!' : 'Keep studying!'}`
            };

            const response = await emailjs.send(
                this.serviceId,
                'template_result_notification', // You'll need to create this template
                templateParams
            );

            console.log('Result notification sent:', response);
            return { success: true, message: 'Result notification sent successfully' };
        } catch (error) {
            console.error('Error sending result notification:', error);
            return { success: false, message: 'Failed to send result notification' };
        }
    }

    // Send password reset email
    async sendPasswordResetEmail(email, resetLink) {
        try {
            await this.init();
            
            const templateParams = {
                to_email: email,
                reset_link: resetLink,
                message: 'You requested a password reset. Click the link below to reset your password.'
            };

            const response = await emailjs.send(
                this.serviceId,
                'template_password_reset', // You'll need to create this template
                templateParams
            );

            console.log('Password reset email sent:', response);
            return { success: true, message: 'Password reset email sent successfully' };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            return { success: false, message: 'Failed to send password reset email' };
        }
    }

    // Fallback method using simple fetch (if EmailJS fails)
    async sendSimpleNotification(to, subject, message) {
        try {
            // This is a placeholder - in a real app, you'd use a backend service
            console.log(`Email would be sent to: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            
            return { success: true, message: 'Notification logged (EmailJS not configured)' };
        } catch (error) {
            console.error('Error sending simple notification:', error);
            return { success: false, message: 'Failed to send notification' };
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
} else {
    window.EmailService = EmailService;
}
