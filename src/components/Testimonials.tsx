import { Quote } from 'lucide-react'
import { testimonials } from '../data/content'
import { SectionHeading } from './ui'

export default function Testimonials() {
  return (
    <section className="section bg-cream-100">
      <div className="container-x">
        <SectionHeading
          eyebrow="Customer Voices"
          title="What our customers say"
          subtitle="Homes, offices and hotels across Kenya trust Realwood for furniture that lasts."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="card relative p-7">
              <Quote className="h-8 w-8 text-gold" aria-hidden="true" />
              <blockquote className="mt-4 text-base leading-relaxed text-charcoal-700">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-charcoal-900">{t.name}</p>
                  <p className="text-sm text-charcoal-500">{t.place}</p>
                </div>
                {t.isSample && (
                  <span className="rounded-full border border-charcoal-400/40 px-2.5 py-1 text-[11px] font-medium text-charcoal-500">
                    Sample review
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
