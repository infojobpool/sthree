"use client";

export default function SignOut() {
  async function out() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button className="admin-link" type="button" onClick={out}>Sign out</button>
  );
}
