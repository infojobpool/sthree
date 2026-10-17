"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { defaultHomeMedia } from "@/lib/media";
import { studio } from "@/lib/studio";

export default function Footer({ image = defaultHomeMedia.footer }: { image?: string }) {
  const pathname = usePathname();
  const [joined, setJoined] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoined(true);
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="footer-mark">Sthree</Link>
          <p className="footer-blurb">{studio.tagline}. A sisters' house in Nagole, kept for eight years.</p>
        </div>
        <div className="footer-col">
          <h2>Shop</h2>
          <Link href="/shop">Order online</Link>
          <Link href="/shop?highlight=new">New pieces</Link>
          <Link href="/shop?cat=lehenga">Lehenga</Link>
          <Link href="/shop?cat=saree">Sarees</Link>
          <Link href="/shop?highlight=bestseller">Bestsellers</Link>
        </div>
        <div className="footer-col">
          <h2>The house</h2>
          <Link href="/about">About & Contact</Link>
          <Link href="/showrooms">Showrooms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div className="footer-col">
          <h2>Care</h2>
          <Link href="/shipping">Shipping & returns</Link>
          <Link href="/track">Track order</Link>
          <Link href="/wishlist">Wishlist</Link>
          <a href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <div className="footer-col footer-notes">
          <h2>Notes</h2>
          <p>New collections and floor notes from the studio.</p>
          <form className="newsletter" onSubmit={subscribe}>
            <label htmlFor="news-email" className="sr-only">Email address</label>
            {joined ? <p className="success">You are on the list.</p> : (
              <div className="news-row">
                <input id="news-email" type="email" required placeholder="Your email" />
                <button className="btn footer-join" type="submit">Join</button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="footer-stage">
        <div className="footer-cast" aria-hidden="true">
          <img src={image} alt="" />
        </div>
        <svg className="footer-silk" viewBox="0 0 1440 280" preserveAspectRatio="none" aria-hidden="true">
          <path fill="url(#silk)" d="M-80 90C120 10 240 170 420 70C600 -30 640 190 900 80C1080 0 1200 130 1520 40L1520 0H-80Z" />
          <defs>
            <linearGradient id="silk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#d6148e" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#a43ab8" stopOpacity="0.72" />
              <stop offset="1" stopColor="#d6148e" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="footer-bar">
          <p className="fineprint">© {new Date().getFullYear()} Sthree Designer Studio. All rights reserved.</p>
          <div className="footer-social">
            <a href={studio.instagram} target="_blank" rel="noreferrer">{studio.instagramLabel}</a>
            <a href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      <a className="wa-float" href={studio.whatsapp} target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12.04 3.2A8.7 8.7 0 0 0 4.5 16.7L3.4 20.6l4-1.05A8.7 8.7 0 1 0 12.04 3.2Zm5.05 12.28c-.21.6-1.23 1.14-1.7 1.16-.44.02-.86.2-2.9-.6-2.43-.96-3.96-3.46-4.08-3.62-.12-.16-.98-1.3-.98-2.48 0-1.18.62-1.76.84-2 .22-.24.48-.3.64-.3h.46c.14 0 .34-.06.52.4.18.48.64 1.66.7 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.32-.36.42-.12.12-.24.24-.1.48.14.24.62 1.02 1.34 1.66.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.15 1.18Z" />
        </svg>
        <span className="wa-label">WhatsApp</span>
      </a>
    </footer>
  );
}
