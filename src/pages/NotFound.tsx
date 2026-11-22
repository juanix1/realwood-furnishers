import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="container-x py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-charcoal-600">The link may be broken or the page may have moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/shop" className="btn-outline">Browse the shop</Link>
      </div>
    </section>
  )
}
