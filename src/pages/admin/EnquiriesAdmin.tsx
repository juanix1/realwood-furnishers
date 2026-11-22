import { useState } from 'react'
import { Mail, MessageCircle, Phone, Trash2 } from 'lucide-react'
import { ErrorState, Notice, Spinner } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { formatDate } from '../../lib/utils'
import { deleteEnquiry, fetchEnquiries, updateEnquiryStatus } from '../../services/enquiries'
import type { EnquiryStatus } from '../../types'

const STATUSES: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('254')) return d
  if (d.startsWith('0')) return `254${d.slice(1)}`
  return d
}

export default function EnquiriesAdmin() {
  const enquiries = useAsync(fetchEnquiries, [])
  const [msg, setMsg] = useState<string | null>(null)

  async function run(fn: () => Promise<void>) {
    setMsg(null)
    try {
      await fn()
      enquiries.reload()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Action failed.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Customer enquiries</h1>
      {msg && <Notice type="error" className="mt-4">{msg}</Notice>}

      {enquiries.loading ? (
        <Spinner />
      ) : enquiries.error ? (
        <ErrorState message={enquiries.error} onRetry={enquiries.reload} />
      ) : (enquiries.data ?? []).length === 0 ? (
        <div className="card mt-6 p-10 text-center text-charcoal-600">No enquiries yet.</div>
      ) : (
        <ul className="mt-6 space-y-4">
          {(enquiries.data ?? []).map((e) => (
            <li key={e.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{e.name}</p>
                  <p className="text-xs text-charcoal-500">{formatDate(e.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={e.status}
                    aria-label={`Status for enquiry from ${e.name}`}
                    onChange={(ev) => void run(() => updateEnquiryStatus(e.id, ev.target.value as EnquiryStatus))}
                    className="input !w-auto !py-2"
                  >
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button
                    type="button"
                    aria-label={`Delete enquiry from ${e.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => { if (window.confirm('Delete this enquiry?')) void run(() => deleteEnquiry(e.id)) }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {(e.subject || e.product_name) && (
                <p className="mt-3 text-sm font-medium text-wood">{e.subject ?? `Product: ${e.product_name}`}</p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-700">{e.message}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a className="btn-outline !px-4 !py-2" href={`tel:${e.phone.replace(/[^\d+]/g, '')}`}><Phone className="h-4 w-4" aria-hidden="true" /> {e.phone}</a>
                <a className="btn-outline !px-4 !py-2" href={`https://wa.me/${waNumber(e.phone)}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>
                {e.email && <a className="btn-outline !px-4 !py-2" href={`mailto:${e.email}`}><Mail className="h-4 w-4" aria-hidden="true" /> {e.email}</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
