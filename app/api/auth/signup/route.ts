import { prisma } from "@/lib/db";
import { setSessionCookie, signSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const phone = String(body?.phone ?? "").replace(/\s/g, "");
  const password = String(body?.password ?? "");

  if (!name || !email || !password) return Response.json({ error: "Name, email, and password are required." }, { status: 400 });
  if (password.length < 6) return Response.json({ error: "Use at least 6 characters for the password." }, { status: 400 });
  if (!/^\d{10}$/.test(phone)) return Response.json({ error: "Enter a 10-digit mobile number." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return Response.json({ error: "An account with this email already exists." }, { status: 409 });

  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash: hashPassword(password), role: "CUSTOMER" },
  });
  await setSessionCookie(signSession({ id: user.id, email: user.email, name: user.name, role: "CUSTOMER" }));
  return Response.json({
    user: { name: user.name, email: user.email, phone: user.phone, role: "CUSTOMER" as const },
  });
}
