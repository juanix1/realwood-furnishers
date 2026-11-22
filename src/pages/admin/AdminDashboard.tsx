import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, FolderTree, Inbox, LogOut, Package, Wrench } from 'lucide-react'
import { signOutAdmin } from '../../services/auth'
import { cn } from '../../lib/utils'
import ProductsAdmin from './ProductsAdmin'
import CategoriesAdmin from './CategoriesAdmin'
import EnquiriesAdmin from './EnquiriesAdmin'
import RequestsAdmin from './RequestsAdmin'

const TABS = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'enquiries', label: 'Enquiries', icon: Inbox },
  { id: 'requests', label: 'Quote requests', icon: Wrench },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminDashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabId>('products')

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-charcoal-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-xl font-bold">
              Real<span className="text-gold">wood</span> <span className="text-sm font-sans font-medium text-cream-200/70">Admin</span>
            </p>
            <p className="text-xs text-cream-200/70">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-light !px-4 !py-2">
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> View site
            </Link>
            <button type="button" onClick={() => void signOutAdmin()} className="btn-gold !px-4 !py-2">
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-medium transition',
                tab === t.id ? 'bg-cream-100 text-charcoal-900' : 'text-cream-200 hover:text-white',
              )}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === 'products' && <ProductsAdmin />}
        {tab === 'categories' && <CategoriesAdmin />}
        {tab === 'enquiries' && <EnquiriesAdmin />}
        {tab === 'requests' && <RequestsAdmin />}
      </main>
    </div>
  )
}
