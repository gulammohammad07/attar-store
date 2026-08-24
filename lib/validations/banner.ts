import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z
    .string()
    .url("Please upload a valid banner image.")
    .optional()
    .or(z.literal("")),
  imagePublicId: z.string().optional(),
  linkUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});
