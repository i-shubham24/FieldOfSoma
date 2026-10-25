import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Bookings from './pages/Bookings'
import ClassEditor from './pages/ClassEditor'
import ClassList from './pages/ClassList'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Orders from './pages/Orders'
import Reviews from './pages/Reviews'
import Settings from './pages/Settings'
import WritingEditor from './pages/WritingEditor'
import WritingList from './pages/WritingList'
import { adminEnabled } from './session'
import { AdminDataProvider } from './store'

// The admin lives at /admin, in its own layout: no site header, smooth scroll or ambient sound.
export default function AdminApp() {
  if (!adminEnabled) return <Navigate to="/" replace />

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        element={
          <AdminDataProvider>
            <AdminLayout />
          </AdminDataProvider>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="classes" element={<ClassList />} />
        <Route path="classes/:id" element={<ClassEditor />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="orders" element={<Orders />} />
        <Route path="writing" element={<WritingList />} />
        <Route path="writing/:id" element={<WritingEditor />} />
        <Route path="profile" element={<Navigate to="/admin/settings" replace />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
