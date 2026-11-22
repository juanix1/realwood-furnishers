import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/**
 * Admin = signed in AND app_metadata.role === 'admin'.
 * This is only a UI gate: the real enforcement is Row Level Security in the
 * database, which checks the same claim on every request.
 */
export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = session?.user?.app_metadata?.role === 'admin'
  return { session, loading, isAdmin }
}
