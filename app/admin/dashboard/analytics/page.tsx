"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { adminApi } from "@/lib/adminApi";

// ── Types ─────────────────────────────────────────────────────
interface Overview {
  revenue: number;
  orders: number;
  aov: number;
  revenue_delta: number;
  orders_delta: number;
  aov_delta: number;
  conversion_rate: number;
  total_customers: number;
  customers_with_orders: number;
}

interface RevenuePoint {
  period: string;
  revenue: number;
  orders: number;
}
interface StatusPoint {
  status: string;
  count: number;
  percentage: number;
}
interface ProductPoint {
  product_id: number;
  name: string;
  revenue: number;
  units_sold: number;
  order_count: number;
}
interface MaterialPoint {
  material: string;
  revenue: number;
  units_sold: number;
}
interface CategoryPoint {
  category: string;
  revenue: number;
  units_sold: number;
}
interface GrowthPoint {
  period: string;
  new_customers: number;
}

// ── Status config ─────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  PLACED: "#1a6fa8",
  CONFIRMED: "#1a7a3c",
  PACKED: "#b7770d",
  SHIPPED: "#6b35b8",
  OUT_FOR_DELIVERY: "#e65100",
  DELIVERED: "#1a7a3c",
};

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

// ── Helpers ───────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "k";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function fmtFull(n: number) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function fmtLabel(dateStr: string, period: number): string {
  const d = new Date(dateStr);
  if (period <= 30) return `${d.getDate()}/${d.getMonth() + 1}`;
  if (period <= 90)
    return `W${Math.ceil(d.getDate() / 7)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]}`;
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][d.getMonth()];
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
    overflowY: "auto" as const,
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
  card: { background: "#fff", border: "1px solid #e8e8e8" },
  cardHead: {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #e8e8e8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    color: "#000",
  },
  cardBody: { padding: "1rem 1.25rem" },
  row2: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
};

