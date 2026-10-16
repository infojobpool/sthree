import Link from "next/link";
import CategoryScroller from "@/components/CategoryScroller";
import KidsCollection from "@/components/KidsCollection";
import OccasionSlider from "@/components/OccasionSlider";
import OfferSlider from "@/components/OfferSlider";
import ProductCard from "@/components/ProductCard";
import StageDeck from "@/components/StageDeck";
import WeddingFloor from "@/components/WeddingFloor";
import { categories } from "@/lib/catalog";
import { getStorefront } from "@/lib/storefront";
import { heroPhoto, looks } from "@/lib/photos";
import { studio } from "@/lib/studio";

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
  const { products } = await getStorefront();
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
            src: heroPhoto(looks.ivory),
            alt: "Ivory Arch Lehenga",
            href: "/shop",
            floor: true,
            eyebrow: "Nagole showroom",
            title: "More than a photograph",
            text: "Try the fall, the blouse, and the dupatta on the floor before you decide.",
            cta: "Shop the edit",
            secondaryHref: "/showrooms",
            secondary: "Visit the studio",
          },
          {
            src: heroPhoto(looks.blush),
            alt: "Blush Pavilion Lehenga",
            href: "/product/blush-pavilion-lehenga",
            floor: true,
            eyebrow: "Lehenga",
            title: "Blush Pavilion",
            text: "Pink and gold work gathered into a lighter skirt.",
            cta: "View this piece",
          },
          {
            src: heroPhoto(looks.pearl),
            alt: "Pearl Hour Lehenga",
            href: "/product/pearl-hour-lehenga",
            floor: true,
            eyebrow: "Lehenga",
            title: "Pearl Hour",
            text: "A blush lehenga beaded along the hem in small pearls.",
            cta: "View this piece",
          },
          {
            src: "/banners/dasara-double-dhamaka.jpg",
            alt: "Sthree Dasara Double Dhamaka banner",
            href: "/shop",
            graphic: true,
          },
        ]}
        products={[]}
      />
  <div className="home">

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

      <OccasionSlider />

      <StageDeck
        products={best}
        eyebrow="Chosen again"
        title={<>Best<em>sellers</em></>}
        href="/shop?highlight=bestseller"
        link="View all"
      />

      <WeddingFloor products={wedding} />

      <KidsCollection products={kidsPieces} />

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
            <p>Try the fall, the blouse, and the dupatta before you decide. Walk in on a weekday, or send a note ahead.</p>
            <p className="visit-meta">{studio.address}</p>
            <p className="visit-meta">Open daily, 11:00 – 8:30 · {studio.phones[0]}</p>
          </div>
          <div className="visit-actions">
            <a className="btn" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp the studio</a>
            <Link className="btn btn-ghost" href="/showrooms">Showroom details</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Why the house</h2></div>
        <div className="feature-grid">
          <article className="feature"><h3>Hand-finished</h3><p>Embroidery is placed so a lehenga can be worn for hours, not just photographed.</p></article>
          <article className="feature"><h3>Showroom first</h3><p>Try the fall, the blouse, and the dupatta in person before you decide.</p></article>
          <article className="feature"><h3>A full floor</h3><p>Kurtis, sarees, and dupattas sit beside the lehengas — one edit, not a marketplace.</p></article>
        </div>
      </section>
    </div>
    </>
  );
}
