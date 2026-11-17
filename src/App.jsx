import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import PageShell from './components/layout/PageShell'
import AppErrorBoundary from './components/shared/AppErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Somatics = lazy(() => import('./pages/Somatics'))
const Practices = lazy(() => import('./pages/Practices'))
const Classes = lazy(() => import('./pages/Classes'))
const ClassDetail = lazy(() => import('./pages/ClassDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Articles = lazy(() => import('./pages/Articles'))
const Article = lazy(() => import('./pages/Article'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminApp = lazy(() => import('./admin/AdminApp'))

function PageFallback() {
  return <div className="min-h-screen bg-soma-paper" aria-hidden="true" />
}

function LegacyCourseRedirect() {
  const { id } = useParams()
  return <Navigate to={`/classes/${id}`} replace />
}

function LegacyArticleRedirect() {
  const { id } = useParams()
  return <Navigate to={`/articles/${id}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="admin/*" element={<AdminApp />} />
            <Route element={<PageShell />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="somatics" element={<Somatics />} />
              <Route path="practices" element={<Practices />} />
              <Route path="practice" element={<Navigate to="/practices" replace />} />
              <Route path="classes" element={<Classes />} />
              <Route path="courses" element={<Navigate to="/classes" replace />} />
              <Route path="classes/:id" element={<ClassDetail />} />
              <Route path="course/:id" element={<LegacyCourseRedirect />} />
              <Route path="class/:id" element={<LegacyCourseRedirect />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="articles" element={<Articles />} />
              <Route path="journal" element={<Navigate to="/articles" replace />} />
              <Route path="articles/:id" element={<Article />} />
              <Route path="journal/:id" element={<LegacyArticleRedirect />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  )
}
