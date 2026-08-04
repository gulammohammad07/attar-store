"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/services/product.service";
import { productSchema } from "@/lib/validations/product";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

const PLACEHOLDER_IMAGE = "/placeholder-product.png";

export type ProductActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

function parseValues(formData: FormData) {
  return {
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
    notes:
      formData
        .get("notes")
        ?.toString()
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean) ?? [],
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
  };
}

export async function createProductAction(
  prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const values = parseValues(formData);
  const result = productSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const imageUrl = result.data.imageUrl || PLACEHOLDER_IMAGE;
  const imagePublicId = result.data.imagePublicId || null;

  try {
    await createProduct({
      name: result.data.name,
      slug: result.data.slug,
      sku: result.data.sku,
      description: result.data.description || null,
      price: result.data.price,
      salePrice: result.data.salePrice ?? null,
      stock: result.data.stock,
      volume: result.data.volume,
      notes: result.data.notes ?? [],
      imageUrl,
      imagePublicId,
      gallery: [imageUrl],
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
    });
  } catch {
    if (imagePublicId) {
      await deleteImageFromCloudinary(imagePublicId);
    }
    return {
      success: false,
      message: "Failed to create product. Please try again.",
    };
  }

  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Product created successfully.",
  };
}

export async function updateProductAction(
  productId: string,
  prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const values = parseValues(formData);
  const result = productSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await getProductById(productId);
  if (!existing) {
    return { success: false, message: "Product not found." };
  }

  const newImageUrl = result.data.imageUrl || null;
  const newImagePublicId = result.data.imagePublicId || null;
  const imageChanged =
    newImageUrl !== null &&
    newImageUrl !== (existing.imageUrl ?? PLACEHOLDER_IMAGE);

  try {
    await updateProduct(productId, {
      name: result.data.name,
      slug: result.data.slug,
      sku: result.data.sku,
      description: result.data.description || null,
      price: result.data.price,
      salePrice: result.data.salePrice ?? null,
      stock: result.data.stock,
      volume: result.data.volume,
      notes: result.data.notes ?? [],
      imageUrl: newImageUrl ?? PLACEHOLDER_IMAGE,
      imagePublicId: imageChanged ? newImagePublicId : existing.imagePublicId,
      gallery: [newImageUrl ?? PLACEHOLDER_IMAGE],
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
    });

    if (
      imageChanged &&
      existing.imagePublicId &&
      existing.imagePublicId !== newImagePublicId
    ) {
      await deleteImageFromCloudinary(existing.imagePublicId);
    }
  } catch {
    if (imageChanged && newImagePublicId) {
      await deleteImageFromCloudinary(newImagePublicId);
    }
    return {
      success: false,
      message: "Failed to update product. Please try again.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);

  return {
    success: true,
    message: "Product updated successfully.",
  };
}

export async function deleteProductAction(productId: string) {
  const existing = await getProductById(productId);
  if (!existing) {
    return { success: false, message: "Product not found." };
  }

  try {
    await deleteProduct(productId);

    if (existing.imagePublicId) {
      await deleteImageFromCloudinary(existing.imagePublicId);
    }
  } catch {
    return {
      success: false,
      message: "Failed to delete product. Please try again.",
    };
  }

  revalidatePath("/admin/products");

  return { success: true, message: "Product deleted successfully." };
}
