import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totbrjiujqnnybgvhdaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdGJyaml1anFubnliZ3ZoZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Nzc4MDgsImV4cCI6MjA3OTM1MzgwOH0.R60ZATX-4eFanwta0gkFj0aX3ABMVXJnWwmBxqwlJ6s';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testUpdate() {
  const { data: comercios, error: selectErr } = await supabase.from('comercios').select('*');
  console.log("SELECT result:", selectErr || `Found ${comercios.length} comercios`);
  
  if (comercios && comercios.length > 0) {
    const target = comercios[0];
    console.log("Target comercio before update:", target);

    // Test updating resena on first comercio
    const { data: updateData, error: updateErr } = await supabase
      .from('comercios')
      .update({ resena: target.resena }) // harmless re-save of resena
      .eq('id', target.id)
      .select('*');

    console.log("UPDATE error:", updateErr);
    console.log("UPDATE result:", updateData);
  }
}

testUpdate();
