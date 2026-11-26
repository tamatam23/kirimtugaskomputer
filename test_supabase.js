import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mcyjsubijeadtaedwysk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWpzdWJpamVhZHRhZWR3eXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2OTk4NDksImV4cCI6MjExMTI3NTg0OX0.j_mdsP4EJ4S8zY_5qQnzgeYof5avmwO_fSme2qSimx0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkInserts() {
  console.log('Testing insert classes...');
  const res1 = await supabase.from('classes').insert({ id: 'test_cls', name: 'Test' }).select();
  console.log('Class insert:', res1.data, res1.error);

  console.log('Testing insert submissions...');
  const res2 = await supabase.from('submissions').insert({ id: 'test_sub', title: 'Test Sub' }).select();
  console.log('Submission insert:', res2.data, res2.error);

  // cleanup
  if (res1.data) await supabase.from('classes').delete().eq('id', 'test_cls');
  if (res2.data) await supabase.from('submissions').delete().eq('id', 'test_sub');
}

checkInserts();
