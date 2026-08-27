import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    ),

  description: z.string().optional(),

  imageUrl: z
    .string()
    .url("Please upload a valid category image.")
    .optional()
    .or(z.literal("")),

  imagePublicId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
