'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/adminApi'

interface DashboardStats {
  revenueMTD: number
  ordersToday: number
  pendingOrders: number
  activeProducts: number
  revenueLastSevenDays: { day: string; amount: number }[]
  recentOrders: {
    id: number
    order_number: string
    total: number
    status: string
    email: string
    created_at: string
  }[]
  topProducts: {
    id: number
    name: string
    revenue: number
  }[]
}

const STATUS_STYLES: Record<string, string> = {
  PLACED:      'background:#e8f4fd;color:#1a6fa8',
  PROCESSING:  'background:#fef9e7;color:#b7770d',
  SHIPPED:     'background:#f0eafb;color:#6b35b8',
  DELIVERED:   'background:#eafaf1;color:#1a7a3c',
  CANCELLED:   'background:#fdecea;color:#c0392b',
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [orders, products] = await Promise.all([
          adminApi.getOrders() as Promise<any[]>,
          adminApi.getProducts() as Promise<any[]>,
        ])

        const now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const ordersToday = orders.filter(
          (o) => new Date(o.created_at) >= startOfToday
        ).length

        const pendingOrders = orders.filter((o) =>
          ['PLACED', 'PROCESSING'].includes(o.status)
        ).length

        const revenueMTD = orders
          .filter((o) => new Date(o.created_at) >= startOfMonth && o.status !== 'CANCELLED')
          .reduce((sum: number, o: any) => sum + Number(o.total), 0)

        // Last 7 days revenue
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const revenueLastSevenDays = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
          const dayEnd = new Date(dayStart.getTime() + 86400000)
          const amount = orders
            .filter((o) => {
              const t = new Date(o.created_at)
              return t >= dayStart && t < dayEnd && o.status !== 'CANCELLED'
            })
            .reduce((sum: number, o: any) => sum + Number(o.total), 0)
          return { day: days[d.getDay()], amount }
        })

        // Recent 5 orders
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)

        // Top 5 products by revenue from order_items
        const productRevMap: Record<number, { name: string; revenue: number }> = {}
        orders.forEach((o: any) => {
          o.order_items?.forEach((item: any) => {
            if (!productRevMap[item.product_id]) {
              productRevMap[item.product_id] = { name: item.name, revenue: 0 }
            }
            productRevMap[item.product_id].revenue += Number(item.price) * item.quantity
          })
        })
        const topProducts = Object.entries(productRevMap)
          .map(([id, v]) => ({ id: Number(id), ...v }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setStats({
          revenueMTD,
          ordersToday,
          pendingOrders,
          activeProducts: products.length,
          revenueLastSevenDays,
          recentOrders,
          topProducts,
        })
      } catch {
        // token expired or not admin — middleware will redirect
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Dynamically load Chart.js and render after stats load
  useEffect(() => {
    if (!stats) return
    let chart: any = null
    import('chart.js/auto').then((mod) => {
      const Chart = mod.default
      const canvas = document.getElementById('revenueChart') as HTMLCanvasElement
      if (!canvas) return
      chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: stats.revenueLastSevenDays.map((d) => d.day),
          datasets: [{
            label: 'Revenue',
            data: stats.revenueLastSevenDays.map((d) => d.amount),
            backgroundColor: '#000',
            borderRadius: 2,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) => '₹' + ctx.parsed.y.toLocaleString('en-IN'),
              },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#999', font: { size: 11 } } },
            y: {
              grid: { color: '#f0f0f0' },
              ticks: {
                color: '#999',
                font: { size: 11 },
                callback: (v: any) => '₹' + Math.round(v / 1000) + 'k',
              },
            },
          },
        },
      })
    })
    return () => { chart?.destroy() }
  }, [stats])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <p style={{ fontSize: 13, color: '#888', letterSpacing: 1, textTransform: 'uppercase' }}>Loading...</p>
      </div>
    )
  }

  const fmt = (n: number) =>
    n >= 100000
      ? '₹' + (n / 100000).toFixed(1) + 'L'
      : '₹' + n.toLocaleString('en-IN')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'Revenue MTD',     value: fmt(stats?.revenueMTD ?? 0),          delta: null },
          { label: 'Orders Today',    value: String(stats?.ordersToday ?? 0),       delta: null },
          { label: 'Pending Orders',  value: String(stats?.pendingOrders ?? 0),     delta: 'Need action' },
          { label: 'Active Products', value: String(stats?.activeProducts ?? 0),    delta: null },
        ].map((m) => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#000', letterSpacing: -1, lineHeight: 1 }}>{m.value}</div>
            {m.delta && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6, fontWeight: 500 }}>{m.delta}</div>}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Revenue — Last 7 Days</span>
        </div>
        <div style={{ padding: '1rem 1.25rem 1.25rem', height: 220, position: 'relative' }}>
          <canvas id="revenueChart" role="img" aria-label="Revenue bar chart last 7 days" />
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>

        {/* Recent Orders */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Recent Orders</span>
            <span
              onClick={() => router.push('/admin/orders')}
              style={{ fontSize: 11, color: '#888', cursor: 'pointer', fontWeight: 500 }}
            >
              View all →
            </span>
          </div>
          <div style={{ padding: '0 1.25rem' }}>
            {stats?.recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>{order.order_number}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{order.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>₹{Number(order.total).toLocaleString('en-IN')}</div>
                  <div style={{ marginTop: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, padding: '2px 8px', textTransform: 'uppercase', ...(STATUS_STYLES[order.status] ? Object.fromEntries(STATUS_STYLES[order.status].split(';').map(s => s.split(':'))) : {}) }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Top Products</span>
            <span
              onClick={() => router.push('/admin/products')}
              style={{ fontSize: 11, color: '#888', cursor: 'pointer', fontWeight: 500 }}
            >
              View all →
            </span>
          </div>
          <div style={{ padding: '0 1.25rem' }}>
            {stats?.topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < (stats.topProducts.length - 1) ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#ccc', width: 20 }}>0{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#000', flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>₹{Math.round(p.revenue).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { title: 'Add Product',    sub: 'Create a new listing',       href: '/admin/products/new' },
          { title: 'Manage Orders',  sub: 'Update status & refunds',    href: '/admin/orders' },
          { title: 'Promo Codes',    sub: 'Create & deactivate promos', href: '/admin/promos' },
        ].map((a) => (
          <div
            key={a.title}
            onClick={() => router.push(a.href)}
            style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '1rem 1.25rem', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#000')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e8e8e8')}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: 0.5 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}