import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://dgpugcaffoguppzvbqlj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncHVnY2FmZm9ndXBwenZicWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTQ4MjQsImV4cCI6MjA5MzczMDgyNH0.oSjQ5jy9oA3mt7uP4pUDWC3FsMnM6CAL0EWpfMoS7Ls'
);
