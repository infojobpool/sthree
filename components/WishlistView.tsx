"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreProvider";
import ProductCard from "@/components/ProductCard";

export default function WishlistView() {
  const { ready, wishlist, catalog } = useStore();
  if (!ready) return <div className="page-loading">Loading your wishlist…</div>;
  const items = wishlist.flatMap((slug) => {
    const product = catalog.find((piece) => piece.slug === slug);
    return product ? [product] : [];
  });

  return (
    <div className="page">
      <header className="page-title">
        <p className="eyebrow">Saved</p>
        <h1>Wishlist</h1>
      </header>
      {items.length === 0 ? (
        <div className="empty">
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on a piece and it will wait for you here.</p>
          <Link className="btn" href="/shop">Browse the shop</Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      )}
    </div>
  );
}
