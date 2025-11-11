import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import Layout from './components/Layout'
import routes from './routes'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map((r: any) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                r.roles ? (
                  <ProtectedRoute roles={r.roles}>{r.element}</ProtectedRoute>
                ) : (
                  r.element
                )
              }
            />
          ))}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
