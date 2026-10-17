"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { looks, portraitPhoto } from "@/lib/photos";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      setError(body.error || "Email or password does not match.");
      return;
    }
    if (body.user?.role !== "ADMIN") {
      await fetch("/api/auth/logout", { method: "POST" });
      setBusy(false);
      setError("This desk is for the studio login.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="desk-gate">
      <div className="desk-gate-photo">
        <img src={portraitPhoto(looks.ivory)} alt="" />
        <div className="desk-gate-caption">
          <p className="desk-gate-mark">Sthree</p>
          <p>Nagole floor · Gitta sisters</p>
        </div>
      </div>
      <form className="stack-form desk-gate-card" onSubmit={submit}>
        <p className="eyebrow">Studio desk</p>
        <h1>Sign in to the floor</h1>
        <p className="desk-gate-lead">Orders, pieces, and media for the Nagole house. Customers use Account on the shop.</p>
        <label className="field">Email<input name="email" type="email" required autoComplete="username" placeholder="studio email" /></label>
        <label className="field">Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-full" type="submit" disabled={busy}>{busy ? "Entering…" : "Enter the desk"}</button>
      </form>
    </div>
  );
}
