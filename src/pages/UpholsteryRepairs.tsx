import { MessageCircle } from 'lucide-react'
import BeforeAfter from '../components/BeforeAfter'
import RequestForm from '../components/RequestForm'
import { PageHero, SectionHeading } from '../components/ui'
import { repairProcess, repairServices } from '../data/content'
import { usePageTitle } from '../hooks/usePageTitle'
import { whatsappLink } from '../lib/config'

export default function UpholsteryRepairs() {
  usePageTitle('Upholstery & Repairs')

  return (
    <>
      <PageHero
        eyebrow="Upholstery & Repairs"
        title="Give your furniture a second life"
        subtitle="Sofa re-upholstery, repairs, seat replacement, furniture restoration and fabric replacement. Often at a fraction of the cost of buying new."
      >
        <a href="#repair-quote" className="btn-gold">Request a quotation</a>
        <a
          href={whatsappLink('Hello Realwood Furnishers, I would like a quotation for a repair / re-upholstery. I will send photos.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline !border-white/30 !text-white hover:!border-gold hover:!text-gold"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send photos on WhatsApp
        </a>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Our Repair Services" title="Restore, re-cover, renew" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repairServices.map((s) => (
              <div key={s.title} className="card p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cream-200 text-wood">
                  <s.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-x">
          <SectionHeading eyebrow="Transformations" title="Before & after" subtitle="Drag the slider across each project to compare." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BeforeAfter title="Sofa re-upholstery" description="Tired fabric and flat cushions replaced with new upholstery and foam." />
            <BeforeAfter title="Seat replacement" description="Worn dining and office chair seats rebuilt with fresh padding and covers." />
            <BeforeAfter title="Wood restoration" description="Scratched, faded wood sanded and re-finished to a deep, protective shine." />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="Simple, transparent process" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {repairProcess.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="font-display text-4xl font-semibold text-gold">{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="repair-quote" className="section scroll-mt-24 bg-cream-100">
        <div className="container-x max-w-4xl">
          <SectionHeading eyebrow="Quotation" title="Request a repair or upholstery quotation" subtitle="Upload a photo or share a link so we can quote accurately. Fields marked * are required." />
          <div className="mt-10">
            <RequestForm variant="repair" />
          </div>
        </div>
      </section>
    </>
  )
}
