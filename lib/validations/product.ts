import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string(),
  brandId: z.string(),
  price: z.coerce.number(),
  salePrice: z.coerce.number().optional(),
  stock: z.coerce.number(),
  volume: z.string(),
  description: z.string().optional(),
  notes: z.array(z.string()).optional(),
  occasionIds: z.array(z.string()).optional(),
  imageUrl: z
    .string()
    .url("Please upload a valid product image.")
    .optional()
    .or(z.literal("")),
  imagePublicId: z.string().optional(),
  galleryUrls: z.string().optional(),
  galleryPublicIds: z.string().optional(),
});
