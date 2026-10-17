import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { toOrder } from "@/lib/orders";
import { getDeskProducts, getShopSettings } from "@/lib/storefront";
import { studio } from "@/lib/studio";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [session, orders, customers, openOrders, orderCount, unpaid, exchanges, pieces, settings] = await Promise.all([
    getSession(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: { notIn: ["Delivered", "Cancelled"] } } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "Unpaid", status: { not: "Cancelled" } } }),
    prisma.exchange.count({ where: { status: { in: ["Requested", "Accepted"] } } }),
    getDeskProducts(),
    getShopSettings(),
  ]);
  const paid = await prisma.order.findMany({ where: { status: { not: "Cancelled" } }, select: { total: true } });
  const revenue = paid.reduce((sum, order) => sum + order.total, 0);
  const recent = orders.map(toOrder);
  const live = pieces.filter((product) => !product.hidden);
  const out = pieces.filter((product) => !product.inStock);
  const hidden = pieces.filter((product) => product.hidden);
  const women = live.filter((product) => product.audience === "women").length;
  const men = live.filter((product) => product.audience === "men").length;
  const kids = live.filter((product) => product.audience === "kids").length;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <header className="desk-head dash-head">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>Dashboard</h1>
          <p className="desk-note">Nagole floor · signed in as {session?.name || session?.email}</p>
        </div>
        <div className="dash-actions">
          <Link className="btn" href="/admin/products/new">Add product</Link>
          <Link className="btn btn-ghost" href="/admin/orders">Orders</Link>
          <Link className="btn btn-ghost" href="/admin/products">Edit stock</Link>
          <a className="btn btn-ghost" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </header>

      <div className="desk-stats">
        <article><span>Open orders</span><strong>{openOrders}</strong></article>
        <article className={unpaid ? "is-warn" : undefined}><span>Unpaid</span><strong>{unpaid}</strong></article>
        <article className={exchanges ? "is-warn" : undefined}><span>Exchanges</span><strong>{exchanges}</strong></article>
        <article><span>Revenue</span><strong>{formatINR(revenue)}</strong></article>
        <article className={out.length ? "is-warn" : undefined}><span>Out of stock</span><strong>{out.length}</strong></article>
        <article><span>Live pieces</span><strong>{live.length}</strong></article>
      </div>

      <div className="dash-grid">
        <section className="desk-card">
          <div className="section-head">
            <h2>Latest orders</h2>
            <Link href="/admin/orders">All orders</Link>
          </div>
          {recent.length === 0 ? (
            <div className="dash-empty">
              <p>No web orders yet. Walk-in bills and checkout from the shop will show here.</p>
              <form className="desk-search" action="/admin/orders">
                <input name="q" placeholder="Find an order by name or mobile" aria-label="Find an order" />
                <button className="btn" type="submit">Search</button>
              </form>
            </div>
          ) : (
            <div className="desk-table-wrap is-flush">
              <table className="desk-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Payment</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {recent.map((order) => (
                    <tr key={order.id}>
                      <td><Link href={`/admin/orders/${order.id}`}>{order.id}</Link><br /><small>{new Date(order.createdAt).toLocaleString("en-IN")}</small></td>
                      <td>{order.customer.name}<br /><small>{order.email}</small></td>
                      <td><span className={`desk-pill${order.paymentStatus === "Paid" ? " is-ok" : " is-warn"}`}>{order.paymentStatus}</span></td>
                      <td><span className="desk-pill">{order.status}</span></td>
                      <td>{formatINR(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="desk-stack">
          <section className="desk-card">
            <h2>Needs attention</h2>
            {out.length === 0 && hidden.length === 0 && unpaid === 0 && exchanges === 0 ? (
              <p className="desk-note">Nothing waiting. Stock is on the floor and no unpaid orders are open.</p>
            ) : (
              <ul className="dash-list">
                {out.slice(0, 6).map((product) => (
                  <li key={product.slug}>
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <small>Out of stock · {product.sku}</small>
                    </div>
                    <Link href="/admin/products">Fix</Link>
                  </li>
                ))}
                {hidden.slice(0, 4).map((product) => (
                  <li key={`h-${product.slug}`}>
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <small>Hidden from the shop</small>
                    </div>
                    <Link href="/admin/products">Show</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="desk-card">
            <h2>Offer on checkout</h2>
            <p className="dash-offer">
              <span className={`desk-pill${settings.promoOn ? " is-ok" : " is-off"}`}>{settings.promoOn ? "On" : "Off"}</span>
              <strong>{settings.promoCode}</strong>
              <small>20% when the code is entered</small>
            </p>
            <p className="desk-note">Ship free from {formatINR(settings.freeShipping)}. Fee {formatINR(settings.shippingFee)}.</p>
            <Link className="text-btn" href="/admin/settings">Edit settings</Link>
          </section>

          <section className="desk-card">
            <h2>Floor mix</h2>
            <ul className="dash-mix">
              <li><span>Women</span><strong>{women}</strong></li>
              <li><span>Men</span><strong>{men}</strong></li>
              <li><span>Kids</span><strong>{kids}</strong></li>
              <li><span>Customers</span><strong>{customers}</strong></li>
            </ul>
            <p className="desk-note">{orderCount} web {orderCount === 1 ? "order" : "orders"} in the desk.</p>
          </section>
        </aside>
      </div>
    </>
  );
}
