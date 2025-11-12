import axios from 'axios';

type AuthHandlers = {
  getToken: () => string | null;
  logout: () => void;
  // refreshToken should attempt to get a new token and return true if successful
  refreshToken?: () => Promise<boolean>;
};

let authHandlers: AuthHandlers | null = null;

export function setAuthHandlers(h: AuthHandlers) {
  authHandlers = h;
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  // send cookies (for refresh token stored as HttpOnly cookie on backend)
  withCredentials: true,
});

// Attach Authorization header using registered authHandlers if present
api.interceptors.request.use((config) => {
  try {
    const token = authHandlers?.getToken
      ? authHandlers.getToken()
      : localStorage.getItem('ev_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor: on 401 try refresh flow (if provided), otherwise logout
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (err: any) => void;
  config: any;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token) p.config.headers['Authorization'] = `Bearer ${token}`;
      p.resolve(api(p.config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (authHandlers?.refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        isRefreshing = true;
        try {
          const ok = await authHandlers.refreshToken();
          isRefreshing = false;
          if (ok) {
            const token = authHandlers.getToken();
            processQueue(null, token);
            if (token) originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (e) {
          isRefreshing = false;
          processQueue(e, null);
        }
      }

      // No refresh available or refresh failed -> logout
      try {
        authHandlers?.logout();
      } catch {}
    }
    return Promise.reject(error);
  }
);

// Vehicles
export async function getVehicles() {
  const res = await api.get('/api/vehicles');
  return res.data;
}

export async function getVehicleById(id: string) {
  const res = await api.get(`/api/vehicles/${id}`);
  return res.data;
}

export async function createVehicle(payload: any) {
  const res = await api.post('/api/vehicles', payload);
  return res.data;
}

export async function updateVehicle(id: string, payload: any) {
  const res = await api.put(`/api/vehicles/${id}`, payload);
  return res.data;
}

export async function deleteVehicle(id: string) {
  const res = await api.delete(`/api/vehicles/${id}`);
  return res.data;
}

export async function compareVehicles(firstId: string, secondId: string) {
  const res = await api.get('/api/vehicles/compare', { params: { firstId, secondId } });
  return res.data;
}

// Sale Contracts
export async function getContracts() {
  const res = await api.get('/api/sale-contracts');
  return res.data;
}

export async function getContractById(id: string) {
  const res = await api.get(`/api/sale-contracts/${id}`);
  return res.data;
}

// Customers
export async function getCustomers() {
  const res = await api.get('/api/customers');
  return res.data;
}

export async function getCustomerByPhone(phone: string) {
  const res = await api.get(`/api/customers/${encodeURIComponent(phone)}`);
  return res.data;
}

// Test drives
export async function getDealerTestDrives(dealerId: string, start?: string, end?: string) {
  const params: any = { dealerId };
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await api.get('/api/test-drives', { params });
  return res.data;
}

export async function createTestDrive(payload: any) {
  const res = await api.post('/api/test-drives', payload);
  return res.data;
}

// VNPAY
export async function createVnPayPayment(payload: any) {
  const res = await api.post('/api/payment/vnpay/create', payload);
  return res.data;
}

// Payments list (generic)
export async function getPayments() {
  const res = await api.get('/payment');
  return res.data;
}

export async function verifyVnPayReturn(params: Record<string, string>) {
  // backend: GET /api/payment/vnpay/return
  const res = await api.get('/api/payment/vnpay/return', { params });
  return res.data;
}

// Dealers
export async function getDealers() {
  const res = await api.get('/api/dealers');
  return res.data;
}

// Users
export async function getUsers() {
  const res = await api.get('/api/users');
  return res.data;
}

export default api;
