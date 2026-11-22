import { useState } from 'react'
import { ExternalLink, MessageCircle, Phone, Trash2 } from 'lucide-react'
import { ErrorState, Notice, Spinner } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { cn, formatDate, formatKES } from '../../lib/utils'
import { deleteRequest, fetchRequests, updateRequestStatus } from '../../services/enquiries'
import type { RequestStatus } from '../../types'

const STATUSES: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
]

const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('254')) return d
  if (d.startsWith('0')) return `254${d.slice(1)}`
  return d
}

export default function RequestsAdmin() {
  const requests = useAsync(fetchRequests, [])
  const [filter, setFilter] = useState<'all' | 'custom_furniture' | 'upholstery_repair'>('all')
  const [msg, setMsg] = useState<string | null>(null)

  async function run(fn: () => Promise<void>) {
    setMsg(null)
    try {
      await fn()
      requests.reload()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Action failed.')
    }
  }

  const list = (requests.data ?? []).filter((r) => filter === 'all' || r.request_type === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Quote requests</h1>
        <div className="flex gap-1 rounded-full bg-white p-1 text-sm shadow-sm" role="group" aria-label="Filter by type">
          {([['all', 'All'], ['custom_furniture', 'Custom furniture'], ['upholstery_repair', 'Upholstery & repairs']] as const).map(([v, l]) => (
            <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v} className={cn('rounded-full px-4 py-1.5 font-medium', filter === v ? 'bg-charcoal-900 text-white' : 'text-charcoal-600')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {msg && <Notice type="error" className="mt-4">{msg}</Notice>}

      {requests.loading ? (
        <Spinner />
      ) : requests.error ? (
        <ErrorState message={requests.error} onRetry={requests.reload} />
      ) : list.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-charcoal-600">No requests yet.</div>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((r) => (
            <li key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {formatDate(r.created_at)} · {r.request_type === 'custom_furniture' ? 'Custom furniture' : 'Upholstery / repair'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={r.status}
                    aria-label={`Status for request from ${r.name}`}
                    onChange={(ev) => void run(() => updateRequestStatus(r.id, ev.target.value as RequestStatus))}
                    className="input !w-auto !py-2"
                  >
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button
                    type="button"
                    aria-label={`Delete request from ${r.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => { if (window.confirm('Delete this request?')) void run(() => deleteRequest(r.id)) }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {([
                  ['Item / service', r.furniture_type],
                  ['Dimensions', r.dimensions],
                  ['Material / fabric', r.material],
                  ['Colour', r.colour],
                  ['Budget', r.budget_kes !== null ? formatKES(r.budget_kes) : null],
                  ['Location', r.location],
                ] as const).map(([k, v]) =>
                  v ? (
                    <div key={k}>
                      <dt className="text-xs text-charcoal-500">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ) : null,
                )}
              </dl>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-700">{r.description}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a className="btn-outline !px-4 !py-2" href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}><Phone className="h-4 w-4" aria-hidden="true" /> {r.phone}</a>
                <a className="btn-outline !px-4 !py-2" href={`https://wa.me/${waNumber(r.phone)}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>
                {r.reference_image_url && (
                  <a className="btn-outline !px-4 !py-2" href={r.reference_image_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" aria-hidden="true" /> Reference image</a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
