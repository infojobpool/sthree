import { prisma } from "@/lib/db";
import { toOrder } from "@/lib/orders";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const row = await prisma.order.findUnique({ where: { id } });
  if (!row) return Response.json({ error: "Order not found." }, { status: 404 });
  return Response.json(toOrder(row));
}
