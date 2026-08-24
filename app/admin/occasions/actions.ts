"use server";

import { prisma } from "@/lib/prisma";
import { occasionSchema } from "@/lib/validations/occasion";
import { revalidatePath } from "next/cache";

export type CreateOccasionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createOccasionAction(
  prevState: CreateOccasionState,
  formData: FormData,
): Promise<CreateOccasionState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
  };

  const result = occasionSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.occasion.findUnique({
    where: {
      slug: result.data.slug,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "Occasion already exists.",
    };
  }

  await prisma.occasion.create({
    data: result.data,
  });

  revalidatePath("/admin/occasions");

  return {
    success: true,
    message: "Occasion created successfully.",
  };
}

export async function deleteOccasionAction(occasionId: string) {
  await prisma.occasion.delete({
    where: { id: occasionId },
  });

  revalidatePath("/admin/occasions");
}
