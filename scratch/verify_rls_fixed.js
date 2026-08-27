import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testUpdate() {
  const { data: comercios } = await supabase.from('comercios').select('*');
  if (!comercios || comercios.length === 0) {
    console.log("No comercios found.");
    return;
  }

  const target = comercios[0];
  console.log(`Testing update on: ${target.nombre} (${target.id})`);

  const { data, error } = await supabase
    .from('comercios')
    .update({ resena: target.resena }) // harmless update
    .eq('id', target.id)
    .select('*');

  console.log("Error:", error);
  console.log("Updated rows count:", data ? data.length : 0);
  console.log("Updated row data:", data);
}

testUpdate();
