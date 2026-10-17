import Link from "next/link";
import { formatINR, FREE_SHIPPING, PROMO_CODE } from "@/lib/format";
import { studio } from "@/lib/studio";

export default function OrderBand() {
  return (
    <section className="order-band" aria-label="Order online">
      <div className="order-band-copy">
        <p className="eyebrow">From the Nagole floor</p>
        <h2>Order online</h2>
        <p>
          Bag the piece on the site. {PROMO_CODE} takes 20% off. Shipping is complimentary above {formatINR(FREE_SHIPPING)}.
          Unsure of a blouse? WhatsApp the floor before you pay.
        </p>
      </div>
      <ul className="order-points">
        <li><strong>20% off</strong> Code {PROMO_CODE} at checkout</li>
        <li><strong>Ship from Hyderabad</strong> Free above {formatINR(FREE_SHIPPING)}</li>
        <li><strong>7-day exchange</strong> Unworn, with tags</li>
      </ul>
      <div className="order-actions">
        <Link className="btn" href="/shop">Order online</Link>
        <a className="btn btn-ghost" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp the studio</a>
      </div>
    </section>
  );
}
