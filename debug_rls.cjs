// debug_rls.cjs
const { createClient } = require('@supabase/supabase-js');
const DRIVER_ID = '9fb245d5-a5e6-41b8-921e-c45dfde2559f';
const PARENT_ID = '641abb74-f523-4da9-b847-3a8a3f41dbeb';

const supabase = createClient(
  'https://lzkhjmtfvksxobxdjytb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a2hqbXRmdmtzeG9ieGRqeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDcyODYsImV4cCI6MjA4OTYyMzI4Nn0.YmwbP8PB24Lc1vYaBPhfjkTRBFxwuwlmzxGM4skb09w'
);

(async () => {
  // Sign in — try parent for child reading
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'tmawaro25@gmail.com', password: 'money1'
  });
  console.log('Auth:', data?.session ? 'parent OK uid='+data.session.user.id.slice(0,8) : 'FAILED', error?.message || '');
  if (!data?.session) return;

  // Direct children count
  const { count: chCount, error: chErr } = await supabase.from('children').select('*', { count: 'exact' });
  console.log('\nchildren count:', chCount, chErr ? '| ERR '+chErr.message : '');

  const { data: ch } = await supabase.from('children').select('id, full_name, parent_id, photo_url, status').order('full_name');
  console.log('children rows:', ch?.length);
  for (const c of (ch||[])) console.log(' ', c.full_name, '|', (c.parent_id||'').slice(0,8), '|', (c.id||'').slice(0,8), '| p:', !!c.photo_url, '| s:', c.status);

  // Route fetch for driver
  await supabase.auth.signOut();
  await supabase.auth.signInWithPassword({ email: 'driver@allbright.com', password: 'money1' });
  console.log('\nAuth as driver:', !!data);

  const { data: routes } = await supabase.from('transport_routes').select('*').eq('driver_id', DRIVER_ID);
  console.log('driver routes:', routes?.length);

  // child_transport join
  const routeIds = (routes || []).map(r => r.id);
  if (routeIds.length) {
    const { data: ct } = await supabase.from('child_transport').select('*').in('route_id', routeIds);
    console.log('child_transport links:', ct?.length);
    for (const row of (ct||[])) {
      console.log(' ', (row.id||'').slice(0,8), '| hikey=', (row.child_id||'').slice(0,8), '| rid:', (row.route_id||'').slice(0,8), '|', row.status);
    }
  }

  // children fetch for driver — using child_transport subquery
  if (routeIds.length) {
    // Get child IDs from child_transport
    const { data: ct2 } = await supabase.from('child_transport')
      .select('child_id')
      .in('route_id', routeIds);
    const childIds = (ct2 || []).map(x => x.child_id).filter(Boolean);
    console.log('\nchild_transport child_ids count:', childIds.length);

    if (childIds.length) {
      const { data: kids, error: kErr } = await supabase.from('children')
        .select('id, full_name, dob, parent_id, photo_url, status, pickup_location, location_coordinates')
        .in('id', childIds);
      console.log('children fetched by id:', kids?.length, kErr ? '| '+kErr.message : '');
      for (const k of (kids||[])) console.log(' ', k.full_name, (k.id||'').slice(0,8), 'loc:', k.location_coordinates||k.pickup_location);
    }
  }

  await supabase.auth.signOut();
  console.log('\nDebug done.');
})();
