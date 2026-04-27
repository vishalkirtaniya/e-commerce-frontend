"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

// ── Types ─────────────────────────────────────────────────────
interface CustomerOrder {
  id: number;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
}

interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string;
  created_at: string;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
  orders: CustomerOrder[];
}

interface CustomerStats {
  total_customers: number;
  new_this_month: number;
  with_orders: number;
  avg_order_value: number;
}

// ── Status styles ─────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PLACED: { bg: "#e8f4fd", color: "#1a6fa8" },
  CONFIRMED: { bg: "#eafaf1", color: "#1a7a3c" },
  PACKED: { bg: "#fef9e7", color: "#b7770d" },
  SHIPPED: { bg: "#f0eafb", color: "#6b35b8" },
  OUT_FOR_DELIVERY: { bg: "#fff3e0", color: "#e65100" },
  DELIVERED: { bg: "#eafaf1", color: "#1a7a3c" },
  CANCELLED: { bg: "#fdecea", color: "#c0392b" },
};

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// ── Helpers ───────────────────────────────────────────────────
function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
}

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
  search: {
    fontSize: 12,
    padding: "6px 12px",
    border: "1px solid #e8e8e8",
    background: "#f5f5f5",
    color: "#000",
    outline: "none",
    width: 240,
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
    width: 480,
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
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOrders, setFilterOrders] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    Promise.all([
      adminApi.getCustomers() as Promise<Customer[]>,
      adminApi.getCustomerStats(),
    ])
      .then(([c, s]) => {
        setCustomers(c);
        setStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Filter + Sort ─────────────────────────────────────────
  const filtered = customers
    .filter((c) => {
      const matchSearch =
        (c.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone ?? "").includes(search);

      const matchFilter =
        filterOrders === "all"
          ? true
          : filterOrders === "with_orders"
            ? c.order_count > 0
            : filterOrders === "no_orders"
              ? c.order_count === 0
              : filterOrders === "new"
                ? new Date(c.created_at) >=
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                : true;

      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "most_orders") return b.order_count - a.order_count;
      if (sortBy === "highest_spend")
        return Number(b.total_spent) - Number(a.total_spent);
      return 0;
    });

  // ── Drawer ────────────────────────────────────────────────
  const CustomerDrawer = activeCustomer && (
    <>
      <div style={S.drawerBody}>
        {/* Avatar header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 16,
            background: "#fafafa",
            border: "1px solid #e8e8e8",
            marginBottom: 4,
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
            {getInitials(activeCustomer.full_name, activeCustomer.email)}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#000" }}>
              {activeCustomer.full_name ?? "No name"}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {activeCustomer.email}
            </div>
            {activeCustomer.phone && (
              <div style={{ fontSize: 12, color: "#888" }}>
                {activeCustomer.phone}
              </div>
            )}
          </div>
        </div>

        {/* Profile */}
        <SectionHead num={1} label="Profile" mt={true} />
        <InfoRow label="Full Name" value={activeCustomer.full_name ?? "—"} />
        <InfoRow label="Email" value={activeCustomer.email} />
        <InfoRow label="Phone" value={activeCustomer.phone ?? "—"} />
        <InfoRow label="Joined" value={fmtDate(activeCustomer.created_at)} />

        {/* Purchase summary */}
        <SectionHead num={2} label="Purchase Summary" />
        <InfoRow label="Total Orders" value={activeCustomer.order_count} />
        <InfoRow
          label="Total Spent"
          value={
            <span style={{ fontSize: 15, fontWeight: 900 }}>
              {fmt(Number(activeCustomer.total_spent))}
            </span>
          }
        />
        <InfoRow
          label="Last Order"
          value={
            activeCustomer.last_order_at
              ? fmtDate(activeCustomer.last_order_at)
              : "—"
          }
        />
        {activeCustomer.order_count > 0 && (
          <InfoRow
            label="Avg Order Value"
            value={fmt(
              Math.round(
                Number(activeCustomer.total_spent) / activeCustomer.order_count,
              ),
            )}
          />
        )}

        {/* Recent orders */}
        <SectionHead num={3} label={`Orders (${activeCustomer.order_count})`} />
        {activeCustomer.orders.length === 0 ? (
          <div style={{ fontSize: 12, color: "#888", padding: "12px 0" }}>
            No orders yet
          </div>
        ) : (
          activeCustomer.orders.slice(0, 5).map((order) => {
            const style = STATUS_STYLES[order.status] ?? {
              bg: "#f5f5f5",
              color: "#888",
            };
            return (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>
                    {order.order_number}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
                    {fmtDateTime(order.created_at)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    {fmt(Number(order.total))}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      padding: "2px 8px",
                      textTransform: "uppercase",
                      background: style.bg,
                      color: style.color,
                    }}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {activeCustomer.orders.length > 5 && (
          <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
            +{activeCustomer.orders.length - 5} more orders
          </div>
        )}
      </div>

      <div style={S.drawerFoot}>
        <button style={S.btnGhost} onClick={() => setActiveCustomer(null)}>
          Close
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
          <span style={S.title}>Customers</span>
          <input
            style={S.search}
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={S.select}
            value={filterOrders}
            onChange={(e) => setFilterOrders(e.target.value)}
          >
            <option value="all">All customers</option>
            <option value="with_orders">With orders</option>
            <option value="no_orders">No orders</option>
            <option value="new">New this month</option>
          </select>
          <select
            style={S.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="most_orders">Sort: Most orders</option>
            <option value="highest_spend">Sort: Highest spend</option>
          </select>
        </div>
        <div style={{ fontSize: 12, color: "#888" }}>
          {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={S.content}>
        {/* Metrics */}
        {stats && (
          <div style={S.metrics}>
            {[
              {
                label: "Total Customers",
                value: stats.total_customers,
                sub: "All registered users",
              },
              {
                label: "New This Month",
                value: stats.new_this_month,
                sub: "Signed up this month",
              },
              {
                label: "With Orders",
                value: stats.with_orders,
                sub: `${Math.round((stats.with_orders / stats.total_customers) * 100)}% conversion`,
              },
              {
                label: "Avg Order Value",
                value: fmt(Number(stats.avg_order_value)),
                sub: "Across all customers",
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
                  "Customer",
                  "Phone",
                  "Orders",
                  "Total Spent",
                  "Last Order",
                  "Joined",
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
                    colSpan={7}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setActiveCustomer(c)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      Array.from(e.currentTarget.cells).forEach(
                        (cell) => (cell.style.background = "#fafafa"),
                      )
                    }
                    onMouseLeave={(e) =>
                      Array.from(e.currentTarget.cells).forEach(
                        (cell) => (cell.style.background = ""),
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
                          {getInitials(c.full_name, c.email)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#000",
                            }}
                          >
                            {c.full_name ?? "—"}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#888",
                              marginTop: 1,
                            }}
                          >
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={S.td}>{c.phone ?? "—"}</td>
                    <td style={S.td}>
                      <strong>{c.order_count}</strong>
                    </td>
                    <td style={S.td}>
                      <strong>{fmt(Number(c.total_spent))}</strong>
                    </td>
                    <td style={S.td}>
                      {c.last_order_at ? fmtDate(c.last_order_at) : "—"}
                    </td>
                    <td style={S.td}>{fmtDate(c.created_at)}</td>
                    <td style={S.td} onClick={(e) => e.stopPropagation()}>
                      <button
                        style={S.btnAct}
                        onClick={() => setActiveCustomer(c)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay + Drawer */}
      {activeCustomer && (
        <>
          <div style={S.overlay} onClick={() => setActiveCustomer(null)} />
          <div style={S.drawer}>
            <div style={S.drawerHead}>
              <span style={S.drawerTitle}>
                {activeCustomer.full_name ?? activeCustomer.email}
              </span>
              <button
                onClick={() => setActiveCustomer(null)}
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
            {CustomerDrawer}
          </div>
        </>
      )}
    </div>
  );
}
