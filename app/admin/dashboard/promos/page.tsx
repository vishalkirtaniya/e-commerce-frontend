"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

// ── Types ─────────────────────────────────────────────────────
interface Promo {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  times_used: number;
  total_discount_given: number;
}

interface PromoStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  times_used: number;
  total_discount_given: number;
}

interface FormState {
  code: string;
  discount_percent: string;
  is_active: boolean;
  expires_at: string;
}

interface FormErrors {
  code?: string;
  discount_percent?: string;
}

type DrawerMode = "create" | "edit" | null;

// ── Helpers ───────────────────────────────────────────────────
function fmt(n: number) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPromoStatus(promo: Promo): "active" | "inactive" | "expired" {
  if (promo.expires_at && new Date(promo.expires_at) <= new Date())
    return "expired";
  if (!promo.is_active) return "inactive";
  return "active";
}

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function emptyForm(): FormState {
  return { code: "", discount_percent: "", is_active: true, expires_at: "" };
}

function promoToForm(p: Promo): FormState {
  return {
    code: p.code,
    discount_percent: String(p.discount_percent),
    is_active: p.is_active,
    expires_at: p.expires_at ? p.expires_at.split("T")[0] : "",
  };
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({
  status,
}: {
  status: "active" | "inactive" | "expired";
}) {
  const styles = {
    active: { bg: "#eafaf1", color: "#1a7a3c" },
    inactive: { bg: "#fdecea", color: "#c0392b" },
    expired: { bg: "#f5f5f5", color: "#888" },
  };
  const s = styles[status];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        padding: "3px 9px",
        textTransform: "uppercase",
        display: "inline-block",
        background: s.bg,
        color: s.color,
      }}
    >
      {status}
    </span>
  );
}

