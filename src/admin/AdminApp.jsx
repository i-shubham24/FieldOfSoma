import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Bookings from './pages/Bookings'
import ClassEditor from './pages/ClassEditor'
import ClassList from './pages/ClassList'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Login from './pages/Login'
import Members from './pages/Members'
import NotFound from './pages/NotFound'
import Orders from './pages/Orders'
import Photos from './pages/Photos'
import Profile from './pages/Profile'
import Promos from './pages/Promos'
import Reviews from './pages/Reviews'
import Settings from './pages/Settings'
import WritingEditor from './pages/WritingEditor'
import WritingList from './pages/WritingList'
import { adminEnabled } from './session'
import { AdminDataProvider } from './store'

// The admin lives at /admin, in its own layout: no site header, smooth scroll or ambient sound.
// Everything works on sample data kept in this browser until the backend is connected
// (ADMIN_PANEL_PLAN.md). Only store.jsx and media.js change then.
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
        <Route path="promos" element={<Promos />} />
        <Route path="members" element={<Members />} />
        <Route path="writing" element={<WritingList />} />
        <Route path="writing/:id" element={<WritingEditor />} />
        <Route path="photos" element={<Photos />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
