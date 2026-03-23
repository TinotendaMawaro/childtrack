import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Log environment variables (masked for security)
console.log('[Supabase Debug] Environment Check:')
console.log('- URL configured:', !!supabaseUrl)
console.log('- ANON_KEY configured:', !!supabaseAnonKey)
console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase Error] Missing environment variables!')
  console.error('- VITE_SUPABASE_URL:', supabaseUrl || 'NOT SET')
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'childtrack-web'
    }
  }
})

// Test connection on export
console.log('[Supabase] Client initialized, testing connection...')
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.warn('[Supabase Connection Test] WARNING:', error.message)
      console.warn('- This may be due to RLS policy blocking unauthenticated access')
      console.warn('- Make sure to run supabase-schema.sql in your Supabase SQL Editor')
    } else {
      console.log('[Supabase Connection Test] SUCCESS - Profiles table accessible (count: ' + count + ')')
    }
  })
