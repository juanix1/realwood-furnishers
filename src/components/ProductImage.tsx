import { useEffect, useState } from 'react'
import { Armchair } from 'lucide-react'
import { cn } from '../lib/utils'

interface Props {
  src?: string | null
  alt: string
  className?: string
}

/** Shows the image, or a tasteful wood-grain placeholder if none/failed to load. */
export default function ProductImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div
        className={cn('wood-grain flex items-center justify-center text-wood/50', className)}
        role="img"
        aria-label={alt}
      >
        <Armchair className="h-1/4 w-1/4 min-h-8 min-w-8" strokeWidth={1.25} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  )
}
