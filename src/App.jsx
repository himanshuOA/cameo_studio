import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import WhatsApp from './components/WhatsApp'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Category from './pages/Category'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

// Each route swings in from depth; the key restarts the animation on
// every navigation.
function Main() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <main className="route-3d" key={pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<Category />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Main />
      <Footer />
      <WhatsApp />
    </BrowserRouter>
  )
}
