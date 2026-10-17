"use client";

import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  PRICE_MAX,
  PRICE_MIN,
  SIZE_ORDER,
  audiences,
  categories,
  categoryLine,
  categoryName,
  filterProducts,
  parseShopQuery,
} from "@/lib/catalog";
import { useStore } from "@/context/StoreProvider";
import { formatINR } from "@/lib/format";

const highlightOptions = [
  { id: "new", label: "New arrivals" },
  { id: "bestseller", label: "Bestsellers" },
  { id: "sale", label: "Sale & offers" },
];

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "latest", label: "Latest" },
  { id: "rating", label: "Top rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

export default function ShopView() {
  const router = useRouter();
  const { catalog } = useStore();
  const searchParams = useSearchParams();
  const query = useMemo(() => parseShopQuery(new URLSearchParams(searchParams.toString())), [searchParams]);
  const result = useMemo(() => filterProducts(query, catalog), [query, catalog]);
  const pool = useMemo(
    () => catalog.filter((product) => !query.who || product.audience === query.who),
    [catalog, query.who]
  );
  const visibleCategories = categories.filter((category) => pool.some((product) => product.category === category.slug));
  const visibleSizes = SIZE_ORDER.filter((size) => pool.some((product) => product.sizes.includes(size)));
  const visibleColors = Array.from(new Set(pool.flatMap((product) => product.colors))).sort();
  const [draftMin, setDraftMin] = useState(query.min);
  const [draftMax, setDraftMax] = useState(query.max);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setDraftMin(query.min);
    setDraftMax(query.max);
  }, [query.min, query.max]);

  function push(next: URLSearchParams) {
    const value = next.toString();
    router.push(value ? `/shop?${value}` : "/shop");
  }

  function update(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    push(params);
  }

  function toggle(key: string, value: string) {
    update((params) => {
      const current = (params.get(key) ?? "").split(",").filter(Boolean);
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    });
  }

  function commitPrice(min: number, max: number) {
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    update((params) => {
      if (low <= PRICE_MIN) params.delete("min");
      else params.set("min", String(low));
      if (high >= PRICE_MAX) params.delete("max");
      else params.set("max", String(high));
    });
  }

  function clearFilters() {
    router.push(query.who ? `/shop?who=${query.who}` : "/shop");
  }

  const audience = audiences.find((item) => item.slug === query.who);
  const title = query.cats.length === 1 ? categoryName(query.cats[0]) : query.q ? "Search" : query.cats.length > 1 ? "Selected edits" : audience ? audience.name : "The Shop";
  const line = query.q
    ? `Showing pieces that match “${query.q}”.`
    : query.cats.length === 1
      ? categoryLine(query.cats[0])
      : audience
        ? audience.line
        : "The full Sthree floor — festive, daily, and everything between.";

  const from = result.total === 0 ? 0 : result.start + 1;
  const to = result.start + result.items.length;
  const bannerPhoto =
    query.cats.length === 1
      ? pool.find((product) => product.category === query.cats[0])?.image
      : query.who
        ? pool.find((product) => product.audience === query.who)?.image
        : undefined;

  return (
    <div className="shop-wrap">
      <section className={`cat-banner${bannerPhoto ? " has-photo" : ""}`}>
        <div>
          <p className="eyebrow">{audience ? "Department" : "Category"}</p>
          <h1>{title}</h1>
          <p>{line}</p>
          <p className="style-count">{result.total} {result.total === 1 ? "style" : "styles"}</p>
        </div>
        {bannerPhoto ? <img src={bannerPhoto} alt="" /> : null}
      </section>

      <div className="circle-row" role="tablist" aria-label="Categories">
        <button type="button" className="circle-opt" onClick={() => update((params) => params.delete("cat"))}>
          <span className={`circle-photo circle-plain${!query.cats.length ? " is-on" : ""}`}>All</span>
          <span>All</span>
        </button>
        <button type="button" className="circle-opt" onClick={() => toggle("highlight", "sale")}>
          <span className={`circle-photo circle-plain${query.highlights.includes("sale") ? " is-on" : ""}`}>%</span>
          <span>Offers</span>
        </button>
        {visibleCategories.map((category) => {
          const cover = pool.find((product) => product.category === category.slug);
          const selected = query.cats.includes(category.slug);
          return (
            <button
              key={category.slug}
              type="button"
              className="circle-opt"
              onClick={() => toggle("cat", category.slug)}
            >
              <span className={`circle-photo${selected ? " is-on" : ""}`}>
                {cover ? <img src={cover.image} alt="" /> : null}
              </span>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="shop-layout">
        <aside className={`filters${filtersOpen ? " is-open" : ""}`}>
          <div className="filters-head">
            <h2>Filters</h2>
            <button type="button" className="text-btn" onClick={clearFilters}>Clear all</button>
          </div>
          <FilterCard title="Price range">
            <div className="range-wrap">
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={500} value={draftMin} aria-label="Minimum price" onChange={(event) => setDraftMin(Number(event.target.value))} onPointerUp={(event) => commitPrice(Number(event.currentTarget.value), draftMax)} onKeyUp={(event) => commitPrice(Number(event.currentTarget.value), draftMax)} />
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={500} value={draftMax} aria-label="Maximum price" onChange={(event) => setDraftMax(Number(event.target.value))} onPointerUp={(event) => commitPrice(draftMin, Number(event.currentTarget.value))} onKeyUp={(event) => commitPrice(draftMin, Number(event.currentTarget.value))} />
            </div>
            <p className="range-label">Price: {formatINR(Math.min(draftMin, draftMax))} — {formatINR(Math.max(draftMin, draftMax))}</p>
          </FilterCard>
          <FilterCard title="Highlights">
            {highlightOptions.map((option) => (
              <label key={option.id} className="check">
                <input type="checkbox" checked={query.highlights.includes(option.id)} onChange={() => toggle("highlight", option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </FilterCard>
          <FilterCard title="Categories">
            {visibleCategories.map((category) => (
              <label key={category.slug} className="check">
                <input type="checkbox" checked={query.cats.includes(category.slug)} onChange={() => toggle("cat", category.slug)} />
                <span>{category.name}</span>
                <em>{pool.filter((product) => product.category === category.slug).length}</em>
              </label>
            ))}
          </FilterCard>
          <FilterCard title="Sizes">
            <div className="size-checks">
              {visibleSizes.map((size) => (
                <label key={size} className={`size-chip${query.sizes.includes(size) ? " is-on" : ""}`}>
                  <input type="checkbox" checked={query.sizes.includes(size)} onChange={() => toggle("size", size)} />
                  {size}
                </label>
              ))}
            </div>
          </FilterCard>
          <FilterCard title="Colours">
            {visibleColors.map((color) => (
              <label key={color} className="check">
                <input type="checkbox" checked={query.colors.includes(color)} onChange={() => toggle("color", color)} />
                <span>{color}</span>
              </label>
            ))}
          </FilterCard>
        </aside>
        {filtersOpen ? <button className="scrim filters-scrim" aria-label="Close filters" onClick={() => setFiltersOpen(false)} /> : null}

        <div>
          <div className="results-bar">
            <p>Showing {from}–{to} of {result.total} results</p>
            <div className="results-actions">
              <button className="btn btn-ghost filter-toggle" type="button" onClick={() => setFiltersOpen(true)}>Filters</button>
              <label className="sort">
                <span className="sr-only">Sort</span>
                <select value={query.sort} onChange={(event) => update((params) => {
                  if (event.target.value === "featured") params.delete("sort");
                  else params.set("sort", event.target.value);
                })}>
                  {sorts.map((sort) => <option key={sort.id} value={sort.id}>{sort.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {result.items.length === 0 ? (
            <div className="empty">
              <h2>No pieces match these filters</h2>
              <p>Widen the price, or clear a category and look again.</p>
              <button className="btn" type="button" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {result.items.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          )}

          {result.pageCount > 1 ? (
            <nav className="pager" aria-label="Pages">
              {Array.from({ length: result.pageCount }, (_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    className={page === result.page ? "is-on" : ""}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (page === 1) params.delete("page");
                      else params.set("page", String(page));
                      push(params);
                    }}
                  >
                    {page}
                  </button>
                );
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="filter-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
