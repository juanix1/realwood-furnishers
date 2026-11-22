import { MessageCircle } from 'lucide-react'
import RequestForm from '../components/RequestForm'
import { PageHero, SectionHeading } from '../components/ui'
import { customProcess } from '../data/content'
import { usePageTitle } from '../hooks/usePageTitle'
import { whatsappLink } from '../lib/config'

const builds = [
  'Sofas, sectionals & couches',
  'Beds & upholstered headboards',
  'Dining tables & chairs',
  'TV stands & entertainment units',
  'Wardrobes & storage',
  'Office desks & seating',
  'Coffee, side & console tables',
  'Anything you can imagine',
]

export default function CustomFurniture() {
  usePageTitle('Custom Furniture')

  return (
    <>
      <PageHero
        eyebrow="Custom Furniture"
        title="Furniture designed around you"
        subtitle="Tell us what you need: the size, the style, the budget. We will craft a piece that fits your space and your life perfectly."
      >
        <a href="#quote" className="btn-gold">Request a quotation</a>
        <a
          href={whatsappLink('Hello Realwood Furnishers, I would like to discuss a custom furniture project.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline !border-white/30 !text-white hover:!border-gold hover:!text-gold"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
        </a>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="What we build" title="Made to your measurements" subtitle="If you can describe it or show us a photo, we can build it." />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {builds.map((b) => (
              <li key={b} className="card px-5 py-4 text-center text-sm font-medium text-charcoal-800">{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="From idea to finished piece" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {customProcess.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="font-display text-4xl font-semibold text-gold">{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="quote" className="section scroll-mt-24">
        <div className="container-x max-w-4xl">
          <SectionHeading eyebrow="Quotation" title="Request a custom quotation" subtitle="The more detail you share, the more accurate our quote. Fields marked * are required." />
          <div className="mt-10">
            <RequestForm variant="custom" />
          </div>
        </div>
      </section>
    </>
  )
}
