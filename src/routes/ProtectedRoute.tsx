import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

interface ProtectedRouteProps {
  role?: Role
  children: ReactNode
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading…</div>
  }

  if (!user) {
    const loginPath = role === 'admin' ? '/admin/login' : role === 'doctor' ? '/doctor/login' : '/login'
    return <Navigate to={loginPath} replace />
  }

  if (role && user.role !== role) {
    const homePath =
      user.role === 'admin' ? '/admin/doctors' : user.role === 'doctor' ? '/doctor/appointments' : '/doctors'
    return <Navigate to={homePath} replace />
  }

  return <>{children}</>
}
