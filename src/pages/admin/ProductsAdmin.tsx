import { useState } from 'react'
import { Pencil, Plus, Star, Trash2 } from 'lucide-react'
import ProductImage from '../../components/ProductImage'
import { ErrorState, Notice, Spinner } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { cn, formatKES } from '../../lib/utils'
import { fetchCategories } from '../../services/categories'
import { deleteProduct, fetchAdminProducts, updateProduct } from '../../services/products'
import type { Product } from '../../types'
import ProductForm from './ProductForm'

export default function ProductsAdmin() {
  const products = useAsync(fetchAdminProducts, [])
  const categories = useAsync(fetchCategories, [])
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function run(id: string, fn: () => Promise<void>, okText: string) {
    setBusyId(id)
    setMsg(null)
    try {
      await fn()
      setMsg({ type: 'success', text: okText })
      products.reload()
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Action failed.' })
    } finally {
      setBusyId(null)
    }
  }

  if (editing) {
    return (
      <ProductForm
        product={editing === 'new' ? null : editing}
        categories={categories.data ?? []}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          setMsg({ type: 'success', text: 'Product saved.' })
          products.reload()
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button type="button" className="btn-primary" onClick={() => setEditing('new')}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add product
        </button>
      </div>

      {msg && <Notice type={msg.type} className="mt-4">{msg.text}</Notice>}

      {products.loading ? (
        <Spinner label="Loading products" />
      ) : products.error ? (
        <ErrorState message={products.error} onRetry={products.reload} />
      ) : (products.data ?? []).length === 0 ? (
        <div className="card mt-6 p-10 text-center text-charcoal-600">
          No products yet. Click <strong>Add product</strong> to create your first one.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {(products.data ?? []).map((p) => (
            <li key={p.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <ProductImage src={p.images[0]} alt={p.name} className="h-20 w-28 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-charcoal-500">
                  {p.category?.name ?? 'Uncategorised'} · /shop/{p.slug}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className={cn('rounded-full px-2.5 py-1 font-medium', p.is_active ? 'bg-green-100 text-green-800' : 'bg-charcoal-400/20 text-charcoal-600')}>
                    {p.is_active ? 'Visible' : 'Hidden'}
                  </span>
                  {!p.in_stock && <span className="rounded-full bg-gold/20 px-2.5 py-1 font-medium">Made to order</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs text-charcoal-500">
                  <span className="sr-only">Price in KES for {p.name}</span>
                  <input
                    key={`${p.id}-${p.price}`}
                    type="number"
                    min={0}
                    defaultValue={p.price}
                    disabled={busyId === p.id}
                    aria-label={`Price in KES for ${p.name}`}
                    className="input !w-32 !py-2"
                    onBlur={(e) => {
                      const next = Number(e.target.value)
                      if (!Number.isFinite(next) || next < 0) {
                        e.target.value = String(p.price)
                        return
                      }
                      if (next !== p.price)
                        void run(p.id, () => updateProduct(p.id, { price: next }), `Price updated to ${formatKES(next)}.`)
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={busyId === p.id}
                  onClick={() => void run(p.id, () => updateProduct(p.id, { is_featured: !p.is_featured }), p.is_featured ? 'Removed from featured.' : 'Marked as featured.')}
                  aria-pressed={p.is_featured}
                  aria-label={p.is_featured ? `Unfeature ${p.name}` : `Feature ${p.name}`}
                  className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full border transition', p.is_featured ? 'border-gold bg-gold text-charcoal-900' : 'border-charcoal-400/40 text-charcoal-500 hover:border-gold')}
                >
                  <Star className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className="btn-outline !px-4 !py-2" onClick={() => setEditing(p)}>
                  <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                </button>
                <button
                  type="button"
                  disabled={busyId === p.id}
                  aria-label={`Delete ${p.name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`))
                      void run(p.id, () => deleteProduct(p.id), 'Product deleted.')
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
