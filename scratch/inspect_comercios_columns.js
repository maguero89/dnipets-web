import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  const { data, error } = await supabase.from('comercios').select('*').limit(10);
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("ALL ROWS IN COMERCIOS:");
  data.forEach((row, i) => {
    console.log(`\nRow ${i + 1}:`);
    console.log(row);
  });
}

inspect();
