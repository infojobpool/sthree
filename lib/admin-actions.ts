"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { defaultOffer } from "@/lib/format";
import { hashPassword, verifyPassword } from "@/lib/password";
import { EXCHANGE_STATUSES, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orders";
import { parseOffer } from "@/lib/storefront";

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
  revalidatePath("/admin/staff");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const base = getProduct(slug);
  if (!base) return;
  const price = Math.max(0, Math.round(Number(formData.get("price")) || 0));
  const compareRaw = String(formData.get("compareAt") ?? "").trim();
  const compareAt = compareRaw === "" ? null : Math.max(0, Math.round(Number(compareRaw)));
  await prisma.productEdit.upsert({
    where: { slug },
    update: {
      price,
      compareAt: compareAt && compareAt > price ? compareAt : null,
      inStock: formData.get("inStock") === "on",
      hidden: formData.get("hidden") === "on",
    },
    create: {
      slug,
      price,
      compareAt: compareAt && compareAt > price ? compareAt : null,
      inStock: formData.get("inStock") === "on",
      hidden: formData.get("hidden") === "on",
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
