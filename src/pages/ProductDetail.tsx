import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, MessageCircle, Phone, Ruler, Mail } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { ErrorState, Spinner } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { telLink, whatsappLink } from '../lib/config'
import { cn, formatKES } from '../lib/utils'
import { fetchProductBySlug, fetchProducts } from '../services/products'

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const product = useAsync(() => fetchProductBySlug(slug), [slug])
  const related = useAsync(async () => {
    const p = product.data
    if (!p?.category) return []
    const list = await fetchProducts({ categorySlug: p.category.slug })
    return list.filter((x) => x.id !== p.id).slice(0, 4)
  }, [product.data?.id])

  const [active, setActive] = useState(0)
  useEffect(() => setActive(0), [slug])

  const p = product.data
  usePageTitle(p?.name ?? 'Product')

  if (product.loading) return <Spinner label="Loading product" />
  if (product.error) return <ErrorState message={product.error} onRetry={product.reload} />
  if (!p) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl font-semibold">Product not found</h1>
        <p className="mt-3 text-charcoal-600">This item may have been removed or the link is incorrect.</p>
        <Link to="/shop" className="btn-primary mt-6">Back to shop</Link>
      </div>
    )
  }

  const message = `Hello Realwood Furnishers, I'm interested in the "${p.name}" (${formatKES(p.price)}). ${
    typeof window !== 'undefined' ? window.location.href : ''
  }`
  const specs = Object.entries(p.specifications)

  return (
    <>
      <div className="border-b border-cream-200 bg-cream-100">
        <nav className="container-x flex flex-wrap items-center gap-1 py-3 text-sm text-charcoal-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-wood">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link to="/shop" className="hover:text-wood">Shop</Link>
          {p.category && (
            <>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <Link to={`/shop?category=${p.category.slug}`} className="hover:text-wood">{p.category.name}</Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-charcoal-800">{p.name}</span>
        </nav>
      </div>

      <section className="section !pb-12 !pt-10">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="card overflow-hidden">
              <ProductImage src={p.images[active]} alt={p.name} className="aspect-[4/3] w-full" />
            </div>
            {p.images.length > 1 && (
              <ul className="mt-4 grid grid-cols-5 gap-3">
                {p.images.map((img, i) => (
                  <li key={img + i}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show image ${i + 1} of ${p.images.length}`}
                      aria-current={i === active}
                      className={cn('block w-full overflow-hidden rounded-xl border-2', i === active ? 'border-wood' : 'border-transparent')}
                    >
                      <ProductImage src={img} alt="" className="aspect-square w-full" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Info */}
          <div>
            {p.category && <p className="eyebrow">{p.category.name}</p>}
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{p.name}</h1>
            <p className="mt-4 text-3xl font-semibold text-wood">{formatKES(p.price)}</p>
            <p className="mt-1 text-sm text-charcoal-500">
              {p.in_stock ? 'Available. Customisable in size and fabric.' : 'Made to order. Contact us for the lead time.'}
            </p>

            {p.description && <p className="mt-6 leading-relaxed text-charcoal-700">{p.description}</p>}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Enquire on WhatsApp
              </a>
              <a href={telLink()} className="btn-outline"><Phone className="h-4 w-4" aria-hidden="true" /> Call</a>
              <Link to={`/contact?product=${encodeURIComponent(p.name)}`} className="btn-outline">
                <Mail className="h-4 w-4" aria-hidden="true" /> Send enquiry
              </Link>
            </div>

            <div className="card mt-8 divide-y divide-cream-200">
              <h2 className="px-5 py-4 font-sans text-sm font-semibold uppercase tracking-wider">Specifications</h2>
              {p.dimensions && (
                <div className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                  <span className="flex items-center gap-2 text-charcoal-500"><Ruler className="h-4 w-4" aria-hidden="true" /> Dimensions</span>
                  <span className="text-right font-medium">{p.dimensions}</span>
                </div>
              )}
              {p.materials && (
                <div className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                  <span className="text-charcoal-500">Materials</span>
                  <span className="text-right font-medium">{p.materials}</span>
                </div>
              )}
              {specs.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                  <span className="text-charcoal-500">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
              {!p.dimensions && !p.materials && specs.length === 0 && (
                <p className="px-5 py-3 text-sm text-charcoal-500">Contact us for full specifications.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {(related.data ?? []).length > 0 && (
        <section className="section bg-cream-100 !py-14">
          <div className="container-x">
            <h2 className="text-2xl font-semibold">You may also like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(related.data ?? []).map((r) => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
