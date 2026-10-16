"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categoryName, type Product } from "@/lib/catalog";
import { discountPercent, formatINR, FREE_SHIPPING } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";

const BODY: Record<string, { bust: string; waist: string; hip: string }> = {
  XS: { bust: "32", waist: "26", hip: "35" },
  S: { bust: "34", waist: "28", hip: "37" },
  M: { bust: "36", waist: "30", hip: "39" },
  L: { bust: "38", waist: "32", hip: "41" },
  XL: { bust: "40", waist: "34", hip: "43" },
  XXL: { bust: "42", waist: "36", hip: "45" },
  "3XL": { bust: "44", waist: "38", hip: "47" },
  "4XL": { bust: "46", waist: "40", hip: "49" },
  "5XL": { bust: "48", waist: "42", hip: "51" },
};

const KIDS: Record<string, string> = {
  "2-3Y": "92–98 cm",
  "4-5Y": "104–110 cm",
  "6-7Y": "116–122 cm",
  "8-9Y": "128–134 cm",
  "10-12Y": "140–152 cm",
};

function SizeGuide({ sizes, onClose }: { sizes: string[]; onClose: () => void }) {
  const body = sizes.filter((size) => BODY[size]);
  const kids = sizes.filter((size) => KIDS[size]);
  const free = sizes.includes("Free Size") || sizes.includes("One Size");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="guide-backdrop" onClick={onClose}>
      <div className="guide" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" onClick={(event) => event.stopPropagation()}>
        <div className="guide-head">
          <h2 id="size-guide-title">Size guide</h2>
          <button type="button" className="text-btn" onClick={onClose}>Close</button>
        </div>
        <p className="hint">Measurements are body size, in inches. Between two sizes, take the larger one.</p>
        {body.length > 0 ? (
          <table>
            <thead>
              <tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th></tr>
            </thead>
            <tbody>
              {body.map((size) => (
                <tr key={size}>
                  <td>{size}</td>
                  <td>{BODY[size].bust}</td>
                  <td>{BODY[size].waist}</td>
                  <td>{BODY[size].hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {kids.length > 0 ? (
          <table>
            <thead>
              <tr><th>Age</th><th>Height</th></tr>
            </thead>
            <tbody>
              {kids.map((size) => (
                <tr key={size}><td>{size}</td><td>{KIDS[size]}</td></tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {free ? <p>This piece is free size. The cloth is cut to drape, not to a numbered size.</p> : null}
      </div>
    </div>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const { addToCart, toggleWish, wished, catalog } = useStore();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [error, setError] = useState("");
  const [failed, setFailed] = useState(false);
  const [guide, setGuide] = useState(false);
  const shots = product.images?.length ? product.images : [product.image];
  const sale = discountPercent(product.price, product.compareAt);
  const saved = wished(product.slug);

  const related = useMemo(
    () => catalog.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4),
    [catalog, product]
  );

  function add() {
    if (!product.inStock) return;
    if (!size) {
      setError("Choose a size to add this piece to your bag.");
      return;
    }
    setError("");
    addToCart({ slug: product.slug, size, color, qty });
  }

  return (
    <div className="page">
      <p className="crumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <Link href={`/shop?cat=${product.category}`}>{categoryName(product.category)}</Link>
      </p>
      <div className="pdp">
        <div className={`gallery${shots.length > 1 ? " has-looks" : ""}`}>
          {shots.length > 1 ? (
            <div className="looks">
              <p className="look-label">Change look</p>
              {shots.map((src, index) => (
                <button key={src} type="button" className={index === shot ? "is-on" : ""} onClick={() => { setShot(index); setFailed(false); }} aria-label={`View photo ${index + 1}`}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          ) : null}
          <div className="look-hero">
            {failed ? <span className="photo-fallback tall">{product.name}</span> : (
              <img key={shots[shot] ?? product.image} src={shots[shot] ?? product.image} alt={product.name} onError={() => setFailed(true)} />
            )}
          </div>
        </div>
        <div className="pdp-info">
          <p className="eyebrow">{categoryName(product.category)}</p>
          <h1>{product.name}</h1>
          <p className="meta">{product.sku} · {product.rating.toFixed(1)} ★ · {product.reviews} reviews</p>
          <p className="price price-lg">
            {product.compareAt ? <s>{formatINR(product.compareAt)}</s> : null}
            <span>{formatINR(product.price)}</span>
            {sale > 0 ? <em className="badge">Sale −{sale}%</em> : null}
          </p>
          <p className="tax">Inclusive of all taxes</p>
          <p className="lead">{product.description}</p>

          <fieldset className="choice">
            <legend>Colour · {color}</legend>
            <div className="swatches">
              {product.colors.map((item) => (
                <button key={item} type="button" className={item === color ? "is-on" : ""} onClick={() => setColor(item)}>{item}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="choice">
            <div className="choice-head">
              <legend>Size</legend>
              <button type="button" className="text-btn" onClick={() => setGuide(true)}>Size guide</button>
            </div>
            <div className="size-grid">
              {product.sizes.map((item) => (
                <button key={item} type="button" className={item === size ? "is-on" : ""} onClick={() => { setSize(item); setError(""); }}>{item}</button>
              ))}
            </div>
            <p className="hint">Between sizes, take the larger one.</p>
          </fieldset>
          {guide ? <SizeGuide sizes={product.sizes} onClose={() => setGuide(false)} /> : null}

          <div className="buy-row">
            <div className="qty-ctrl" aria-label="Quantity">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((value) => Math.min(5, value + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn" type="button" disabled={!product.inStock} onClick={add}>
              {product.inStock ? "Add to bag" : "Sold out"}
            </button>
            <button className={`btn btn-ghost${saved ? " is-on" : ""}`} type="button" onClick={() => toggleWish(product.slug)}>
              {saved ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
          {error ? <p className="error">{error}</p> : null}
          <ul className="reassure">
            <li>Ships in 3–5 days from Hyderabad.</li>
            <li>Complimentary shipping above {formatINR(FREE_SHIPPING)}.</li>
            <li>Exchanges within 7 days, unworn with tags.</li>
          </ul>

          <dl className="detail-list">
            <div><dt>Fabric</dt><dd>{product.fabric}</dd></div>
            <div><dt>Includes</dt><dd>{product.includes.join(", ")}</dd></div>
            <div><dt>Care</dt><dd>Dry clean only. Store folded, away from direct sun.</dd></div>
            <div><dt>Dispatch</dt><dd>Ships in 3–5 days from Hyderabad. Free above {formatINR(FREE_SHIPPING)}.</dd></div>
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="section">
          <div className="section-head">
            <h2>More in {categoryName(product.category)}</h2>
            <Link href={`/shop?cat=${product.category}`}>View all</Link>
          </div>
          <div className="product-grid">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
