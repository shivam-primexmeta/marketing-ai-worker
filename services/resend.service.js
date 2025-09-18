const { Resend } = require('resend');
const config = require('../config');

// Initialize a single, reusable Resend client
const resend = new Resend(config.resendApiKey);

/**
 * Personalizes and sends a single email.
 * @param {object} job - The job object containing contact, template, and campaign info.
 * @returns {Promise<void>}
 */
async function sendPersonalizedEmail(job) {
    const { contact, template, campaign } = job;
    const unsubscribeUrl = `${config.appUrl}/unsubscribe?contactId=${contact.id}`;
    const unsubscribeLinkHtml = `<br><p style="font-size: 12px; color: #888;">To unsubscribe, <a href="${unsubscribeUrl}">click here</a>.</p>`;

    // Personalize both the body and the subject
    const personalizedBody = (template.body || '')
        .replace(/{{company_name}}/g, contact.company_name || 'your company')
        .replace(/{{company_url}}/g, contact.company_url || 'your website');

    const personalizedSubject = (template.subject || '')
        .replace(/{{company_name}}/g, contact.company_name || 'your company')
        .replace(/{{company_url}}/g, contact.company_url || 'your website');
    
    await resend.emails.send({
        from: config.fromEmail,
        to: contact.email,
        subject: personalizedSubject,
        html: personalizedBody + unsubscribeLinkHtml,
    });
}

module.exports = {
    sendPersonalizedEmail,
};
