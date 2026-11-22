import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, LogOut, Lock } from 'lucide-react'
import { Notice, Spinner } from '../../components/ui'
import { useAdminSession } from '../../hooks/useAdminSession'
import { usePageTitle } from '../../hooks/usePageTitle'
import { isSupabaseConfigured } from '../../lib/supabase'
import { signInAdmin, signOutAdmin } from '../../services/auth'
import AdminDashboard from './AdminDashboard'

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-900 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 shadow-2xl">{children}</div>
    </div>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await signInAdmin(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <div className="text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 text-gold">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">Staff sign in</h1>
        <p className="mt-1 text-sm text-charcoal-600">Realwood Furnishers admin dashboard</p>
      </div>
      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="admin-email" className="label">Email</label>
          <input id="admin-email" type="email" autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="admin-password" className="label">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <Notice type="error">{error}</Notice>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Signing in…</> : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/" className="text-wood hover:underline">← Back to website</Link>
      </p>
    </Shell>
  )
}

export default function AdminPage() {
  usePageTitle('Admin')
  const { session, loading, isAdmin } = useAdminSession()

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold">Admin not configured</h1>
        <Notice className="mt-4">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file,
          run the SQL migration, then restart the dev server. See the README for step-by-step instructions.
        </Notice>
        <Link to="/" className="btn-outline mt-6 w-full">Back to website</Link>
      </Shell>
    )
  }

  if (loading) return <div className="min-h-screen bg-cream-50"><Spinner /></div>
  if (!session) return <LoginForm />

  if (!isAdmin) {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <Notice type="error" className="mt-4">
          You are signed in as <strong>{session.user.email}</strong>, but this account does not have admin
          permission. If you were just granted access, sign out and sign in again.
        </Notice>
        <button type="button" onClick={() => void signOutAdmin()} className="btn-dark mt-6 w-full">
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
        </button>
      </Shell>
    )
  }

  return <AdminDashboard email={session.user.email ?? 'admin'} />
}
