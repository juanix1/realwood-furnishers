import { fallbackProducts } from '../data/fallback'
import { requireSupabase, supabase } from '../lib/supabase'
import type { Product, ProductInput } from '../types'

const SELECT = '*, category:categories(id, name, slug)'

function normalize(row: Record<string, unknown>): Product {
  const r = row as unknown as Product
  return {
    ...r,
    price: Number(r.price),
    images: Array.isArray(r.images) ? r.images : [],
    specifications: r.specifications && typeof r.specifications === 'object' ? r.specifications : {},
  }
}

export interface ProductQuery {
  featuredOnly?: boolean
  categorySlug?: string
  limit?: number
}

function applyQuery(products: Product[], q: ProductQuery): Product[] {
  let out = products
  if (q.featuredOnly) out = out.filter((p) => p.is_featured)
  if (q.categorySlug) out = out.filter((p) => p.category?.slug === q.categorySlug)
  if (q.limit) out = out.slice(0, q.limit)
  return out
}

/** Public catalogue: active products only (RLS enforces this server-side too). */
export async function fetchProducts(q: ProductQuery = {}): Promise<Product[]> {
  if (!supabase) return applyQuery(fallbackProducts, q)
  const { data, error } = await supabase
    .from('products')
    .select(SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return applyQuery((data ?? []).map(normalize), q)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return fallbackProducts.find((p) => p.slug === slug) ?? null
  const { data, error } = await supabase
    .from('products')
    .select(SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? normalize(data) : null
}

/* ───────────── Admin (requires an admin session; enforced by RLS) ───────────── */

export async function fetchAdminProducts(): Promise<Product[]> {
  const { data, error } = await requireSupabase()
    .from('products')
    .select(SELECT)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(normalize)
}

export async function createProduct(input: ProductInput): Promise<void> {
  const { error } = await requireSupabase().from('products').insert(input)
  if (error) throw new Error(friendly(error.message))
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const { error } = await requireSupabase().from('products').update(input).eq('id', id)
  if (error) throw new Error(friendly(error.message))
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await requireSupabase().from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

function friendly(message: string): string {
  if (message.includes('products_slug_key')) return 'That URL slug is already used by another product.'
  return message
}
