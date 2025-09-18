require('dotenv').config();

const config = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    cronSchedule: '*/5 * * * *', // Run every 5 minutes
    timezone: 'Asia/Kolkata',
};

// Validate that all necessary environment variables are set
for (const [key, value] of Object.entries(config)) {
    if (!value && key !== 'cronSchedule' && key !== 'timezone') { // cronSchedule has a default
        throw new Error(`Missing environment variable: ${key.toUpperCase()}`);
    }
}

module.exports = config;
