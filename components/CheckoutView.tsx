"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { discountFor, formatINR, shippingFor } from "@/lib/format";
import { useStore, type Customer } from "@/context/StoreProvider";

const empty = { name: "", email: "", phone: "", address: "", city: "Hyderabad", state: "Telangana", pincode: "" };

export default function CheckoutView() {
  const router = useRouter();
  const { ready, cart, user, code, placeOrder, catalog, settings } = useStore();
  const [form, setForm] = useState<Customer>({ ...empty, name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [payment, setPayment] = useState("Cash on delivery");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
      phone: current.phone || user.phone,
    }));
  }, [user]);

  if (!ready) return <div className="page-loading">Preparing checkout…</div>;

  const lines = cart.flatMap((item) => {
    const product = catalog.find((piece) => piece.slug === item.slug);
    return product ? [{ item, product }] : [];
  });
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.item.qty, 0);
  const discount = discountFor(subtotal, code, settings);
  const shipping = shippingFor(subtotal, discount, settings);
  const total = subtotal - discount + shipping;

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="empty">
          <h2>Your bag is empty</h2>
          <Link className="btn" href="/shop">Return to shop</Link>
        </div>
      </div>
    );
  }

  function set<K extends keyof Customer>(key: K, value: Customer[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter a 6-digit PIN code.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    const result = await placeOrder({ ...form, phone: form.phone.replace(/\s/g, "") }, payment);
    if (result.error || !result.id) {
      setError(result.error || "The order could not be saved.");
      return;
    }
    router.push(`/order/${result.id}`);
  }

  return (
    <div className="page">
      <header className="page-title">
        <p className="eyebrow">Checkout</p>
        <h1>Delivery details</h1>
        <p className="hint">The studio desk keeps this order. No card payment is taken.</p>
      </header>
      <form className="cart-layout" onSubmit={submit}>
        <div className="form-grid">
          <Field label="Full name" value={form.name} onChange={(value) => set("name", value)} required />
          <Field label="Email" type="email" value={form.email} onChange={(value) => set("email", value)} required />
          <Field label="Mobile" value={form.phone} onChange={(value) => set("phone", value)} required />
          <label className="field field-wide">
            Address
            <textarea required rows={3} value={form.address} onChange={(event) => set("address", event.target.value)} />
          </label>
          <Field label="City" value={form.city} onChange={(value) => set("city", value)} required />
          <Field label="State" value={form.state} onChange={(value) => set("state", value)} required />
          <Field label="PIN code" value={form.pincode} onChange={(value) => set("pincode", value)} required />
          <fieldset className="field field-wide">
            <legend>Payment</legend>
            {["Cash on delivery", "UPI", "Card"].map((option) => (
              <label key={option} className="check">
                <input type="radio" name="payment" checked={payment === option} onChange={() => setPayment(option)} />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          {error ? <p className="error field-wide">{error}</p> : null}
          <button className="btn" type="submit">Place order · {formatINR(total)}</button>
        </div>
        <aside className="summary">
          <h2>Your order</h2>
          {lines.map(({ item, product }) => (
            <p key={`${product.slug}-${item.size}`} className="summary-line">
              <span>{product.name} × {item.qty}</span>
              <span>{formatINR(product.price * item.qty)}</span>
            </p>
          ))}
          <dl>
            <div><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div><dt>Discount</dt><dd>{discount ? `−${formatINR(discount)}` : "—"}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
          </dl>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="field">
      {label}
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
