"use server";

import { prisma } from "@/lib/prisma";

export async function createBrandAction(formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";

  await prisma.brand.create({
    data: {
      name,
      slug,
    },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/brands");
}
