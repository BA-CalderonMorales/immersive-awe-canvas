
-- Enable pg_cron to allow scheduled tasks, if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions for cron to operate.
GRANT USAGE ON SCHEMA cron TO postgres;

-- This command schedules a job named 'delete-old-logs' to run every day at midnight (UTC).
SELECT cron.schedule(
  'delete-old-logs',
  '0 0 * * *',
  $$
    DELETE FROM public.logs WHERE created_at < now() - interval '60 days';
  $$
);
