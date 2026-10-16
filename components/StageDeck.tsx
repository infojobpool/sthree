"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";

export default function StageDeck({
  products,
  eyebrow = "The atelier",
  title = <>Cut to be <em>remembered</em></>,
  href = "/shop?who=women",
  link = "Explore the edit",
}: {
  products: Product[];
  eyebrow?: string;
  title?: ReactNode;
  href?: string;
  link?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const origin = useRef(0);
  const drag = useRef(0);
  const moved = useRef(false);
  const dragging = useRef(false);
  const count = products.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  function wrap(next: number) {
    if (count === 0) return 0;
    return ((next % count) + count) % count;
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (count < 2) return;
    origin.current = event.clientX;
    drag.current = 0;
    moved.current = false;
    dragging.current = true;
    setPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    drag.current = event.clientX - origin.current;
    if (Math.abs(drag.current) > 8) moved.current = true;
  }

  function onPointerUp() {
    if (!dragging.current) return;
    const distance = drag.current;
    dragging.current = false;
    if (distance > 48) setIndex((current) => wrap(current - 1));
    else if (distance < -48) setIndex((current) => wrap(current + 1));
    window.setTimeout(() => setPaused(false), 2400);
  }

  if (count === 0) return null;

  return (
    <section id="bestsellers" className="section deck-section" aria-roledescription="carousel" aria-label="Bestsellers">
      <div className="deck-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <Link href={href}>{link}</Link>
      </div>
      <div
        className="deck-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => {
          if (dragging.current) onPointerUp();
        }}
      >
        <div className="deck-axis">
        {products.map((product, cardIndex) => {
          let offset = cardIndex - index;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const far = Math.abs(offset) > 2;
          const depth = Math.abs(offset);
          const transform = `translateX(${offset * 168}px) rotateY(${offset * -24}deg) translateZ(${-depth * 80}px) scale(${1 - depth * 0.07})`;
          return (
            <article
              key={product.slug}
              className={`deck-card${offset === 0 ? " is-front" : ""}`}
              style={{
                transform,
                zIndex: 20 - depth,
                pointerEvents: far ? "none" : "auto",
                opacity: far ? 0 : 1,
              }}
            >
              <Link
                href={`/product/${product.slug}`}
                onClick={(event) => {
                  if (moved.current) event.preventDefault();
                  else if (offset !== 0) {
                    event.preventDefault();
                    setIndex(cardIndex);
                  }
                }}
              >
                <img src={product.image} alt={product.name} />
                <span>
                  <strong>{product.name}</strong>
                  {formatINR(product.price)}
                </span>
              </Link>
            </article>
          );
        })}
        </div>
      </div>
      {count > 1 ? (
        <div className="deck-controls">
          <button type="button" aria-label="Previous piece" onClick={() => setIndex((current) => wrap(current - 1))}>
            <Chevron />
          </button>
          <button type="button" aria-label="Next piece" onClick={() => setIndex((current) => wrap(current + 1))}>
            <Chevron />
          </button>
        </div>
      ) : null}
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
