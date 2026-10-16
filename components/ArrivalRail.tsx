"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";

export default function ArrivalRail({ products }: { products: Product[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const origin = useRef(0);
  const drag = useRef(0);
  const moved = useRef(false);
  const dragging = useRef(false);
  const [index, setIndex] = useState(0);
  const [per, setPer] = useState(4);
  const [step, setStep] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [live, setLive] = useState(false);
  const max = Math.max(0, products.length - per);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const measure = () => {
      const width = view.clientWidth;
      const nextPer = width < 640 ? 1 : width < 900 ? 2 : width < 1200 ? 3 : 4;
      setPer(nextPer);
      const card = view.querySelector<HTMLElement>(".rail-card");
      if (card) setStep(card.offsetWidth + 16);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIndex((current) => Math.min(current, max));
  }, [max]);

  function go(next: number) {
    setIndex(Math.min(max, Math.max(0, next)));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (max < 1) return;
    origin.current = event.clientX;
    drag.current = 0;
    moved.current = false;
    dragging.current = true;
    setLive(true);
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
    drag.current = 0;
    if (distance > 48) go(index - 1);
    else if (distance < -48) go(index + 1);
  }

  if (products.length === 0) return null;

  return (
    <section className="section" aria-roledescription="carousel" aria-label="Just in">
      <div className="section-head">
        <div>
          <p className="eyebrow">Fresh on the floor</p>
          <h2>Just in</h2>
        </div>
        <Link href="/shop?highlight=new">View new arrivals</Link>
      </div>
      <div className="rail-slider">
        <div
          className="rail-viewport"
          ref={viewRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className={`rail-track${live ? " is-live" : ""}`} style={{ transform: `translateX(${-index * step + dragPx}px)` }}>
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="rail-card"
                onClick={(event) => {
                  if (moved.current) event.preventDefault();
                }}
              >
                <span className="rail-photo">
                  <img src={product.image} alt="" />
                  {product.highlights.includes("new") ? <em className="badge">New</em> : null}
                </span>
                <span className="rail-name">{product.name}</span>
                <span className="rail-price">{formatINR(product.price)}</span>
              </Link>
            ))}
          </div>
        </div>
        {max > 0 ? (
          <>
            <button className="rail-nav rail-prev" type="button" aria-label="Previous new pieces" onClick={() => go(index - 1)} disabled={index === 0}>
              <Chevron />
            </button>
            <button className="rail-nav rail-next" type="button" aria-label="Next new pieces" onClick={() => go(index + 1)} disabled={index >= max}>
              <Chevron />
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.2 3.5 10.5 8 6.2 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
