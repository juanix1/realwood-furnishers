import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { Field, Notice } from './ui'
import { whatsappLink } from '../lib/config'
import { isSupabaseConfigured } from '../lib/supabase'
import { isHttpUrl, isValidEmail, isValidKenyanPhone, validateImageFile } from '../lib/utils'
import { submitCustomRequest } from '../services/enquiries'
import { uploadImage } from '../services/storage'
import type { RequestType } from '../types'

export type RequestVariant = 'custom' | 'repair'

const CONFIG = {
  custom: {
    requestType: 'custom_furniture' as RequestType,
    typeLabel: 'Furniture type',
    types: [
      'Sofa / Couch',
      'Sectional / L-shaped sofa',
      'Bed & headboard',
      'Dining table & chairs',
      'TV stand / entertainment unit',
      'Coffee / side table',
      'Wardrobe / storage',
      'Office desk / furniture',
      'Other',
    ],
    materialLabel: 'Preferred material',
    materials: [
      'Mahogany',
      'Mvule',
      'Meru oak',
      'Cypress',
      'Pine',
      'Plywood / MDF',
      'Wood & metal combination',
      'Not sure - please advise',
    ],
    dimensionsLabel: 'Preferred dimensions',
    dimensionsHint: 'e.g. 210 x 90 x 80 cm, or the space you need to fit',
    descriptionLabel: 'Design description',
    descriptionPlaceholder: 'Tell us about the style, features, number of seats, storage, finish…',
    submit: 'Request custom quotation',
    colourLabel: 'Preferred colour / finish',
  },
  repair: {
    requestType: 'upholstery_repair' as RequestType,
    typeLabel: 'Service needed',
    types: [
      'Sofa re-upholstery',
      'Sofa repair',
      'Seat replacement',
      'Furniture restoration',
      'Fabric replacement',
      'Other',
    ],
    materialLabel: 'Preferred fabric',
    materials: ['Velvet', 'Leather', 'Leatherette (faux leather)', 'Linen / cotton blend', 'Chenille', 'Not sure - please advise'],
    dimensionsLabel: 'Item size / number of seats',
    dimensionsHint: 'e.g. 3-seater sofa, 4 dining chairs',
    descriptionLabel: 'What needs fixing?',
    descriptionPlaceholder: 'Describe the item and the problem: sagging seats, torn fabric, broken frame…',
    submit: 'Request repair quotation',
    colourLabel: 'Preferred colour',
  },
}

interface Values {
  name: string
  phone: string
  email: string
  location: string
  furniture_type: string
  dimensions: string
  material: string
  colour: string
  description: string
  budget: string
  reference_url: string
  website: string // honeypot
}

const empty: Values = {
  name: '',
  phone: '',
  email: '',
  location: '',
  furniture_type: '',
  dimensions: '',
  material: '',
  colour: '',
  description: '',
  budget: '',
  reference_url: '',
  website: '',
}

type Errors = Partial<Record<keyof Values | 'file', string>>

