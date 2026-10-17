"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { categories, getProduct, type Audience, type CategorySlug, type Highlight } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { defaultOffer } from "@/lib/format";
import { hashPassword, verifyPassword } from "@/lib/password";
import { EXCHANGE_STATUSES, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orders";
import { parseHomeMedia } from "@/lib/media";
import { parseOffer } from "@/lib/storefront";
import { saveUpload } from "@/lib/upload";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/admin/login");
  return session;
}

function refreshShop(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/admin/exchanges");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/media");
  revalidatePath("/admin/staff");
  if (slug) revalidatePath(`/product/${slug}`);
}

function csv(raw: string, fallback: string[]) {
  const items = raw.split(/[,|\n]/).map((item) => item.trim()).filter(Boolean);
  return items.length ? items : fallback;
}

function slugify(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 56);
  return slug || "piece";
}

const allowedCategories = new Set(categories.map((item) => item.slug));

function parseAudience(value: string): Audience {
  return value === "men" || value === "kids" ? value : "women";
}

function parseCategory(value: string): CategorySlug {
  return allowedCategories.has(value as CategorySlug) ? (value as CategorySlug) : "kurthi";
}

export async function addProduct(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const photo = await saveUpload(formData.get("photo"));
  if (!name) redirect("/admin/products/new?error=name");
  if (!photo) redirect("/admin/products/new?error=photo");
  const audience = parseAudience(String(formData.get("audience") ?? "women"));
  const category = parseCategory(String(formData.get("category") ?? "kurthi"));
  const price = Math.max(0, Math.round(Number(formData.get("price")) || 0));
  const compareRaw = String(formData.get("compareAt") ?? "").trim();
  const compareAt = compareRaw === "" ? null : Math.max(0, Math.round(Number(compareRaw)));
  const sizes = csv(String(formData.get("sizes") ?? ""), audience === "kids" ? ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"] : ["S", "M", "L", "XL", "XXL", "3XL"]);
  const colors = csv(String(formData.get("colors") ?? ""), ["As shown"]);
  const includes = csv(String(formData.get("includes") ?? ""), []);
  const highlights = ["new", "bestseller", "sale"].filter((item) => formData.get(item) === "on") as Highlight[];
  let slug = slugify(name);
  let n = 2;
  while (getProduct(slug) || (await prisma.studioProduct.findUnique({ where: { slug } }))) {
    slug = `${slugify(name)}-${n}`;
    n += 1;
  }
  const sku = String(formData.get("sku") ?? "").trim().toUpperCase() || `ST-D${String(Date.now()).slice(-5)}`;
  await prisma.studioProduct.create({
    data: {
      slug,
      sku,
      name,
      category,
      audience,
      price,
      compareAt: compareAt && compareAt > price ? compareAt : null,
      colors: JSON.stringify(colors),
      sizes: JSON.stringify(sizes),
      image: photo,
      description: String(formData.get("description") ?? "").trim().slice(0, 800),
      fabric: String(formData.get("fabric") ?? "").trim().slice(0, 160),
      includes: JSON.stringify(includes),
      highlights: JSON.stringify(highlights),
      inStock: formData.get("inStock") === "on",
      hidden: String(formData.get("status") ?? "") === "draft",
    },
  });
  refreshShop(slug);
  redirect("/admin/products?notice=added");
}

export async function deleteStudioProduct(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  await prisma.studioProduct.deleteMany({ where: { slug } });
  refreshShop(slug);
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const price = Math.max(0, Math.round(Number(formData.get("price")) || 0));
  const compareRaw = String(formData.get("compareAt") ?? "").trim();
  const compareAt = compareRaw === "" ? null : Math.max(0, Math.round(Number(compareRaw)));
  const inStock = formData.get("inStock") === "on";
  const hidden = formData.get("hidden") === "on";
  const uploaded = await saveUpload(formData.get("photo"));
  const studio = await prisma.studioProduct.findUnique({ where: { slug } });
  if (studio) {
    await prisma.studioProduct.update({
      where: { slug },
      data: {
        price,
        compareAt: compareAt && compareAt > price ? compareAt : null,
        inStock,
        hidden,
        image: uploaded || studio.image,
      },
    });
    refreshShop(slug);
    return;
  }
  const base = getProduct(slug);
  if (!base) return;
  const current = await prisma.productEdit.findUnique({ where: { slug } });
  const image = uploaded || current?.image || null;
  await prisma.productEdit.upsert({
    where: { slug },
    update: {
      price,
      compareAt: compareAt && compareAt > price ? compareAt : null,
      inStock: formData.get("inStock") === "on",
      hidden: formData.get("hidden") === "on",
      image,
    },
    create: {
      slug,
      price,
      compareAt: compareAt && compareAt > price ? compareAt : null,
      inStock: formData.get("inStock") === "on",
      hidden: formData.get("hidden") === "on",
      image,
    },
  });
  refreshShop(slug);
}

export async function resetProduct(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  await prisma.productEdit.deleteMany({ where: { slug } });
  refreshShop(slug);
}

export async function saveOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const current = await prisma.order.findUnique({ where: { id } });
  if (!current) return;

  if (intent === "status") {
    const status = String(formData.get("status") ?? "");
    if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) return;
    await prisma.order.update({ where: { id }, data: { status } });
  }
  if (intent === "payment") {
    const paymentStatus = String(formData.get("paymentStatus") ?? "");
    if (!PAYMENT_STATUSES.includes(paymentStatus as (typeof PAYMENT_STATUSES)[number])) return;
    await prisma.order.update({ where: { id }, data: { paymentStatus } });
  }
  if (intent === "note") {
    await prisma.order.update({ where: { id }, data: { note: String(formData.get("note") ?? "").slice(0, 800) } });
  }
  if (intent === "exchange") {
    const reason = String(formData.get("reason") ?? "").trim();
    if (!reason) return;
    await prisma.exchange.create({ data: { orderId: id, reason: reason.slice(0, 400) } });
  }
  refreshShop();
  revalidatePath(`/admin/orders/${id}`);
}

