import { z } from "zod";

export const announcementSchema = z.object({
  badge: z.string().max(40, "Badge must be 40 characters or fewer.").optional(),
  title: z
    .string()
    .min(2, "Please enter a title (at least 2 characters).")
    .max(120, "Title must be 120 characters or fewer."),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer.")
    .optional(),
  imageUrl: z
    .string()
    .url("Please upload a valid image.")
    .optional()
    .or(z.literal("")),
  imagePublicId: z.string().optional(),
  linkUrl: z.string().max(300).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
