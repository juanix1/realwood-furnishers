import type { Category, Product } from '../types'

/**
 * SAMPLE catalogue shown only while Supabase is not configured.
 * Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, the live
 * database is used instead and none of this is displayed.
 * Prices and specifications are illustrative placeholders.
 */
export const fallbackCategories: Category[] = [
  { id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas', description: 'Handcrafted sofas, sectionals and couches built to order.', image_url: null, sort_order: 1 },
  { id: 'cat-beds', name: 'Beds & Headboards', slug: 'beds', description: 'Solid frames and upholstered headboards for every bedroom.', image_url: null, sort_order: 2 },
  { id: 'cat-dining', name: 'Dining Tables & Chairs', slug: 'dining', description: 'Dining sets and tables that gather the whole family.', image_url: null, sort_order: 3 },
  { id: 'cat-tv', name: 'TV Stands & Units', slug: 'tv-stands', description: 'Entertainment units and TV stands in quality finishes.', image_url: null, sort_order: 4 },
  { id: 'cat-tables', name: 'Coffee & Side Tables', slug: 'tables', description: 'Coffee tables, side tables and console tables.', image_url: null, sort_order: 5 },
  { id: 'cat-armchairs', name: 'Armchairs & Seating', slug: 'armchairs', description: 'Accent chairs, ottomans and statement seating.', image_url: null, sort_order: 6 },
  { id: 'cat-storage', name: 'Wardrobes & Storage', slug: 'storage', description: 'Wardrobes, shoe racks and storage solutions.', image_url: null, sort_order: 7 },
  { id: 'cat-office', name: 'Office Furniture', slug: 'office', description: 'Desks and office seating for work-from-home and business.', image_url: null, sort_order: 8 },
]

const cat = (slug: string) => {
  const c = fallbackCategories.find((x) => x.slug === slug)!
  return { id: c.id, name: c.name, slug: c.slug }
}

const base = {
  images: [] as string[],
  is_active: true,
  in_stock: true,
}

export const fallbackProducts: Product[] = [
  {
    ...base, id: 'sample-1', slug: 'chesterfield-three-seater-sofa', name: 'Chesterfield 3-Seater Sofa',
    category_id: 'cat-sofas', category: cat('sofas'), price: 85000, is_featured: true,
    description: 'A timeless button-tufted three-seater on a seasoned hardwood frame, with high-density foam seating for lasting comfort. Made to order in your choice of fabric.',
    materials: 'Hardwood frame, high-density foam, premium upholstery fabric',
    dimensions: '210 L x 90 W x 80 H cm',
    specifications: { Seats: '3', Frame: 'Seasoned hardwood', Finish: 'Button-tufted', 'Lead time': 'Made to order' },
  },
  {
    ...base, id: 'sample-2', slug: 'l-shaped-sectional-sofa', name: 'L-Shaped Sectional Sofa',
    category_id: 'cat-sofas', category: cat('sofas'), price: 125000, is_featured: true,
    description: 'A generous corner sectional ideal for family living rooms. Choose velvet, linen-look or leatherette, and left- or right-hand configuration.',
    materials: 'Hardwood frame, high-density foam, fabric of your choice',
    dimensions: '280 x 200 x 85 cm',
    specifications: { Seats: '5-6', Configuration: 'Left or right hand', Frame: 'Seasoned hardwood' },
  },
  {
    ...base, id: 'sample-3', slug: 'upholstered-queen-bed', name: 'Upholstered Queen Bed with Headboard',
    category_id: 'cat-beds', category: cat('beds'), price: 68000, is_featured: true,
    description: 'A solid queen-size bed with a padded, channel-stitched headboard. Built to be strong and silent.',
    materials: 'Hardwood frame, plywood slats, upholstered headboard',
    dimensions: '5 x 6 ft (Queen)',
    specifications: { Size: 'Queen (5 x 6 ft)', Headboard: 'Channel-stitched', Base: 'Slatted' },
  },
  {
    ...base, id: 'sample-4', slug: 'tufted-headboard-king', name: 'Tufted King Headboard',
    category_id: 'cat-beds', category: cat('beds'), price: 32000, is_featured: false,
    description: 'Statement button-tufted headboard that transforms the look of any bedroom. Sizes available on request.',
    materials: 'Wooden board, foam padding, fabric upholstery',
    dimensions: '6 ft wide x 130 cm high',
    specifications: { Size: 'King (6 ft)', Style: 'Button-tufted' },
  },
  {
    ...base, id: 'sample-5', slug: 'six-seater-mahogany-dining-set', name: 'Six-Seater Mahogany Dining Set',
    category_id: 'cat-dining', category: cat('dining'), price: 98000, is_featured: true,
    description: 'Solid hardwood dining table with six cushioned chairs. Hand-finished with a durable lacquer that wipes clean.',
    materials: 'Mahogany, durable lacquer finish, cushioned seats',
    dimensions: 'Table 180 x 90 x 76 cm',
    specifications: { Seats: '6', Top: 'Solid hardwood', Finish: 'Satin lacquer' },
  },
  {
    ...base, id: 'sample-6', slug: 'round-four-seater-dining-table', name: 'Round Four-Seater Dining Table',
    category_id: 'cat-dining', category: cat('dining'), price: 52000, is_featured: false,
    description: 'A compact round dining table that suits apartments and smaller dining rooms.',
    materials: 'Hardwood, lacquer finish',
    dimensions: '120 cm diameter x 76 cm high',
    specifications: { Seats: '4', Shape: 'Round' },
  },
  {
    ...base, id: 'sample-7', slug: 'modern-tv-stand-with-storage', name: 'Modern TV Stand with Storage',
    category_id: 'cat-tv', category: cat('tv-stands'), price: 38000, is_featured: true,
    description: 'Clean-lined TV unit with closed storage and open shelving. Suits screens up to 65 inches.',
    materials: 'Hardwood and MDF, durable finish',
    dimensions: '180 x 40 x 50 cm',
    specifications: { 'Max screen': '65 inches', Storage: 'Doors and open shelves' },
  },
  {
    ...base, id: 'sample-8', slug: 'floating-tv-unit-wall-mounted', name: 'Floating Wall-Mounted TV Unit',
    category_id: 'cat-tv', category: cat('tv-stands'), price: 45000, is_featured: false,
    description: 'A sleek wall-mounted entertainment unit that keeps the floor clear and the room feeling larger.',
    materials: 'Hardwood and MDF',
    dimensions: '200 x 35 x 40 cm',
    specifications: { Mounting: 'Wall-mounted' },
  },
  {
    ...base, id: 'sample-9', slug: 'nesting-coffee-table-set', name: 'Nesting Coffee Table Set',
    category_id: 'cat-tables', category: cat('tables'), price: 24000, is_featured: false,
    description: 'Two nesting tables with a solid wood top and tapered legs — use together or apart.',
    materials: 'Hardwood',
    dimensions: 'Large 90 x 50 x 45 cm',
    specifications: { Pieces: '2' },
  },
  {
    ...base, id: 'sample-10', slug: 'wingback-accent-armchair', name: 'Wingback Accent Armchair',
    category_id: 'cat-armchairs', category: cat('armchairs'), price: 32000, is_featured: true,
    description: 'A classic wingback armchair with deep seat and solid wooden legs. Perfect for living rooms and reading corners.',
    materials: 'Hardwood frame, foam, upholstery fabric',
    dimensions: '80 x 85 x 105 cm',
    specifications: { Style: 'Wingback' },
  },
  {
    ...base, id: 'sample-11', slug: 'three-door-wardrobe', name: 'Three-Door Wardrobe',
    category_id: 'cat-storage', category: cat('storage'), price: 72000, is_featured: false,
    description: 'Spacious three-door wardrobe with hanging rail and shelves, finished to match your bedroom.',
    materials: 'Hardwood and MDF',
    dimensions: '180 x 55 x 210 cm',
    specifications: { Doors: '3', Interior: 'Hanging rail and shelves' },
  },
  {
    ...base, id: 'sample-12', slug: 'executive-office-desk', name: 'Executive Office Desk',
    category_id: 'cat-office', category: cat('office'), price: 56000, is_featured: false,
    description: 'A solid executive desk with drawer pedestal and cable management, built for offices and home studies.',
    materials: 'Hardwood top, durable finish',
    dimensions: '160 x 80 x 76 cm',
    specifications: { Drawers: '3', 'Cable management': 'Yes' },
  },
]
