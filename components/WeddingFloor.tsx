"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";

export default function WeddingFloor({ products }: { products: Product[] }) {
  const { addToCart } = useStore();
  const [face, setFace] = useState(0);
  const [paused, setPaused] = useState(false);
  const loop = [...products, ...products];
  const portraits = products.filter((product) => product.image.includes("unsplash"));
  const faces = portraits.length ? portraits : products;

  useEffect(() => {
    if (paused || faces.length < 2) return;
    const timer = window.setInterval(() => {
      setFace((current) => (current + 1) % faces.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused, faces.length]);

  if (!products.length) return null;
  const current = faces[face] ?? products[0];

  return (
    <section className="section wedding-floor" aria-label="The wedding floor">
      <svg className="wedding-wave" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 24C180 48 360 0 540 16C720 32 900 48 1080 24C1260 0 1380 8 1440 20V48H0Z" />
      </svg>
      <div className="wedding-inner">
        <Link
          href="/shop?cat=lehenga"
          className="wedding-portrait"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {faces.map((product, index) => (
            <img
              key={product.slug}
              src={product.image}
              alt=""
              className={index === face ? "is-on" : ""}
            />
          ))}
          <span>View the collection</span>
        </Link>
        <div className="wedding-copy">
          <h2>The wedding floor</h2>
          <p className="wedding-now">{current.name}</p>
          <div className="wedding-viewport">
            <div className="wedding-track">
              {loop.map((product, index) => (
                <article key={`${product.slug}-${index}`} className="wedding-card">
                  <Link href={`/product/${product.slug}`} className="wedding-photo">
                    <img src={product.image} alt="" />
                  </Link>
                  <Link href={`/product/${product.slug}`} className="wedding-name">{product.name}</Link>
                  <span className="wedding-price">{formatINR(product.price)}</span>
                  <button
                    type="button"
                    className="wedding-bag"
                    disabled={!product.inStock}
                    onClick={() =>
                      addToCart({
                        slug: product.slug,
                        size: product.sizes[0] ?? "M",
                        color: product.colors[0] ?? "As shown",
                        qty: 1,
                      })
                    }
                  >
                    {product.inStock ? "Add to bag" : "Sold out"}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      <svg className="wedding-wave is-bottom" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 24C180 48 360 0 540 16C720 32 900 48 1080 24C1260 0 1380 8 1440 20V48H0Z" />
      </svg>
    </section>
  );
}
