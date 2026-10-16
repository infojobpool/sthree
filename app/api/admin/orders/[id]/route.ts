import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ORDER_STATUSES, toOrder } from "@/lib/orders";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return Response.json({ error: "Studio desk only." }, { status: 403 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const status = String(body?.status ?? "");
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return Response.json({ error: "Unknown status." }, { status: 400 });
  }
  const row = await prisma.order.update({ where: { id }, data: { status } });
  return Response.json(toOrder(row));
}
