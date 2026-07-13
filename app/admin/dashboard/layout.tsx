// app/admin/layout.tsx
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { AdminShellGate } from "@/components/admin/AdminShellGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <AdminAuthProvider>
        <AdminShellGate>{children}</AdminShellGate>
      </AdminAuthProvider>
    </AdminThemeProvider>
  );
}
