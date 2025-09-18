const cron = require('node-cron');
const config = require('./config');
const { processEmailQueue } = require('./processor/campaign.processor');

console.log('🚀 Marketing AI Worker is starting...');
console.log(`- Cron schedule set to: "${config.cronSchedule}"`);
console.log(`- Timezone: "${config.timezone}"`);

// Schedule our main processing function to run according to the schedule in our config.
cron.schedule(config.cronSchedule, processEmailQueue, {
    scheduled: true,
    timezone: config.timezone,
});

console.log('✅ Worker is running. Waiting for the scheduled time to process email queue...');
