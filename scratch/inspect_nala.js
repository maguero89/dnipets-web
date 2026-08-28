import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectNala() {
  console.log("Searching for Nala...");
  const { data: pets } = await supabase.from('pets').select('*').ilike('name', '%Nala%');
  console.log("NALA PET RECORDS:", JSON.stringify(pets, null, 2));

  if (pets && pets.length > 0) {
    for (const pet of pets) {
      console.log(`\nOwner profile for ${pet.name} (owner_id: ${pet.owner_id}):`);
      const { data: owner } = await supabase.from('profiles').select('*').eq('uid', pet.owner_id);
      console.log(JSON.stringify(owner, null, 2));
    }
  }
}

inspectNala();
