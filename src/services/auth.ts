import { requireSupabase } from '../lib/supabase'

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error(
      error.message.toLowerCase().includes('invalid')
        ? 'Incorrect email or password.'
        : error.message,
    )
  }
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw new Error(error.message)
}
