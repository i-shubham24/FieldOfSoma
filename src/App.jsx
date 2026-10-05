import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageShell from './components/layout/PageShell'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Somatics = lazy(() => import('./pages/Somatics'))
const Practices = lazy(() => import('./pages/Practices'))
const Classes = lazy(() => import('./pages/Classes'))
const ClassDetail = lazy(() => import('./pages/ClassDetail'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Articles = lazy(() => import('./pages/Articles'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return <div className="min-h-screen bg-soma-paper" aria-hidden="true" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<PageShell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="somatics" element={<Somatics />} />
            <Route path="practices" element={<Practices />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetail />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="articles" element={<Articles />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
