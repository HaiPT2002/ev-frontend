import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Login() {
  const { login, loginWithCredentials } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (loginWithCredentials) {
      try {
        await loginWithCredentials(email, password)
        navigate('/dashboard')
        return
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Login failed')
      }
    }
  }

  function quickLogin(role: any) {
    // fallback: demo login
    login(role === 'ADMIN' ? 'Alice Admin' : role === 'EVM_STAFF' ? 'Evm Staff' : 'Dealer Bob', role)
    navigate('/dashboard')
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained">Sign in</Button>
        </form>
        {error && <Typography color="error">{error}</Typography>}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Quick login for demo:</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button variant="outlined" onClick={() => quickLogin('ADMIN')}>ADMIN</Button>
            <Button variant="outlined" onClick={() => quickLogin('EVM_STAFF')}>EVM_STAFF</Button>
            <Button variant="outlined" onClick={() => quickLogin('DEALER_MANAGER')}>DEALER_MANAGER</Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
