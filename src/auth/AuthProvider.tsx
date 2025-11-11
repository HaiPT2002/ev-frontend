import React, { createContext, useContext, useState, ReactNode } from 'react'
import api from '../api/api'

export type Role = 'ADMIN' | 'EVM_STAFF' | 'DEALER_MANAGER' | 'DEALER_STAFF' | 'GUEST'

type AuthContextType = {
  user: { name: string; role: Role } | null
  login: (name: string, role: Role) => void
  loginWithCredentials?: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: Role } | null>(() => {
    try {
      const raw = localStorage.getItem('ev_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  function login(name: string, role: Role) {
    const u = { name, role }
    setUser(u)
    localStorage.setItem('ev_user', JSON.stringify(u))
    // Simulate an auth token for API calls (in real app this comes from backend)
    const fakeToken = `FAKE-TOKEN-${role}-${Date.now()}`
    localStorage.setItem('ev_token', fakeToken)
  }

  async function loginWithCredentials(email: string, password: string) {
    // call backend /api/auth/login
    const res = await api.post('/api/auth/login', { email, password })
    const data = res.data
    // Expecting { token, role, name, email, userId, dealerId }
    const role = (data.role || 'EVM_STAFF') as Role
    const name = data.name || data.email || 'User'
    const token = data.token || data.token
    const u = { name, role }
    setUser(u)
    localStorage.setItem('ev_user', JSON.stringify(u))
    if (token) localStorage.setItem('ev_token', token)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('ev_user')
    localStorage.removeItem('ev_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
