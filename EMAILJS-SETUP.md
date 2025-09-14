# EmailJS Setup Guide for Edu-Morph

## Overview
This guide will help you set up EmailJS for sending email notifications in your Edu-Morph platform.

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Connect Your Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (Recommended)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

### For Gmail:
1. Select "Gmail"
2. Click "Connect Account"
3. Sign in to your Gmail account
4. Allow EmailJS to access your account
5. Note down your **Service ID** (e.g., `service_odb6xxq`)

## Step 3: Create Email Templates
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"

### Template 1: Welcome Email
- **Template ID**: `template_welcome`
- **Subject**: Welcome to Edu-Morph!
- **Content**:
```
Hello {{to_name}},

Welcome to Edu-Morph! Your educator {{educator_name}} has added you to their class.

You can now access your dashboard and start learning.

Best regards,
Edu-Morph Team
```

### Template 2: Test Notification
- **Template ID**: `template_test_notification`
- **Subject**: New Test Assigned - {{test_title}}
- **Content**:
```
Hello {{to_name}},

A new test "{{test_title}}" has been assigned by {{educator_name}}.

Please log in to your dashboard to take the test.

Good luck!
Edu-Morph Team
```

### Template 3: Result Notification
- **Template ID**: `template_result_notification`
- **Subject**: Test Results - {{test_title}}
- **Content**:
```
Hello {{to_name}},

Your test results for "{{test_title}}":
Score: {{score}}/{{total_questions}} ({{percentage}}%)

{{#if percentage >= 70}}
Great job! Keep up the excellent work!
{{else}}
Keep studying! You're making progress!
{{/if}}

Best regards,
Edu-Morph Team
```

## Step 4: Get Your Public Key
1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (starts with `user_`)
3. Copy this key

## Step 5: Update Configuration
Update the `config.js` file with your EmailJS details:

```javascript
// EmailJS Configuration
EMAILJS: {
    SERVICE_ID: 'service_odb6xxq', // Your service ID
    PUBLIC_KEY: 'your_public_key_here', // Your public key
    TEMPLATE_IDS: {
        WELCOME: 'template_welcome',
        TEST_NOTIFICATION: 'template_test_notification',
        RESULT_NOTIFICATION: 'template_result_notification'
    }
}
```

## Step 6: Test Email Functionality
1. Open your Edu-Morph dashboard
2. Try the AI Test Paper Making feature
3. Check if emails are being sent (check your email)

## Troubleshooting

### Common Issues:
1. **"EmailJS not initialized"**
   - Make sure you've included the EmailJS script
   - Check that your Public Key is correct

2. **"Template not found"**
   - Verify template IDs match exactly
   - Check that templates are published

3. **"Service not found"**
   - Verify Service ID is correct
   - Check that email service is connected

4. **Emails not sending**
   - Check browser console for errors
   - Verify email service connection
   - Check spam folder

## Free Tier Limits
- **200 emails per month**
- **3 email services**
- **10 email templates**
- **1,000 API calls per month**

## Upgrade Options
If you need more emails:
- **Starter Plan**: $15/month (1,000 emails)
- **Business Plan**: $45/month (10,000 emails)
- **Enterprise Plan**: Custom pricing

## Security Notes
- Never expose your Private Key in client-side code
- Use Public Key only for frontend applications
- Consider rate limiting for production use
- Monitor email usage to avoid exceeding limits

## Support
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
- Community Forum: [https://github.com/emailjs/emailjs-html](https://github.com/emailjs/emailjs-html)

## Next Steps
1. Complete EmailJS setup
2. Test email functionality
3. Implement email notifications in your modules
4. Monitor email usage and performance
