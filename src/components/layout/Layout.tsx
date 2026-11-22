import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import { whatsappLink } from '../../lib/config'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <a
        href={whatsappLink('Hello Realwood Furnishers, I would like to make an enquiry.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Realwood Furnishers on WhatsApp"
        className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </a>
    </div>
  )
}
