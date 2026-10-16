"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";
import type { Order } from "@/lib/shop-types";

export default function TrackView() {
  const { ready, orders } = useStore();
  const [id, setId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!ready) return <div className="page-loading">Loading orders…</div>;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const searched = id.trim().toUpperCase();
    setPending(true);
    setError("");
    setOrder(null);
    const local = orders.find((item) => item.id === searched);
    if (local) {
      setOrder(local);
      setPending(false);
      return;
    }
    const res = await fetch(`/api/orders/${searched}`);
    setPending(false);
    if (!res.ok) {
      setError(`No order ${searched} was found.`);
      return;
    }
    setOrder(await res.json());
  }

  return (
    <div className="page page-narrow">
      <header className="page-title">
        <p className="eyebrow">Care</p>
        <h1>Track an order</h1>
        <p>Enter the order id from your confirmation.</p>
      </header>
      <form className="code-row" onSubmit={submit}>
        <label className="sr-only" htmlFor="order-id">Order id</label>
        <input id="order-id" value={id} onChange={(event) => setId(event.target.value)} placeholder="ST…" required />
        <button className="btn" type="submit" disabled={pending}>{pending ? "Looking…" : "Track"}</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {order ? (
        <article className="summary order-card">
          <p className="eyebrow">{order.status}</p>
          <h2>{order.id}</h2>
          <p className="meta">{new Date(order.createdAt).toLocaleString("en-IN")} · {order.payment}</p>
          {order.lines.map((line) => (
            <p key={`${line.slug}-${line.size}`} className="summary-line">
              <span>{line.name} · {line.size} × {line.qty}</span>
              <span>{formatINR(line.price * line.qty)}</span>
            </p>
          ))}
          <p className="total-line">Total {formatINR(order.total)}</p>
          <p>{order.customer.name}<br />{order.customer.address}<br />{order.customer.city}, {order.customer.state} {order.customer.pincode}</p>
          <Link className="btn" href={`/order/${order.id}`}>View confirmation</Link>
        </article>
      ) : null}
    </div>
  );
}
