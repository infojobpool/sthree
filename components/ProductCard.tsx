"use client";

import Link from "next/link";
import { useState } from "react";
import { categoryName, type Product } from "@/lib/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { wished, toggleWish } = useStore();
  const [failed, setFailed] = useState(false);
  const sale = discountPercent(product.price, product.compareAt);
  const saved = wished(product.slug);

  return (
    <article className="card">
      <div className="card-media">
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          {failed ? <span className="photo-fallback">{product.sku}</span> : (
            <img src={product.image} alt={product.name} onError={() => setFailed(true)} />
          )}
        </Link>
        {sale > 0 ? <span className="badge">Sale −{sale}%</span> : product.highlights.includes("new") ? <span className="badge">New</span> : null}
        {!product.inStock ? <span className="badge badge-muted">Sold out</span> : null}
        <button
          className={`wish${saved ? " is-on" : ""}`}
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          onClick={() => toggleWish(product.slug)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19s-6.2-3.8-6.2-8.1A3.4 3.4 0 0 1 12 8.2a3.4 3.4 0 0 1 6.2 2.7C18.2 15.2 12 19 12 19Z" />
          </svg>
        </button>
      </div>
      <div className="card-body">
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <p className="meta">{product.sku} · {categoryName(product.category)}</p>
        <p className="price">
          {product.compareAt ? <s>{formatINR(product.compareAt)}</s> : null}
          <span>{formatINR(product.price)}</span>
        </p>
      </div>
    </article>
  );
}
