"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { announcementSchema } from "@/lib/validations/announcement";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export type AnnouncementActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function upsertAnnouncementAction(
  id: string | null,
  prevState: AnnouncementActionState,
  formData: FormData,
): Promise<AnnouncementActionState> {
  await requireAdmin();

  const values = {
    badge: formData.get("badge")?.toString() ?? "",
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
    linkUrl: formData.get("linkUrl")?.toString() ?? "",
    sortOrder: formData.get("sortOrder")?.toString() ?? "0",
    isActive: formData.get("isActive") === "on",
  };

  const result = announcementSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const newImagePublicId = result.data.imagePublicId || null;
  const existing = id
    ? await prisma.announcement.findUnique({ where: { id } })
    : null;

  if (id && !existing) {
    return {
      success: false,
      message: "This announcement no longer exists.",
    };
  }

  const data = {
    badge: result.data.badge?.trim() || null,
    title: result.data.title.trim(),
    description: result.data.description?.trim() || null,
    imageUrl: result.data.imageUrl || null,
    imagePublicId: newImagePublicId,
    linkUrl: result.data.linkUrl?.trim() || null,
    isActive: result.data.isActive ?? true,
    sortOrder: result.data.sortOrder ?? 0,
  };

  try {
    if (existing) {
      await prisma.announcement.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.announcement.create({ data });
    }
  } catch {
    return {
      success: false,
      message: "Failed to save announcement. Please try again.",
    };
  }

  if (existing?.imagePublicId && existing.imagePublicId !== newImagePublicId) {
    await deleteImageFromCloudinary(existing.imagePublicId);
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");

  return {
    success: true,
    message: existing
      ? "Announcement updated successfully."
      : "Announcement added successfully.",
  };
}

export async function deleteAnnouncementAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  try {
    const existing = await prisma.announcement.delete({ where: { id } });
    if (existing.imagePublicId) {
      await deleteImageFromCloudinary(existing.imagePublicId);
    }
  } catch {
    return { success: false, message: "Failed to delete announcement." };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");

  return { success: true, message: "Announcement deleted." };
}

export async function toggleAnnouncementAction(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  try {
    await prisma.announcement.update({
      where: { id },
      data: { isActive },
    });
  } catch {
    return { success: false, message: "Failed to update announcement." };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");

  return {
    success: true,
    message: isActive ? "Announcement is now live." : "Announcement hidden.",
  };
}
