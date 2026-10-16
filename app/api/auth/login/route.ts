import { prisma } from "@/lib/db";
import { setSessionCookie, signSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  if (!email || !password) return Response.json({ error: "Email and password are required." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ error: "Email or password does not match." }, { status: 401 });
  }

  const role = user.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
  await setSessionCookie(signSession({ id: user.id, email: user.email, name: user.name, role }));
  return Response.json({
    user: { name: user.name, email: user.email, phone: user.phone, role },
  });
}
