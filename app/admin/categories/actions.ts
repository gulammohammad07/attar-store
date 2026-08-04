"use server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";

export type CreateCategoryState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createCategory(
  prevState: CreateCategoryState,
  formData: FormData,
): Promise<CreateCategoryState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
  };

  const result = categorySchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.category.findUnique({
    where: {
      slug: result.data.slug,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "Category already exists.",
    };
  }

  await prisma.category.create({
    data: result.data,
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
    message: "Category created successfully.",
  };
}
