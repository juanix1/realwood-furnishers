import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageHero, SectionHeading } from '../components/ui'
import { clientele, values } from '../data/content'
import { usePageTitle } from '../hooks/usePageTitle'
import { business } from '../lib/config'

export default function About() {
  usePageTitle('About Us')

  return (
    <>
      <PageHero
        eyebrow="About Realwood"
        title="Furniture made with care, in Kahawa Wendani"
        subtitle={business.slogan}
      />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading align="left" eyebrow="Our Story" title="Where craft meets everyday living" />
            <div className="mt-6 space-y-4 leading-relaxed text-charcoal-700">
              <p>
                Realwood Furnishers is a furniture workshop based in {business.location}. We design and build
                furniture for the way Kenyans actually live: sofas that host the whole family, beds that
                last, dining tables that carry every celebration.
              </p>
              <p>
                We believe good furniture should be well made, honestly priced, and fixable. That is why, alongside
                building new pieces, we repair, re-upholster and restore furniture so that what you already own can
                keep serving you.
              </p>
              <p>
                Every project, big or small, is handled with the same attention to measurement, materials and
                finishing, and with a straight conversation about what will work best for your space and budget.
              </p>
            </div>
          </div>
          <div className="wood-grain flex aspect-[4/3] items-center justify-center rounded-3xl border border-cream-200 p-8 text-center">
            <p className="font-display text-2xl font-semibold leading-snug text-wood-dark sm:text-3xl">
              “Transforming Spaces,
              <br />
              Enriching Lives.”
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-x">
          <SectionHeading eyebrow="Our Values" title="What guides our work" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="card p-7">
                <h3 className="text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-charcoal-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Craftsmanship" title="Built by hand, finished with pride" />
            <p className="mt-6 leading-relaxed text-charcoal-700">
              From selecting seasoned hardwood and cutting joints, to stitching upholstery and applying the final
              finish, our work is done by hand in our workshop. We use quality foam, durable fabrics and strong
              framing so your furniture looks good and stays good.
            </p>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Who We Serve" title="Clients across Kenya" />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {clientele.map((c) => (
                <li key={c} className="flex items-center gap-3 text-charcoal-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-wood">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-x">
          <div className="rounded-3xl bg-charcoal-900 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-semibold text-white">Let&apos;s build something for your space</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/custom-furniture" className="btn-gold">Request custom quote</Link>
              <Link to="/contact" className="btn-light">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
