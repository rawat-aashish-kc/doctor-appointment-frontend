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
    <nav className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-medium text-[var(--ink)]">{PORTAL_LABEL[user.role]}</span>
          {user.role === 'admin' && (
            <>
              <Link to="/admin/doctors" className="text-sm text-[var(--ink)]/70 hover:text-[var(--accent)]">
                Doctors
              </Link>
              <Link to="/admin/appointments" className="text-sm text-[var(--ink)]/70 hover:text-[var(--accent)]">
                Appointments
              </Link>
            </>
          )}
          {user.role === 'doctor' && (
            <Link to="/doctor/appointments" className="text-sm text-[var(--ink)]/70 hover:text-[var(--accent)]">
              My Appointments
            </Link>
          )}
          {user.role === 'patient' && (
            <>
              <Link to="/doctors" className="text-sm text-[var(--ink)]/70 hover:text-[var(--accent)]">
                Doctors
              </Link>
              <Link to="/appointments" className="text-sm text-[var(--ink)]/70 hover:text-[var(--accent)]">
                My Appointments
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--ink)]/60">{user.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-[4px] border border-[var(--line)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--panel)]"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
