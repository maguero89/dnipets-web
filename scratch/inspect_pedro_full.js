import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  console.log("--- PET DATA ---");
  const { data: pet } = await supabase.from('pets').select('*').eq('id', '48192cd6-7adb-4857-a5d5-e4d8828bd3f4').single();
  console.log(JSON.stringify(pet, null, 2));

  if (pet) {
    console.log("\n--- OWNER PROFILE ---");
    const { data: owner } = await supabase.from('profiles').select('*').eq('uid', pet.owner_id).single();
    console.log(JSON.stringify(owner, null, 2));

    console.log("\n--- HEALTH RECORDS ---");
    const { data: records } = await supabase.from('health_records').select('*').eq('pet_id', pet.id);
    console.log(JSON.stringify(records, null, 2));
  }
}

inspect();
