"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { discountPercent, formatINR, FREE_SHIPPING } from "@/lib/format";

type Banner = {
  src: string;
  alt: string;
  href: string;
  line?: string;
  graphic?: boolean;
  ratio?: string;
  floor?: boolean;
  eyebrow?: string;
  title?: string;
  text?: string;
  cta?: string;
  secondaryHref?: string;
  secondary?: string;
};

export default function OfferSlider({ products, banners = [] }: { products: Product[]; banners?: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const origin = useRef(0);
  const drag = useRef(0);
  const moved = useRef(false);
  const dragging = useRef(false);
  const slides = [
    ...banners.map((banner, bannerIndex) => ({ id: `banner-${bannerIndex}`, kind: "banner" as const, banner })),
    ...products.map((product) => ({ id: product.slug, kind: "product" as const, product })),
  ];
  const count = slides.length;
  const active = slides[index];
  const activeRatio = active?.kind === "banner" ? active.banner.ratio : undefined;

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (count === 0) return null;

  function go(next: number) {
    setIndex((next + count) % count);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (count < 2) return;
    origin.current = event.clientX;
    drag.current = 0;
    moved.current = false;
    dragging.current = true;
    setLive(true);
    setPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const next = event.clientX - origin.current;
    drag.current = next;
    if (Math.abs(next) > 8) moved.current = true;
    setDragPx(next);
  }

  function onPointerUp() {
    if (!dragging.current) return;
    const distance = drag.current;
    dragging.current = false;
    setLive(false);
    setDragPx(0);
    setPaused(false);
    drag.current = 0;
    if (distance > 48) go(index - 1);
    else if (distance < -48) go(index + 1);
  }

  return (
    <section
      className="offer-slider"
      aria-roledescription="carousel"
      aria-label="Home offers"
      style={activeRatio ? ({ "--offer-ratio": activeRatio } as React.CSSProperties) : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="offer-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (!moved.current) return;
          event.preventDefault();
          event.stopPropagation();
          moved.current = false;
        }}
      >
        <div
          className="offer-track"
          style={{
            transform: `translateX(calc(-${index * 100}% + ${dragPx}px))`,
            transition: live ? "none" : undefined,
          }}
        >
          {slides.map((slide, slideIndex) => {
            if (slide.kind === "banner") {
              const banner = slide.banner;
              return (
                <article
                  key={slide.id}
                  className={`offer-slide is-banner${banner.graphic ? " is-graphic" : ""}${banner.floor ? " is-floor" : ""}`}
                  aria-hidden={slideIndex !== index}
                  style={banner.ratio ? ({ "--banner-ratio": banner.ratio } as React.CSSProperties) : undefined}
                >
                  <img src={banner.src} alt="" />
                  {banner.floor ? (
                    <div className="floor-copy">
                      {banner.eyebrow ? <p className="eyebrow">{banner.eyebrow}</p> : null}
                      {banner.title ? <h2>{banner.title}</h2> : null}
                      {banner.text ? <p>{banner.text}</p> : null}
                      <div className="hero-actions">
                        <Link className="btn" href={banner.href} tabIndex={slideIndex === index ? 0 : -1}>
                          {banner.cta ?? "Shop the edit"}
                        </Link>
                        {banner.secondaryHref ? (
                          <Link className="btn btn-ghost" href={banner.secondaryHref} tabIndex={slideIndex === index ? 0 : -1}>
                            {banner.secondary}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <Link href={banner.href} tabIndex={slideIndex === index ? 0 : -1} aria-label={banner.alt}>
                      {banner.line ? <span className="banner-line">{banner.line}</span> : null}
                    </Link>
                  )}
                </article>
              );
            }
            const product = slide.product;
            const off = discountPercent(product.price, product.compareAt);
            return (
              <article
                key={product.slug}
                className="offer-slide"
                aria-hidden={slideIndex !== index}
              >
                {failed[product.slug] ? <span className="photo-fallback tall">{product.name}</span> : (
                  <img
                    src={product.image}
                    alt=""
                    onError={() => setFailed((current) => ({ ...current, [product.slug]: true }))}
                  />
                )}
                <div className="offer-card">
                  <p className="eyebrow">Discount</p>
                  <p className="offer-off">−{off}%</p>
                  <h2>{product.name}</h2>
                  <p className="meta">{product.sku}</p>
                  <p className="price price-lg">
                    {product.compareAt ? <s>{formatINR(product.compareAt)}</s> : null}
                    <span>{formatINR(product.price)}</span>
                  </p>
                  <Link className="btn" href={`/product/${product.slug}`} tabIndex={slideIndex === index ? 0 : -1}>
                    Shop this piece
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <button className="offer-nav offer-prev" type="button" aria-label="Previous slide" onClick={() => go(index - 1)} hidden={count < 2}>‹</button>
      <button className="offer-nav offer-next" type="button" aria-label="Next slide" onClick={() => go(index + 1)} hidden={count < 2}>›</button>
      <ul className="floor-chips">
        <li><strong>Nagole floor</strong> Try the fall in Sainagar Colony</li>
        <li><strong>Ship from Hyderabad</strong> Complimentary above {formatINR(FREE_SHIPPING)}</li>
        <li><strong>7-day exchange</strong> Unworn, with tags</li>
      </ul>
      {count > 1 ? (
        <div className="offer-dots" role="tablist" aria-label="Slides">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={slide.kind === "banner" ? slide.banner.alt : `${slide.product.name}, ${discountPercent(slide.product.price, slide.product.compareAt)} percent off`}
              aria-selected={slideIndex === index}
              className={slideIndex === index ? "is-on" : ""}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
