import { useState } from 'react'
import { Sofa } from 'lucide-react'
import { cn } from '../lib/utils'

interface Props {
  title: string
  description?: string
  beforeSrc?: string
  afterSrc?: string
}

function Pane({ src, variant }: { src?: string; variant: 'before' | 'after' }) {
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={variant === 'before' ? 'Before restoration' : 'After restoration'}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
        draggable={false}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2',
        variant === 'before'
          ? 'bg-gradient-to-br from-stone-400 to-stone-500 text-stone-100'
          : 'bg-gradient-to-br from-wood-light to-wood-dark text-cream-50',
      )}
    >
      <Sofa className="h-14 w-14 opacity-80" strokeWidth={1.25} aria-hidden="true" />
      <span className="text-xs opacity-80">
        {variant === 'before' ? 'Add your “before” photo' : 'Add your “after” photo'}
      </span>
    </div>
  )
}

/**
 * Drag-to-compare slider. Pass `beforeSrc` / `afterSrc` (e.g. from /public/showcase/...)
 * to show real project photos; otherwise a placeholder is shown.
 */
export default function BeforeAfter({ title, description, beforeSrc, afterSrc }: Props) {
  const [pos, setPos] = useState(50)

  return (
    <figure className="card overflow-hidden">
      <div className="relative aspect-[4/3] select-none overflow-hidden bg-cream-200">
        <div className="absolute inset-0">
          <Pane src={afterSrc} variant="after" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Pane src={beforeSrc} variant="before" />
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-charcoal-900/80 px-3 py-1 text-xs font-semibold text-white">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-charcoal-900">
          After
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-charcoal-900 shadow-lg">
            ⇆
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare before and after: ${title}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-charcoal-600">{description}</p>}
      </figcaption>
    </figure>
  )
}
