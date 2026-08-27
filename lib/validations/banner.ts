import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  desktopImageUrl: z
    .string()
    .url("Please upload a valid desktop banner image.")
    .optional()
    .or(z.literal("")),
  desktopImagePublicId: z.string().optional(),
  tabletImageUrl: z
    .string()
    .url("Please upload a valid tablet banner image.")
    .optional()
    .or(z.literal("")),
  tabletImagePublicId: z.string().optional(),
  mobileImageUrl: z
    .string()
    .url("Please upload a valid mobile banner image.")
    .optional()
    .or(z.literal("")),
  mobileImagePublicId: z.string().optional(),
  linkUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});
