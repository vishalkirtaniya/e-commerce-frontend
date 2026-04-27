// components/admin/AdminShellGate.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { AdminShell } from '@/components/admin/AdminShell'

const PUBLIC_ROUTES = ['/admin/login']

export function AdminShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { admin, loading } = useAdminAuth()

  // Always render public routes bare — no auth logic, no shell
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>
  }

  // Still fetching /me — AdminShell handles this loading state already
  // but we guard here too so shell doesn't flash on unauthenticated users
  if (loading) return null

  // Token expired or invalid — AdminShell will redirect, render nothing
  if (!admin) return null

  return <AdminShell>{children}</AdminShell>
}