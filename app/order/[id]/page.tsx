import type { Metadata } from "next";
import OrderView from "@/components/OrderView";

export const metadata: Metadata = { title: "Order" };

export default function OrderPage() {
  return <OrderView />;
}
