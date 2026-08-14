+"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/dal";
import { ROLES } from "@/lib/auth/config";
import { getStoreSettings } from "@/lib/services/settings.service";

export type UpdateSettingsResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string | undefined>;
};

export async function updateStoreSettingsAction(
  prevState: UpdateSettingsResult,
  formData: FormData,
): Promise<UpdateSettingsResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== ROLES.ADMIN) {
    return { success: false, message: "Unauthorized." };
  }

  const storeName = (formData.get("storeName") ?? "").toString().trim();
  const supportEmail = (formData.get("supportEmail") ?? "").toString().trim();
  const supportPhone = (formData.get("supportPhone") ?? "").toString().trim();
  const address = (formData.get("address") ?? "").toString().trim();
  const currency = (formData.get("currency") ?? "INR").toString().trim();
  const freeShippingThreshold = Number(
    (formData.get("freeShippingThreshold") ?? "").toString(),
  );
  const shippingFee = Number((formData.get("shippingFee") ?? "").toString());

  const errors: Record<string, string> = {};

  if (!storeName) errors.storeName = "Store name is required.";
  if (!supportEmail) errors.supportEmail = "Support email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
    errors.supportEmail = "Please provide a valid email address.";
  }
  if (!supportPhone) errors.supportPhone = "Support phone is required.";
  if (!Number.isFinite(freeShippingThreshold) || freeShippingThreshold < 0) {
    errors.freeShippingThreshold = "Enter a valid non-negative number.";
  }
  if (!Number.isFinite(shippingFee) || shippingFee < 0) {
    errors.shippingFee = "Enter a valid non-negative number.";
  }
  if (!currency) errors.currency = "Currency is required.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      storeName,
      supportEmail,
      supportPhone,
      address,
      currency,
      freeShippingThreshold,
      shippingFee,
    },
    create: {
      id: 1,
      storeName,
      supportEmail,
      supportPhone,
      address,
      currency,
      freeShippingThreshold,
      shippingFee,
    },
  });

  revalidatePath("/admin/settings");

  return { success: true, message: "Settings saved successfully." };
}

export type PublicStoreSettings = {
  freeShippingThreshold: number;
  shippingFee: number;
  currency: string;
};

export async function getPublicStoreSettings(): Promise<PublicStoreSettings> {
  const settings = await getStoreSettings();
  return {
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    currency: settings.currency,
  };
}
