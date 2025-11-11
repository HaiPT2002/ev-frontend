import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' }
})

// Attach Authorization header from localStorage token when present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('ev_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

// Vehicles
export async function getVehicles() {
  const res = await api.get('/api/vehicles')
  return res.data
}

export async function getVehicleById(id: string) {
  const res = await api.get(`/api/vehicles/${id}`)
  return res.data
}

// Sale Contracts
export async function getContracts() {
  const res = await api.get('/api/sale-contracts')
  return res.data
}

export async function getContractById(id: string) {
  const res = await api.get(`/api/sale-contracts/${id}`)
  return res.data
}

// Customers
export async function getCustomers() {
  const res = await api.get('/api/customers')
  return res.data
}

export async function getCustomerByPhone(phone: string) {
  const res = await api.get(`/api/customers/${encodeURIComponent(phone)}`)
  return res.data
}

// Test drives
export async function getDealerTestDrives(dealerId: string, start?: string, end?: string) {
  const params: any = { dealerId }
  if (start) params.start = start
  if (end) params.end = end
  const res = await api.get('/api/test-drives', { params })
  return res.data
}

// VNPAY
export async function createVnPayPayment(payload: any) {
  const res = await api.post('/api/payment/vnpay/create', payload)
  return res.data
}

// Payments list (generic)
export async function getPayments() {
  const res = await api.get('/payment')
  return res.data
}

export async function verifyVnPayReturn(params: Record<string,string>) {
  // backend: GET /api/payment/vnpay/return
  const res = await api.get('/api/payment/vnpay/return', { params })
  return res.data
}

// Dealers
export async function getDealers() {
  const res = await api.get('/api/dealers')
  return res.data
}

// Users
export async function getUsers() {
  const res = await api.get('/api/users')
  return res.data
}

export default api
