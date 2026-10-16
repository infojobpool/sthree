"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";
import type { Order } from "@/lib/shop-types";

export default function OrderView() {
  const params = useParams<{ id: string }>();
  const { ready, orders } = useStore();
  const local = orders.find((item) => item.id === params.id);
  const [fetched, setFetched] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);
  const [reason, setReason] = useState("");
  const [exchangeNote, setExchangeNote] = useState("");

  useEffect(() => {
    if (!ready || local) return;
    let ignore = false;
    (async () => {
      const res = await fetch(`/api/orders/${params.id}`);
      if (ignore) return;
      if (!res.ok) setMissing(true);
      else setFetched(await res.json());
    })();
    return () => {
      ignore = true;
    };
  }, [ready, local, params.id]);

  if (!ready || (!local && !fetched && !missing)) return <div className="page-loading">Finding your order…</div>;
  const order = local ?? fetched;

  if (!order) {
    return (
      <div className="page">
        <div className="empty">
          <h2>Order not found</h2>
          <p>Check the order id from your confirmation, or track it from the care page.</p>
          <Link className="btn" href="/track">Track an order</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <header className="page-title">
        <p className="eyebrow">Confirmed</p>
        <h1>Thank you, {order.customer.name.split(" ")[0]}</h1>
        <p>Order <strong>{order.id}</strong> is confirmed. The studio desk has it. Nothing has been charged.</p>
      </header>
      <article className="summary order-card">
        <p className="meta">{new Date(order.createdAt).toLocaleString("en-IN")} · {order.payment} · {order.status}</p>
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
        <h2>Delivering to</h2>
        <p>{order.customer.name}<br />{order.customer.address}<br />{order.customer.city}, {order.customer.state} {order.customer.pincode}<br />{order.customer.phone} · {order.customer.email}</p>
      </article>
      {order.status !== "Cancelled" ? (
        <form className="stack-form" onSubmit={async (event) => {
          event.preventDefault();
          setExchangeNote("");
          const res = await fetch(`/api/orders/${order.id}/exchange`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason }),
          });
          const body = await res.json().catch(() => ({}));
          setExchangeNote(res.ok ? "The studio has your exchange request." : body.error || "Could not send the request.");
          if (res.ok) setReason("");
        }}>
          <h2>Request an exchange</h2>
          <label className="field">What should change?<textarea required minLength={8} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} /></label>
          {exchangeNote ? <p className="hint">{exchangeNote}</p> : null}
          <button className="btn btn-ghost" type="submit">Send to the studio</button>
        </form>
      ) : null}
      <div className="hero-actions">
        <Link className="btn" href="/shop">Continue shopping</Link>
        <Link className="btn btn-ghost" href="/account">View account</Link>
      </div>
    </div>
  );
}
