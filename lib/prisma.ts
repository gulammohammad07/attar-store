import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = new URL(process.env.DATABASE_URL!);
const sslMode = databaseUrl.searchParams.get("sslmode");

// pg will soon change the meaning of these aliases. Keep the current,
// certificate-verifying behavior explicitly and avoid the deprecation warning.
if (["prefer", "require", "verify-ca"].includes(sslMode ?? "")) {
  databaseUrl.searchParams.set("sslmode", "verify-full");
}

const connectionString = databaseUrl.toString();

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
