"use server";

import { prisma } from "@/lib/prisma";

export async function createBrandAction(formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";

  if (!name.trim()) {
    return { success: false, message: "Brand name is required." };
  }

  const brand = await prisma.brand.create({
    data: {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
    },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products");

  return { success: true, message: "Brand created.", brand };
}
