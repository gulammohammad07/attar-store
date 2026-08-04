"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBrandAction(formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";

  await prisma.brand.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/admin/brands");
}
