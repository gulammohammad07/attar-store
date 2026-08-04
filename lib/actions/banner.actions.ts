"use server";

import { prisma } from "@/lib/prisma";
import { bannerSchema } from "@/lib/validations/banner";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
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

  if (!result.data.imageUrl) {
    return {
      success: false,
      errors: { imageUrl: ["Please upload a banner image."] },
    };
  }

  const existing = await prisma.banner.findUnique({
    where: { section },
  });

  const newImagePublicId = result.data.imagePublicId || null;

  const data = {
    title: result.data.title || null,
    subtitle: result.data.subtitle || null,
    imageUrl: result.data.imageUrl,
    imagePublicId: newImagePublicId,
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

    if (
      existing?.imagePublicId &&
      existing.imagePublicId !== newImagePublicId
    ) {
      await deleteImageFromCloudinary(existing.imagePublicId);
    }
  } catch {
    if (newImagePublicId && existing?.imagePublicId !== newImagePublicId) {
      await deleteImageFromCloudinary(newImagePublicId);
    }
    return {
      success: false,
      message: "Failed to save banner. Please try again.",
    };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return {
    success: true,
    message: "Banner saved successfully.",
  };
}
