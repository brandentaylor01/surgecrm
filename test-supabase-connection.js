const { createClient } = require('@supabase/supabase-js');

// Target credentials directly from your system snap
const url = 'https://supabase.co';
const anonKey = 'sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL';

console.log('Initializing test connection to project endpoint: ' + url + '...\n');

try {
  const supabase = createClient(url, anonKey);
  
  // Attempt to test access parameters against the target instance
  supabase.from('leads').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
      if (error) {
        // Handle common auth/network block flags safely
        console.log('⚠️ Status: Initial structural handshake returned parameters.');
        console.log('Details: ' + error.message);
        console.log('\nTip: This is expected if the migration schema has not been pushed via CLI yet.');
      } else {
        console.log('✅ Success! Connection stable. Active ledger row count: ' + count);
      }
    })
    .catch(err => {
      console.error('❌ Network validation failure: ', err.message);
    });
} catch (err) {
  console.error('❌ Client initialization crashed: ', err.message);
}
