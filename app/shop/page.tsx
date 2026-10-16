import { Suspense } from "react";
import type { Metadata } from "next";
import ShopView from "@/components/ShopView";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="page-loading">Loading the edit…</div>}>
      <ShopView />
    </Suspense>
  );
}
