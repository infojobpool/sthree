"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { formatINR, PROMO_RATE } from "@/lib/format";

const KEY = "sthree-offer-pop";
const WEEK = 7 * 24 * 60 * 60 * 1000;

function recentlyClosed() {
  try {
    const at = Number(localStorage.getItem(KEY) ?? "");
    return Number.isFinite(at) && Date.now() - at < WEEK;
  } catch {
    return false;
  }
}

function rememberClose() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export default function OfferPopup() {
  const pathname = usePathname();
  const titleId = useId();
  const { ready, settings, code, applyCode } = useStore();
  const [open, setOpen] = useState(false);
  const percent = Math.round(PROMO_RATE * 100);
  const hide =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/cart");

  useEffect(() => {
    if (!ready || hide || !settings.promoOn) return;
    if (code === settings.promoCode) return;
    if (recentlyClosed()) return;
    const timer = window.setTimeout(() => setOpen(true), 1100);
    return () => window.clearTimeout(timer);
  }, [ready, hide, settings.promoOn, settings.promoCode, code]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    rememberClose();
    setOpen(false);
  }

  function takeOffer() {
    applyCode(settings.promoCode);
    rememberClose();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="offer-pop-scrim" onClick={close}>
      <div
        className="offer-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="offer-pop-close" type="button" aria-label="Close offer" onClick={close}>
          ×
        </button>
        <p className="eyebrow">From the Nagole floor</p>
        <h2 id={titleId}>{percent}% off with {settings.promoCode}</h2>
        <p>
          A flat {percent}% on the bag when you use the code. Complimentary shipping from {formatINR(settings.freeShipping)}.
        </p>
        <p className="offer-pop-code">{settings.promoCode}</p>
        <div className="offer-pop-actions">
          <button className="btn" type="button" onClick={takeOffer}>Apply to bag</button>
          <Link className="btn btn-ghost" href="/shop" onClick={close}>Shop the edit</Link>
        </div>
      </div>
    </div>
  );
}
