import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { api, unwrap } from '../lib/api'
import { AuthContext } from './auth-context'
import type { AuthResponse, Role, User } from '../types'

function persistSession(user: User, token: string) {
  localStorage.setItem('token', token)
  localStorage.setItem('role', user.role)
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return

    api
      .get<User>('/me')
      .then((res) => setUser(unwrap(res)))
      .catch(() => clearSession())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<Role> => {
    const res = await api.post<AuthResponse>('/login', { email, password })
    const { user: loggedInUser, token } = res.data
    persistSession(loggedInUser, token)
    setUser(loggedInUser)
    return loggedInUser.role
  }, [])

  const registerPatient = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
    ): Promise<Role> => {
      const res = await api.post<AuthResponse>('/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      const { user: registeredUser, token } = res.data
      persistSession(registeredUser, token)
      setUser(registeredUser)
      return registeredUser.role
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } finally {
      clearSession()
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, registerPatient, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
