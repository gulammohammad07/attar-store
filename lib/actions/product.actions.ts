"use server";

import { revalidatePath } from "next/cache";
import { createProduct } from "@/lib/services/product.service";
import { productSchema } from "@/lib/validations/product";

export type CreateProductState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createProductAction(
  prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    sku: formData.get("sku")?.toString() ?? "",
    categoryId: formData.get("categoryId")?.toString() ?? "",
    brandId: formData.get("brandId")?.toString() ?? "",
    price: formData.get("price"),
    salePrice: formData.get("salePrice"),
    stock: formData.get("stock"),
    volume: formData.get("volume")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
  };

  const result = productSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  await createProduct({
    name: result.data.name,
    slug: result.data.slug,
    sku: result.data.sku,

    description: result.data.description || null,

    price: result.data.price,
    salePrice: result.data.salePrice ?? null,

    stock: result.data.stock,
    volume: result.data.volume,

    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,

    category: {
      connect: {
        id: result.data.categoryId,
      },
    },

    brand: {
      connect: {
        id: result.data.brandId,
      },
    },

    gallery: ["/placeholder-product.png"],
    imageUrl: "/placeholder-product.png",
  });

  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Product created successfully.",
  };
}
