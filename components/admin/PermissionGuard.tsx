'use client'

import type { PermissionKey } from '@/types/admin'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface PermissionGuardProps {
  permission: PermissionKey
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission } = useAdminAuth()
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>
}