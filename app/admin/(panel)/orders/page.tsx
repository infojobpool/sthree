import Link from "next/link";
import OrderStatus from "@/components/admin/OrderStatus";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { toOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const needle = q.trim().toLowerCase();
  const orders = (await prisma.order.findMany({ orderBy: { createdAt: "desc" } })).map(toOrder).filter((order) => {
    if (!needle) return true;
    return [order.id, order.email, order.customer.name, order.customer.phone, order.status].join(" ").toLowerCase().includes(needle);
  });

  return (
    <>
      <header className="desk-head">
        <h1>Orders</h1>
        <p className="desk-note">{orders.length === 1 ? "1 order" : `${orders.length} orders`}</p>
      </header>
      <div className="desk-toolbar">
        <form className="desk-search" action="/admin/orders">
          <input name="q" defaultValue={q} placeholder="Search order id, name, or mobile" aria-label="Find an order" />
          <button className="btn" type="submit">Search</button>
        </form>
      </div>
      {orders.length === 0 ? <p className="desk-note">No orders match.</p> : (
        <div className="desk-table-wrap">
          <table className="desk-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Pieces</th><th>Payment</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><Link href={`/admin/orders/${order.id}`}>{order.id}</Link><br /><small>{new Date(order.createdAt).toLocaleString("en-IN")}</small></td>
                  <td>
                    {order.customer.name}<br />
                    <small>{order.email} · {order.customer.phone}</small><br />
                    <small>{order.customer.address}, {order.customer.city} {order.customer.pincode}</small>
                  </td>
                  <td>{order.lines.map((line) => `${line.name} · ${line.size} × ${line.qty}`).join(", ")}</td>
                  <td><span className={`desk-pill${order.paymentStatus === "Paid" ? " is-ok" : " is-warn"}`}>{order.paymentStatus}</span><br /><small>{order.payment}{order.code ? ` · ${order.code}` : ""}</small></td>
                  <td>{formatINR(order.total)}</td>
                  <td><OrderStatus id={order.id} status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
