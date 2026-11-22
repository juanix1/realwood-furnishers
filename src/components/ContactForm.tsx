import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { Field, Notice } from './ui'
import { whatsappLink } from '../lib/config'
import { isValidEmail, isValidKenyanPhone } from '../lib/utils'
import { submitContactEnquiry } from '../services/enquiries'

interface Values {
  name: string
  phone: string
  email: string
  subject: string
  message: string
  website: string // honeypot
}

type Errors = Partial<Record<keyof Values, string>>

export default function ContactForm({ productName }: { productName?: string }) {
  const initial: Values = {
    name: '',
    phone: '',
    email: '',
    subject: productName ? `Enquiry: ${productName}` : '',
    message: productName ? `Hello, I'd like to know more about the "${productName}".` : '',
    website: '',
  }
  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [notConfigured, setNotConfigured] = useState(false)

  const set = (key: keyof Values) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = (): Errors => {
    const er: Errors = {}
    if (values.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!isValidKenyanPhone(values.phone)) er.phone = 'Enter a valid Kenyan number, e.g. 0712 345 678.'
    if (values.email.trim() && !isValidEmail(values.email)) er.email = 'Enter a valid email address.'
    if (values.message.trim().length < 5) er.message = 'Please write a short message.'
    return er
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'submitting') return

    if (values.website) {
      setStatus('success')
      return
    }

    const er = validate()
    setErrors(er)
    if (Object.keys(er).length > 0) {
      const first = Object.keys(er)[0]
      document.getElementById(`cf-${first}`)?.focus()
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    setNotConfigured(false)

    try {
      const result = await submitContactEnquiry({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || null,
        subject: values.subject.trim() || null,
        message: values.message.trim(),
        product_name: productName ?? null,
      })
      if (result.ok) {
        setStatus('success')
        setValues({ ...initial, subject: '', message: '' })
      } else {
        setNotConfigured(Boolean(result.notConfigured))
        setErrorMsg(result.error)
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong while sending. Please try again or use WhatsApp.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Message sent</h3>
        <p className="mx-auto mt-2 max-w-md text-charcoal-600">
          Thank you for contacting Realwood Furnishers. We will get back to you shortly.
        </p>
        <button type="button" className="btn-outline mt-6" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  const waText = `Hello Realwood Furnishers, I'm ${values.name || 'a customer'}.${
    values.subject ? ` Subject: ${values.subject}.` : ''
  } ${values.message}`.trim()

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8" aria-busy={status === 'submitting'}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="cf-name" error={errors.name} required>
          <input id="cf-name" className="input" value={values.name} onChange={set('name')} autoComplete="name" aria-invalid={errors.name ? true : undefined} />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="cf-phone" error={errors.phone} required>
          <input id="cf-phone" className="input" type="tel" inputMode="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" placeholder="0712 345 678" aria-invalid={errors.phone ? true : undefined} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="cf-email" error={errors.email} hint="Optional">
          <input id="cf-email" className="input" type="email" value={values.email} onChange={set('email')} autoComplete="email" aria-invalid={errors.email ? true : undefined} />
        </Field>
        <Field label="Subject" htmlFor="cf-subject">
          <input id="cf-subject" className="input" value={values.subject} onChange={set('subject')} />
        </Field>
      </div>
      <Field label="Message" htmlFor="cf-message" error={errors.message} required>
        <textarea id="cf-message" className="input min-h-36 resize-y" value={values.message} onChange={set('message')} aria-invalid={errors.message ? true : undefined} />
      </Field>

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
            <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 !py-2">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Send on WhatsApp instead
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
            <Send className="h-4 w-4" aria-hidden="true" /> Send message
          </>
        )}
      </button>
    </form>
  )
}
