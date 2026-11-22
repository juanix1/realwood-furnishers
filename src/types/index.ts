export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  created_at?: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  images: string[]
  specifications: Record<string, string>
  materials: string | null
  dimensions: string | null
  is_featured: boolean
  is_active: boolean
  in_stock: boolean
  created_at?: string
  updated_at?: string
  /** Joined from categories when available */
  category?: { id?: string; name: string; slug: string } | null
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>

export type EnquiryStatus = 'new' | 'contacted' | 'closed'

export interface ContactEnquiry {
  id: string
  name: string
  phone: string
  email: string | null
  subject: string | null
  message: string
  product_name: string | null
  status: EnquiryStatus
  created_at: string
}

export type ContactEnquiryInput = Pick<
  ContactEnquiry,
  'name' | 'phone' | 'email' | 'subject' | 'message' | 'product_name'
>

export type RequestType = 'custom_furniture' | 'upholstery_repair'
export type RequestStatus = 'new' | 'quoted' | 'in_progress' | 'completed' | 'closed'

export interface CustomRequest {
  id: string
  request_type: RequestType
  name: string
  phone: string
  email: string | null
  location: string | null
  furniture_type: string
  dimensions: string | null
  material: string | null
  colour: string | null
  description: string
  budget_kes: number | null
  reference_image_url: string | null
  status: RequestStatus
  created_at: string
}

export type CustomRequestInput = Omit<CustomRequest, 'id' | 'status' | 'created_at'>

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; notConfigured?: boolean }
