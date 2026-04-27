"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// ── Types ─────────────────────────────────────────────────────
interface AdminRole {
  id: number;
  name: string;
  label: string;
}

interface AdminUser {
  id: number;
  is_active: boolean;
  created_at: string;
  credential_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  admin_roles: AdminRole;
}

interface AuditLogEntry {
  id: number;
  action: string;
  entity: string;
  entity_id: string | null;
  payload: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

interface FormErrors {
  email?: string;
  role_id?: string;
}

// ── Helpers ───────────────────────────────────────────────────
function getInitials(name: string | null, email: string): string {
  if (name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  return email[0].toUpperCase();
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Styles ────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#f5f5f5",
    fontFamily: "Helvetica Neue, Arial, sans-serif",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    padding: "0 1.5rem",
    height: 52,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 12 },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: "#000",
    letterSpacing: -0.3,
    textTransform: "uppercase" as const,
  },
  btn: {
    fontSize: 12,
    padding: "7px 16px",
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
  btnGhost: {
    fontSize: 12,
    padding: "7px 16px",
    border: "1px solid #000",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
  btnAct: {
    fontSize: 11,
    padding: "4px 10px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: 500,
  },
  btnDanger: {
    fontSize: 11,
    padding: "4px 10px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#c0392b",
    cursor: "pointer",
    fontWeight: 500,
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  metrics: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  metric: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    padding: "1rem 1.25rem",
  },
  tableWrap: { background: "#fff", border: "1px solid #e8e8e8" },
  th: {
    textAlign: "left" as const,
    padding: "10px 14px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    color: "#888",
    background: "#fafafa",
    borderBottom: "1px solid #e8e8e8",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid #f0f0f0",
    color: "#000",
    verticalAlign: "middle" as const,
  },
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  drawer: {
    position: "fixed" as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: 440,
    background: "#fff",
    borderLeft: "1px solid #e8e8e8",
    zIndex: 11,
    display: "flex",
    flexDirection: "column",
  },
  drawerHead: {
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #e8e8e8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    background: "#000",
  },
  drawerTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "#fff",
  },
  drawerBody: { flex: 1, overflowY: "auto" as const, padding: "1.5rem" },
  drawerFoot: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #e8e8e8",
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  field: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    color: "#888",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    fontSize: 13,
    padding: "9px 11px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#000",
    outline: "none",
    fontFamily: "inherit",
  },
  sectionHead: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
    color: "#000",
    paddingBottom: 8,
    borderBottom: "2px solid #000",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f5f5f5",
    fontSize: 12,
  },
};

