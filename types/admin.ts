export interface AdminRole {
  name: string
  label: string
}

export interface AdminUser {
  adminUserId: number
  role: AdminRole
  permissions: string[]  // array on the frontend (JSON-serializable)
}

export type PermissionKey =
  | 'orders:read'
  | 'orders:write'
  | 'orders:refund'
  | 'products:read'
  | 'products:write'
  | 'products:delete'
  | 'users:read'
  | 'users:write'
  | 'analytics:read'
  | 'promo:read'
  | 'promo:write'
  | 'admin:manage'