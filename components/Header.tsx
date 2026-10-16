"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/context/StoreProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/showrooms", label: "Showrooms" },
  { href: "/about", label: "About & Contact" },
];

const departments = [
  { href: "/shop?who=women", label: "Women" },
  { href: "/shop?who=men", label: "Men" },
  { href: "/shop?who=kids", label: "Kids" },
];

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishCount, user } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setShopOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
        setShopOpen(false);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!shopRef.current?.contains(event.target as Node)) setShopOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  if (isAdmin) return null;

  return (
    <>
      <a className="skip" href="#content">Skip to the content</a>
      <div className={`masthead${isHome ? " is-home" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="topbar">Festive offer on all merchandise · 20% off · Complimentary shipping above ₹15,000 · Exchanges within 7 days</div>
      <header className="header">
        <div className="header-inner">
          <button className="menu-btn" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <span /><span /><span />
          </button>
          <Link href="/" className="logo" aria-label="Sthree Designer Studio">
            <img src="/logo.jpg" alt="Sthree — the vintage fashion for modern women" />
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
            <div
              className={`nav-item${shopOpen ? " is-open" : ""}`}
              ref={shopRef}
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                className="nav-toggle"
                type="button"
                aria-expanded={shopOpen}
                aria-haspopup="true"
                aria-current={pathname.startsWith("/shop") ? "page" : undefined}
                onClick={() => setShopOpen((value) => !value)}
              >
                Shop
                <span className="nav-v" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M3.5 6.2 8 10.5l4.5-4.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className="drop" role="menu">
                {departments.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" onClick={() => setShopOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {links.slice(1).map((link) => (
              <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-tools">
            <form className="search" action="/shop" method="get" role="search">
              <label className="sr-only" htmlFor="site-search">Search products</label>
              <input id="site-search" name="q" placeholder="Search products…" />
              <button type="submit" aria-label="Search">
                <SearchIcon />
              </button>
            </form>
            <button className="icon-link search-toggle" type="button" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}>
              <SearchIcon />
            </button>
            <Link className="icon-link" href="/account">
              <UserIcon />
              <span>{user ? user.name.split(" ")[0] : "Login/Signup"}</span>
            </Link>
            <Link className="icon-link" href="/wishlist" aria-label="Wishlist">
              <HeartIcon />
              <span className="hide-sm">Wishlist</span>
              {wishCount > 0 ? <em className="count">{wishCount}</em> : null}
            </Link>
            <Link className="icon-link" href="/cart" aria-label="Bag">
              <BagIcon />
              <span className="hide-sm">Bag</span>
              {cartCount > 0 ? <em className="count">{cartCount}</em> : null}
            </Link>
          </div>
        </div>
        {searchOpen ? (
          <form className="mobile-search" action="/shop" method="get">
            <input name="q" placeholder="Search products…" autoFocus />
            <button className="btn" type="submit">Search</button>
          </form>
        ) : null}
      </header>
      </div>
      {open ? (
        <div className="scrim" onClick={() => setOpen(false)}>
          <nav className="mobile-panel" aria-label="Mobile" onClick={(event) => event.stopPropagation()}>
            <button className="close-btn" type="button" onClick={() => setOpen(false)} aria-label="Close menu">Close</button>
            <Link href="/">Home</Link>
            <p className="mobile-label">Shop</p>
            {departments.map((item) => (
              <Link key={item.href} className="mobile-sub" href={item.href}>{item.label}</Link>
            ))}
            <Link href="/showrooms">Showrooms</Link>
            <Link href="/about">About & Contact</Link>
            <Link href="/account">{user ? "My account" : "Login / Signup"}</Link>
            {user?.role === "ADMIN" ? <Link href="/admin">Studio desk</Link> : null}
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/track">Track order</Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19.2c1.4-2.8 3.6-4.2 6.5-4.2s5.1 1.4 6.5 4.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19s-6.2-3.8-6.2-8.1A3.4 3.4 0 0 1 12 8.2a3.4 3.4 0 0 1 6.2 2.7C18.2 15.2 12 19 12 19Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8.5h11l-.7 10.2a1.5 1.5 0 0 1-1.5 1.4H8.7a1.5 1.5 0 0 1-1.5-1.4L6.5 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8.4V7.2A3 3 0 0 1 12 4a3 3 0 0 1 3 3.2v1.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
