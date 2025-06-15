
import { supabase } from '@/integrations/supabase/client';

export const logEvent = async (
  eventType: string,
  eventSource?: string,
  metadata?: Record<string, any>
) => {
  try {
    const { error } = await supabase.from('logs').insert([
      {
        event_type: eventType,
        event_source: eventSource,
        metadata: metadata,
      },
    ]);
    if (error) {
      console.error('Error logging event:', error.message);
    }
  } catch (err) {
    console.error('Failed to log event:', err);
  }
};
