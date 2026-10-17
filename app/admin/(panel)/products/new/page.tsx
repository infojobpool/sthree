import Link from "next/link";
import PhotoPick from "@/components/admin/PhotoPick";
import { addProduct } from "@/lib/admin-actions";
import { audiences, categories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  name: "Give the piece a name.",
  photo: "Add a photo — jpeg, png, or webp, under 8MB.",
};

export default async function NewProduct({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <form action={addProduct} className="piece-page">
      <header className="desk-head dash-head">
        <div>
          <p className="eyebrow"><Link href="/admin/products">Products</Link> / New</p>
          <h1>Add product</h1>
          <p className="desk-note">Write the listing the way it should appear on the shop. The photo is used on bestsellers, the wedding floor, kids, and the product page.</p>
        </div>
        <div className="dash-actions">
          <Link className="btn btn-ghost" href="/admin/products">Discard</Link>
          <button className="btn" type="submit">Save product</button>
        </div>
      </header>
      {error && errors[error] ? <p className="error">{errors[error]}</p> : null}
      <div className="piece-editor">
        <div className="desk-stack">
          <section className="desk-card">
            <h2>Title</h2>
            <label className="field">
              Name
              <input name="name" required placeholder="Amber Court Lehenga" autoComplete="off" />
            </label>
            <label className="field">
              Description
              <textarea name="description" rows={5} placeholder="What the piece is for, the fabric, and how it wears on a wedding day." />
            </label>
          </section>
          <section className="desk-card">
            <h2>Media</h2>
            <PhotoPick name="photo" required />
          </section>
          <section className="desk-card">
            <h2>Pricing</h2>
            <div className="desk-form-grid">
              <label className="field">Price ₹<input name="price" type="number" min={0} required defaultValue={4990} /></label>
              <label className="field">Compare-at ₹<input name="compareAt" type="number" min={0} placeholder="Shown as a strike-through if higher" /></label>
            </div>
          </section>
          <section className="desk-card">
            <h2>Options</h2>
            <div className="desk-form-grid">
              <label className="field">Colours<input name="colors" placeholder="Ivory, Maroon" /></label>
              <label className="field">Sizes<input name="sizes" placeholder="S, M, L, XL, XXL, 3XL" /></label>
              <label className="field">Fabric<input name="fabric" placeholder="Georgette" /></label>
              <label className="field">Includes<input name="includes" placeholder="Blouse, Dupatta" /></label>
            </div>
          </section>
        </div>
        <aside className="desk-stack">
          <section className="desk-card">
            <h2>Status</h2>
            <label className="field">
              Visibility
              <select name="status" defaultValue="live">
                <option value="live">Active — live on the shop</option>
                <option value="draft">Draft — hidden until you publish</option>
              </select>
            </label>
            <label className="check"><input type="checkbox" name="inStock" defaultChecked /><span>In stock</span></label>
          </section>
          <section className="desk-card">
            <h2>Organisation</h2>
            <label className="field">
              Audience
              <select name="audience" defaultValue="women">
                {audiences.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label className="field">
              Category
              <select name="category" defaultValue="kurthi">
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label className="field">SKU (optional)<input name="sku" placeholder="ST-4101" /></label>
          </section>
          <section className="desk-card">
            <h2>Sales channels</h2>
            <p className="desk-note">Where this piece should surface besides the shop grid.</p>
            <div className="desk-checks">
              <label className="check"><input type="checkbox" name="new" defaultChecked /><span>New</span></label>
              <label className="check"><input type="checkbox" name="bestseller" /><span>Home bestsellers</span></label>
              <label className="check"><input type="checkbox" name="sale" /><span>Sale</span></label>
            </div>
          </section>
        </aside>
        <div className="piece-savebar">
          <Link href="/admin/products">Back to products</Link>
          <button className="btn" type="submit">Save product</button>
        </div>
      </div>
    </form>
  );
}
