import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
     lockStorageOutTimeout: 1000 ,
    storageKey: 'greener-vile-auth-token', 
    flowType: 'pkce',
  },
  global: {
    fetch: (...args) => fetch(...args, { signal: AbortSignal.timeout(30000) })
  }
})
