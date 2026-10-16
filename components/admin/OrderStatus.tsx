"use client";

import { useState } from "react";
import { ORDER_STATUSES } from "@/lib/orders";

export default function OrderStatus({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [pending, setPending] = useState(false);

  async function save(next: string) {
    setValue(next);
    setPending(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setPending(false);
  }

  return (
    <select className="admin-select" value={value} disabled={pending} onChange={(event) => save(event.target.value)} aria-label={`Status for ${id}`}>
      {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  );
}
