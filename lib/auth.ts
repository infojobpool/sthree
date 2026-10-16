import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "sthree_session";

export type Session = {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  exp: number;
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

export function signSession(input: Omit<Session, "exp">) {
  const body = Buffer.from(JSON.stringify({ ...input, exp: Date.now() + 14 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSession(token: string | undefined | null): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    if (!data.exp || data.exp < Date.now()) return null;
    if (data.role !== "ADMIN" && data.role !== "CUSTOMER") return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return readSession(jar.get(COOKIE)?.value);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
