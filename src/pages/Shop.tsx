import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { ErrorState, Notice, PageHero, Spinner } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { cn } from '../lib/utils'
import { fetchCategories, usingFallbackData } from '../services/categories'
import { fetchProducts } from '../services/products'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export default function Shop() {
  usePageTitle('Shop Furniture')
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const min = params.get('min') ?? ''
  const max = params.get('max') ?? ''
  const sort = (params.get('sort') as Sort) || 'featured'

  const products = useAsync(() => fetchProducts(), [])
  const categories = useAsync(fetchCategories, [])

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const clearAll = () => setParams(new URLSearchParams(), { replace: true })
  const hasFilters = Boolean(q || category || min || max)

  const results = useMemo(() => {
    const list = products.data ?? []
    const term = q.trim().toLowerCase()
    const minN = min ? Number(min) : null
    const maxN = max ? Number(max) : null
    const filtered = list.filter((p) => {
      if (category && p.category?.slug !== category) return false
      if (minN !== null && Number.isFinite(minN) && p.price < minN) return false
      if (maxN !== null && Number.isFinite(maxN) && p.price > maxN) return false
      if (term) {
        const hay = `${p.name} ${p.description ?? ''} ${p.materials ?? ''} ${p.category?.name ?? ''}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
    const sorted = [...filtered]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'featured')
      sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
    // 'newest' keeps the server order (created_at desc)
    return sorted
  }, [products.data, q, category, min, max, sort])

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Furniture catalogue"
        subtitle="Browse handcrafted pieces in KES. Every item can be customised in size, fabric and finish. Just ask."
      />

      <section className="section !pt-10">
        <div className="container-x">
          {usingFallbackData && (
            <Notice className="mb-8">
              Showing a <strong>sample catalogue</strong>. Connect Supabase and add your real products from the admin
              dashboard to replace it.
            </Notice>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => update('q', e.target.value)}
                placeholder="Search sofas, beds, dining tables…"
                aria-label="Search products"
                className="input !pl-11"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value === 'featured' ? '' : e.target.value)}
              aria-label="Sort products"
              className="input md:w-56"
            >
              <option value="featured">Featured first</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <button type="button" onClick={() => setFiltersOpen((v) => !v)} className="btn-outline md:hidden" aria-expanded={filtersOpen}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className={cn('space-y-8', filtersOpen ? 'block' : 'hidden', 'lg:block')} aria-label="Filters">
              <div>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-charcoal-900">Category</h2>
                <ul className="mt-3 space-y-1">
                  <li>
                    <button type="button" onClick={() => update('category', '')} className={cn('w-full rounded-lg px-3 py-2 text-left text-sm', !category ? 'bg-wood text-white' : 'hover:bg-cream-200')}>
                      All furniture
                    </button>
                  </li>
                  {(categories.data ?? []).map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => update('category', c.slug)} className={cn('w-full rounded-lg px-3 py-2 text-left text-sm', category === c.slug ? 'bg-wood text-white' : 'hover:bg-cream-200')}>
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-charcoal-900">Price range (KES)</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input type="number" inputMode="numeric" min={0} value={min} onChange={(e) => update('min', e.target.value)} placeholder="Min" aria-label="Minimum price in KES" className="input" />
                  <input type="number" inputMode="numeric" min={0} value={max} onChange={(e) => update('max', e.target.value)} placeholder="Max" aria-label="Maximum price in KES" className="input" />
                </div>
              </div>

              {hasFilters && (
                <button type="button" onClick={clearAll} className="inline-flex items-center gap-1.5 text-sm font-medium text-wood hover:underline">
                  <X className="h-4 w-4" aria-hidden="true" /> Clear all filters
                </button>
              )}
            </aside>

            <div>
              {products.loading ? (
                <Spinner label="Loading products" />
              ) : products.error ? (
                <ErrorState message={products.error} onRetry={products.reload} />
              ) : results.length === 0 ? (
                <div className="card p-10 text-center">
                  <h3 className="text-xl font-semibold">No products match your filters</h3>
                  <p className="mt-2 text-charcoal-600">Try clearing a filter, or ask us to build exactly what you need.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={clearAll} className="btn-outline">Clear filters</button>
                    <Link to="/custom-furniture" className="btn-primary">Request custom furniture</Link>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-5 text-sm text-charcoal-500" aria-live="polite">
                    {results.length} {results.length === 1 ? 'product' : 'products'}
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {results.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
