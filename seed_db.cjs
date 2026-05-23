// seed_db.cjs — CommonJS — no TS annotations
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')
const uuidv4 = () => crypto.randomUUID()

const DRIVER_ID = '9fb245d5-a5e6-41b8-921e-c45dfde2559f'
const PARENT_ID = '641abb74-f523-4da9-b847-3a8a3f41dbeb'

const supabase = createClient(
  'https://lzkhjmtfvksxobxdjytb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a2hqbXRmdmtzeG9ieGRqeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDcyODYsImV4cCI6MjA4OTYyMzI4Nn0.YmwbP8PB24Lc1vYaBPhfjkTRBFxwuwlmzxGM4skb09w'
)

async function main() {
  const { data: signIn, error: siErr } = await supabase.auth.signInWithPassword({
    email: 'tmawaro25@gmail.com',
    password: 'money1'
  })
  console.log('Sign-in as parent:', signIn?.session ? 'OK' : 'FAILED', siErr ? siErr.message : '')
  if (!signIn?.session) return

  // Probe real column names
  const { data: exRoutes } = await supabase.from('transport_routes').select('*').limit(1)
  const rtCols = exRoutes?.length ? Object.keys(exRoutes[0]) : []
  console.log('transport_routes cols:', rtCols)

  const { data: exChildren } = await supabase.from('children').select('*').limit(1)
  const childCols = exChildren?.length ? Object.keys(exChildren[0]) : []
  console.log('children cols:', childCols)

  const { data: exCt } = await supabase.from('child_transport').select('*').limit(1)
  const ctCols = exCt?.length ? Object.keys(exCt[0]) : []
  console.log('child_transport cols:', ctCols)

  // 1. Build and insert routes
  const ROUTES = [
    { name: 'Morning Route A',  vehicle: 'Toyota Hiace 2019 (AB 12 CD)', status: 'active' },
    { name: 'Morning Route B',  vehicle: 'Toyota Hiace 2019 (AB 34 EF)', status: 'active' },
    { name: 'Afternoon Route A',vehicle: 'Toyota Hiace 2019 (AB 56 GH)', status: 'scheduled' },
    { name: 'Afternoon Route B',vehicle: 'Toyota Hiace 2019 (AB 78 IJ)', status: 'scheduled' },
    { name: 'Saturday Activity',vehicle: 'Minibus (KL 90 MN)',           status: 'active' },
  ]

  const routeIds = []
  for (const r of ROUTES) {
    const row = { name: r.name, driver_id: DRIVER_ID, vehicle: r.vehicle, status: r.status }
    if (rtCols.includes('return_time'))   row.return_time   = null
    if (rtCols.includes('description'))   row.description   = r.name

    const { data, error } = await supabase.from('transport_routes').insert(row).select('id').single()
    console.log('Route', r.name.slice(0,16), ':', error ? 'ERR ' + error.message : 'OK')
    if (data) routeIds.push(data.id)
  }

  // 2. Insert children + child_transport
  const CHILDREN = [
    ['Emma Johnson',  '2019-03-15', '-26.1076,28.0590', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face'],
    ['Noah Williams', '2019-07-22', '-26.1082,28.0610', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'],
    ['Sofia Chen',    '2018-11-04', '-26.1090,28.0570', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'],
    ['Liam Okafor',   '2018-05-30', '-26.1065,28.0635', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'],
    ['Ava Patel',     '2019-01-18', '-26.1110,28.0550', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'],
    ['Lucas Nkosi',   '2019-09-12', '-26.1085,28.0600', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'],
    ['Mia Schreiber', '2018-08-03', '-26.1070,28.0580', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'],
    ['James Moyo',    '2019-04-27', '-26.1095,28.0620', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'],
  ]

  for (let i = 0; i < CHILDREN.length; i++) {
    const [name, dob, loc, photo] = CHILDREN[i]
    const routeId = routeIds[i % routeIds.length]
    const status  = i < 3 ? 'ONBOARD' : 'NOT_PICKED'

    const childRow = { full_name: name, dob, parent_id: PARENT_ID }
    if (childCols.includes('photo_url'))       childRow.photo_url = photo
    if (childCols.includes('pickup_location')) childRow.pickup_location = loc

    const { data: ch, error: chErr } = await supabase.from('children')
      .insert(childRow).select('id').single()
    console.log('Child', name.slice(0, 12), ':', chErr ? 'ERR ' + chErr.message : 'OK')

    if (ch) {
      const ctRow = { child_id: ch.id, route_id: routeId, driver_id: DRIVER_ID, status }
      if (ctCols.includes('pickup_time'))  ctRow.pickup_time  = null
      if (ctCols.includes('dropoff_time')) ctRow.dropoff_time = null

      const { error: ctErr } = await supabase.from('child_transport').insert(ctRow)
      console.log(' CT ', name.slice(0, 12), ':', ctErr ? 'ERR ' + ctErr.message : 'OK')
    }
  }

  await supabase.auth.signOut()
  console.log('\nSeed done.')
}

main().catch(e => console.error('Fatal:', e.message))
