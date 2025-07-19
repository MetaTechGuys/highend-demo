import { createClient } from '@supabase/supabase-js'

// For client-side (browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please add NEXT_PUBLIC_SUPABASE_URL to your .env.local file')
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side API routes
export const createServerSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials for server-side client')
  }
  
  return createClient(url, key)
}