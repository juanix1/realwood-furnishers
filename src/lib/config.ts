const env = import.meta.env

const digits = (v: string | undefined, fallback: string) => (v || fallback).replace(/\D/g, '')

export const business = {
  name: 'Realwood Furnishers',
  slogan: 'Transforming Spaces, Enriching Lives.',
  location: 'Kahawa Wendani, Kiambu County, Kenya',
  area: 'Kahawa Wendani',
  county: 'Kiambu County',
  phone: env.VITE_PHONE_NUMBER || '+254700000000',
  whatsapp: digits(env.VITE_WHATSAPP_NUMBER, '254700000000'),
  email: env.VITE_CONTACT_EMAIL || '',
  hours: env.VITE_BUSINESS_HOURS || 'Mon - Sat: 8:00 AM - 6:00 PM',
  mapsQuery: 'Kahawa Wendani, Kiambu County, Kenya',
} as const

export const telLink = () => `tel:${business.phone.replace(/[^\d+]/g, '')}`

export const whatsappLink = (message: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  business.mapsQuery,
)}&output=embed`

export const mapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  business.mapsQuery,
)}`
