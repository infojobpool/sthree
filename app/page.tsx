import Link from "next/link";
import CategoryScroller from "@/components/CategoryScroller";
import HouseBand from "@/components/HouseBand";
import KidsCollection from "@/components/KidsCollection";
import OccasionSlider from "@/components/OccasionSlider";
import OfferSlider from "@/components/OfferSlider";
import OrderBand from "@/components/OrderBand";
import ProductCard from "@/components/ProductCard";
import StageDeck from "@/components/StageDeck";
import WeddingFloor from "@/components/WeddingFloor";
import { categories } from "@/lib/catalog";
import { formatINR, FREE_SHIPPING, PROMO_CODE } from "@/lib/format";
import { getHomeMedia, getStorefront } from "@/lib/storefront";
import { sisterLine, studio } from "@/lib/studio";

const circleCovers: Record<string, { image: string; focus?: string }> = {
  designer: { image: "/looks/designer-gown.png", focus: "center 18%" },
  "dress-material": { image: "/looks/peacock-dress-material.jpg" },
  saree: { image: "/looks/pink-gold-saree.jpg", focus: "center 55%" },
};

const notes = [
  { quote: "Tried the lehenga in Nagole before I booked it. The fall was lighter than it looked in the photograph.", name: "Meera", place: "Hyderabad" },
  { quote: "The blouse sat properly in 3XL. I wore it through the sangeet and did not send it for alteration.", name: "Anitha", place: "Uppal" },
  { quote: "Ordered the co-ord for a lunch and wore it again the next week. The colour was the same as the site.", name: "Latha", place: "Secunderabad" },
];

export default async function HomePage() {
  const [{ products }, media] = await Promise.all([getStorefront(), getHomeMedia()]);
  const cover = (slug: string) => products.find((product) => product.category === slug);
  const edit = categories.filter((category) => products.some((product) => product.category === category.slug && product.audience === "women"));
  const women = products.filter((product) => product.audience === "women");
  const kidsPieces = products.filter((product) => product.audience === "kids");
  const best = women.filter((product) => product.highlights.includes("bestseller")).slice(0, 7);
  const offers = women.filter((product) => product.highlights.includes("sale")).slice(0, 4);
  const lehengas = women.filter((product) => product.category === "lehenga");
  const wedding = [
    ...lehengas.filter((product) => product.slug === "ruby-filigree-lehenga"),
    ...lehengas.filter((product) => product.slug !== "ruby-filigree-lehenga"),
  ].slice(0, 8);

  return (
    <>
      <OfferSlider
        banners={[
          {
            src: media.heroes[0],
            alt: "Ivory Arch Lehenga",
            href: "/shop",
            floor: true,
            eyebrow: "Nagole showroom",
            title: "More than a photograph",
            text: "Order the piece from the site, or try the fall on the floor in Nagole before you decide.",
            cta: "Order online",
            secondaryHref: "/showrooms",
            secondary: "Visit the studio",
          },
          {
            src: media.heroes[1],
            alt: "Blush Pavilion Lehenga",
            href: "/product/blush-pavilion-lehenga",
            floor: true,
            eyebrow: "Lehenga",
            title: "Blush Pavilion",
            text: "Pink and gold work gathered into a lighter skirt.",
            cta: "View this piece",
          },
          {
            src: media.heroes[2],
            alt: "Pearl Hour Lehenga",
            href: "/product/pearl-hour-lehenga",
            floor: true,
            eyebrow: "Lehenga",
            title: "Pearl Hour",
            text: "A blush lehenga beaded along the hem in small pearls.",
            cta: "View this piece",
          },
          {
            src: media.dasara,
            alt: "Sthree Dasara Double Dhamaka banner",
            href: "/shop",
            graphic: true,
          },
        ]}
        products={[]}
      />
  <div className="home">
      <OrderBand />

      <section className="section">
        <div className="section-head">
          <h2>Shop by Categories</h2>
          <Link href="/shop">All categories</Link>
        </div>
        <CategoryScroller
          items={edit.map((category) => ({
            slug: category.slug,
            name: category.name,
            image: circleCovers[category.slug]?.image ?? cover(category.slug)?.image,
            focus: circleCovers[category.slug]?.focus,
          }))}
        />
      </section>

      <OccasionSlider items={media.occasions} />

      <StageDeck
        products={best}
        eyebrow="Chosen again"
        title={<>Best<em>sellers</em></>}
        href="/shop?highlight=bestseller"
        link="View all"
      />

      <WeddingFloor products={wedding} />

      <KidsCollection products={kidsPieces} />

      <HouseBand />

      <section className="section">
        <div className="section-head">
          <h2>On offer</h2>
          <Link href="/shop?highlight=sale">View all</Link>
        </div>
        <div className="product-grid">
          {offers.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="section band band-blush">
        <div className="section-head">
          <h2>From the floor</h2>
        </div>
        <div className="quote-grid">
          {notes.map((note) => (
            <blockquote key={note.name} className="quote">
              <p>“{note.quote}”</p>
              <cite>{note.name} · {note.place}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="visit">
          <div>
            <p className="eyebrow">In Hyderabad</p>
            <h2>Visit the studio</h2>
            <p>Two shopping outlets in Hyderabad. Try the fall on the floor, or order from the site if you already know the piece. Walk in on a weekday, or send a note ahead.</p>
            <p className="visit-meta">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(studio.address)}`} target="_blank" rel="noreferrer">
                {studio.address}
              </a>
            </p>
            <p className="visit-meta">
              Open daily, 11:00 – 8:30
              {studio.phones[0].split(",").map((phone) => {
                const digits = phone.replace(/\D/g, "");
                return (
                  <a key={digits} className="visit-phone" href={`tel:+91${digits}`}>
                    {digits}
                  </a>
                );
              })}
            </p>
          </div>
          <div className="visit-actions">
            <Link className="btn" href="/shop">Order online</Link>
            <a className="btn btn-ghost" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp the studio</a>
            <Link className="btn btn-ghost" href="/showrooms">Showroom details</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Why the house</h2></div>
        <div className="feature-grid">
          <article className="feature"><h3>A sisters' house</h3><p>{sisterLine} opened the floor in {studio.opened}. The edit is still chosen the way they dress their own family.</p></article>
          <article className="feature"><h3>Two Hyderabad outlets</h3><p>Walk in at Nagole, or call for the nearer floor. Weekdays are quieter; send a note ahead if you want a piece kept ready.</p></article>
          <article className="feature"><h3>Order from home</h3><p>Bag it on the site with {PROMO_CODE}. Complimentary shipping above {formatINR(FREE_SHIPPING)}. WhatsApp if you want the desk to check a size first.</p></article>
          <article className="feature"><h3>Five hundred families</h3><p>They come back because a lehenga can be worn for hours, and a blouse is fitted on the floor.</p></article>
        </div>
      </section>
    </div>
    </>
  );
}
