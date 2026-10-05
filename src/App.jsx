import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageShell from './components/layout/PageShell'
import About from './pages/About'
import Articles from './pages/Articles'
import Calendar from './pages/Calendar'
import Classes from './pages/Classes'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Practices from './pages/Practices'
import Somatics from './pages/Somatics'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="somatics" element={<Somatics />} />
          <Route path="practices" element={<Practices />} />
          <Route path="classes" element={<Classes />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="articles" element={<Articles />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
