"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect } from "react";

const NAV = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Orders", href: "/admin/orders" },
      { label: "Products", href: "/admin/products" },
    ],
  },
  {
    section: "Management",
    items: [
      { label: "Customers", href: "/admin/customers" },
      { label: "Promo Codes", href: "/admin/promos" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    section: "Settings",
    items: [{ label: "Admin Users", href: "/admin/users" }],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/customers": "Customers",
  "/admin/promos": "Promo Codes",
  "/admin/analytics": "Analytics",
  "/admin/users": "Admin Users",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading, logout } = useAdminAuth();

  // Redirect to login if not authenticated after load
  useEffect(() => {
    if (!loading && !admin) {
      router.push("/admin/login");
    }
  }, [loading, admin, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f5f5f5",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: -0.5,
              marginBottom: 8,
            }}
          >
            SHOP.CO
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#888",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) =>
      pathname.startsWith(key),
    )?.[1] ?? "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f5f5f5",
        fontFamily: "Helvetica Neue, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────── */}
      <div
        style={{
          width: 220,
          background: "#000",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: -0.5,
            }}
          >
            SHOP.CO
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
          {NAV.map((group) => (
            <div key={group.section}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  padding: "0.75rem 1.25rem 0.35rem",
                }}
              >
                {group.section}
              </div>
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <div
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 1.25rem",
                      fontSize: 13,
                      cursor: "pointer",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                      borderLeft: isActive
                        ? "2px solid #fff"
                        : "2px solid transparent",
                      background: isActive
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                      fontWeight: isActive ? 500 : 400,
                      transition: "all 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: isActive ? "#fff" : "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                      }}
                    />
                    {item.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div
          onClick={logout}
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
          }
        >
          ← Logout
        </div>
      </div>

      {/* ── Main ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e8e8",
            padding: "0 1.5rem",
            height: 52,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#000",
              letterSpacing: -0.3,
              textTransform: "uppercase",
            }}
          >
            {pageTitle}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#888" }}>
              {admin.role.label}
            </span>
            <div
              onClick={logout}
              style={{
                background: "#000",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                padding: "5px 14px",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Logout
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
