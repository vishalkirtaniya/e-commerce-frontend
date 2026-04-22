"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { PermissionKey } from "@/types/admin";

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission: PermissionKey | null;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <DashboardIcon />,
    permission: null,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCartIcon />,
    permission: "orders:read",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <InventoryIcon />,
    permission: "products:read",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: <PeopleIcon />,
    permission: "users:read",
  },
  {
    label: "Promo Codes",
    href: "/admin/promos",
    icon: <LocalOfferIcon />,
    permission: "promo:read",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChartIcon />,
    permission: "analytics:read",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { hasPermission } = useAdminAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.permission === null || hasPermission(item.permission),
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#0f172a",
          color: "white",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700} sx={{ color: "white" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <List>
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  bgcolor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "rgba(255,255,255,0.6)",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontSize: 14,
                      color: isActive ? "white" : "rgba(255,255,255,0.6)",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
