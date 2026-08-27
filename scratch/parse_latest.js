import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  const { data: pets } = await supabase.from('pets').select('id, name, owner_name, photo_url, created_at').order('created_at', { ascending: false }).limit(10);
  console.log("PETS:");
  pets.forEach(p => {
    console.log(`- Pet: ${p.name} | Owner: ${p.owner_name} | Photo: ${p.photo_url ? p.photo_url.substring(0, 50) + '...' : 'NULL'} | Created: ${p.created_at}`);
  });
}

inspect();
