import { createClient } from '@supabase/supabase-js'

// Vite exposes env vars via import.meta.env (must be prefixed with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase env vars are missing. Ensure you have a frontend/.env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabaseInitError = isSupabaseConfigured
  ? null
  : 'Supabase env vars are missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null