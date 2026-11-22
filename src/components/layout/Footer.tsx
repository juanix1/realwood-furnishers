import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { business, mapsOpenUrl, telLink, whatsappLink } from '../../lib/config'
import { navLinks } from '../../data/content'

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-200">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-white">
            Real<span className="text-gold">wood</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cream-200/70">
            Furnishers
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream-200/80">{business.slogan}</p>
          <p className="mt-3 text-sm text-cream-200/70">
            Custom furniture, sofas, upholstery and restoration, made in {business.area}.
          </p>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-gold">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-cream-200/80 hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-gold">Services</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream-200/80">
            <li>Custom furniture manufacturing</li>
            <li>Sofa manufacturing</li>
            <li>Sofa repairs &amp; restoration</li>
            <li>Upholstery &amp; re-upholstery</li>
            <li>Beds, dining tables &amp; TV stands</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-gold">Visit &amp; contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <a href={mapsOpenUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                {business.location}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <a href={telLink()} className="hover:text-gold">
                {business.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <a
                href={whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                Chat on WhatsApp
              </a>
            </li>
            {business.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`mailto:${business.email}`} className="hover:text-gold">
                  {business.email}
                </a>
              </li>
            )}
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{business.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream-200/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <Link to="/admin" className="hover:text-gold">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  )
}
