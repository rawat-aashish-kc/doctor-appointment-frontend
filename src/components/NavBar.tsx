import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const PORTAL_LABEL = {
  admin: 'Admin Portal',
  doctor: 'Doctor Portal',
  patient: 'Patient Portal',
} as const

const LOGIN_PATH = {
  admin: '/admin/login',
  doctor: '/doctor/login',
  patient: '/login',
} as const

export function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  async function handleLogout() {
    await logout()
    navigate(LOGIN_PATH[user!.role])
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-gray-900">{PORTAL_LABEL[user.role]}</span>
          {user.role === 'admin' && (
            <>
              <Link to="/admin/doctors" className="text-sm text-gray-600 hover:text-gray-900">
                Doctors
              </Link>
              <Link to="/admin/appointments" className="text-sm text-gray-600 hover:text-gray-900">
                Appointments
              </Link>
            </>
          )}
          {user.role === 'doctor' && (
            <Link to="/doctor/appointments" className="text-sm text-gray-600 hover:text-gray-900">
              My Appointments
            </Link>
          )}
          {user.role === 'patient' && (
            <>
              <Link to="/doctors" className="text-sm text-gray-600 hover:text-gray-900">
                Doctors
              </Link>
              <Link to="/appointments" className="text-sm text-gray-600 hover:text-gray-900">
                My Appointments
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
