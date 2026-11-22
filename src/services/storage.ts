import { requireSupabase } from '../lib/supabase'
import { uid, validateImageFile } from '../lib/utils'

export type ImageBucket = 'product-images' | 'request-references'

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

/** Uploads an image and returns its public URL. Bucket rules live in the SQL migration. */
export async function uploadImage(
  bucket: ImageBucket,
  file: File,
  folder = 'uploads',
): Promise<string> {
  const problem = validateImageFile(file)
  if (problem) throw new Error(problem)

  const client = requireSupabase()
  const path = `${folder}/${uid()}.${EXT[file.type] ?? 'jpg'}`
  const { error } = await client.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false, cacheControl: '31536000' })
  if (error) throw new Error(error.message)

  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
