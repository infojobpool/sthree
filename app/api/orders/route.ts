import { randomBytes } from "crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { discountFor, shippingFor } from "@/lib/format";
import { toOrder } from "@/lib/orders";
import { getStorefront } from "@/lib/storefront";
import type { Customer } from "@/lib/shop-types";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in to see your orders." }, { status: 401 });
  const rows = await prisma.order.findMany({
    where: { email: session.email },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(rows.map(toOrder));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const customer = body?.customer as Customer | undefined;
  const payment = String(body?.payment ?? "");
  const code = String(body?.code ?? "");
  const requested = Array.isArray(body?.lines) ? body.lines : [];
  if (!customer?.name || !customer.email || !customer.phone || !customer.address || !payment) {
    return Response.json({ error: "Delivery details are incomplete." }, { status: 400 });
  }

  const { products, settings } = await getStorefront();
  const lines = [];
  for (const raw of requested) {
    const slug = String(raw?.slug ?? "");
    const product = products.find((item) => item.slug === slug);
    const qty = Math.min(5, Math.max(1, Number(raw?.qty) || 1));
    if (!product || !product.inStock) {
      return Response.json({ error: "A piece in the bag is no longer available." }, { status: 400 });
    }
    lines.push({
      slug,
      size: String(raw?.size ?? ""),
      color: String(raw?.color ?? ""),
      qty,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.image,
    });
  }
  if (lines.length === 0) return Response.json({ error: "Your bag is empty." }, { status: 400 });

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = discountFor(subtotal, code, settings);
  const shipping = shippingFor(subtotal, discount, settings);
  const session = await getSession();
  const email = customer.email.trim().toLowerCase();
  const id = `ST${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`;

  const row = await prisma.order.create({
    data: {
      id,
      userId: session?.id,
      email,
      customerJson: JSON.stringify({ ...customer, email }),
      linesJson: JSON.stringify(lines),
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      code: discount > 0 ? code.trim().toUpperCase() : "",
      payment,
      paymentStatus: "Unpaid",
      status: "Confirmed",
      note: "",
    },
  });

  return Response.json(toOrder(row));
}
