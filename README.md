⚙️ Marketing AI - Node.js Cron Worker
This is the backend worker for the Marketing AI platform. It's a standalone, long-running Node.js application responsible for processing scheduled email campaigns in a robust, staggered, and reliable manner.

🎯 Core Functionality
This worker acts as the "Back Office" for the main Marketing AI dashboard. Its primary responsibility is to protect the sender's domain reputation by sending emails intelligently.

Scheduled Execution: Uses node-cron to wake up at a regular interval (e.g., every 5 minutes) to check for work.

Staggered & Randomized Sending: To mimic natural sending patterns and avoid spam filters, the worker sends emails one by one with a configurable random delay between each send.

Individual Email Tracking: It operates on a dedicated "work queue" table (email_sending_log) in the database. Each email is treated as an individual job, and its status (pending, sent, failed) is tracked.

Fault Tolerance: The system is crash-proof. If the worker stops for any reason, it will pick up exactly where it left off on its next run by only looking for emails still marked as pending.

🔧 Tech Stack & Architecture
This is a lightweight Node.js application built with a modular architecture to separate concerns.

Runtime: Node.js

Database Client: @supabase/supabase-js

Email Service: Resend SDK

Task Scheduler: node-cron

Environment Variables: dotenv

The architecture is broken down into:

config/: Handles loading and validating all environment variables.

services/: Contains modules for interacting with external APIs (Supabase and Resend).

processor/: The core "engine" that contains the main business logic.

index.js: The main entry point that starts the cron job.

🏁 Getting Started
To run this worker, follow these steps:

1. Clone the Repository
git clone <your-worker-repository-url>
cd marketing-ai-worker

2. Install Dependencies
npm install

3. Set Up Environment Variables
Create a file named .env in the root of this project.

IMPORTANT: This file is listed in .gitignore and must never be committed to your repository. It contains all the same secrets as the frontend application.

# Supabase Credentials
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY

# Resend API Key
RESEND_API_KEY=YOUR_RESEND_API_KEY

# The email address to send campaigns from
FROM_EMAIL="Your Name <you@yourverifieddomain.com>"

# The public URL of the main Next.js application
NEXT_PUBLIC_APP_URL=http://localhost:3000

4. Run the Worker
Start the worker script. It will run continuously in your terminal.

node index.js

You should see a message confirming that the worker has started. It will now wake up every 5 minutes to check the database for scheduled campaigns to process.

🔗 Connection to Frontend
This worker operates on the campaigns and email_sending_log tables in the shared Supabase database. It looks for jobs that are populated by the Marketing AI Next.js frontend application. Both projects must be connected to the same Supabase project to function correctly.
