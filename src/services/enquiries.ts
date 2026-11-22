import { isSupabaseConfigured, requireSupabase, supabase } from '../lib/supabase'
import type {
  ContactEnquiry,
  ContactEnquiryInput,
  CustomRequest,
  CustomRequestInput,
  EnquiryStatus,
  RequestStatus,
  SubmitResult,
} from '../types'

const NOT_CONFIGURED: SubmitResult = {
  ok: false,
  notConfigured: true,
  error:
    'Online submissions are not switched on yet. Please send your details on WhatsApp or call us instead.',
}

const GENERIC_ERROR =
  'We could not send your message right now. Please check your connection and try again, or reach us on WhatsApp.'

/* ───────────── Public submissions (anon insert; RLS validates) ───────────── */

export async function submitContactEnquiry(input: ContactEnquiryInput): Promise<SubmitResult> {
  if (!isSupabaseConfigured || !supabase) return NOT_CONFIGURED
  const { error } = await supabase.from('contact_enquiries').insert(input)
  if (error) {
    console.error('[contact_enquiries]', error.message)
    return { ok: false, error: GENERIC_ERROR }
  }
  return { ok: true }
}

export async function submitCustomRequest(input: CustomRequestInput): Promise<SubmitResult> {
  if (!isSupabaseConfigured || !supabase) return NOT_CONFIGURED
  const { error } = await supabase.from('custom_furniture_requests').insert(input)
  if (error) {
    console.error('[custom_furniture_requests]', error.message)
    return { ok: false, error: GENERIC_ERROR }
  }
  return { ok: true }
}

/* ───────────── Admin (requires admin session) ───────────── */

export async function fetchEnquiries(): Promise<ContactEnquiry[]> {
  const { data, error } = await requireSupabase()
    .from('contact_enquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as ContactEnquiry[]
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const { error } = await requireSupabase().from('contact_enquiries').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteEnquiry(id: string): Promise<void> {
  const { error } = await requireSupabase().from('contact_enquiries').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchRequests(): Promise<CustomRequest[]> {
  const { data, error } = await requireSupabase()
    .from('custom_furniture_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    ...(r as CustomRequest),
    budget_kes: r.budget_kes === null ? null : Number(r.budget_kes),
  }))
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
  const { error } = await requireSupabase()
    .from('custom_furniture_requests')
    .update({ status })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteRequest(id: string): Promise<void> {
  const { error } = await requireSupabase().from('custom_furniture_requests').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
