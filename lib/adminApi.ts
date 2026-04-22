const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

interface RequestOptions extends RequestInit {
  token?: string
}

async function adminFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = options.token ?? getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    // Token expired — clear cookie and redirect to login
    document.cookie = 'admin_token=; Max-Age=0; path=/'
    window.location.href = '/admin/login'
    throw new Error('Unauthorized')
  }

  if (res.status === 403) {
    throw new Error('Forbidden')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ── Auth ─────────────────────────────────────────────────
export const adminApi = {
  me: () =>
    adminFetch<{ adminUserId: number; role: { name: string; label: string }; permissions: string[] }>(
      '/admin/me'
    ),

  login: (email: string, password: string) =>
    adminFetch<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ── Orders ───────────────────────────────────────────
  getOrders: () =>
    adminFetch<unknown[]>('/admin/orders'),

  updateOrderStatus: (id: string, status: string, label: string) =>
    adminFetch(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, label }),
    }),

  refundOrder: (id: string) =>
    adminFetch(`/admin/orders/${id}/refund`, {
      method: 'POST',
    }),

  // ── Products ─────────────────────────────────────────
  getProducts: () =>
    adminFetch<unknown[]>('/admin/products'),

  getProduct: (id: string) =>
    adminFetch<unknown>(`/admin/products/${id}`),

  createProduct: (body: Record<string, unknown>) =>
    adminFetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateProduct: (id: string, body: Record<string, unknown>) =>
    adminFetch(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  deleteProduct: (id: string) =>
    adminFetch(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
}