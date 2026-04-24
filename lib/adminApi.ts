const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function adminFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = options.token ?? getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    document.cookie = "admin_token=; Max-Age=0; path=/";
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (res.status === 403) throw new Error("Forbidden");

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }

  // 204 No Content — return null
  if (res.status === 204) return null as T;

  return res.json() as Promise<T>;
}

// Separate fetch for multipart — no Content-Type header (browser sets boundary)
async function adminUpload<T>(path: string, file: File): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (res.status === 401) {
    document.cookie = "admin_token=; Max-Age=0; path=/";
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Upload failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export const adminApi = {
  // ── Auth ─────────────────────────────────────────────
  me: () =>
    adminFetch<{
      adminUserId: number;
      role: { name: string; label: string };
      permissions: string[];
    }>("/admin/me"),

  login: (email: string, password: string) =>
    adminFetch<{ token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // ── Orders ───────────────────────────────────────────
  getOrders: () => adminFetch<unknown[]>("/admin/orders"),

  updateOrderStatus: (id: string, status: string, label: string) =>
    adminFetch(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, label }),
    }),

  refundOrder: (id: string) =>
    adminFetch(`/admin/orders/${id}/refund`, {
      method: "POST",
    }),

  // ── Products ─────────────────────────────────────────
  getProducts: () => adminFetch<unknown[]>("/admin/products"),

  getProduct: (id: string) => adminFetch<unknown>(`/admin/products/${id}`),

  createProduct: (body: Record<string, unknown>) =>
    adminFetch("/admin/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateProduct: (id: string, body: Record<string, unknown>) =>
    adminFetch(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteProduct: (id: string) =>
    adminFetch(`/admin/products/${id}`, {
      method: "DELETE",
    }),

  toggleSoldOut: (id: string, isSoldOut: boolean) =>
    adminFetch(`/admin/products/${id}/sold-out`, {
      method: "PATCH",
      body: JSON.stringify({ is_sold_out: isSoldOut }),
    }),

  // ── Product Images ────────────────────────────────────
  getProductImages: (productId: string) =>
    adminFetch<ProductImage[]>(`/admin/products/${productId}/images`),

  uploadProductImage: (productId: string, file: File) =>
    adminUpload<ProductImage>(`/admin/products/${productId}/images`, file),

  deleteProductImage: (productId: string, imageId: number) =>
    adminFetch<null>(`/admin/products/${productId}/images/${imageId}`, {
      method: "DELETE",
    }),

  setPrimaryImage: (productId: string, imageId: number) =>
    adminFetch<ProductImage>(
      `/admin/products/${productId}/images/${imageId}/primary`,
      { method: "PATCH" },
    ),

  reorderImages: (productId: string, orderedIds: number[]) =>
    adminFetch(`/admin/products/${productId}/images/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ orderedIds }),
    }),

  getCategories: () =>
    adminFetch<{ id: number; name: string; slug: string }[]>(
      "/admin/categories",
    ),

  createCategory: (name: string, slug: string) =>
    adminFetch<{ id: number; name: string; slug: string }>(
      "/admin/categories",
      {
        method: "POST",
        body: JSON.stringify({ name, slug }),
      },
    ),

  // Materials
  getMaterials: () => adminFetch<string[]>("/admin/materials"),

  createMaterial: (name: string) =>
    adminFetch<string[]>("/admin/materials", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
};
