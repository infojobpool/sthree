"use client";

import Link from "next/link";

type Item = { slug: string; name: string; image?: string; focus?: string };

export default function CategoryScroller({ items }: { items: Item[] }) {
  const loop = [...items, ...items];

  return (
    <div className="cat-scroller">
      <div className="cat-track">
        {loop.map((category, index) => (
          <Link
            key={`${category.slug}-${index}`}
            href={`/shop?cat=${category.slug}`}
            className="cat-tile"
            aria-hidden={index >= items.length ? true : undefined}
            tabIndex={index >= items.length ? -1 : undefined}
          >
            <span className="circle-photo">
              {category.image ? <img src={category.image} alt="" style={category.focus ? { objectPosition: category.focus } : undefined} /> : null}
              <span className="circle-caption">
                <span className="circle-name">{category.name}</span>
                <span className="circle-deal">UPTO <strong>20%</strong> OFF</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
