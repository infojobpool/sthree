"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setError(body.error || "Email or password does not match.");
      return;
    }
    if (body.user?.role !== "ADMIN") {
      await fetch("/api/auth/logout", { method: "POST" });
      setError("This desk is for the studio login.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login">
      <form className="stack-form admin-card" onSubmit={submit}>
        <p className="eyebrow">Sthree</p>
        <h1>Studio desk</h1>
        <label className="field">Email<input name="email" type="email" required autoComplete="username" /></label>
        <label className="field">Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit">Enter</button>
      </form>
    </div>
  );
}
