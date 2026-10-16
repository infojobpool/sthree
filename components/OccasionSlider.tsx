"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { looks, portraitPhoto } from "@/lib/photos";

const occasions = [
  { name: "Wedding", href: "/shop?cat=lehenga", image: portraitPhoto(looks.ivory) },
  { name: "Sangeet", href: "/shop?cat=lehenga", image: portraitPhoto(looks.blush) },
  { name: "Festive morning", href: "/shop?cat=dupatta", image: portraitPhoto(looks.pearl) },
  { name: "Everyday", href: "/shop?cat=co-ord-set", image: portraitPhoto(looks.sage) },
  { name: "Brunch", href: "/shop?cat=co-ord-set", image: portraitPhoto(looks.garden) },
  { name: "Festive day", href: "/shop?cat=saree", image: portraitPhoto(looks.ruby) },
];

function offsetOf(card: number, index: number, count: number) {
  let delta = card - index;
  const half = count / 2;
  if (delta > half) delta -= count;
  if (delta < -half) delta += count;
  return delta;
}

export default function OccasionSlider() {
  const count = occasions.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const origin = useRef(0);
  const drag = useRef(0);
  const moved = useRef(false);
  const dragging = useRef(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  function wrap(next: number) {
    return ((next % count) + count) % count;
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
    window.setTimeout(() => setPaused(false), 1800);
  }

  return (
    <section className="section band band-sand arc-band" aria-roledescription="carousel" aria-label="Shop by occasion">
      <h2 className="occasion-title">Shop by occasion</h2>
      <div
        className="arc-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="arc-axis">
          {occasions.map((occasion, card) => {
            const offset = offsetOf(card, index, count);
            const depth = Math.abs(offset);
            return (
              <Link
                key={occasion.name}
                href={occasion.href}
                className={`arc-card${offset === 0 ? " is-front" : ""}`}
                style={{
                  transform: `translateX(${offset * 168}px) translateY(${offset * offset * 6}px) rotateY(${offset * -12}deg) rotateZ(${offset * -2.5}deg) translateZ(${-depth * 42}px)`,
                  zIndex: 8 - depth,
                  opacity: depth > 2 ? 0.35 : 1,
                }}
                onClick={(event) => {
                  if (moved.current) event.preventDefault();
                  else if (offset !== 0) {
                    event.preventDefault();
                    setIndex(card);
                  }
                }}
              >
                <img src={occasion.image} alt="" />
                <span>{occasion.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
