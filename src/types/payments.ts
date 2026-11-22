/**
 * Payment-readiness types for a future M-Pesa (Safaricom Daraja) integration.
 *
 * IMPORTANT: Nothing in this project moves real money or simulates a payment.
 * Daraja credentials (consumer key/secret, passkey) must NEVER live in the
 * browser. The intended design is:
 *
 *   Browser  →  Supabase Edge Function (holds Daraja secrets)  →  Daraja API
 *                         ↑
 *   Daraja callback  →  Edge Function  →  `payments` table (to be added)
 *
 * See `src/services/payments.ts` for the placeholder service.
 */

export type PaymentProviderId = 'mpesa'

export type PaymentStatus =
  | 'pending'
  | 'awaiting_customer'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'timeout'

/** What the browser will eventually send to our own backend (never to Daraja directly). */
export interface MpesaStkPushRequest {
  /** Customer's Safaricom number in 2547XXXXXXXX format */
  phoneNumber: string
  /** Whole KES amount */
  amountKes: number
  /** Our own reference, e.g. an order or deposit id (max 12 chars for Daraja AccountReference) */
  accountReference: string
  /** Short description shown on the customer's phone (max 13 chars on Daraja) */
  transactionDesc: string
}

/** What our backend will eventually return after initiating the STK push. */
export interface MpesaStkPushResponse {
  merchantRequestId: string
  checkoutRequestId: string
  customerMessage: string
}

/** Normalised result of the Daraja callback, as stored by our backend. */
export interface MpesaCallbackResult {
  checkoutRequestId: string
  resultCode: number
  resultDesc: string
  mpesaReceiptNumber?: string
  amountKes?: number
  phoneNumber?: string
  transactionDate?: string
}

export interface PaymentStatusSnapshot {
  checkoutRequestId: string
  status: PaymentStatus
  receipt?: string
  updatedAt: string
}

export interface PaymentProvider {
  id: PaymentProviderId
  isAvailable(): boolean
  initiate(request: MpesaStkPushRequest): Promise<MpesaStkPushResponse>
  getStatus(checkoutRequestId: string): Promise<PaymentStatusSnapshot>
}
