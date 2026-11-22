import { useSearchParams } from 'react-router-dom'
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import { PageHero } from '../components/ui'
import { usePageTitle } from '../hooks/usePageTitle'
import { business, mapsEmbedUrl, mapsOpenUrl, telLink, whatsappLink } from '../lib/config'

export default function Contact() {
  usePageTitle('Contact Us')
  const [params] = useSearchParams()
  const product = params.get('product')?.slice(0, 160) || undefined

  const cards = [
    { icon: Phone, title: 'Call us', text: business.phone, href: telLink(), external: false },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      text: 'Chat with us',
      href: whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.'),
      external: true,
    },
    { icon: MapPin, title: 'Visit us', text: business.location, href: mapsOpenUrl, external: true },
    ...(business.email
      ? [{ icon: Mail, title: 'Email', text: business.email, href: `mailto:${business.email}`, external: false }]
      : []),
  ]

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's talk about your furniture"
        subtitle="Call, WhatsApp, visit our workshop, or send a message and we will get back to you."
      />

      <section className="section !pb-10">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <a
                key={c.title}
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-wood">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-charcoal-900">{c.title}</span>
                  <span className="mt-0.5 block break-words text-sm text-charcoal-600">{c.text}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-charcoal-600">
            <Clock className="h-4 w-4 text-wood" aria-hidden="true" /> {business.hours}
          </p>
        </div>
      </section>

      <section className="section !pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-2xl font-semibold">Send us a message</h2>
            <ContactForm productName={product} />
          </div>
          <div>
            <h2 className="mb-5 text-2xl font-semibold">Find us</h2>
            <div className="card overflow-hidden">
              <iframe
                title="Realwood Furnishers location on Google Maps"
                src={mapsEmbedUrl}
                className="h-80 w-full border-0 sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a href={mapsOpenUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4">
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open in Google Maps
            </a>
            <p className="mt-3 text-sm text-charcoal-500">
              Planning a visit? Call or WhatsApp first so we can confirm the exact location and that we are in.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