const SectionHead = ({
  num,
  label,
  mt = true,
}: {
  num: number;
  label: string;
  mt?: boolean;
}) => (
  <div style={{ ...S.sectionHead, marginTop: mt ? 20 : 0 }}>
    <div
      style={{
        width: 18,
        height: 18,
        background: "#000",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {num}
    </div>
    {label}
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div style={S.infoRow}>
    <span style={{ color: "#888", fontWeight: 500 }}>{label}</span>
    <span style={{ color: "#000", fontWeight: 600 }}>{value}</span>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { admin: currentAdmin } = useAdminAuth();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerMode, setDrawerMode] = useState<"add" | "view" | null>(null);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getAdminUsers() as Promise<AdminUser[]>,
      adminApi.getAdminRoles(),
    ])
      .then(([users, r]) => {
        setAdminUsers(users);
        setRoles(r);
        if (r.length > 0) setRoleId(r[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Stats ─────────────────────────────────────────────────
  const total = adminUsers.length;
  const active = adminUsers.filter((u) => u.is_active).length;
  const inactive = adminUsers.filter((u) => !u.is_active).length;

  // ── Open view ─────────────────────────────────────────────
  async function openView(user: AdminUser) {
    setViewUser(user);
    setDrawerMode("view");
    setAuditLoading(true);
    try {
      const log = (await adminApi.getAdminAuditLog(user.id)) as AuditLogEntry[];
      setAuditLog(log);
    } catch {
      setAuditLog([]);
    } finally {
      setAuditLoading(false);
    }
  }

  function openAdd() {
    setEmail("");
    setRoleId(roles[0]?.id ?? 1);
    setFormErrors({});
    setError("");
    setDrawerMode("add");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setViewUser(null);
    setAuditLog([]);
    setError("");
  }

  // ── Validation ────────────────────────────────────────────
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!roleId) errs.role_id = "Please select a role";
    return errs;
  }

  // ── Add admin ─────────────────────────────────────────────
  async function handleAdd() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminApi.createAdminUser(email.trim(), roleId);
      // Refresh list
      const users = (await adminApi.getAdminUsers()) as AdminUser[];
      setAdminUsers(users);
      closeDrawer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setSaving(false);
    }
  }

  // ── Deactivate ────────────────────────────────────────────
  async function handleDeactivate(user: AdminUser) {
    if (
      !confirm(
        `Deactivate ${user.full_name ?? user.email}? They will lose dashboard access immediately.`,
      )
    )
      return;
    try {
      await adminApi.deactivateAdminUser(user.id);
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: false } : u)),
      );
      if (viewUser?.id === user.id)
        setViewUser((prev) => (prev ? { ...prev, is_active: false } : null));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to deactivate");
    }
  }

  // ── Reactivate ────────────────────────────────────────────
  async function handleReactivate(user: AdminUser) {
    try {
      await adminApi.reactivateAdminUser(user.id);
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: true } : u)),
      );
      if (viewUser?.id === user.id)
        setViewUser((prev) => (prev ? { ...prev, is_active: true } : null));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reactivate");
    }
  }

  const isCurrentAdmin = (user: AdminUser) =>
    user.credential_id === currentAdmin?.adminUserId?.toString();

  // ── View Drawer ───────────────────────────────────────────
  const ViewDrawer = viewUser && (
    <>
      <div style={S.drawerBody}>
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 16,
            background: "#fafafa",
            border: "1px solid #e8e8e8",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: "#000",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          >
            {getInitials(viewUser.full_name, viewUser.email)}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#000" }}>
              {viewUser.full_name ?? "—"}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {viewUser.email}
            </div>
          </div>
        </div>

        <SectionHead num={1} label="Details" />
        <InfoRow label="Email" value={viewUser.email} />
        <InfoRow label="Full Name" value={viewUser.full_name ?? "—"} />
        <InfoRow label="Phone" value={viewUser.phone ?? "—"} />
        <InfoRow
          label="Role"
          value={
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                padding: "3px 9px",
                textTransform: "uppercase",
                background: "#000",
                color: "#fff",
              }}
            >
              {viewUser.admin_roles.label}
            </span>
          }
        />
        <InfoRow
          label="Status"
          value={
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                padding: "3px 9px",
                textTransform: "uppercase",
                background: viewUser.is_active ? "#eafaf1" : "#fdecea",
                color: viewUser.is_active ? "#1a7a3c" : "#c0392b",
              }}
            >
              {viewUser.is_active ? "Active" : "Inactive"}
            </span>
          }
        />
        <InfoRow label="Added" value={fmtDate(viewUser.created_at)} />

        <SectionHead num={2} label="Recent Activity" />
        {auditLoading ? (
          <div style={{ fontSize: 12, color: "#888", padding: "8px 0" }}>
            Loading...
          </div>
        ) : auditLog.length === 0 ? (
          <div style={{ fontSize: 12, color: "#888", padding: "8px 0" }}>
            No activity yet
          </div>
        ) : (
          auditLog.map((entry) => (
            <div
              key={entry.id}
              style={{ padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#000" }}>
                {entry.action}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                {entry.entity}
                {entry.entity_id ? ` · #${entry.entity_id}` : ""} ·{" "}
                {fmtDateTime(entry.created_at)}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={S.drawerFoot}>
        {!isCurrentAdmin(viewUser) &&
          (viewUser.is_active ? (
            <button
              style={{ ...S.btnDanger, fontSize: 12, padding: "7px 16px" }}
              onClick={() => handleDeactivate(viewUser)}
            >
              Deactivate
            </button>
          ) : (
            <button
              style={S.btnGhost}
              onClick={() => handleReactivate(viewUser)}
            >
              Reactivate
            </button>
          ))}
        <button style={S.btnGhost} onClick={closeDrawer}>
          Close
        </button>
      </div>
    </>
  );

  // ── Add Drawer ────────────────────────────────────────────
  const AddDrawer = (
    <>
      <div style={S.drawerBody}>
        <div
          style={{
            background: "#fef9e7",
            border: "1px solid #f5e6a3",
            padding: "12px 14px",
            marginBottom: 20,
            fontSize: 12,
            color: "#b7770d",
          }}
        >
          ⚠ The user must already have a storefront account. Enter their
          registered email to grant admin access.
        </div>

        {Object.keys(formErrors).length > 0 && (
          <div
            style={{
              background: "#fdecea",
              border: "1px solid #f5c6c2",
              padding: "10px 14px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#c0392b",
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              ⚠ Fix before saving
            </div>
            {Object.values(formErrors).map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: "#c0392b" }}>
                → {e}
              </div>
            ))}
          </div>
        )}

        <SectionHead num={1} label="User" mt={false} />
        <div style={S.field}>
          <label style={S.label}>
            Email Address <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            style={{
              ...S.input,
              borderColor: formErrors.email ? "#c0392b" : "#e8e8e8",
              background: formErrors.email ? "#fff9f9" : "#fff",
            }}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors((p) => ({ ...p, email: undefined }));
            }}
            placeholder="user@example.com"
          />
          {formErrors.email && (
            <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
              ⚠ {formErrors.email}
            </div>
          )}
        </div>

        <SectionHead num={2} label="Role" />
        <div style={S.field}>
          <label style={S.label}>
            Role <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <select
            style={{ ...S.input }}
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            padding: 12,
            background: "#fafafa",
            border: "1px solid #e8e8e8",
            fontSize: 12,
            color: "#888",
          }}
        >
          Super Admin has full access to all dashboard features including adding
          and removing other admins.
        </div>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "#fdecea",
              border: "1px solid #f5c6c2",
              fontSize: 12,
              color: "#c0392b",
            }}
          >
            ⚠ {error}
          </div>
        )}
      </div>

      <div style={S.drawerFoot}>
        <button style={S.btnGhost} onClick={closeDrawer}>
          Cancel
        </button>
        <button
          style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}
          onClick={handleAdd}
          disabled={saving}
        >
          {saving ? "Adding..." : "Add Admin"}
        </button>
      </div>
    </>
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.topLeft}>
          <span style={S.title}>Admin Users</span>
        </div>
        <button style={S.btn} onClick={openAdd}>
          + Add Admin
        </button>
      </div>

      <div style={S.content}>
        {/* Metrics */}
        <div style={S.metrics}>
          {[
            { label: "Total Admins", value: total, sub: "All admin accounts" },
            { label: "Active", value: active, sub: "Can access dashboard" },
            { label: "Inactive", value: inactive, sub: "Access revoked" },
          ].map((m) => (
            <div key={m.label} style={S.metric}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase" as const,
                  color: "#888",
                  marginBottom: 6,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#000",
                  letterSpacing: -1,
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={S.tableWrap}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                {["Admin", "Role", "Status", "Added", "Actions"].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : adminUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    No admin users found
                  </td>
                </tr>
              ) : (
                adminUsers.map((user) => {
                  const isSelf =
                    user.credential_id ===
                    currentAdmin?.adminUserId?.toString();
                  return (
                    <tr
                      key={user.id}
                      onMouseEnter={(e) =>
                        Array.from(e.currentTarget.cells).forEach(
                          (c) => (c.style.background = "#fafafa"),
                        )
                      }
                      onMouseLeave={(e) =>
                        Array.from(e.currentTarget.cells).forEach(
                          (c) => (c.style.background = ""),
                        )
                      }
                    >
                      <td style={S.td}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              background: "#000",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(user.full_name, user.email)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#000",
                              }}
                            >
                              {user.full_name ?? "—"}
                              {isSelf && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: "#888",
                                    fontWeight: 400,
                                    marginLeft: 6,
                                  }}
                                >
                                  — You
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#888",
                                marginTop: 1,
                              }}
                            >
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={S.td}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            padding: "3px 9px",
                            textTransform: "uppercase",
                            background: "#000",
                            color: "#fff",
                          }}
                        >
                          {user.admin_roles.label}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            padding: "3px 9px",
                            textTransform: "uppercase",
                            background: user.is_active ? "#eafaf1" : "#fdecea",
                            color: user.is_active ? "#1a7a3c" : "#c0392b",
                          }}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={S.td}>{fmtDate(user.created_at)}</td>
                      <td style={S.td}>
                        {isSelf ? (
                          <span style={{ fontSize: 11, color: "#888" }}>—</span>
                        ) : (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              style={S.btnAct}
                              onClick={() => openView(user)}
                            >
                              View
                            </button>
                            {user.is_active ? (
                              <button
                                style={S.btnDanger}
                                onClick={() => handleDeactivate(user)}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                style={S.btnAct}
                                onClick={() => handleReactivate(user)}
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay + Drawer */}
      {drawerMode && (
        <>
          <div style={S.overlay} onClick={closeDrawer} />
          <div style={S.drawer}>
            <div style={S.drawerHead}>
              <span style={S.drawerTitle}>
                {drawerMode === "add"
                  ? "Add Admin User"
                  : (viewUser?.full_name ?? viewUser?.email)}
              </span>
              <button
                onClick={closeDrawer}
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            {drawerMode === "add" ? AddDrawer : ViewDrawer}
          </div>
        </>
      )}
    </div>
  );
}
