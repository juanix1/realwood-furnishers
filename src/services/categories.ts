import { fallbackCategories } from '../data/fallback'
import { isSupabaseConfigured, requireSupabase, supabase } from '../lib/supabase'
import type { Category } from '../types'

export const usingFallbackData = !isSupabaseConfigured

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return fallbackCategories
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as Category[]
}

export type CategoryInput = Pick<Category, 'name' | 'slug' | 'description' | 'image_url' | 'sort_order'>

export async function createCategory(input: CategoryInput): Promise<void> {
  const { error } = await requireSupabase().from('categories').insert(input)
  if (error) throw new Error(error.message)
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<void> {
  const { error } = await requireSupabase().from('categories').update(input).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await requireSupabase().from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
