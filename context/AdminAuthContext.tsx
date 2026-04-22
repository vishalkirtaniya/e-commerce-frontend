"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { AdminUser, PermissionKey } from "@/types/admin";
import { adminApi } from "@/lib/adminApi";

interface AdminAuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  hasPermission: (key: PermissionKey) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .me()
      .then((data) => setAdmin(data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const hasPermission = useCallback(
    (key: PermissionKey): boolean => {
      if (!admin) return false;
      return admin.permissions.includes(key);
    },
    [admin],
  );

  const logout = useCallback(() => {
    document.cookie = "admin_token=; Max-Age=0; path=/";
    window.location.href = "/admin/login";
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, hasPermission, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
