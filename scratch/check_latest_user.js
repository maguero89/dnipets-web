import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  console.log("Fetching profiles...");
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (pErr) console.error("Profiles error:", pErr);
  else console.log("Recent Profiles:", JSON.stringify(profiles, null, 2));

  console.log("\nFetching pets...");
  const { data: pets, error: petErr } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (petErr) console.error("Pets error:", petErr);
  else console.log("Recent Pets:", JSON.stringify(pets, null, 2));
}

inspect();
