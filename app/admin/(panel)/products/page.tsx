import Link from "next/link";
import { deleteStudioProduct, resetProduct, saveProduct } from "@/lib/admin-actions";
import { formatINR } from "@/lib/format";
import { getDeskProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const whos = ["", "women", "men", "kids"] as const;

const notices: Record<string, string> = {
  added: "Piece is live on the shop. Open it from the table to change price, stock, or the photo.",
};

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ who?: string; q?: string; notice?: string }> }) {
  const { who = "", q = "", notice } = await searchParams;
  const needle = q.trim().toLowerCase();
  const rows = (await getDeskProducts()).filter((product) => {
    if (who && product.audience !== who) return false;
    if (!needle) return true;
    return `${product.name} ${product.sku}`.toLowerCase().includes(needle);
  });

  return (
    <>
      <header className="desk-head dash-head">
        <div>
          <h1>Products</h1>
          <p className="desk-note">{rows.length} pieces · click a photo to replace it. That photo is used on bestsellers, the wedding floor, kids, and the shop.</p>
        </div>
        <div className="dash-actions">
          <Link className="btn" href="/admin/products/new">Add product</Link>
        </div>
      </header>
      {notice && notices[notice] ? <p className="success">{notices[notice]}</p> : null}
      <div className="desk-toolbar">
        <form className="desk-search" action="/admin/products">
          {who ? <input type="hidden" name="who" value={who} /> : null}
          <input name="q" defaultValue={q} placeholder="Search name or SKU" aria-label="Find a piece" />
          <button className="btn btn-ghost" type="submit">Search</button>
        </form>
        <p className="desk-filters">
          {whos.map((item) => (
            <Link key={item || "all"} href={item ? `/admin/products?who=${item}` : "/admin/products"} className={who === item ? "is-on" : undefined}>
              {item || "All"}
            </Link>
          ))}
        </p>
      </div>
      <div className="desk-table-wrap">
        <table className="desk-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Compare</th>
              <th>Stock</th>
              <th>Visibility</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => {
              const formId = `piece-${product.slug}`;
              return (
                <tr key={product.slug}>
                  <td>
                    <div className="desk-piece">
                      <label className="desk-photo">
                        <img className="desk-thumb" src={product.image} alt="" />
                        <input form={formId} type="file" name="photo" accept="image/jpeg,image/png,image/webp" aria-label={`Replace photo for ${product.name}`} />
                      </label>
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.sku} · {product.audience} · {product.category}{product.fromDesk ? " · desk" : ""}</small>
                        {product.edited && !product.fromDesk ? <><br /><small>Catalogue {formatINR(product.cataloguePrice)}</small></> : null}
                      </div>
                    </div>
                  </td>
                  <td>
                    <form id={formId} action={saveProduct}>
                      <input type="hidden" name="slug" value={product.slug} />
                    </form>
                    <input className="desk-num" form={formId} name="price" type="number" min={0} defaultValue={product.price} aria-label={`Price for ${product.name}`} required />
                  </td>
                  <td>
                    <input className="desk-num" form={formId} name="compareAt" type="number" min={0} defaultValue={product.compareAt ?? ""} placeholder="—" aria-label={`Compare price for ${product.name}`} />
                  </td>
                  <td>
                    <label className="desk-check">
                      <input form={formId} type="checkbox" name="inStock" defaultChecked={product.inStock} />
                      <span className={`desk-pill${product.inStock ? " is-ok" : " is-warn"}`}>{product.inStock ? "In stock" : "Out"}</span>
                    </label>
                  </td>
                  <td>
                    <label className="desk-check">
                      <input form={formId} type="checkbox" name="hidden" defaultChecked={product.hidden} />
                      <span className={`desk-pill${product.hidden ? " is-off" : ""}`}>{product.hidden ? "Hidden" : "Live"}</span>
                    </label>
                  </td>
                  <td>
                    <div className="desk-inline">
                      <button className="btn" form={formId} type="submit">Save</button>
                      {product.fromDesk ? (
                        <form action={deleteStudioProduct}>
                          <input type="hidden" name="slug" value={product.slug} />
                          <button className="text-btn" type="submit">Remove</button>
                        </form>
                      ) : product.edited ? (
                        <form action={resetProduct}>
                          <input type="hidden" name="slug" value={product.slug} />
                          <button className="text-btn" type="submit">Reset</button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
