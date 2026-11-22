import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import ProductImage from './ProductImage'
import { whatsappLink } from '../lib/config'
import { formatKES } from '../lib/utils'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const message = `Hello Realwood Furnishers, I'm interested in the "${product.name}" (${formatKES(
    product.price,
  )}). Is it available?`

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link to={`/shop/${product.slug}`} className="relative block overflow-hidden" aria-label={product.name}>
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105"
        />
        {product.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-charcoal-900">
            Featured
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-charcoal-900 px-3 py-1 text-xs font-semibold text-white">
            Made to order
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.category && <p className="eyebrow">{product.category.name}</p>}
        <h3 className="mt-1 text-lg font-semibold leading-snug">
          <Link to={`/shop/${product.slug}`} className="hover:text-wood">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-lg font-semibold text-wood">{formatKES(product.price)}</p>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link to={`/shop/${product.slug}`} className="btn-outline flex-1 !px-4 !py-2.5">
            View details
          </Link>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-3.5 !py-2.5"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}
