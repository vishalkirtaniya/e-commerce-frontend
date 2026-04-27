"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

// ── Types ─────────────────────────────────────────────────────
interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  image_url: string | null;
  price: number;
  size_label: string | null;
  quantity: number;
  customization: string | null;
}

interface Address {
  id: number;
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
}

interface Order {
  id: number;
  order_number: string;
  user_id: string;
  email: string;
  phone: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
  payment_method: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  addresses: Address | null;
}

type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

type DrawerMode = "view" | "status" | "refund" | null;

// ── Status config ─────────────────────────────────────────────
const STATUS_LABELS: Record<OrderStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

const STATUS_DESC: Record<OrderStatus, string> = {
  PLACED: "Order received, awaiting confirmation",
  CONFIRMED: "Order confirmed by store",
  PACKED: "Order has been packed",
  SHIPPED: "Order handed to courier",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered to customer",
};

const STATUS_FLOW: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

// Valid next statuses for each status
const STATUS_NEXT: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["CONFIRMED"],
  CONFIRMED: ["PACKED"],
  PACKED: ["SHIPPED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
};

const STATUS_STYLES: Record<
  OrderStatus | string,
  { bg: string; color: string }
> = {
  PLACED: { bg: "#e8f4fd", color: "#1a6fa8" },
  CONFIRMED: { bg: "#eafaf1", color: "#1a7a3c" },
  PACKED: { bg: "#fef9e7", color: "#b7770d" },
  SHIPPED: { bg: "#f0eafb", color: "#6b35b8" },
  OUT_FOR_DELIVERY: { bg: "#fff3e0", color: "#e65100" },
  DELIVERED: { bg: "#eafaf1", color: "#1a7a3c" },
};

// ── Helpers ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? { bg: "#f5f5f5", color: "#888" };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        padding: "3px 9px",
        textTransform: "uppercase",
        display: "inline-block",
        background: style.bg,
        color: style.color,
      }}
    >
      {STATUS_LABELS[status as OrderStatus] ?? status}
    </span>
  );
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
  content: { flex: 1, overflow: "auto", padding: "1.25rem 1.5rem" },
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
    width: 500,
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
    padding: "7px 16px",
    border: "1px solid #c0392b",
    background: "#fff",
    color: "#c0392b",
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
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "8px 0",
    borderBottom: "1px solid #f5f5f5",
    fontSize: 12,
  },
};

