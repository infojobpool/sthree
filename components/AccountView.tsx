"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";

export default function AccountView() {
  const { ready, user, orders, login, signup, logout } = useStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  if (!ready) return <div className="page-loading">Loading account…</div>;

  if (user) {
    const mine = orders.filter((order) => order.email === user.email);
    return (
      <div className="page">
        <header className="page-title">
          <p className="eyebrow">Account</p>
          <h1>Hello, {user.name.split(" ")[0]}</h1>
          <p className="meta">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
        </header>
        <div className="hero-actions">
          <button className="btn btn-ghost" type="button" onClick={() => logout()}>Sign out</button>
          {user.role === "ADMIN" ? <Link className="btn" href="/admin">Studio desk</Link> : null}
        </div>
        <section className="section">
          <div className="section-head"><h2>Orders</h2><Link href="/track">Track an order</Link></div>
          {mine.length === 0 ? <p>No orders on this account yet.</p> : (
            <div className="order-list">
              {mine.map((order) => (
                <Link key={order.id} href={`/order/${order.id}`} className="order-row">
                  <strong>{order.id}</strong>
                  <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>{order.status}</span>
                  <span>{formatINR(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    if (password.length < 6) {
      setError("Use at least 6 characters for the password.");
      return;
    }
    const message = mode === "login"
      ? await login(email, password)
      : await signup({
          name: String(data.get("name") ?? ""),
          email,
          phone: String(data.get("phone") ?? ""),
          password,
        });
    setError(message);
  }

  return (
    <div className="page page-narrow">
      <header className="page-title">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "New here"}</p>
        <h1>{mode === "login" ? "Login" : "Create your Sthree account"}</h1>
      </header>
      <form className="stack-form" onSubmit={submit}>
        {mode === "signup" ? (
          <>
            <label className="field">Full name<input name="name" required /></label>
            <label className="field">Mobile<input name="phone" required pattern="\d{10}" title="10 digit mobile" /></label>
          </>
        ) : null}
        <label className="field">Email<input name="email" type="email" required /></label>
        <label className="field">Password<input name="password" type="password" required minLength={6} /></label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
      </form>
      <p className="switch-auth">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button type="button" className="text-btn" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
          {mode === "login" ? "Create account" : "Login"}
        </button>
      </p>
      <p className="hint">Sign in to keep your orders with the studio. Checkout still does not take a card payment.</p>
    </div>
  );
}
