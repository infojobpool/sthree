"use client";

import Link from "next/link";
import { defaultOccasions, type OccasionCard } from "@/lib/media";

export default function OccasionSlider({ items = defaultOccasions }: { items?: OccasionCard[] }) {
  const occasions = items.length ? items : defaultOccasions;

  return (
    <section className="section band band-sand fan-band" aria-label="Shop by occasion">
      <h2 className="occasion-title">Shop by occasion</h2>
      <div className="swatch-stage">
        {occasions.map((occasion) => (
          <Link key={occasion.name} href={occasion.href} className="swatch-chip">
            <img src={occasion.image} alt="" />
            <span>{occasion.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
