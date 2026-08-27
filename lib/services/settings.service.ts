import "server-only";

import { prisma } from "@/lib/prisma";

export type StoreSettingsDTO = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  freeShippingThreshold: number;
  shippingFee: number;
  currency: string;
  navbarTitle: string;
  navbarTitleColor: string;
  navbarLogoUrl: string | null;
  navbarDisplayMode: "TEXT" | "IMAGE";
};

const DEFAULTS: StoreSettingsDTO = {
  storeName: "Danish Perfumes",
  supportEmail: "support@danishperfumes.com",
  supportPhone: "",
  address: "",
  freeShippingThreshold: 1500,
  shippingFee: 99,
  currency: "INR",
  navbarTitle: "Danish Perfumes",
  navbarTitleColor: "#0f2838",
  navbarLogoUrl: null,
  navbarDisplayMode: "TEXT",
};

export async function getStoreSettings(): Promise<StoreSettingsDTO> {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });

  if (!settings) {
    await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    return DEFAULTS;
  }

  return {
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    address: settings.address,
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    currency: settings.currency,
    navbarTitle: settings.navbarTitle,
    navbarTitleColor: settings.navbarTitleColor,
    navbarLogoUrl: settings.navbarLogoUrl,
    navbarDisplayMode: settings.navbarDisplayMode === "IMAGE" ? "IMAGE" : "TEXT",
  };
}
