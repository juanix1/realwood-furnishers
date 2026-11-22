import { useState, type FormEvent } from 'react'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import ProductImage from '../../components/ProductImage'
import { Field, Notice } from '../../components/ui'
import { isHttpUrl, parseSpecs, slugify, specsToText, validateImageFile } from '../../lib/utils'
import { createProduct, updateProduct } from '../../services/products'
import { uploadImage } from '../../services/storage'
import type { Category, Product } from '../../types'

interface Props {
  product: Product | null
  categories: Category[]
  onCancel: () => void
  onSaved: () => void
}

export default function ProductForm({ product, categories, onCancel, onSaved }: Props) {
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [materials, setMaterials] = useState(product?.materials ?? '')
  const [dimensions, setDimensions] = useState(product?.dimensions ?? '')
  const [specs, setSpecs] = useState(product ? specsToText(product.specifications) : '')
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [imageUrl, setImageUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false)
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [inStock, setInStock] = useState(product?.in_stock ?? true)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function onNameChange(v: string) {
    setName(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const problem = validateImageFile(file)
        if (problem) throw new Error(`${file.name}: ${problem}`)
        uploaded.push(await uploadImage('product-images', file, 'products'))
      }
      setImages((prev) => [...prev, ...uploaded])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  function addUrl() {
    const v = imageUrl.trim()
    if (!isHttpUrl(v)) {
      setError('Enter a full image link starting with http:// or https://')
      return
    }
    setError('')
    setImages((prev) => [...prev, v])
    setImageUrl('')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    const priceNum = Number(price)
    if (name.trim().length < 2) return setError('Enter a product name.')
    if (!slug.trim() || slug !== slugify(slug)) return setError('The URL slug may only contain lowercase letters, numbers and hyphens.')
    if (!price.trim() || !Number.isFinite(priceNum) || priceNum < 0) return setError('Enter a valid price in KES.')

    setSaving(true)
    setError('')
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        category_id: categoryId || null,
        price: priceNum,
        description: description.trim() || null,
        materials: materials.trim() || null,
        dimensions: dimensions.trim() || null,
        specifications: parseSpecs(specs),
        images,
        is_featured: isFeatured,
        is_active: isActive,
        in_stock: inStock,
      }
      if (product) await updateProduct(product.id, payload)
      else await createProduct(payload)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the product.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{product ? 'Edit product' : 'Add product'}</h1>
        <button type="button" className="btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>

      <div className="card grid gap-5 p-6 sm:grid-cols-2">
        <Field label="Product name" htmlFor="pf-name" required>
          <input id="pf-name" className="input" value={name} onChange={(e) => onNameChange(e.target.value)} />
        </Field>
        <Field label="URL slug" htmlFor="pf-slug" required hint="Used in the link: /shop/your-slug">
          <input id="pf-slug" className="input" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value) }} />
        </Field>
        <Field label="Category" htmlFor="pf-category">
          <select id="pf-category" className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Uncategorised</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Price (KES)" htmlFor="pf-price" required>
          <input id="pf-price" type="number" min={0} inputMode="numeric" className="input" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Description" htmlFor="pf-desc" className="sm:col-span-2">
          <textarea id="pf-desc" className="input min-h-28" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Materials" htmlFor="pf-materials">
          <input id="pf-materials" className="input" value={materials} onChange={(e) => setMaterials(e.target.value)} />
        </Field>
        <Field label="Dimensions" htmlFor="pf-dimensions">
          <input id="pf-dimensions" className="input" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="210 L x 90 W x 80 H cm" />
        </Field>
        <Field label="Other specifications" htmlFor="pf-specs" hint="One per line, as  Name: Value" className="sm:col-span-2">
          <textarea id="pf-specs" className="input min-h-24 font-mono text-xs" value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder={'Seats: 3\nFinish: Satin lacquer'} />
        </Field>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider">Images</h2>
        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((src, i) => (
              <li key={src + i} className="relative">
                <ProductImage src={src} alt={`Product image ${i + 1}`} className="aspect-square w-full rounded-xl" />
                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold">Main</span>}
                <button
                  type="button"
                  aria-label={`Remove image ${i + 1}`}
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-700 shadow"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn-dark cursor-pointer !py-2.5">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
            {uploading ? 'Uploading…' : 'Upload images'}
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={uploading} onChange={(e) => { void onFiles(e.target.files); e.target.value = '' }} />
          </label>
          <span className="text-xs text-charcoal-500">JPG, PNG, WebP or AVIF, up to 5 MB each. First image is the main photo.</span>
        </div>
        <div className="flex gap-2">
          <input className="input" type="url" placeholder="…or paste an image link" aria-label="Image link" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button type="button" className="btn-outline shrink-0" onClick={addUrl}><Plus className="h-4 w-4" aria-hidden="true" /> Add</button>
        </div>
      </div>

      <div className="card flex flex-wrap gap-6 p-6">
        {[
          { label: 'Featured on homepage', value: isFeatured, set: setIsFeatured },
          { label: 'Visible in shop', value: isActive, set: setIsActive },
          { label: 'In stock (off = made to order)', value: inStock, set: setInStock },
        ].map((t) => (
          <label key={t.label} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-wood" checked={t.value} onChange={(e) => t.set(e.target.checked)} />
            {t.label}
          </label>
        ))}
      </div>

      {error && <Notice type="error">{error}</Notice>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving || uploading}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…</> : 'Save product'}
        </button>
        <button type="button" className="btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </form>
  )
}
