import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { business, telLink, whatsappLink } from '../../lib/config'
import { navLinks } from '../../data/content'
import { cn } from '../../lib/utils'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-full px-3.5 py-2 text-sm font-medium transition',
      isActive ? 'bg-cream-200 text-wood-dark' : 'text-charcoal-700 hover:text-wood',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
      <div className="hidden bg-charcoal-900 text-xs text-cream-200 md:block">
        <div className="container-x flex items-center justify-between py-2">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {business.location}
          </span>
          <a href={telLink()} className="inline-flex items-center gap-1.5 hover:text-gold">
            <Phone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {business.phone}
          </a>
        </div>
      </div>

      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex flex-col leading-none" aria-label="Realwood Furnishers home">
          <span className="font-display text-xl font-bold tracking-tight text-charcoal-900 sm:text-2xl">
            Real<span className="text-wood">wood</span>
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-charcoal-500">
            Furnishers
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-900/15 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-cream-200 bg-cream-50 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="container-x flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-3 text-base font-medium',
                    isActive ? 'bg-cream-200 text-wood-dark' : 'text-charcoal-800',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
