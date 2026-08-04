import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name is required").max(50),

  slug: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    ),

  description: z.string().optional(),

  logoUrl: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
