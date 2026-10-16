"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { discountFor, formatINR, shippingFor } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";

export default function CartView() {
  const { ready, cart, setQty, removeFromCart, code, applyCode, clearCode, catalog, settings } = useStore();
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");

  if (!ready) return <div className="page-loading">Loading your bag…</div>;

  const lines = cart.flatMap((item) => {
    const product = catalog.find((piece) => piece.slug === item.slug);
    return product ? [{ item, product }] : [];
  });
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.item.qty, 0);
  const discount = discountFor(subtotal, code, settings);
  const shipping = shippingFor(subtotal, discount, settings);
  const total = subtotal - discount + shipping;

  function onCode(event: FormEvent) {
    event.preventDefault();
    setMessage(applyCode(entry));
  }

  return (
    <div className="page">
      <header className="page-title">
        <p className="eyebrow">Bag</p>
        <h1>Your bag</h1>
      </header>
      {lines.length === 0 ? (
        <div className="empty">
          <h2>Your bag is empty</h2>
          <p>Lehengas, suits, and the smaller pieces live in the shop.</p>
          <Link className="btn" href="/shop">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="lines">
            {lines.map(({ item, product }) => (
              <article key={`${item.slug}-${item.size}-${item.color}`} className="line">
                <Link href={`/product/${product.slug}`} className="line-photo">
                  <img src={product.image} alt="" />
                </Link>
                <div>
                  <h2><Link href={`/product/${product.slug}`}>{product.name}</Link></h2>
                  <p className="meta">{product.sku} · {item.color} · Size {item.size}</p>
                  <p className="price"><span>{formatINR(product.price)}</span></p>
                  <div className="line-actions">
                    <div className="qty-ctrl">
                      <button type="button" aria-label="Decrease" onClick={() => setQty(item, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Increase" onClick={() => setQty(item, item.qty + 1)}>+</button>
                    </div>
                    <button className="text-btn" type="button" onClick={() => removeFromCart(item)}>Remove</button>
                  </div>
                </div>
                <strong>{formatINR(product.price * item.qty)}</strong>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Summary</h2>
            <form onSubmit={onCode} className="code-row">
              <label className="sr-only" htmlFor="code">Offer code</label>
              <input id="code" value={entry} placeholder="Offer code" onChange={(event) => setEntry(event.target.value)} />
              <button className="btn btn-ghost" type="submit">Apply</button>
            </form>
            {message ? <p className="error">{message}</p> : null}
            {code ? <p className="success">GRACE10 is applied. <button type="button" className="text-btn" onClick={clearCode}>Remove</button></p> : <p className="hint">Try GRACE10 for 20% off.</p>}
            <dl>
              <div><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
              <div><dt>Discount</dt><dd>{discount ? `−${formatINR(discount)}` : "—"}</dd></div>
              <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
            </dl>
            <p className="hint">{subtotal - discount >= 15000 ? "You have complimentary shipping." : `Add ${formatINR(15000 - (subtotal - discount))} more for complimentary shipping.`}</p>
            <Link className="btn btn-full" href="/checkout">Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
