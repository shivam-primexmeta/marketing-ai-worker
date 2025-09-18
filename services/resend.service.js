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
    const { contact, template } = job;
    const unsubscribeUrl = `${config.appUrl}/unsubscribe?contactId=${contact.id}`;
    const unsubscribeLinkHtml = `<br><p style="font-size: 12px; color: #888;">To unsubscribe, <a href="${unsubscribeUrl}">click here</a>.</p>`;

    // THE UPDATE: Added .replace() calls for all four placeholders.
    const personalizedBody = (template.body || '')
        .replace(/{{email}}/g, contact.email || '')
        .replace(/{{phone_number}}/g, contact.phone_number || '')
        .replace(/{{company_name}}/g, contact.company_name || 'your company')
        .replace(/{{company_url}}/g, contact.company_url || 'your website');

    const personalizedSubject = (template.subject || '')
        .replace(/{{email}}/g, contact.email || '')
        .replace(/{{phone_number}}/g, contact.phone_number || '')
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