export default function RequestForm({ variant }: { variant: RequestVariant }) {
  const cfg = CONFIG[variant]
  const [values, setValues] = useState<Values>(empty)
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [notConfigured, setNotConfigured] = useState(false)

  const set = (key: keyof Values) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = (): Errors => {
    const er: Errors = {}
    if (values.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!isValidKenyanPhone(values.phone)) er.phone = 'Enter a valid Kenyan number, e.g. 0712 345 678.'
    if (values.email.trim() && !isValidEmail(values.email)) er.email = 'Enter a valid email address.'
    if (!values.furniture_type) er.furniture_type = 'Please choose an option.'
    if (values.description.trim().length < 10) er.description = 'Please give us a little more detail (at least 10 characters).'
    if (values.budget.trim()) {
      const n = Number(values.budget)
      if (!Number.isFinite(n) || n <= 0) er.budget = 'Enter a budget in KES, numbers only.'
    }
    if (values.reference_url.trim() && !isHttpUrl(values.reference_url))
      er.reference_url = 'Enter a full link starting with http:// or https://'
    if (file) {
      const problem = validateImageFile(file)
      if (problem) er.file = problem
    }
    return er
  }

  const whatsappMessage = () =>
    [
      `Hello Realwood Furnishers, I'd like a quotation.`,
      `Type: ${cfg.requestType === 'custom_furniture' ? 'Custom furniture' : 'Upholstery / repair'}`,
      `${cfg.typeLabel}: ${values.furniture_type || '-'}`,
      values.dimensions && `Size: ${values.dimensions}`,
      values.material && `${cfg.materialLabel}: ${values.material}`,
      values.colour && `Colour: ${values.colour}`,
      values.budget && `Budget: KES ${values.budget}`,
      values.description && `Details: ${values.description}`,
      `Name: ${values.name || '-'}  Phone: ${values.phone || '-'}`,
    ]
      .filter(Boolean)
      .join('\n')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'submitting') return

    // Honeypot: bots fill hidden fields. Pretend success, send nothing.
    if (values.website) {
      setStatus('success')
      return
    }

    const er = validate()
    setErrors(er)
    if (Object.keys(er).length > 0) {
      setStatus('idle')
      const first = Object.keys(er)[0]
      document.getElementById(`rf-${variant}-${first}`)?.focus()
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    setNotConfigured(false)

    try {
      let referenceUrl = values.reference_url.trim() || null
      if (file) {
        if (!isSupabaseConfigured) {
          setNotConfigured(true)
          setErrorMsg('Photo uploads are not switched on yet. Please send your photos on WhatsApp.')
          setStatus('error')
          return
        }
        referenceUrl = await uploadImage('request-references', file, 'requests')
      }

      const result = await submitCustomRequest({
        request_type: cfg.requestType,
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || null,
        location: values.location.trim() || null,
        furniture_type: values.furniture_type,
        dimensions: values.dimensions.trim() || null,
        material: values.material || null,
        colour: values.colour.trim() || null,
        description: values.description.trim(),
        budget_kes: values.budget.trim() ? Number(values.budget) : null,
        reference_image_url: referenceUrl,
      })

      if (result.ok) {
        setStatus('success')
        setValues(empty)
        setFile(null)
      } else {
        setNotConfigured(Boolean(result.notConfigured))
        setErrorMsg(result.error)
        setStatus('error')
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'We could not send your request. Please try again or use WhatsApp.',
      )
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Request received</h3>
        <p className="mx-auto mt-2 max-w-md text-charcoal-600">
          Thank you. We will review the details and contact you shortly with a quotation.
        </p>
        <button type="button" className="btn-outline mt-6" onClick={() => setStatus('idle')}>
          Send another request
        </button>
      </div>
    )
  }

  const id = (k: string) => `rf-${variant}-${k}`
  const invalid = (k: keyof Errors) => (errors[k] ? true : undefined)

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-6 p-6 sm:p-8" aria-busy={status === 'submitting'}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor={id('name')} error={errors.name} required>
          <input id={id('name')} className="input" value={values.name} onChange={set('name')} autoComplete="name" aria-invalid={invalid('name')} />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor={id('phone')} error={errors.phone} required>
          <input id={id('phone')} className="input" type="tel" inputMode="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" placeholder="0712 345 678" aria-invalid={invalid('phone')} />
        </Field>
        <Field label="Email" htmlFor={id('email')} error={errors.email} hint="Optional">
          <input id={id('email')} className="input" type="email" value={values.email} onChange={set('email')} autoComplete="email" aria-invalid={invalid('email')} />
        </Field>
        <Field label="Your location" htmlFor={id('location')} hint="Estate / town, helps us plan delivery">
          <input id={id('location')} className="input" value={values.location} onChange={set('location')} autoComplete="address-level2" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={cfg.typeLabel} htmlFor={id('furniture_type')} error={errors.furniture_type} required>
          <select id={id('furniture_type')} className="input" value={values.furniture_type} onChange={set('furniture_type')} aria-invalid={invalid('furniture_type')}>
            <option value="">Select…</option>
            {cfg.types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label={cfg.dimensionsLabel} htmlFor={id('dimensions')} hint={cfg.dimensionsHint}>
          <input id={id('dimensions')} className="input" value={values.dimensions} onChange={set('dimensions')} />
        </Field>
        <Field label={cfg.materialLabel} htmlFor={id('material')}>
          <select id={id('material')} className="input" value={values.material} onChange={set('material')}>
            <option value="">Select…</option>
            {cfg.materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label={cfg.colourLabel} htmlFor={id('colour')}>
          <input id={id('colour')} className="input" value={values.colour} onChange={set('colour')} placeholder="e.g. walnut brown, charcoal grey" />
        </Field>
      </div>

      <Field label={cfg.descriptionLabel} htmlFor={id('description')} error={errors.description} required>
        <textarea id={id('description')} className="input min-h-32 resize-y" value={values.description} onChange={set('description')} placeholder={cfg.descriptionPlaceholder} aria-invalid={invalid('description')} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Budget (KES)" htmlFor={id('budget')} error={errors.budget} hint="Optional, helps us suggest the right materials">
          <input id={id('budget')} className="input" type="number" inputMode="numeric" min={0} value={values.budget} onChange={set('budget')} placeholder="e.g. 80000" aria-invalid={invalid('budget')} />
        </Field>
        <Field label="Reference image link" htmlFor={id('reference_url')} error={errors.reference_url} hint="Optional, paste a link to a photo you like">
          <input id={id('reference_url')} className="input" type="url" value={values.reference_url} onChange={set('reference_url')} placeholder="https://…" aria-invalid={invalid('reference_url')} />
        </Field>
      </div>

      <Field label="Or upload a reference photo" htmlFor={id('file')} error={errors.file} hint="JPG, PNG, WebP or AVIF, up to 5 MB">
        <input
          id={id('file')}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            setErrors((er) => ({ ...er, file: undefined }))
          }}
          className="block w-full cursor-pointer rounded-xl border border-dashed border-charcoal-400/40 bg-cream-50 p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-wood file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-wood-dark"
        />
      </Field>

      {/* Honeypot, hidden from people */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      {status === 'error' && (
        <Notice type="error">
          <p>{errorMsg}</p>
          {notConfigured && (
            <a href={whatsappLink(whatsappMessage())} target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 !py-2">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Send details on WhatsApp
            </a>
          )}
        </Notice>
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" /> {cfg.submit}
          </>
        )}
      </button>
    </form>
  )
}
