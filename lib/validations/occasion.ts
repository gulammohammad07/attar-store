import { z } from "zod";

export const occasionSchema = z.object({
  name: z
    .string()
    .min(2, "Occasion name must be at least 2 characters")
    .max(50, "Occasion name cannot exceed 50 characters"),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    ),
});

export type OccasionFormValues = z.infer<typeof occasionSchema>;
