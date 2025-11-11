import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, Role } from '../auth/AuthProvider'

type Props = {
  children: React.ReactElement
  roles?: Role[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuth()

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If roles is not provided, allow any authenticated user
  if (!roles || roles.length === 0) {
    return children
  }

  if (roles.includes(user.role as Role)) {
    return children
  }

  // Not authorized
  return <Navigate to="/login" replace />
}
