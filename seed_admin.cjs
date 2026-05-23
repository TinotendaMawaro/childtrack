// seed_admin.cjs — CommonJS, no TS annotations
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const DRIVER_ID = '9fb245d5-a5e6-41b8-921e-c45dfde2559f';
const PARENT_ID = '641abb74-f523-4da9-b847-3a8a3f41dbeb';

const supabase = createClient(
  'https://lzkhjmtfvksxobxdjytb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a2hqbXRmdmtzeG9ieGRqeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDcyODYsImV4cCI6MjA4OTYyMzI4Nn0.YmwbP8PB24Lc1vYaBPhfjkTRBFxwuwlmzxGM4skb09w'
);

async function main() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@allbright.com',
    password: 'money1'
  });
  console.log('Admin sign-in:', data?.session ? 'OK' : 'FAILED', error ? error.message : '');
  if (!data?.session) return;

  const { data: exR } = await supabase.from('transport_routes').select('*').limit(1);
  const rtCols = exR?.length ? Object.keys(exR[0]) : [];
  console.log('transport_routes cols:', rtCols);

  const { data: exCt } = await supabase.from('child_transport').select('*').limit(1);
  const ctCols = exCt?.length ? Object.keys(exCt[0]) : [];
  console.log('child_transport cols:', ctCols);

  const ROUTES = [
    { name: 'Morning Route A',   vehicle: 'Toyota Hiace 2019 (AB 12 CD)', status: 'active' },
    { name: 'Morning Route B',   vehicle: 'Toyota Hiace 2019 (AB 34 EF)', status: 'active' },
    { name: 'Afternoon Route A', vehicle: 'Toyota Hiace 2019 (AB 56 GH)', status: 'scheduled' },
    { name: 'Afternoon Route B', vehicle: 'Toyota Hiace 2019 (AB 78 IJ)', status: 'scheduled' },
    { name: 'Saturday Activity', vehicle: 'Minibus (KL 90 MN)',           status: 'active' },
  ];

  const routeIds = [];
  for (const r of ROUTES) {
    const row = { name: r.name, driver_id: DRIVER_ID, vehicle: r.vehicle, status: r.status };
    if (rtCols.includes('return_time')) row.return_time = null;
    if (rtCols.includes('description')) row.description = r.name;

    const { data: ins, error: rErr } = await supabase.from('transport_routes').insert(row).select('id').single();
    console.log('Route', r.name.slice(0, 16), ':', rErr ? 'ERR ' + rErr.message : 'OK');
    if (ins) routeIds.push(ins.id);
  }

  if (!routeIds.length) { console.log('No routes — aborting.'); return; }

  const NAMES = ['Emma Johnson','Noah Williams','Sofia Chen','Liam Okafor','Ava Patel','Lucas Nkosi','Mia Schreiber','James Moyo'];
  const { data: allChildren } = await supabase.from('children').select('id, full_name').eq('parent_id', PARENT_ID);
  console.log('Total children found:', allChildren?.length || 0);

  for (let i = 0; i < allChildren?.length; i++) {
    const child = allChildren[i];
    const routeId = routeIds[i % routeIds.length];
    const status = i < 3 ? 'ONBOARD' : 'NOT_PICKED';

    const ctRow = { child_id: child.id, route_id: routeId, driver_id: DRIVER_ID, status };
    if (ctCols.includes('pickup_time'))  ctRow.pickup_time  = null;
    if (ctCols.includes('dropoff_time')) ctRow.dropoff_time = null;

    const { error: ctErr } = await supabase.from('child_transport').insert(ctRow);
    console.log(' CT ', child.full_name.slice(0, 12), ':', ctErr ? 'ERR ' + ctErr.message : 'OK');
  }

  if (routeIds[0]) {
    const { error: gErr } = await supabase.from('transport_tracking').insert({
      driver_id: DRIVER_ID, route_id: routeIds[0], latitude: -26.1076, longitude: 28.0590,
    });
    console.log('GPS seed:', gErr ? 'ERR ' + gErr.message : 'OK');
  }

  await supabase.auth.signOut();
  console.log('\nDone.');
}

main().catch(e => console.error(e));
