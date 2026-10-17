import Link from "next/link";
import { looks, portraitPhoto } from "@/lib/photos";
import { sisterLine, studio } from "@/lib/studio";

export default function HouseBand() {
  return (
    <section className="house-band">
      <img src={portraitPhoto(looks.ruby)} alt="" />
      <div className="house-band-copy">
        <p className="eyebrow">The house</p>
        <h2>Eight years, two floors, one sisters' name</h2>
        <p>
          {sisterLine} opened Sthree in {studio.opened} for festive clothes they would wear themselves.
          Five hundred families still come back. The house now keeps two shopping outlets in Hyderabad.
        </p>
        <p className="house-sisters">{studio.sisters.join(" · ")} {studio.family}</p>
        <div className="house-stats">
          <p><strong>{studio.years}</strong><span>Years on the floor</span></p>
          <p><strong>{studio.families}+</strong><span>Loyal families</span></p>
          <p><strong>{studio.outlets}</strong><span>Shopping outlets</span></p>
        </div>
        <Link className="btn" href="/about">Read the story</Link>
      </div>
    </section>
  );
}
