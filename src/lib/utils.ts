export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const formatKES = (amount: number) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount)

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

/** Accepts 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX (spaces/dashes ignored). */
export const isValidKenyanPhone = (v: string) =>
  /^(?:\+?254|0)[17]\d{8}$/.test(v.replace(/[\s-]/g, ''))

export const isHttpUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v.trim())

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Please choose a JPG, PNG, WebP or AVIF image.'
  if (file.size > MAX_IMAGE_BYTES) return 'Image is too large. Maximum size is 5 MB.'
  return null
}

export function parseSpecs(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  text.split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key && value) out[key] = value
  })
  return out
}

export const specsToText = (specs: Record<string, string>) =>
  Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
