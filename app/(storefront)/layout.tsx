import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import { getStoreSettings } from "@/lib/services/settings.service";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, products, settings] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontProducts(),
    getStoreSettings(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 2);

  return (
    <>
      <SmoothScroll />
      <Navbar
        categories={categories}
        featured={featured}
        branding={{
          title: settings.navbarTitle,
          titleColor: settings.navbarTitleColor,
          logoUrl: settings.navbarLogoUrl,
          displayMode: settings.navbarDisplayMode,
        }}
      />
      <main className="flex-1">{children}</main>
      <Footer freeShippingThreshold={settings.freeShippingThreshold} />
    </>
  );
}
