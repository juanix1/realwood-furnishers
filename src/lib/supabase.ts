import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * True only when both public env vars are present and the URL looks valid.
 * Only the public ANON key is ever used in the browser. Row Level Security
 * (see supabase/migrations) is what protects the data. The service-role key
 * must never be placed in this project.
 */
export const isSupabaseConfigured = Boolean(url && anonKey && /^https?:\/\//.test(url))

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    )
  }
  return supabase
}
