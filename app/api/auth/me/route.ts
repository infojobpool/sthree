import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return Response.json({ user: null }, { status: 401 });
  const role = user.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
  return Response.json({
    user: { name: user.name, email: user.email, phone: user.phone, role },
  });
}
