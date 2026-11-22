import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-charcoal-500" role="status">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}…</span>
    </div>
  )
}

export function Notice({
  type = 'info',
  children,
  className,
}: {
  type?: 'info' | 'success' | 'error'
  children: ReactNode
  className?: string
}) {
  const styles = {
    info: 'border-gold/40 bg-gold/10 text-charcoal-800',
    success: 'border-green-600/30 bg-green-50 text-green-900',
    error: 'border-red-600/30 bg-red-50 text-red-900',
  }[type]
  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-sm', styles, className)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <Notice type="error" className="text-left">
        {message}
      </Notice>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-4">
          Try again
        </button>
      )}
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="text-wood"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-charcoal-500">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  light?: boolean
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      {eyebrow && <p className={cn('eyebrow', light && 'text-gold')}>{eyebrow}</p>}
      <h2
        className={cn(
          'mt-2 text-3xl font-semibold leading-tight sm:text-4xl',
          light && 'text-white',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-base leading-relaxed', light ? 'text-cream-200' : 'text-charcoal-600')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <section className="bg-charcoal-900 py-16 text-white sm:py-20">
      <div className="container-x">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
          <h1 className="mt-2 text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 text-lg leading-relaxed text-cream-200">{subtitle}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  )
}
