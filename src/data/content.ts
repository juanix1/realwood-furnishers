import {
  Hammer,
  Sofa,
  Wrench,
  Layers,
  BedDouble,
  Utensils,
  Tv,
  RefreshCw,
  ShieldCheck,
  Ruler,
  Leaf,
  HeartHandshake,
  Award,
  MessageCircle,
  Scissors,
  Paintbrush,
  type LucideIcon,
} from 'lucide-react'

export interface ServiceItem {
  title: string
  description: string
  icon: LucideIcon
  to: string
}

export const services: ServiceItem[] = [
  { title: 'Custom Furniture Manufacturing', description: 'Pieces designed around your space, taste and budget, built by hand in our workshop.', icon: Hammer, to: '/custom-furniture' },
  { title: 'Sofa Manufacturing', description: 'Sofas, sectionals and couches made to order in the size, fabric and style you choose.', icon: Sofa, to: '/custom-furniture' },
  { title: 'Sofa Repairs & Restoration', description: 'Sagging seats, broken frames and worn cushions brought back to comfortable life.', icon: Wrench, to: '/upholstery-repairs' },
  { title: 'Upholstery & Re-upholstery', description: 'Fresh fabric, leather or leatherette that renews furniture you already love.', icon: Layers, to: '/upholstery-repairs' },
  { title: 'Beds & Headboards', description: 'Strong bed frames and statement headboards in any size, from single to king.', icon: BedDouble, to: '/custom-furniture' },
  { title: 'Dining Tables', description: 'Solid dining tables and chair sets crafted for everyday meals and special gatherings.', icon: Utensils, to: '/custom-furniture' },
  { title: 'TV Stands', description: 'Entertainment units and wall-mounted TV stands with storage tailored to your room.', icon: Tv, to: '/custom-furniture' },
  { title: 'Furniture Refurbishment', description: 'Sanding, re-finishing and repair that gives tired wooden furniture a second life.', icon: RefreshCw, to: '/upholstery-repairs' },
]

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export const whyChoose: Feature[] = [
  { title: 'Made to Measure', description: 'Every piece is sized for your room, so it fits perfectly instead of almost fitting.', icon: Ruler },
  { title: 'Honest Materials', description: 'Seasoned hardwoods, quality foam and durable fabrics chosen to last, and explained plainly.', icon: Leaf },
  { title: 'Skilled Craftsmanship', description: 'Joinery, stitching and finishing done by experienced hands with attention to detail.', icon: Award },
  { title: 'Repair, Restore, Renew', description: 'We build new and bring old furniture back, so you never have to replace what can be saved.', icon: ShieldCheck },
  { title: 'Personal Service', description: 'You deal directly with the people making your furniture, by phone, WhatsApp or in person.', icon: HeartHandshake },
  { title: 'Clear Quotations', description: 'Tell us what you need and your budget in KES. We reply with a clear, itemised quote.', icon: MessageCircle },
]

export interface ProcessStep {
  title: string
  description: string
  icon: LucideIcon
}

export const customProcess: ProcessStep[] = [
  { title: 'Share your idea', description: 'Describe the piece, add dimensions and a reference photo if you have one.', icon: MessageCircle },
  { title: 'Get a quotation', description: 'We review the details and come back with a clear price and timeline.', icon: Ruler },
  { title: 'We craft it', description: 'Your piece is built in our workshop, with updates along the way.', icon: Hammer },
  { title: 'Enjoy it', description: 'Collect or arrange delivery, and settle in to furniture made for you.', icon: Sofa },
]

export const repairProcess: ProcessStep[] = [
  { title: 'Send photos', description: 'Share clear photos of the furniture and what needs fixing.', icon: MessageCircle },
  { title: 'Get a quote', description: 'We assess the work and quote the repair, re-upholstery or restoration.', icon: Ruler },
  { title: 'Choose fabric', description: 'Pick from fabric, leather and leatherette options that suit your home.', icon: Scissors },
  { title: 'Restored', description: 'We rebuild, re-cover and finish, then hand back furniture that feels new.', icon: Paintbrush },
]

export const repairServices = [
  { title: 'Sofa Re-upholstery', description: 'Strip, re-pad and re-cover your sofa in fabric or leather that matches your style.', icon: Sofa },
  { title: 'Sofa Repairs', description: 'Frame repairs, spring and webbing replacement, and re-stuffing of worn cushions.', icon: Wrench },
  { title: 'Seat Replacement', description: 'New foam and covers for dining chairs, office chairs and sofa seats.', icon: Layers },
  { title: 'Furniture Restoration', description: 'Re-sanding, re-polishing and structural repair for wooden furniture.', icon: RefreshCw },
  { title: 'Fabric Replacement', description: 'Swap tired or stained fabric for something fresh without replacing the whole piece.', icon: Scissors },
]

export const clientele = [
  'Individuals & families',
  'Homeowners & landlords',
  'Offices & corporate spaces',
  'Hotels & guest houses',
  'Interior designers',
  'Businesses & institutions',
]

export const values = [
  { title: 'Craftsmanship first', description: 'We would rather take the time to do it properly than rush something that will not last.' },
  { title: 'Honest advice', description: 'If a repair makes more sense than a replacement, we will tell you, even when it is the smaller job.' },
  { title: 'Built for Kenyan homes', description: 'Furniture sized and built for real living: busy families, daily use and Kenyan climate.' },
  { title: 'Respect for your budget', description: 'We work with the budget you share and suggest materials and finishes that stretch it wisely.' },
]

export interface Testimonial {
  name: string
  place: string
  quote: string
  /** When true, the UI labels the card as a sample so it is never mistaken for a real review. */
  isSample?: boolean
}

/**
 * REPLACE THESE with genuine customer reviews (with permission) before launch.
 * While `isSample` is true, a visible "Sample review" label is shown on the card.
 * Remove `isSample` (or delete the label) only for real, consented testimonials.
 */
export const testimonials: Testimonial[] = [
  { name: 'Customer name', place: 'Kahawa Wendani', quote: 'Add a real customer comment about their sofa or custom furniture here.', isSample: true },
  { name: 'Customer name', place: 'Nairobi', quote: 'Add a real customer comment about a repair or re-upholstery job here.', isSample: true },
  { name: 'Customer name', place: 'Kiambu', quote: 'Add a real customer comment about service and delivery here.', isSample: true },
]

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/custom-furniture', label: 'Custom Furniture' },
  { to: '/upholstery-repairs', label: 'Upholstery & Repairs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]
