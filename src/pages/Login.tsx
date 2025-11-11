import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CircularProgress from '@mui/material/CircularProgress'

export default function Login() {
  const { login, loginWithCredentials } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (loginWithCredentials) {
      try {
        await loginWithCredentials(email, password)
        navigate('/dashboard')
        return
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Login failed')
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  function quickLogin(role: any) {
    // fallback: demo login
    login(role === 'ADMIN' ? 'Alice Admin' : role === 'EVM_STAFF' ? 'Evm Staff' : 'Dealer Bob', role)
    navigate('/dashboard')
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h6">Sign in to EV Management</Typography>
            </Box>

            <Box component="form" onSubmit={submit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
              <Button type="submit" variant="contained" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Quick login for demo:</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant="outlined" onClick={() => quickLogin('ADMIN')}>ADMIN</Button>
                <Button variant="outlined" onClick={() => quickLogin('EVM_STAFF')}>EVM_STAFF</Button>
                <Button variant="outlined" onClick={() => quickLogin('DEALER_MANAGER')}>DEALER_MANAGER</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
