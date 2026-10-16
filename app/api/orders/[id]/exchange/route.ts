import { prisma } from "@/lib/db";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const reason = String(body?.reason ?? "").trim();
  if (reason.length < 8) return Response.json({ error: "Tell the studio what you would like exchanged." }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
  if (order.status === "Cancelled") return Response.json({ error: "This order is cancelled." }, { status: 400 });
  const open = await prisma.exchange.findFirst({ where: { orderId: id, status: { in: ["Requested", "Accepted"] } } });
  if (open) return Response.json({ error: "An exchange is already open for this order." }, { status: 409 });
  const row = await prisma.exchange.create({ data: { orderId: id, reason: reason.slice(0, 400) } });
  return Response.json({ id: row.id, status: row.status });
}
