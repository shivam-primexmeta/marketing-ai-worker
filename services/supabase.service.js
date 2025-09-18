const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

// Initialize a single, reusable Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

/**
 * Finds a batch of pending emails from the work queue.
 * @returns {Promise<Array>} A list of pending email jobs.
 */
async function getPendingEmails() {
    const { data, error } = await supabase
        .from('email_sending_log')
        .select(`
            *,
            campaign:campaigns(*),
            contact:contacts(id, email, company_name, company_url),
            template:templates(subject, body)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(10); // Process up to 10 emails per run

    if (error) throw new Error(`Failed to fetch pending emails: ${error.message}`);
    return data;
}

/**
 * Updates the status of a specific email in the sending log.
 * @param {string} jobId - The ID of the log entry.
 * @param {'sent' | 'failed'} status - The new status.
 * @param {string} [errorMessage] - An optional error message.
 */
async function updateEmailLogStatus(jobId, status, errorMessage) {
    const updateData = {
        status,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        error_message: errorMessage || null,
    };
    await supabase.from('email_sending_log').update(updateData).eq('id', jobId);
}

module.exports = {
    getPendingEmails,
    updateEmailLogStatus,
};
