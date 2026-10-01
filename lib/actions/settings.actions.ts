"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
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
  const storeName = (formData.get("storeName") ?? "").toString().trim();
  const supportEmail = (formData.get("supportEmail") ?? "").toString().trim();
  const supportPhone = (formData.get("supportPhone") ?? "").toString().trim();
  const address = (formData.get("address") ?? "").toString().trim();
  const currency = (formData.get("currency") ?? "INR").toString().trim();
  const navbarTitle = (formData.get("navbarTitle") ?? "").toString().trim();
  const navbarLogoUrl = (formData.get("navbarLogoUrl") ?? "").toString().trim() || null;
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
      navbarTitle,
      navbarLogoUrl,
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
      navbarTitle,
      navbarLogoUrl,
      freeShippingThreshold,
      shippingFee,
    },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");

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

export type SendTestEmailResult = { success: boolean; message: string };

/**
 * Sends a test email to the store's support email so the admin can verify the
 * SMTP credentials in .env actually work before a real order comes in.
 */
export async function sendTestEmailAction(): Promise<SendTestEmailResult> {
  await requireAdmin();

  try {
    const { sendTestEmail } = await import("@/lib/services/order-mail.service");
    const result = await sendTestEmail();
    if (result.ok) {
      return { success: true, message: `Test email sent to ${result.recipient}.` };
    }
    return { success: false, message: result.message ?? "Could not send the test email." };
  } catch (error) {
    console.error("[mail] Test email failed:", error);
    const detail = error instanceof Error ? error.message : "Unknown error.";
    return { success: false, message: `SMTP error: ${detail}` };
  }
}
export type SendTestWhatsappResult = { success: boolean; message: string };

/**
 * Sends a WhatsApp test message to the owner's number so the admin can verify
 * the CallMeBot setup works before a real order comes in.
 */
export async function sendTestWhatsappAction(): Promise<SendTestWhatsappResult> {
  await requireAdmin();

  try {
    const { sendTestWhatsapp } = await import("@/lib/services/whatsapp.service");
    const result = await sendTestWhatsapp();
    if (result.ok) {
      return {
        success: true,
        message: "Test WhatsApp message sent! Check your phone.",
      };
    }
    return { success: false, message: result.message };
  } catch (error) {
    console.error("[whatsapp] Test message failed:", error);
    const detail = error instanceof Error ? error.message : "Unknown error.";
    return { success: false, message: `WhatsApp error: ${detail}` };
  }
}

