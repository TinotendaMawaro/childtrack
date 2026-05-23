// verify_db.cjs
const { createClient } = require('@supabase/supabase-js');

const DRIVER_ID = '9fb245d5-a5e6-41b8-921e-c45dfde2559f';
const PARENT_ID = '641abb74-f523-4da9-b847-3a8a3f41dbeb';

const supabase = createClient(
  'https://lzkhjmtfvksxobxdjytb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a2hqbXRmdmtzeG9ieGRqeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDcyODYsImV4cCI6MjA4OTYyMzI4Nn0.YmwbP8PB24Lc1vYaBPhfjkTRBFxwuwlmzxGM4skb09w'
);

(async function () {
  const { data: children } = await supabase.from('children').select('*').order('full_name');
  console.log('=== CHILDREN === count:', children?.length);
  for (const c of (children || [])) {
    console.log(' ', (c.id || '').slice(0, 8), '|', c.full_name,
      '| parent:', (c.parent_id || '').slice(0, 8),
      '| loc:', c.location_coordinates || c.pickup_location || 'none',
      '| status:', c.status,
      '| dob:', c.dob);
  }

  const { data: routes } = await supabase.from('transport_routes')
    .select('*').eq('driver_id', DRIVER_ID).order('name');
  console.log('\n=== ROUTES === count:', routes?.length);
  for (const r of (routes || [])) {
    console.log(' ', (r.id || '').slice(0, 8), '|', r.name, '|', r.status, '|', r.vehicle);
  }

  const { data: ct } = await supabase.from('child_transport')
    .select('*, children(full_name)').limit(5);
  console.log('\n=== CHILD_TRANSPORT (sample) ===');
  for (const row of (ct || [])) {
    console.log(' ', (row.id || '').slice(0, 8),
      '| child:', (row.child_id || '').slice(0, 8),
      '| route:', (row.route_id || '').slice(0, 8),
      '| status:', row.status,
      '| name:', row.children?.full_name || '?');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('role', 'DRIVER').maybeSingle();
  console.log('\n=== DRIVER PROFILE ===');
  console.log(JSON.stringify(profile, null, 2));

  const { data: parent } = await supabase.from('profiles').select('*').eq('role', 'PARENT').maybeSingle();
  console.log('\n=== PARENT PROFILE ===');
  console.log(JSON.stringify(parent, null, 2));

  await supabase.auth.signOut();
  console.log('\nVerify done.');
})();
