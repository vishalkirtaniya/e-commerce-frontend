import { Box, Toolbar } from '@mui/material'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AdminTopbar />
          <Toolbar /> {/* spacer for fixed AppBar */}
          {children}
        </Box>
      </Box>
    </AdminAuthProvider>
  )
}