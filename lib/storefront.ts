import { cache } from "react";
import { prisma } from "@/lib/db";
import { products, type Audience, type CategorySlug, type Highlight, type Product } from "@/lib/catalog";
import { defaultOffer, type OfferSettings } from "@/lib/format";
import { defaultHomeMedia, parseHomeMedia } from "@/lib/media";

export function parseOffer(raw: string | null | undefined): OfferSettings {
  if (!raw) return defaultOffer;
  try {
    const data = JSON.parse(raw) as Partial<OfferSettings>;
    const freeShipping = Math.max(0, Math.round(Number(data.freeShipping)));
    const shippingFee = Math.max(0, Math.round(Number(data.shippingFee)));
    const promoCode = String(data.promoCode ?? defaultOffer.promoCode).trim().toUpperCase();
    return {
      promoOn: data.promoOn === undefined ? defaultOffer.promoOn : Boolean(data.promoOn),
      promoCode: promoCode || defaultOffer.promoCode,
      freeShipping: Number.isFinite(freeShipping) ? freeShipping : defaultOffer.freeShipping,
      shippingFee: Number.isFinite(shippingFee) ? shippingFee : defaultOffer.shippingFee,
    };
  } catch {
    return defaultOffer;
  }
}

export type DeskProduct = Product & { hidden: boolean; edited: boolean; cataloguePrice: number; fromDesk: boolean };

function parseList(raw: string) {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map((item) => String(item)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function studioToProduct(row: {
  slug: string;
  sku: string;
  name: string;
  category: string;
  audience: string;
  price: number;
  compareAt: number | null;
  colors: string;
  sizes: string;
  image: string;
  description: string;
  fabric: string;
  includes: string;
  highlights: string;
  inStock: boolean;
  hidden: boolean;
}): DeskProduct {
  const product: DeskProduct = {
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category as CategorySlug,
    audience: (row.audience === "men" || row.audience === "kids" ? row.audience : "women") as Audience,
    price: row.price,
    colors: parseList(row.colors),
    sizes: parseList(row.sizes),
    image: row.image,
    description: row.description,
    fabric: row.fabric,
    includes: parseList(row.includes),
    highlights: parseList(row.highlights) as Highlight[],
    rating: 0,
    reviews: 0,
    inStock: row.inStock,
    hidden: row.hidden,
    edited: true,
    cataloguePrice: row.price,
    fromDesk: true,
  };
  if (row.compareAt && row.compareAt > row.price) product.compareAt = row.compareAt;
  return product;
}

function mergeProduct(product: Product, edit?: { price: number; compareAt: number | null; inStock: boolean; hidden: boolean; image?: string | null }): DeskProduct {
  if (!edit) return { ...product, hidden: false, edited: false, cataloguePrice: product.price, fromDesk: false };
  const next: DeskProduct = {
    ...product,
    price: edit.price,
    inStock: edit.inStock,
    hidden: edit.hidden,
    edited: true,
    cataloguePrice: product.price,
    fromDesk: false,
  };
  if (edit.compareAt && edit.compareAt > edit.price) next.compareAt = edit.compareAt;
  else delete next.compareAt;
  if (edit.image) {
    next.image = edit.image;
    next.images = [edit.image, ...(product.images ?? []).filter((src) => src !== product.image && src !== edit.image)];
  }
  return next;
}

async function deskExtras() {
  try {
    return (await prisma.studioProduct.findMany({ orderBy: { createdAt: "desc" } })).map(studioToProduct);
  } catch {
    return [];
  }
}

export const getStorefront = cache(async () => {
  try {
    const [edits, setting] = await Promise.all([
      prisma.productEdit.findMany(),
      prisma.setting.findUnique({ where: { key: "shop" } }),
    ]);
    const settings = parseOffer(setting?.value);
    const extras = await deskExtras();
    const bySlug = new Map(edits.map((edit) => [edit.slug, edit]));
    const catalog = products.flatMap((product) => {
      const merged = mergeProduct(product, bySlug.get(product.slug));
      if (merged.hidden) return [];
      return [merged];
    });
    const added = extras.filter((product) => !product.hidden && !catalog.some((item) => item.slug === product.slug));
    return { products: [...added, ...catalog], settings };
  } catch {
    return { products, settings: defaultOffer };
  }
});

export async function getDeskProducts() {
  const [edits, extras] = await Promise.all([prisma.productEdit.findMany(), deskExtras()]);
  const bySlug = new Map(edits.map((edit) => [edit.slug, edit]));
  const catalog = products.map((product) => mergeProduct(product, bySlug.get(product.slug)));
  return [...extras, ...catalog.filter((product) => !extras.some((item) => item.slug === product.slug))];
}

export async function getShopSettings() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "shop" } });
    return parseOffer(setting?.value);
  } catch {
    return defaultOffer;
  }
}

export async function getHomeMedia() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "homeMedia" } });
    return parseHomeMedia(setting?.value);
  } catch {
    return defaultHomeMedia;
  }
}
