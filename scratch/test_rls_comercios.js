import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testRLS() {
  console.log("Testing update with select returning count...");
  const { data, count, error } = await supabase
    .from('comercios')
    .update({ resena: 'TEST_RESENA' })
    .eq('id', '7b987368-ca56-4395-8e58-9cfce9793db9')
    .select();

  console.log("Updated rows count:", data ? data.length : 0);
  console.log("Updated data:", data);
  console.log("Error:", error);
}

testRLS();
