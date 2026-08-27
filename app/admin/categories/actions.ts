"use server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export type CategoryActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createCategory(
  prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
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

  try {
    await prisma.category.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description || null,
        imageUrl: result.data.imageUrl || null,
        imagePublicId: result.data.imagePublicId || null,
      },
    });
  } catch {
    if (result.data.imagePublicId) {
      await deleteImageFromCloudinary(result.data.imagePublicId);
    }
    return {
      success: false,
      message: "Failed to create category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return {
    success: true,
    message: "Category created successfully.",
  };
}

export async function updateCategory(
  categoryId: string,
  prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
  };

  const result = categorySchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existing) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  const slugChanged = result.data.slug !== existing.slug;
  if (slugChanged) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: result.data.slug },
    });
    if (slugExists) {
      return {
        success: false,
        message: "A category with this slug already exists.",
      };
    }
  }

  const imageChanged = result.data.imageUrl !== existing.imageUrl;
  const oldImagePublicId = existing.imagePublicId;

  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description || null,
        imageUrl: result.data.imageUrl || null,
        imagePublicId: result.data.imagePublicId || null,
      },
    });

    if (imageChanged && oldImagePublicId && result.data.imagePublicId) {
      await deleteImageFromCloudinary(oldImagePublicId);
    }
  } catch {
    if (imageChanged && result.data.imagePublicId) {
      await deleteImageFromCloudinary(result.data.imagePublicId);
    }
    return {
      success: false,
      message: "Failed to update category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return {
    success: true,
    message: "Category updated successfully.",
  };
}

export async function deleteCategory(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { products: true },
  });

  if (!category) {
    return { success: false, message: "Category not found." };
  }

  if (category.products.length > 0) {
    return {
      success: false,
      message: "Cannot delete category with products. Reassign products first.",
    };
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    if (category.imagePublicId) {
      await deleteImageFromCloudinary(category.imagePublicId);
    }
  } catch {
    return {
      success: false,
      message: "Failed to delete category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true, message: "Category deleted successfully." };
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
