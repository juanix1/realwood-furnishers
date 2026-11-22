import { useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ErrorState, Field, Notice, Spinner } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { slugify } from '../../lib/utils'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../services/categories'
import type { Category } from '../../types'

interface Draft {
  id?: string
  name: string
  slug: string
  description: string
  sort_order: string
}

const blank: Draft = { name: '', slug: '', description: '', sort_order: '0' }

export default function CategoriesAdmin() {
  const categories = useAsync(fetchCategories, [])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const edit = (c: Category) =>
    setDraft({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? '', sort_order: String(c.sort_order) })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft || saving) return
    const name = draft.name.trim()
    const slug = draft.slug.trim() || slugify(name)
    const order = Number(draft.sort_order)
    if (name.length < 2) return setMsg({ type: 'error', text: 'Enter a category name.' })
    if (slug !== slugify(slug)) return setMsg({ type: 'error', text: 'Slug may only contain lowercase letters, numbers and hyphens.' })
    if (!Number.isFinite(order)) return setMsg({ type: 'error', text: 'Sort order must be a number.' })

    setSaving(true)
    setMsg(null)
    try {
      const payload = { name, slug, description: draft.description.trim() || null, image_url: null, sort_order: order }
      if (draft.id) {
        const { image_url: _ignored, ...rest } = payload
        await updateCategory(draft.id, rest)
      } else {
        await createCategory(payload)
      }
      setDraft(null)
      setMsg({ type: 'success', text: 'Category saved.' })
      categories.reload()
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Could not save the category.'
      setMsg({ type: 'error', text: text.includes('categories_slug_key') ? 'That slug is already in use.' : text })
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(c: Category) {
    if (!window.confirm(`Delete category "${c.name}"? Products in it will become uncategorised.`)) return
    try {
      await deleteCategory(c.id)
      setMsg({ type: 'success', text: 'Category deleted.' })
      categories.reload()
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Could not delete.' })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Categories</h1>
        {!draft && (
          <button type="button" className="btn-primary" onClick={() => setDraft(blank)}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add category
          </button>
        )}
      </div>

      {msg && <Notice type={msg.type} className="mt-4">{msg.text}</Notice>}

      {draft && (
        <form onSubmit={onSubmit} noValidate className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Name" htmlFor="cat-name" required>
            <input id="cat-name" className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })} />
          </Field>
          <Field label="URL slug" htmlFor="cat-slug" hint="Used in /shop?category=slug">
            <input id="cat-slug" className="input" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </Field>
          <Field label="Description" htmlFor="cat-desc" className="sm:col-span-2">
            <input id="cat-desc" className="input" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Sort order" htmlFor="cat-order" hint="Lower numbers appear first">
            <input id="cat-order" type="number" className="input" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
          </Field>
          <div className="flex items-end gap-3 sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save category'}</button>
            <button type="button" className="btn-outline" onClick={() => setDraft(null)} disabled={saving}>Cancel</button>
          </div>
        </form>
      )}

      {categories.loading ? (
        <Spinner />
      ) : categories.error ? (
        <ErrorState message={categories.error} onRetry={categories.reload} />
      ) : (
        <ul className="mt-6 space-y-3">
          {(categories.data ?? []).map((c) => (
            <li key={c.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-charcoal-500">/{c.slug} · order {c.sort_order}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-outline !px-4 !py-2" onClick={() => edit(c)}>
                  <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                </button>
                <button type="button" aria-label={`Delete ${c.name}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-300 text-red-700 hover:bg-red-50" onClick={() => void onDelete(c)}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
          {(categories.data ?? []).length === 0 && <li className="card p-8 text-center text-charcoal-600">No categories yet.</li>}
        </ul>
      )}
    </div>
  )
}
