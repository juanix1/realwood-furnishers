import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { Spinner } from './components/ui'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import CustomFurniture from './pages/CustomFurniture'
import UpholsteryRepairs from './pages/UpholsteryRepairs'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin is code-split so customers never download it.
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:slug" element={<ProductDetail />} />
        <Route path="custom-furniture" element={<CustomFurniture />} />
        <Route path="upholstery-repairs" element={<UpholsteryRepairs />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin"
        element={
          <Suspense fallback={<Spinner label="Loading dashboard" />}>
            <AdminPage />
          </Suspense>
        }
      />
    </Routes>
  )
}
