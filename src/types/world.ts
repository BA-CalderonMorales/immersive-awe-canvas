import type { Database } from '@/integrations/supabase/types';

export interface World extends Database['public']['Tables']['worlds']['Row'] {
  slug: string;
}
