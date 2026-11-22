import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import BeforeAfter from '../components/BeforeAfter'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import Testimonials from '../components/Testimonials'
import { ErrorState, SectionHeading, Spinner } from '../components/ui'
import { services, whyChoose } from '../data/content'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { business, telLink, whatsappLink } from '../lib/config'
import { fetchCategories } from '../services/categories'
import { fetchProducts } from '../services/products'

function HeroArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Illustration of a handcrafted sofa and lamp">
      <ellipse cx="200" cy="252" rx="170" ry="14" fill="#000" opacity="0.25" />
      <rect x="28" y="116" width="52" height="112" rx="24" fill="#6F451E" />
      <rect x="320" y="116" width="52" height="112" rx="24" fill="#6F451E" />
      <rect x="58" y="68" width="284" height="92" rx="30" fill="#A97442" />
      <rect x="46" y="128" width="308" height="92" rx="26" fill="#8B5A2B" />
      <rect x="76" y="140" width="112" height="56" rx="16" fill="#C08A55" />
      <rect x="212" y="140" width="112" height="56" rx="16" fill="#C08A55" />
      <rect x="66" y="220" width="14" height="30" rx="4" fill="#181715" />
      <rect x="320" y="220" width="14" height="30" rx="4" fill="#181715" />
      <circle cx="338" cy="52" r="6" fill="#D4AF37" />
      <path d="M338 58v34" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <path d="M318 40l20-26 20 26z" fill="#D4AF37" opacity="0.9" />
    </svg>
  )
}

export default function Home() {
  usePageTitle()
  const featured = useAsync(() => fetchProducts({ featuredOnly: true, limit: 8 }), [])
  const categories = useAsync(fetchCategories, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-900 text-white">
        <div className="absolute inset-0 opacity-[0.07] wood-grain" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="eyebrow text-gold">Kahawa Wendani · Kiambu County · Kenya</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              {business.slogan.replace('.', '')}
              <span className="text-gold">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-200">
              Handcrafted furniture, made-to-measure sofas, and expert upholstery and restoration, built with care
              for homes, offices and hotels across Kenya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-gold">
                Shop furniture <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/custom-furniture" className="btn-light">
                Request custom quote
              </Link>
              <a
                href={whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !border-white/30 !text-white hover:!border-gold hover:!text-gold"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg rounded-3xl border border-gold/30 bg-gradient-to-br from-charcoal-800 to-charcoal-900 p-6 shadow-2xl">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-cream-200 bg-cream-100">
        <div className="container-x grid grid-cols-2 gap-4 py-6 text-center text-sm font-medium text-charcoal-700 md:grid-cols-4">
          <p>Made to measure</p>
          <p>Quality hardwoods &amp; fabrics</p>
          <p>Repairs &amp; restoration</p>
          <p>Serving clients across Kenya</p>
        </div>
      </section>

      {/* Popular categories */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Popular Categories" title="Furniture for every room" subtitle="Browse our most-loved categories, or tell us what you have in mind and we will build it." />
          {categories.loading ? (
            <Spinner />
          ) : categories.error ? (
            <ErrorState message={categories.error} onRetry={categories.reload} />
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {(categories.data ?? []).slice(0, 8).map((c) => (
                <Link key={c.id} to={`/shop?category=${c.slug}`} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
                  <ProductImage src={c.image_url} alt={c.name} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105" />
                  <div className="p-4">
                    <h3 className="text-base font-semibold leading-snug sm:text-lg">{c.name}</h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-wood">
                      Browse <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured furniture */}
      <section className="section bg-cream-100">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow="Featured Furniture" title="Crafted pieces, ready to enquire" />
            <Link to="/shop" className="btn-outline">View all products</Link>
          </div>
          {featured.loading ? (
            <Spinner />
          ) : featured.error ? (
            <ErrorState message={featured.error} onRetry={featured.reload} />
          ) : (featured.data ?? []).length === 0 ? (
            <p className="mt-10 text-charcoal-600">Featured pieces will appear here soon. Browse the full shop in the meantime.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(featured.data ?? []).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="What We Do" title="Our services" subtitle="From a single repair to a full custom build, everything is handled in our workshop." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.title} to={s.to} className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cream-200 text-wood transition group-hover:bg-wood group-hover:text-white">
                  <s.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section bg-charcoal-900">
        <div className="container-x">
          <SectionHeading light eyebrow="Why Realwood" title="Furniture you can trust to last" subtitle="We combine honest materials, skilled hands and personal service." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-charcoal-800 p-6">
                <f.icon className="h-7 w-7 text-gold" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-200/80">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Restoration Showcase" title="Before &amp; after" subtitle="Drag the slider to see how worn furniture is transformed through re-upholstery and restoration." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <BeforeAfter title="Sofa re-upholstery" description="Worn fabric and sagging seats replaced with fresh upholstery and new foam." />
            <BeforeAfter title="Furniture restoration" description="Faded, scratched wood sanded back and re-finished to a rich, durable shine." />
          </div>
          <div className="mt-8 text-center">
            <Link to="/upholstery-repairs" className="btn-primary">
              See upholstery &amp; repairs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Contact */}
      <section className="section">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl bg-charcoal-900 text-white">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="eyebrow text-gold">Let&apos;s talk</p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Ready to transform your space?</h2>
                <p className="mt-4 text-cream-200">Call, WhatsApp or request a quotation. Tell us what you need and we will take it from there.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={telLink()} className="btn-gold"><Phone className="h-4 w-4" aria-hidden="true" /> Call us</a>
                  <a href={whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.')} target="_blank" rel="noopener noreferrer" className="btn-light">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                  <Link to="/contact" className="btn-outline !border-white/30 !text-white hover:!border-gold hover:!text-gold">Contact page</Link>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-cream-200">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />{business.location}</li>
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />{business.phone}</li>
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />{business.hours}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
