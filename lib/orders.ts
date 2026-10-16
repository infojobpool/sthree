import type { Order as DbOrder } from "@prisma/client";
import type { Order } from "@/lib/shop-types";

export const ORDER_STATUSES = ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"] as const;

export function toOrder(row: DbOrder): Order {
  return {
    id: row.id,
    email: row.email,
    lines: JSON.parse(row.linesJson),
    customer: JSON.parse(row.customerJson),
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping,
    total: row.total,
    code: row.code,
    payment: row.payment,
    paymentStatus: row.paymentStatus,
    note: row.note,
    createdAt: row.createdAt.toISOString(),
    status: row.status,
  };
}

export const EXCHANGE_STATUSES = ["Requested", "Accepted", "Completed", "Declined"] as const;
export const PAYMENT_STATUSES = ["Unpaid", "Received"] as const;
