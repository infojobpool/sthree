import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@sthreedesignerstudios.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Studio@Nagole26";
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash: hashPassword(password), name: "Studio desk" },
    create: {
      name: "Studio desk",
      email,
      phone: "7995255536",
      passwordHash: hashPassword(password),
      role: "ADMIN",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