// ── Toggle ────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 100,
        background: value ? "#000" : "#e8e8e8",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: value ? 19 : 3,
          transition: "left 0.15s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
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
  search: {
    fontSize: 12,
    padding: "6px 12px",
    border: "1px solid #e8e8e8",
    background: "#f5f5f5",
    color: "#000",
    outline: "none",
    width: 200,
  },
  select: {
    fontSize: 12,
    padding: "6px 10px",
    border: "1px solid #e8e8e8",
    background: "#f5f5f5",
    color: "#000",
    outline: "none",
    cursor: "pointer",
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
  btnDanger: {
    fontSize: 12,
    padding: "4px 10px",
    border: "1px solid #c0392b",
    background: "#fff",
    color: "#c0392b",
    cursor: "pointer",
    fontWeight: 500,
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
  content: {
    flex: 1,
    overflow: "auto",
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  metrics: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
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

// ── Main Page ─────────────────────────────────────────────────
export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [stats, setStats] = useState<PromoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [editPromo, setEditPromo] = useState<Promo | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getPromos() as Promise<Promo[]>,
      adminApi.getPromoStats(),
    ])
      .then(([p, s]) => {
        setPromos(p);
        setStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Filter ────────────────────────────────────────────────
  const filtered = promos.filter((p) => {
    const matchSearch = p.code.toLowerCase().includes(search.toLowerCase());
    const status = getPromoStatus(p);
    const matchStatus = filterStatus === "all" || status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Drawer ────────────────────────────────────────────────
  function openCreate() {
    setForm(emptyForm());
    setEditPromo(null);
    setFormErrors({});
    setError("");
    setDrawerMode("create");
  }

  function openEdit(p: Promo) {
    setForm(promoToForm(p));
    setEditPromo(p);
    setFormErrors({});
    setError("");
    setDrawerMode("edit");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setEditPromo(null);
    setError("");
  }

  function setField(key: keyof FormState, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Validation ────────────────────────────────────────────
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.code.trim()) {
      errs.code = "Promo code is required";
    } else if (!/^[A-Z0-9]+$/.test(form.code)) {
      errs.code = "Code must be uppercase letters and numbers only";
    } else if (form.code.length < 3) {
      errs.code = "Code must be at least 3 characters";
    }
    if (
      !form.discount_percent ||
      Number(form.discount_percent) < 1 ||
      Number(form.discount_percent) > 100
    ) {
      errs.discount_percent = "Discount must be between 1 and 100";
    }
    return errs;
  }

  // ── Save ──────────────────────────────────────────────────
  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = {
        code: form.code.trim().toUpperCase(),
        discount_percent: Number(form.discount_percent),
        is_active: form.is_active,
        expires_at: form.expires_at || null,
      };
      if (drawerMode === "create") {
        const created = (await adminApi.createPromo(body)) as Promo;
        setPromos((prev) => [
          { ...created, times_used: 0, total_discount_given: 0 },
          ...prev,
        ]);
      } else if (drawerMode === "edit" && editPromo) {
        const updated = (await adminApi.updatePromo(
          editPromo.id,
          body,
        )) as Promo;
        setPromos((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
        );
      }
      closeDrawer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // ── Toggle ────────────────────────────────────────────────
  async function handleToggle(p: Promo) {
    try {
      const updated = (await adminApi.togglePromo(p.id)) as Promo;
      setPromos((prev) =>
        prev.map((x) =>
          x.id === updated.id ? { ...x, is_active: updated.is_active } : x,
        ),
      );
    } catch {
      alert("Failed to toggle promo");
    }
  }

  // ── Delete ────────────────────────────────────────────────
  async function handleDelete(p: Promo) {
    if (!confirm(`Delete promo "${p.code}"? This cannot be undone.`)) return;
    try {
      await adminApi.deletePromo(p.id);
      setPromos((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  // ── Form ──────────────────────────────────────────────────
  const DrawerForm = (
    <div style={S.drawerBody}>
      {/* Code preview */}
      <div
        style={{
          background: "#f5f5f5",
          border: "1px solid #e8e8e8",
          padding: 16,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#888",
            textTransform: "uppercase" as const,
            letterSpacing: 0.5,
            marginBottom: 6,
          }}
        >
          Preview
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            fontFamily: "monospace",
            color: "#000",
            letterSpacing: 3,
          }}
        >
          {form.code || "YOURCODE"}
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
          {form.discount_percent ? `${form.discount_percent}% off` : "—% off"}
        </div>
      </div>

      {/* Validation summary */}
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

      {/* Section 1 — Code */}
      <SectionHead num={1} label="Promo Code" mt={false} />
      <div style={S.field}>
        <label style={S.label}>
          Code <span style={{ color: "#c0392b" }}>*</span>
        </label>
        <input
          style={{
            ...S.input,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            borderColor: formErrors.code ? "#c0392b" : "#e8e8e8",
            background: formErrors.code ? "#fff9f9" : "#fff",
          }}
          value={form.code}
          onChange={(e) =>
            setField(
              "code",
              e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
            )
          }
          placeholder="e.g. SUMMER20"
          disabled={drawerMode === "edit"} // code cannot change after creation
        />
        {formErrors.code && (
          <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
            ⚠ {formErrors.code}
          </div>
        )}
        {drawerMode === "edit" && (
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
            Code cannot be changed after creation
          </div>
        )}
      </div>
      {drawerMode === "create" && (
        <button
          onClick={() => setField("code", generateCode())}
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: 0.5,
            color: "#000",
            background: "#fff",
            border: "1px dashed #000",
            padding: "6px 12px",
            cursor: "pointer",
            width: "100%",
            marginBottom: 14,
          }}
        >
          ⟳ Generate Random Code
        </button>
      )}

      {/* Section 2 — Discount */}
      <SectionHead num={2} label="Discount" />
      <div style={S.field}>
        <label style={S.label}>
          Discount Percentage <span style={{ color: "#c0392b" }}>*</span>
        </label>
        <input
          style={{
            ...S.input,
            borderColor: formErrors.discount_percent ? "#c0392b" : "#e8e8e8",
            background: formErrors.discount_percent ? "#fff9f9" : "#fff",
          }}
          type="number"
          min="1"
          max="100"
          value={form.discount_percent}
          onChange={(e) => setField("discount_percent", e.target.value)}
          placeholder="e.g. 20"
        />
        {formErrors.discount_percent && (
          <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
            ⚠ {formErrors.discount_percent}
          </div>
        )}
      </div>

      {/* Section 3 — Expiry & Status */}
      <SectionHead num={3} label="Expiry & Status" />
      <div style={S.field}>
        <label style={S.label}>
          Expiry Date{" "}
          <span
            style={{
              color: "#888",
              fontWeight: 400,
              textTransform: "none" as const,
              letterSpacing: 0,
            }}
          >
            — leave empty for no expiry
          </span>
        </label>
        <input
          style={S.input}
          type="date"
          value={form.expires_at}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setField("expires_at", e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          border: "1px solid #e8e8e8",
          background: "#fafafa",
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#000" }}>
            Active
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
            Customers can use this code immediately
          </div>
        </div>
        <Toggle
          value={form.is_active}
          onChange={(v) => setField("is_active", v)}
        />
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
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.topLeft}>
          <span style={S.title}>Promo Codes</span>
          <input
            style={S.search}
            placeholder="Search by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
          />
          <select
            style={S.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <button style={S.btn} onClick={openCreate}>
          + Create Promo
        </button>
      </div>

      <div style={S.content}>
        {/* Metrics */}
        {stats && (
          <div style={S.metrics}>
            {[
              { label: "Total Promos", value: stats.total, sub: "All time" },
              {
                label: "Active",
                value: stats.active,
                sub: "Currently running",
              },
              {
                label: "Times Used",
                value: stats.times_used,
                sub: "Across all promos",
              },
              {
                label: "Total Discount Given",
                value: fmt(Number(stats.total_discount_given)),
                sub: "Revenue impact",
              },
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
        )}

        {/* Table */}
        <div style={S.tableWrap}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                {[
                  "Code",
                  "Discount",
                  "Status",
                  "Times Used",
                  "Discount Given",
                  "Expires",
                  "Created",
                  "Actions",
                ].map((h) => (
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
                    colSpan={8}
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    No promo codes found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const status = getPromoStatus(p);
                  return (
                    <tr
                      key={p.id}
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
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#000",
                            background: "#f5f5f5",
                            padding: "3px 8px",
                            border: "1px solid #e8e8e8",
                            letterSpacing: 1,
                          }}
                        >
                          {p.code}
                        </span>
                      </td>
                      <td style={S.td}>
                        <strong>{p.discount_percent}%</strong>
                      </td>
                      <td style={S.td}>
                        <StatusBadge status={status} />
                      </td>
                      <td style={S.td}>{p.times_used}</td>
                      <td style={S.td}>
                        {fmt(Number(p.total_discount_given))}
                      </td>
                      <td style={S.td}>
                        {p.expires_at ? fmtDate(p.expires_at) : "No expiry"}
                      </td>
                      <td style={S.td}>{fmtDate(p.created_at)}</td>
                      <td style={S.td}>
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {status !== "expired" && (
                            <button
                              style={S.btnAct}
                              onClick={() => openEdit(p)}
                            >
                              Edit
                            </button>
                          )}
                          {status !== "expired" && (
                            <button
                              style={S.btnAct}
                              onClick={() => handleToggle(p)}
                            >
                              {p.is_active ? "Deactivate" : "Activate"}
                            </button>
                          )}
                          {p.times_used === 0 && (
                            <button
                              style={S.btnDanger}
                              onClick={() => handleDelete(p)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
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
                {drawerMode === "create"
                  ? "Create Promo Code"
                  : `Edit — ${editPromo?.code}`}
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
            {DrawerForm}
            <div style={S.drawerFoot}>
              <button style={S.btnGhost} onClick={closeDrawer}>
                Cancel
              </button>
              <button
                style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : drawerMode === "create"
                    ? "Create Promo"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