const SectionHead = ({ num, label }: { num: number; label: string }) => (
  <div style={{ ...S.sectionHead, marginTop: num === 1 ? 0 : 20 }}>
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
    <span
      style={{
        color: "#000",
        fontWeight: 600,
        textAlign: "right",
        maxWidth: 280,
      }}
    >
      {value}
    </span>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getOrders()
      .then((data) => setOrders(data as Order[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Filtering ─────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.email ?? "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "all" || o.status === filterStatus;

    const now = new Date();
    const created = new Date(o.created_at);
    const matchDate =
      filterDate === "all"
        ? true
        : filterDate === "today"
          ? created.toDateString() === now.toDateString()
          : filterDate === "week"
            ? now.getTime() - created.getTime() < 7 * 86400000
            : filterDate === "month"
              ? created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
              : true;

    return matchSearch && matchStatus && matchDate;
  });

  // ── Drawer helpers ────────────────────────────────────────
  function openView(order: Order) {
    setActiveOrder(order);
    setError("");
    setDrawerMode("view");
  }

  function openStatus(order: Order) {
    setActiveOrder(order);
    setSelectedStatus(STATUS_NEXT[order.status]?.[0] ?? null);
    setError("");
    setDrawerMode("status");
  }

  function openRefund(order: Order) {
    setActiveOrder(order);
    setError("");
    setDrawerMode("refund");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setActiveOrder(null);
    setError("");
  }

  // ── Status update ─────────────────────────────────────────
  async function handleStatusUpdate() {
    if (!activeOrder || !selectedStatus) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.updateOrderStatus(
        String(activeOrder.id),
        selectedStatus,
        STATUS_LABELS[selectedStatus],
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeOrder.id ? { ...o, status: selectedStatus } : o,
        ),
      );
      closeDrawer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  // ── Refund ────────────────────────────────────────────────
  async function handleRefund() {
    if (!activeOrder) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.refundOrder(String(activeOrder.id));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeOrder.id ? { ...o, status: "DELIVERED" } : o,
        ),
      );
      closeDrawer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to process refund");
    } finally {
      setSaving(false);
    }
  }

  // ── View Drawer ───────────────────────────────────────────
  const ViewDrawer = activeOrder && (
    <>
      <div style={S.drawerBody}>
        {/* Order Summary */}
        <SectionHead num={1} label="Order Summary" />
        <InfoRow label="Order Number" value={activeOrder.order_number} />
        <InfoRow
          label="Status"
          value={<StatusBadge status={activeOrder.status} />}
        />
        <InfoRow label="Date" value={fmtDateTime(activeOrder.created_at)} />
        <InfoRow
          label="Payment Method"
          value={activeOrder.payment_method ?? "—"}
        />
        {activeOrder.estimated_delivery && (
          <InfoRow
            label="Estimated Delivery"
            value={fmtDate(activeOrder.estimated_delivery)}
          />
        )}

        {/* Customer */}
        <SectionHead num={2} label="Customer" />
        <InfoRow label="Email" value={activeOrder.email} />
        <InfoRow label="Phone" value={activeOrder.phone ?? "—"} />
        {activeOrder.addresses && (
          <InfoRow
            label="Delivery Address"
            value={
              <span>
                {activeOrder.addresses.first_name}{" "}
                {activeOrder.addresses.last_name}
                <br />
                {activeOrder.addresses.street_address}
                <br />
                {activeOrder.addresses.city}, {activeOrder.addresses.state}{" "}
                {activeOrder.addresses.zip_code}
                <br />
                {activeOrder.addresses.phone}
              </span>
            }
          />
        )}

        {/* Items */}
        <SectionHead
          num={3}
          label={`Items (${activeOrder.order_items?.length ?? 0})`}
        />
        {activeOrder.order_items?.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #f5f5f5",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#f5f5f5",
                border: "1px solid #e8e8e8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 16 }}>📦</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#000" }}>
                {item.name}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
                {item.size_label && `Size: ${item.size_label} · `}Qty:{" "}
                {item.quantity}
                {item.customization && ` · "${item.customization}"`}
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>
              {fmt(Number(item.price) * item.quantity)}
            </div>
          </div>
        ))}

        {/* Payment Breakdown */}
        <SectionHead num={4} label="Payment Breakdown" />
        <InfoRow label="Subtotal" value={fmt(activeOrder.subtotal)} />
        <InfoRow label="Delivery Fee" value={fmt(activeOrder.delivery_fee)} />
        <InfoRow
          label="Discount"
          value={
            activeOrder.discount_amount > 0
              ? `-${fmt(activeOrder.discount_amount)}`
              : "₹0"
          }
        />
        <div
          style={{
            ...S.infoRow,
            borderTop: "2px solid #000",
            marginTop: 4,
            paddingTop: 8,
          }}
        >
          <span style={{ fontWeight: 700, color: "#000", fontSize: 13 }}>
            Total
          </span>
          <span style={{ fontWeight: 900, color: "#000", fontSize: 16 }}>
            {fmt(activeOrder.total)}
          </span>
        </div>

        {/* Status Timeline */}
        <SectionHead num={5} label="Status Timeline" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {STATUS_FLOW.map((s, i) => {
            const currentIdx = STATUS_FLOW.indexOf(activeOrder.status);
            const isPast = i <= currentIdx;
            const isLast = i === STATUS_FLOW.length - 1;
            return (
              <div key={s}>
                <div
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: isPast ? "#000" : "#e8e8e8",
                      border: isPast ? "none" : "2px solid #e8e8e8",
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: isPast ? "#000" : "#ccc",
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {STATUS_DESC[s]}
                    </div>
                  </div>
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 1,
                      height: 20,
                      background: "#e8e8e8",
                      marginLeft: 4,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={S.drawerFoot}>
        <button style={S.btnGhost} onClick={closeDrawer}>
          Close
        </button>
        {STATUS_NEXT[activeOrder.status].length > 0 && (
          <button style={S.btn} onClick={() => openStatus(activeOrder)}>
            Update Status
          </button>
        )}
        {activeOrder.status === "DELIVERED" && (
          <button style={S.btnDanger} onClick={() => openRefund(activeOrder)}>
            Refund
          </button>
        )}
      </div>
    </>
  );

  // ── Status Drawer ─────────────────────────────────────────
  const StatusDrawer = activeOrder && (
    <>
      <div style={S.drawerBody}>
        <SectionHead num={1} label="Current Status" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px",
            background: "#fafafa",
            border: "1px solid #e8e8e8",
          }}
        >
          <StatusBadge status={activeOrder.status} />
          <span style={{ fontSize: 12, color: "#888" }}>
            {STATUS_DESC[activeOrder.status]}
          </span>
        </div>

        <SectionHead num={2} label="Update To" />
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {STATUS_NEXT[activeOrder.status].map((s) => (
            <div
              key={s}
              onClick={() => setSelectedStatus(s)}
              style={{
                padding: "12px",
                border: `2px solid ${selectedStatus === s ? "#000" : "#e8e8e8"}`,
                cursor: "pointer",
                background: selectedStatus === s ? "#000" : "#fff",
                transition: "all 0.1s",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.5,
                  color: selectedStatus === s ? "#fff" : "#000",
                }}
              >
                {STATUS_LABELS[s]}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color:
                    selectedStatus === s ? "rgba(255,255,255,0.6)" : "#888",
                  marginTop: 2,
                }}
              >
                {STATUS_DESC[s]}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div
            style={{
              marginTop: 12,
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
          style={{ ...S.btn, opacity: !selectedStatus || saving ? 0.6 : 1 }}
          onClick={handleStatusUpdate}
          disabled={!selectedStatus || saving}
        >
          {saving ? "Updating..." : "Confirm Update"}
        </button>
      </div>
    </>
  );

  // ── Refund Drawer ─────────────────────────────────────────
  const RefundDrawer = activeOrder && (
    <>
      <div style={S.drawerBody}>
        <SectionHead num={1} label="Refund Details" />
        <div
          style={{
            background: "#fdecea",
            border: "1px solid #f5c6c2",
            padding: 16,
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
              marginBottom: 8,
            }}
          >
            ⚠ This action cannot be undone
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#c0392b",
              letterSpacing: -1,
            }}
          >
            {fmt(activeOrder.total)}
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
            Full order amount will be refunded via Razorpay to the original
            payment method
          </div>
        </div>

        <SectionHead num={2} label="Order Info" />
        <InfoRow label="Order" value={activeOrder.order_number} />
        <InfoRow label="Customer" value={activeOrder.email} />
        <InfoRow
          label="Payment Method"
          value={activeOrder.payment_method ?? "—"}
        />
        <InfoRow
          label="Refund Amount"
          value={
            <span style={{ color: "#c0392b", fontWeight: 900 }}>
              {fmt(activeOrder.total)}
            </span>
          }
        />

        <div
          style={{
            marginTop: 16,
            padding: "12px",
            background: "#fafafa",
            border: "1px solid #e8e8e8",
            fontSize: 12,
            color: "#888",
          }}
        >
          Refunds typically take 5–7 business days to reflect in the customer's
          account.
        </div>

        {error && (
          <div
            style={{
              marginTop: 12,
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
          style={{ ...S.btnDanger, opacity: saving ? 0.6 : 1 }}
          onClick={handleRefund}
          disabled={saving}
        >
          {saving ? "Processing..." : "Confirm Refund"}
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
          <span style={S.title}>Orders</span>
          <input
            style={S.search}
            placeholder="Search by order # or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={S.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            style={S.select}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>
        <div style={{ fontSize: 12, color: "#888" }}>
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div style={S.content}>
        <div style={S.tableWrap}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Date",
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
                    Loading orders...
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
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => openView(order)}
                    style={{ cursor: "pointer" }}
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
                      <div style={{ fontSize: 12, fontWeight: 700 }}>
                        {order.order_number}
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize: 12, color: "#000" }}>
                        {order.email}
                      </div>
                      {order.phone && (
                        <div
                          style={{ fontSize: 11, color: "#888", marginTop: 1 }}
                        >
                          {order.phone}
                        </div>
                      )}
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize: 12 }}>
                        {order.order_items?.length ?? 0} item
                        {(order.order_items?.length ?? 0) !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>
                        {fmt(order.total)}
                      </div>
                    </td>
                    <td style={S.td}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={S.td}>
                      <div style={{ fontSize: 12 }}>
                        {fmtDate(order.created_at)}
                      </div>
                    </td>
                    <td style={S.td} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={S.btnAct}
                          onClick={() => openView(order)}
                        >
                          View
                        </button>
                        {STATUS_NEXT[order.status].length > 0 && (
                          <button
                            style={S.btnAct}
                            onClick={() => openStatus(order)}
                          >
                            Update
                          </button>
                        )}
                        {order.status === "DELIVERED" && (
                          <button
                            style={{ ...S.btnAct, color: "#c0392b" }}
                            onClick={() => openRefund(order)}
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay */}
      {drawerMode && <div style={S.overlay} onClick={closeDrawer} />}

      {/* Drawer */}
      {drawerMode && activeOrder && (
        <div style={S.drawer}>
          <div style={S.drawerHead}>
            <span style={S.drawerTitle}>
              {drawerMode === "view"
                ? `Order — ${activeOrder.order_number}`
                : drawerMode === "status"
                  ? `Update Status — ${activeOrder.order_number}`
                  : `Refund — ${activeOrder.order_number}`}
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
          {drawerMode === "view" && ViewDrawer}
          {drawerMode === "status" && StatusDrawer}
          {drawerMode === "refund" && RefundDrawer}
        </div>
      )}
    </div>
  );
}
