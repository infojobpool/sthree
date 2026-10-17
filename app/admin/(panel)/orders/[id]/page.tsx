import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/admin/PrintButton";
import { saveOrder } from "@/lib/admin-actions";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { EXCHANGE_STATUSES, ORDER_STATUSES, PAYMENT_STATUSES, toOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  const full = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.order.findUnique({ where: { id }, include: { exchanges: { orderBy: { createdAt: "desc" } } } });
  if (!row) notFound();
  const order = toOrder(row);

  return (
    <article className="bill">
      <header className="desk-head">
        <h1>{order.id}</h1>
        <p className="desk-note">{new Date(order.createdAt).toLocaleString("en-IN")} · <span className="desk-pill">{order.status}</span> · <span className={`desk-pill${order.paymentStatus === "Paid" ? " is-ok" : " is-warn"}`}>{order.paymentStatus}</span></p>
      </header>
      <div className="desk-actions no-print">
        <Link href="/admin/orders">All orders</Link>
        <PrintButton />
        <a className="btn" href={waLink(order.customer.phone, `Sthree Designer Studio: order ${order.id} is ${order.status}. Total ${formatINR(order.total)}.`)} target="_blank" rel="noreferrer">WhatsApp the customer</a>
      </div>
      <div className="desk-split">
        <section className="desk-card">
          <h2>Pieces</h2>
          {order.lines.map((line) => (
            <p key={`${line.slug}-${line.size}-${line.color}`} className="summary-line">
              <span>{line.name}<br /><small>{line.sku} · {line.color} · Size {line.size} × {line.qty}</small></span>
              <span>{formatINR(line.price * line.qty)}</span>
            </p>
          ))}
          <dl>
            <div><dt>Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
            <div><dt>Discount</dt><dd>{order.discount ? `−${formatINR(order.discount)}` : "—"}</dd></div>
            <div><dt>Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatINR(order.total)}</dd></div>
          </dl>
          <p className="desk-note">{order.payment}{order.code ? ` · ${order.code}` : ""}</p>
          <form className="desk-form no-print" action={saveOrder}>
            <input type="hidden" name="id" value={order.id} />
            <input type="hidden" name="intent" value="note" />
            <label className="field">Desk note<textarea name="note" rows={3} defaultValue={order.note} placeholder="Packing note, alteration, or a call you made" /></label>
            <button className="btn" type="submit">Save note</button>
          </form>
          {order.note ? <p className="print-only">{order.note}</p> : null}
        </section>
        <aside className="desk-stack">
          <section className="desk-card">
            <h2>Deliver to</h2>
            <p>{order.customer.name}<br />{order.customer.address}<br />{order.customer.city}, {order.customer.state} {order.customer.pincode}<br />{order.customer.phone}<br />{order.email}</p>
          </section>
          <section className="desk-card no-print">
            <h2>Move the order</h2>
            <form className="desk-form" action={saveOrder}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="intent" value="status" />
              <label className="field">Status
                <select name="status" defaultValue={order.status}>
                  {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <button className="btn" type="submit">Update status</button>
            </form>
            <form className="desk-form" action={saveOrder}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="intent" value="payment" />
              <label className="field">Money
                <select name="paymentStatus" defaultValue={order.paymentStatus}>
                  {PAYMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <button className="btn btn-ghost" type="submit">Update payment</button>
            </form>
          </section>
          <section className="desk-card no-print">
            <h2>Exchange</h2>
            {row.exchanges.length === 0 ? <p className="desk-note">No exchange on this order.</p> : row.exchanges.map((item) => (
              <p key={item.id}><strong>{item.status}</strong><br />{item.reason}</p>
            ))}
            <form className="desk-form" action={saveOrder}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="intent" value="exchange" />
              <label className="field">Open one<textarea name="reason" rows={3} required placeholder="Size, colour, or a fault" /></label>
              <button className="btn btn-ghost" type="submit">Open exchange</button>
            </form>
            {row.exchanges.some((item) => item.status === "Requested" || item.status === "Accepted") ? (
              <p className="desk-note">Update the open exchange from the <Link href="/admin/exchanges">exchange list</Link>. Statuses: {EXCHANGE_STATUSES.join(", ")}.</p>
            ) : null}
          </section>
        </aside>
      </div>
    </article>
  );
}
