import Link from "next/link";
import { resetProduct, saveProduct } from "@/lib/admin-actions";
import { formatINR } from "@/lib/format";
import { getDeskProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const whos = ["", "women", "men", "kids"] as const;

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ who?: string; q?: string }> }) {
  const { who = "", q = "" } = await searchParams;
  const needle = q.trim().toLowerCase();
  const rows = (await getDeskProducts()).filter((product) => {
    if (who && product.audience !== who) return false;
    if (!needle) return true;
    return `${product.name} ${product.sku}`.toLowerCase().includes(needle);
  });

  return (
    <>
      <header className="desk-head">
        <p className="eyebrow">Products</p>
        <h1>{rows.length} pieces</h1>
        <p className="desk-note">Price, stock, and hiding a piece update the shop. Photos and names stay in the catalogue. The offer on checkout stays 20%.</p>
      </header>
      <form className="desk-search" action="/admin/products">
        {who ? <input type="hidden" name="who" value={who} /> : null}
        <input name="q" defaultValue={q} placeholder="Name or SKU" aria-label="Find a piece" />
        <button className="btn" type="submit">Find</button>
      </form>
      <p className="desk-filters">
        {whos.map((item) => (
          <Link key={item || "all"} href={item ? `/admin/products?who=${item}` : "/admin/products"} className={who === item ? "is-on" : undefined}>
            {item || "All"}
          </Link>
        ))}
      </p>
      <div className="desk-table-wrap">
        <table className="desk-table">
          <thead>
            <tr><th>Piece</th><th>Price</th><th>Was</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.slug}>
                <td>
                  {product.name}<br />
                  <small>{product.sku} · {product.audience} · {product.category}</small>
                  {product.edited ? <><br /><small>Catalogue {formatINR(product.cataloguePrice)}</small></> : null}
                </td>
                <td colSpan={4}>
                  <form className="desk-inline" action={saveProduct}>
                    <input type="hidden" name="slug" value={product.slug} />
                    <input className="desk-num" name="price" type="number" min={0} defaultValue={product.price} aria-label={`Price for ${product.name}`} required />
                    <input className="desk-num" name="compareAt" type="number" min={0} defaultValue={product.compareAt ?? ""} placeholder="Was" aria-label={`Compare price for ${product.name}`} />
                    <label className="check"><input type="checkbox" name="inStock" defaultChecked={product.inStock} /><span>In stock</span></label>
                    <label className="check"><input type="checkbox" name="hidden" defaultChecked={product.hidden} /><span>Hide</span></label>
                    <button className="btn" type="submit">Save</button>
                  </form>
                  {product.edited ? (
                    <form action={resetProduct}>
                      <input type="hidden" name="slug" value={product.slug} />
                      <button className="text-btn" type="submit">Use catalogue price</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
