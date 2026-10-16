import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { toOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [orders, customers, openOrders, orderCount, unpaid, exchanges] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: { notIn: ["Delivered", "Cancelled"] } } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "Unpaid", status: { not: "Cancelled" } } }),
    prisma.exchange.count({ where: { status: { in: ["Requested", "Accepted"] } } }),
  ]);
  const paid = await prisma.order.findMany({ where: { status: { not: "Cancelled" } }, select: { total: true } });
  const revenue = paid.reduce((sum, order) => sum + order.total, 0);
  const recent = orders.map(toOrder);

  return (
    <>
      <header className="desk-head">
        <p className="eyebrow">Overview</p>
        <h1>Today at the desk</h1>
      </header>
      <div className="desk-stats">
        <article><span>Open orders</span><strong>{openOrders}</strong></article>
        <article><span>Unpaid</span><strong>{unpaid}</strong></article>
        <article><span>Exchanges</span><strong>{exchanges}</strong></article>
        <article><span>Revenue</span><strong>{formatINR(revenue)}</strong></article>
        <article><span>Customers</span><strong>{customers}</strong></article>
        <article><span>Orders</span><strong>{orderCount}</strong></article>
      </div>
      <section className="desk-block">
        <div className="section-head"><h2>Latest orders</h2><Link href="/admin/orders">All orders</Link></div>
        {recent.length === 0 ? <p className="desk-note">No orders yet. A checkout on the shop will land here.</p> : (
          <div className="desk-table-wrap">
            <table className="desk-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Payment</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td><Link href={`/admin/orders/${order.id}`}>{order.id}</Link><br /><small>{new Date(order.createdAt).toLocaleString("en-IN")}</small></td>
                    <td>{order.customer.name}<br /><small>{order.email}</small></td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.status}</td>
                    <td>{formatINR(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
