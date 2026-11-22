import type {
  MpesaStkPushRequest,
  MpesaStkPushResponse,
  PaymentProvider,
  PaymentStatusSnapshot,
} from '../types/payments'

/**
 * M-Pesa (Daraja) integration placeholder.
 *
 * This deliberately does NOT simulate a payment. Until a secure backend exists,
 * every method throws, and `isAvailable()` returns false so the UI never
 * offers a "Pay with M-Pesa" button that could mislead a customer.
 *
 * To go live later:
 *  1. Create a Supabase Edge Function `mpesa-stk-push` that holds the Daraja
 *     consumer key/secret and passkey as server-side secrets, requests an
 *     OAuth token, and calls the STK Push endpoint.
 *  2. Create a public callback Edge Function `mpesa-callback` that validates and
 *     stores Daraja's result in a new `payments` table (service role, server-side only).
 *  3. Replace `initiate` / `getStatus` below with calls to those functions via
 *     `supabase.functions.invoke(...)`, then flip `isAvailable()` to true.
 */
export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super('M-Pesa payments are not enabled yet. A secure server-side integration is required.')
    this.name = 'PaymentsNotConfiguredError'
  }
}

export const mpesaPaymentService: PaymentProvider = {
  id: 'mpesa',

  isAvailable() {
    return false
  },

  async initiate(_request: MpesaStkPushRequest): Promise<MpesaStkPushResponse> {
    throw new PaymentsNotConfiguredError()
  },

  async getStatus(_checkoutRequestId: string): Promise<PaymentStatusSnapshot> {
    throw new PaymentsNotConfiguredError()
  },
}

/** Normalises 07XX / 01XX / +254 numbers to the 2547XXXXXXXX format Daraja expects. */
export function toMpesaMsisdn(input: string): string | null {
  const cleaned = input.replace(/[\s-]/g, '')
  const m = cleaned.match(/^(?:\+?254|0)([17]\d{8})$/)
  return m ? `254${m[1]}` : null
}
