// app/admin/layout.tsx
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { AdminThemeProvider } from '@/components/admin/AdminThemeProvider'
import { AdminShell } from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminAuthProvider>
        <AdminShell>{children}</AdminShell>
      </AdminAuthProvider>
    </AdminThemeProvider>
  )
}