// ── Delta badge ───────────────────────────────────────────────
function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <div
      style={{
        fontSize: 11,
        marginTop: 6,
        fontWeight: 500,
        color: up ? "#1a7a3c" : "#c0392b",
      }}
    >
      {up ? "↑" : "↓"} {Math.abs(value)}% vs previous period
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState(30);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [statuses, setStatuses] = useState<StatusPoint[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPoint[]>([]);
  const [materials, setMaterials] = useState<MaterialPoint[]>([]);
  const [categories, setCategories] = useState<CategoryPoint[]>([]);
  const [growth, setGrowth] = useState<GrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Chart refs
  const revenueRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<HTMLCanvasElement>(null);
  const categoryRef = useRef<HTMLCanvasElement>(null);
  const growthRef = useRef<HTMLCanvasElement>(null);

  // Chart instances
  const charts = useRef<Record<string, any>>({});

  const loadData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const [ov, rev, st, tp, mat, cat, gr] = await Promise.all([
        adminApi.getAnalyticsOverview(p),
        adminApi.getRevenueChart(p),
        adminApi.getOrdersByStatus(p),
        adminApi.getTopProducts(p),
        adminApi.getRevenueByMaterial(p),
        adminApi.getRevenueByCategory(p),
        adminApi.getCustomerGrowth(p),
      ]);
      setOverview(ov);
      setRevenue(rev);
      setStatuses(st);
      setTopProducts(tp);
      setMaterials(mat);
      setCategories(cat);
      setGrowth(gr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(period);
  }, [period, loadData]);

  // ── Render charts ─────────────────────────────────────────
  useEffect(() => {
    if (loading || !revenue.length) return;
    import("chart.js/auto").then(({ default: Chart }) => {
      const gridColor = "rgba(0,0,0,0.05)";
      const tickColor = "#999";
      const tickFont = { size: 10 };

      // Destroy old
      Object.values(charts.current).forEach((c: any) => c?.destroy());
      charts.current = {};

      // Revenue chart
      if (revenueRef.current) {
        charts.current.revenue = new Chart(revenueRef.current, {
          type: "bar",
          data: {
            labels: revenue.map((r) => fmtLabel(r.period, period)),
            datasets: [
              {
                label: "Revenue",
                data: revenue.map((r) => Number(r.revenue)),
                backgroundColor: "#000",
                borderRadius: 2,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: { label: (ctx: any) => fmtFull(ctx.parsed.y) },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: tickColor, font: tickFont, maxTicksLimit: 12 },
              },
              y: {
                grid: { color: gridColor },
                ticks: {
                  color: tickColor,
                  font: tickFont,
                  callback: (v: any) => fmt(v),
                },
              },
            },
          },
        });
      }

      // Status donut
      if (statusRef.current && statuses.length) {
        charts.current.status = new Chart(statusRef.current, {
          type: "doughnut",
          data: {
            labels: statuses.map((s) => STATUS_LABELS[s.status] ?? s.status),
            datasets: [
              {
                data: statuses.map((s) => s.count),
                backgroundColor: statuses.map(
                  (s) => STATUS_COLORS[s.status] ?? "#888",
                ),
                borderWidth: 0,
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: "65%",
          },
        });
      }

      // Material bar
      if (materialRef.current && materials.length) {
        charts.current.material = new Chart(materialRef.current, {
          type: "bar",
          data: {
            labels: materials.map((m) => m.material),
            datasets: [
              {
                data: materials.map((m) => Number(m.revenue)),
                backgroundColor: "#000",
                borderRadius: 2,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: tickColor, font: tickFont },
              },
              y: {
                grid: { color: gridColor },
                ticks: {
                  color: tickColor,
                  font: tickFont,
                  callback: (v: any) => fmt(v),
                },
              },
            },
          },
        });
      }

      // Category bar
      if (categoryRef.current && categories.length) {
        charts.current.category = new Chart(categoryRef.current, {
          type: "bar",
          data: {
            labels: categories.map((c) => c.category),
            datasets: [
              {
                data: categories.map((c) => Number(c.revenue)),
                backgroundColor: "#000",
                borderRadius: 2,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: tickColor, font: tickFont },
              },
              y: {
                grid: { color: gridColor },
                ticks: {
                  color: tickColor,
                  font: tickFont,
                  callback: (v: any) => fmt(v),
                },
              },
            },
          },
        });
      }

      // Growth line
      if (growthRef.current && growth.length) {
        charts.current.growth = new Chart(growthRef.current, {
          type: "line",
          data: {
            labels: growth.map((g) => fmtLabel(g.period, period)),
            datasets: [
              {
                label: "New customers",
                data: growth.map((g) => g.new_customers),
                borderColor: "#000",
                backgroundColor: "rgba(0,0,0,0.05)",
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: tickColor, font: tickFont, maxTicksLimit: 8 },
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: tickColor, font: tickFont },
              },
            },
          },
        });
      }
    });

    return () => {
      Object.values(charts.current).forEach((c: any) => c?.destroy());
    };
  }, [loading, revenue, statuses, materials, categories, growth, period]);

  const maxProductRevenue = topProducts[0]?.revenue ?? 1;

  const periodLabel =
    period <= 7
      ? "Last 7 days"
      : period <= 30
        ? "Last 30 days"
        : period <= 90
          ? "Last 90 days"
          : "This year";

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.topLeft}>
          <span style={S.title}>Analytics</span>
          <select
            style={S.select}
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>This year</option>
          </select>
        </div>
        <div style={{ fontSize: 11, color: "#888" }}>
          {loading ? "Loading..." : periodLabel}
        </div>
      </div>

      <div style={S.content}>
        {/* Metrics */}
        <div style={S.metrics}>
          {[
            {
              label: "Total Revenue",
              value: overview ? fmt(Number(overview.revenue)) : "—",
              delta: overview?.revenue_delta ?? 0,
            },
            {
              label: "Total Orders",
              value: overview?.orders ?? "—",
              delta: overview?.orders_delta ?? 0,
            },
            {
              label: "Avg Order Value",
              value: overview ? fmt(Number(overview.aov)) : "—",
              delta: overview?.aov_delta ?? 0,
            },
            {
              label: "Conversion Rate",
              value: overview ? `${overview.conversion_rate}%` : "—",
              sub: "Customers with orders",
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
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#000",
                  letterSpacing: -1,
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              {"delta" in m && m.delta !== undefined ? (
                <Delta value={Number(m.delta)} />
              ) : (
                <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
                  {m.sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div style={S.card}>
          <div style={S.cardHead}>
            <span style={S.cardTitle}>Revenue Over Time</span>
            <span style={{ fontSize: 11, color: "#888" }}>
              {period <= 90 ? "Daily" : "Weekly"} — {periodLabel}
            </span>
          </div>
          <div
            style={{
              height: 220,
              padding: "1rem 1.25rem 1.25rem",
              position: "relative",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontSize: 12,
                  color: "#888",
                }}
              >
                Loading...
              </div>
            ) : (
              <canvas
                ref={revenueRef}
                role="img"
                aria-label="Revenue over time"
              />
            )}
          </div>
        </div>

        {/* Row 2 — Top products + Orders by status */}
        <div style={S.row2}>
          {/* Top products */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Top Products by Revenue</span>
              <span style={{ fontSize: 11, color: "#888" }}>{periodLabel}</span>
            </div>
            <div style={S.cardBody}>
              {loading ? (
                <div style={{ fontSize: 12, color: "#888" }}>Loading...</div>
              ) : topProducts.length === 0 ? (
                <div style={{ fontSize: 12, color: "#888" }}>
                  No data for this period
                </div>
              ) : (
                topProducts.map((p, i) => (
                  <div
                    key={p.product_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 0",
                      borderBottom:
                        i < topProducts.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ccc",
                        width: 20,
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#000",
                      }}
                    >
                      {p.name}
                    </span>
                    <div
                      style={{
                        width: 80,
                        height: 4,
                        background: "#f0f0f0",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          height: 4,
                          background: "#000",
                          width: `${(Number(p.revenue) / Number(maxProductRevenue)) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#000",
                        flexShrink: 0,
                      }}
                    >
                      {fmt(Number(p.revenue))}
                    </span>
                    <span
                      style={{ fontSize: 11, color: "#888", flexShrink: 0 }}
                    >
                      {p.units_sold} units
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Orders by status */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Orders by Status</span>
            </div>
            <div style={S.cardBody}>
              <div
                style={{ height: 160, position: "relative", marginBottom: 12 }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    Loading...
                  </div>
                ) : (
                  <canvas
                    ref={statusRef}
                    role="img"
                    aria-label="Orders by status"
                  />
                )}
              </div>
              {statuses.map((s) => (
                <div
                  key={s.status}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: "1px solid #f5f5f5",
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: STATUS_COLORS[s.status] ?? "#888",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      color: "#000",
                      fontWeight: 500,
                      marginLeft: 8,
                    }}
                  >
                    {STATUS_LABELS[s.status] ?? s.status}
                  </span>
                  <span style={{ fontWeight: 700, color: "#000" }}>
                    {s.count}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#888",
                      marginLeft: 6,
                      width: 36,
                      textAlign: "right" as const,
                    }}
                  >
                    {s.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3 — Material, Category, Growth */}
        <div style={S.row3}>
          {/* Revenue by material */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>By Material</span>
            </div>
            <div style={S.cardBody}>
              <div style={{ height: 160, position: "relative" }}>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    Loading...
                  </div>
                ) : (
                  <canvas
                    ref={materialRef}
                    role="img"
                    aria-label="Revenue by material"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Revenue by category */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>By Category</span>
            </div>
            <div style={S.cardBody}>
              <div style={{ height: 160, position: "relative" }}>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    Loading...
                  </div>
                ) : (
                  <canvas
                    ref={categoryRef}
                    role="img"
                    aria-label="Revenue by category"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Customer growth */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Customer Growth</span>
            </div>
            <div style={S.cardBody}>
              <div style={{ height: 160, position: "relative" }}>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    Loading...
                  </div>
                ) : (
                  <canvas
                    ref={growthRef}
                    role="img"
                    aria-label="Customer growth"
                  />
                )}
              </div>
              {overview && (
                <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#888",
                        textTransform: "uppercase" as const,
                        letterSpacing: 0.5,
                      }}
                    >
                      Total
                    </div>
                    <div
                      style={{ fontSize: 16, fontWeight: 900, color: "#000" }}
                    >
                      {overview.total_customers}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#888",
                        textTransform: "uppercase" as const,
                        letterSpacing: 0.5,
                      }}
                    >
                      With Orders
                    </div>
                    <div
                      style={{ fontSize: 16, fontWeight: 900, color: "#000" }}
                    >
                      {overview.customers_with_orders}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
