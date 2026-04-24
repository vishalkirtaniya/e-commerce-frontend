'use client'

import { AppBar, Toolbar, Box, Chip, Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const DRAWER_WIDTH = 240

export function AdminTopbar() {
  const { admin, logout } = useAdminAuth()

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <Box display="flex" alignItems="center" gap={2}>
          {admin && (
            <Chip
              label={admin.role.label}
              size="small"
              sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 600 }}
            />
          )}
          <Button
            onClick={logout}
            startIcon={<LogoutIcon />}
            size="small"
            color="inherit"
            sx={{ color: 'text.secondary' }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}