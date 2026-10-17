import { saveHomeMedia } from "@/lib/admin-actions";
import { getHomeMedia } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function AdminMedia({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const media = await getHomeMedia();
  const heroes = [
    { label: "Hero 1 · Nagole showroom", src: media.heroes[0] },
    { label: "Hero 2 · Blush Pavilion", src: media.heroes[1] },
    { label: "Hero 3 · Pearl Hour", src: media.heroes[2] },
  ];

  return (
    <>
      <header className="desk-head">
        <h1>Images</h1>
        <p className="desk-note">Replace the home swiper, occasion cards, and footer. Bestsellers, wedding floor, and kids use each product photo — change those on Products.</p>
      </header>
      {notice === "saved" ? <p className="success">Home images saved.</p> : null}
      <form className="desk-stack" action={saveHomeMedia}>
        <section className="desk-card">
          <h2>Home swiper</h2>
          <div className="desk-media-grid">
            {heroes.map((hero, index) => (
              <label key={hero.label} className="desk-media">
                <img src={hero.src} alt="" />
                <span>{hero.label}</span>
                <input type="file" name={`heroFile-${index}`} accept="image/jpeg,image/png,image/webp" />
                <input name={`hero-${index}`} defaultValue={hero.src} placeholder="Or paste image URL" />
              </label>
            ))}
            <label className="desk-media">
              <img src={media.dasara} alt="" />
              <span>Dasara banner</span>
              <input type="file" name="dasaraFile" accept="image/jpeg,image/png,image/webp" />
              <input name="dasara" defaultValue={media.dasara} placeholder="Or paste image URL" />
            </label>
          </div>
        </section>
        <section className="desk-card">
          <h2>Shop by occasion</h2>
          <div className="desk-media-grid">
            {media.occasions.map((occasion) => (
              <label key={occasion.name} className="desk-media">
                <img src={occasion.image} alt="" />
                <span>{occasion.name}</span>
                <input type="file" name={`occasionFile-${occasion.name}`} accept="image/jpeg,image/png,image/webp" />
                <input name={`occasion-${occasion.name}`} defaultValue={occasion.image} placeholder="Or paste image URL" />
              </label>
            ))}
          </div>
        </section>
        <section className="desk-card">
          <h2>Footer</h2>
          <div className="desk-media-grid">
            <label className="desk-media is-wide">
              <img src={media.footer} alt="" />
              <span>Footer photograph</span>
              <input type="file" name="footerFile" accept="image/jpeg,image/png,image/webp" />
              <input name="footer" defaultValue={media.footer} placeholder="Or paste image URL" />
            </label>
          </div>
        </section>
        <button className="btn" type="submit">Save images</button>
      </form>
    </>
  );
}
