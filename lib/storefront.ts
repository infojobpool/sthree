import { cache } from "react";
import { prisma } from "@/lib/db";
import { products, type Product } from "@/lib/catalog";
import { defaultOffer, type OfferSettings } from "@/lib/format";

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

function mergeProduct(product: Product, edit?: { price: number; compareAt: number | null; inStock: boolean; hidden: boolean }) {
  if (!edit) return { ...product, hidden: false, edited: false, cataloguePrice: product.price };
  const next: Product & { hidden: boolean; edited: boolean; cataloguePrice: number } = {
    ...product,
    price: edit.price,
    inStock: edit.inStock,
    hidden: edit.hidden,
    edited: true,
    cataloguePrice: product.price,
  };
  if (edit.compareAt && edit.compareAt > edit.price) next.compareAt = edit.compareAt;
  else delete next.compareAt;
  return next;
}

export const getStorefront = cache(async () => {
  try {
    const [edits, setting] = await Promise.all([
      prisma.productEdit.findMany(),
      prisma.setting.findUnique({ where: { key: "shop" } }),
    ]);
    const settings = parseOffer(setting?.value);
    const bySlug = new Map(edits.map((edit) => [edit.slug, edit]));
    const live = products.flatMap((product) => {
      const merged = mergeProduct(product, bySlug.get(product.slug));
      if (merged.hidden) return [];
      return [merged];
    });
    return { products: live, settings };
  } catch {
    return { products, settings: defaultOffer };
  }
});

export async function getDeskProducts() {
  const edits = await prisma.productEdit.findMany();
  const bySlug = new Map(edits.map((edit) => [edit.slug, edit]));
  return products.map((product) => mergeProduct(product, bySlug.get(product.slug)));
}

export async function getShopSettings() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "shop" } });
    return parseOffer(setting?.value);
  } catch {
    return defaultOffer;
  }
}
