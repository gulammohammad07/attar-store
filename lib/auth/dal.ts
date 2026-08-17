import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "@/lib/auth/session";
import { ROLES, type Role } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export type AuthUserDTO = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  provider: string;
  createdAt: Date;
};

function toDTO(user: {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  provider: string;
  createdAt: Date;
}): AuthUserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role as Role,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

export const verifySession = cache(async (): Promise<SessionUser> => {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return {
    id: session.id,
    name: session.name,
    email: session.email,
    image: session.image,
    role: session.role,
    provider: session.provider,
  };
});

export const getCurrentUser = cache(async (): Promise<AuthUserDTO | null> => {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      provider: true,
      createdAt: true,
    },
  });

  return user ? toDTO(user) : null;
});

export const requireUser = cache(async (): Promise<AuthUserDTO> => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
});

export const requireAdmin = cache(async (): Promise<AuthUserDTO> => {
  const user = await requireUser();
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUBADMIN) {
    redirect("/");
  }
  return user;
});

export async function canEditProduct(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user && (user.role === ROLES.ADMIN || user.role === ROLES.SUBADMIN));
}
