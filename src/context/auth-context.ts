import { createContext } from 'react'
import type { Role, User } from '../types'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<Role>
  registerPatient: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<Role>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
