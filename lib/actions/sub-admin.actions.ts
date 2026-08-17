"use server";

import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "@/lib/auth/config";
import { hashPassword } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";

export type SubAdminActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string | undefined>;
};

export async function createSubAdminAction(
  prevState: SubAdminActionState,
  formData: FormData,
): Promise<SubAdminActionState> {
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please provide a valid email address.";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    errors.email = "A user with this email already exists.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: ROLES.SUBADMIN,
      provider: "credentials",
    },
  });

  return { success: true, message: "Sub-admin created successfully." };
}

export async function updateUserRoleAction(
  userId: string,
  role: string,
): Promise<SubAdminActionState> {
  if (![ROLES.ADMIN, ROLES.SUBADMIN, ROLES.USER].includes(role as Role)) {
    return { success: false, message: "Invalid role." };
  }

  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return { success: false, message: "Only admins can change roles." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return { success: true, message: "Role updated successfully." };
}

export async function deleteUserAction(userId: string): Promise<SubAdminActionState> {
  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: true, message: "User deleted successfully." };
}

export async function getAdminUsers() {
  const session = await getSession();

  const where: Record<string, unknown> = {
    role: {
      in: [ROLES.ADMIN, ROLES.SUBADMIN],
    },
  };

  if (session?.role === ROLES.SUBADMIN) {
    where.id = session.id;
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
