import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { RESET_TOKEN_TTL_MS } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export function generateResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(userId: string) {
  const { token, tokenHash } = generateResetToken();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return token;
}

export async function findValidResetToken(token: string) {
  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt.getTime() < Date.now()) return null;

  return record;
}

export async function invalidatePasswordResetTokens(userId: string) {
  await prisma.passwordResetToken.updateMany({
    where: { userId },
    data: { usedAt: new Date() },
  });
}
