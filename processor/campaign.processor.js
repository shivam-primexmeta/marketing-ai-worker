const supabaseService = require('../services/supabase.service');
const resendService = require('../services/resend.service');

// Helper function for the random delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * The main processing function for the email queue.
 */
async function processEmailQueue() {
    console.log(`[${new Date().toISOString()}] Cron job started: Checking for pending emails...`);
    
    try {
        const pendingEmails = await supabaseService.getPendingEmails();

        if (!pendingEmails || pendingEmails.length === 0) {
            console.log(`[${new Date().toISOString()}] No pending emails found. Waiting for next run.`);
            return;
        }

        console.log(`[${new Date().toISOString()}] Found ${pendingEmails.length} pending emails to process.`);

        for (const job of pendingEmails) {
            const { campaign, contact } = job;

            // Validate that we have all the necessary data before proceeding
            if (!campaign || !contact) {
                console.error(`   - Skipping job ${job.id} due to missing related data.`);
                await supabaseService.updateEmailLogStatus(job.id, 'failed', 'Missing campaign or contact data');
                continue;
            }

            // Calculate and apply the random sending delay
            const delayMinMs = (campaign.delay_min_minutes || 0) * 60 * 1000;
            const delayMaxMs = (campaign.delay_max_minutes || 1) * 60 * 1000;
            const randomDelay = Math.floor(Math.random() * (delayMaxMs - delayMinMs + 1)) + delayMinMs;
            
            console.log(` - Waiting for ${Math.round(randomDelay / 1000)}s before sending to ${contact.email}...`);
            await sleep(randomDelay);

            try {
                await resendService.sendPersonalizedEmail(job);
                await supabaseService.updateEmailLogStatus(job.id, 'sent');
                console.log(`   - Email sent to ${contact.email}`);
            } catch (sendError) {
                console.error(`   - Failed to send email to ${contact.email}:`, sendError.message);
                await supabaseService.updateEmailLogStatus(job.id, 'failed', sendError.message);
            }
        }

    } catch (error) {
        console.error(`[${new Date().toISOString()}] FATAL ERROR: An error occurred during the main job processing loop.`);
        console.error(error);
    }
}

module.exports = {
    processEmailQueue,
};
