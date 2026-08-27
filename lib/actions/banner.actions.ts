"use server";

import { prisma } from "@/lib/prisma";
import { bannerSchema } from "@/lib/validations/banner";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export type BannerActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function upsertBannerAction(
  section: string,
  prevState: BannerActionState,
  formData: FormData,
): Promise<BannerActionState> {
  const values = {
    title: formData.get("title")?.toString() ?? "",
    subtitle: formData.get("subtitle")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    desktopImageUrl: (formData.get("desktopImageUrl")?.toString() ?? "").trim(),
    desktopImagePublicId: formData.get("desktopImagePublicId")?.toString() ?? "",
    tabletImageUrl: (formData.get("tabletImageUrl")?.toString() ?? "").trim(),
    tabletImagePublicId: formData.get("tabletImagePublicId")?.toString() ?? "",
    mobileImageUrl: (formData.get("mobileImageUrl")?.toString() ?? "").trim(),
    mobileImagePublicId: formData.get("mobileImagePublicId")?.toString() ?? "",
    linkUrl: formData.get("linkUrl")?.toString() ?? "",
    isActive: formData.get("isActive") === "on",
  };

  const result = bannerSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (!result.data.desktopImageUrl) {
    return {
      success: false,
      errors: { desktopImageUrl: ["Please upload a desktop banner image."] },
    };
  }

  const existing = await prisma.banner.findUnique({
    where: { section },
  });

  const newDesktopPublicId = result.data.desktopImagePublicId || null;
  const newTabletPublicId = result.data.tabletImagePublicId || null;
  const newMobilePublicId = result.data.mobileImagePublicId || null;

  const data = {
    title: result.data.title || null,
    subtitle: result.data.subtitle || null,
    description: result.data.description || null,
    desktopImageUrl: result.data.desktopImageUrl,
    desktopImagePublicId: newDesktopPublicId,
    tabletImageUrl: result.data.tabletImageUrl || null,
    tabletImagePublicId: newTabletPublicId,
    mobileImageUrl: result.data.mobileImageUrl || null,
    mobileImagePublicId: newMobilePublicId,
    linkUrl: result.data.linkUrl || null,
    isActive: result.data.isActive ?? true,
  };

  try {
    await prisma.banner.upsert({
      where: { section },
      update: data,
      create: {
        ...data,
        section,
      },
    });

    if (existing?.desktopImagePublicId && existing.desktopImagePublicId !== newDesktopPublicId) {
      await deleteImageFromCloudinary(existing.desktopImagePublicId);
    }
    if (existing?.tabletImagePublicId && existing.tabletImagePublicId !== newTabletPublicId) {
      await deleteImageFromCloudinary(existing.tabletImagePublicId);
    }
    if (existing?.mobileImagePublicId && existing.mobileImagePublicId !== newMobilePublicId) {
      await deleteImageFromCloudinary(existing.mobileImagePublicId);
    }
  } catch {
    if (newDesktopPublicId && existing?.desktopImagePublicId !== newDesktopPublicId) {
      await deleteImageFromCloudinary(newDesktopPublicId);
    }
    if (newTabletPublicId && existing?.tabletImagePublicId !== newTabletPublicId) {
      await deleteImageFromCloudinary(newTabletPublicId);
    }
    if (newMobilePublicId && existing?.mobileImagePublicId !== newMobilePublicId) {
      await deleteImageFromCloudinary(newMobilePublicId);
    }
    return {
      success: false,
      message: "Failed to save banner. Please try again.",
    };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/banners");
  revalidatePath("/");

  return {
    success: true,
    message: "Banner saved successfully.",
  };
}
