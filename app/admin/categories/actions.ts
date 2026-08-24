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

export type ResetCategoriesState = {
  success: boolean;
  message?: string;
};

export async function resetCategories(): Promise<ResetCategoriesState> {
  const defaultCategories = [
    { name: "Men", slug: "men", description: "Masculine fragrances" },
    { name: "Women", slug: "women", description: "Feminine fragrances" },
    { name: "Unisex", slug: "unisex", description: "For everyone" },
  ];

  const created = await Promise.all(
    defaultCategories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description, isActive: true },
        create: cat,
      }),
    ),
  );

  const defaultIds = created.map((c) => c.id);
  const menCategory = created.find((c) => c.slug === "men")!;

  await prisma.product.updateMany({
    where: { categoryId: { notIn: defaultIds } },
    data: { categoryId: menCategory.id },
  });

  await prisma.category.deleteMany({
    where: { id: { notIn: defaultIds } },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return {
    success: true,
    message: "Categories reset to Men, Women, Unisex.",
  };
}
