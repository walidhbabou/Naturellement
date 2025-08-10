import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtyircbbtzjtiialcgkt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWlyY2JidHpqdGlpYWxjZ2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTA5NzQsImV4cCI6MjA3MDM2Njk3NH0.bGWoAiN1ZiwxA80Ph-nWM1cxKG57Lb2ofKXfKyXrdyU';

export const supabase = createClient(supabaseUrl, supabaseKey);