export async function saveExchange(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!EXCHANGE_STATUSES.includes(status as (typeof EXCHANGE_STATUSES)[number])) return;
  const row = await prisma.exchange.update({ where: { id }, data: { status } });
  refreshShop();
  revalidatePath(`/admin/orders/${row.orderId}`);
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const current = parseOffer((await prisma.setting.findUnique({ where: { key: "shop" } }))?.value);
  const next = parseOffer(JSON.stringify({
    promoOn: formData.get("promoOn") === "on",
    promoCode: String(formData.get("promoCode") ?? current.promoCode),
    freeShipping: Number(formData.get("freeShipping") ?? defaultOffer.freeShipping),
    shippingFee: Number(formData.get("shippingFee") ?? defaultOffer.shippingFee),
  }));
  await prisma.setting.upsert({
    where: { key: "shop" },
    update: { value: JSON.stringify(next) },
    create: { key: "shop", value: JSON.stringify(next) },
  });
  refreshShop();
  redirect("/admin/settings?notice=saved");
}

export async function saveHomeMedia(formData: FormData) {
  await requireAdmin();
  const current = parseHomeMedia((await prisma.setting.findUnique({ where: { key: "homeMedia" } }))?.value);
  const heroes = await Promise.all(current.heroes.map(async (src, index) => {
    const uploaded = await saveUpload(formData.get(`heroFile-${index}`));
    const url = String(formData.get(`hero-${index}`) ?? "").trim();
    return uploaded || url || src;
  }));
  const dasaraUpload = await saveUpload(formData.get("dasaraFile"));
  const footerUpload = await saveUpload(formData.get("footerFile"));
  const occasions = await Promise.all(current.occasions.map(async (occasion) => {
    const uploaded = await saveUpload(formData.get(`occasionFile-${occasion.name}`));
    const url = String(formData.get(`occasion-${occasion.name}`) ?? "").trim();
    return { ...occasion, image: uploaded || url || occasion.image };
  }));
  const next = {
    heroes,
    dasara: dasaraUpload || String(formData.get("dasara") ?? "").trim() || current.dasara,
    occasions,
    footer: footerUpload || String(formData.get("footer") ?? "").trim() || current.footer,
  };
  await prisma.setting.upsert({
    where: { key: "homeMedia" },
    update: { value: JSON.stringify(next) },
    create: { key: "homeMedia", value: JSON.stringify(next) },
  });
  refreshShop();
  redirect("/admin/media?notice=saved");
}

export async function addStaff(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || password.length < 6) redirect("/admin/staff?error=details");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/admin/staff?error=email");
  await prisma.user.create({
    data: { name, email, phone: "", passwordHash: hashPassword(password), role: "ADMIN" },
  });
  refreshShop();
  redirect("/admin/staff?notice=staff");
}

export async function changePassword(formData: FormData) {
  const session = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 6) redirect("/admin/staff?error=short");
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !verifyPassword(current, user.passwordHash)) redirect("/admin/staff?error=password");
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(next) } });
  redirect("/admin/staff?notice=password");
}
