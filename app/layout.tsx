import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/store/providers";
import { Toaster } from "@/components/ui/sonner";
import { getStoreSettings } from "@/lib/services/settings.service";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const metadataDefaults: Metadata = {
  // Needed so relative OG/twitter image paths resolve to absolute URLs, and so
  // the canonical origin matches what robots.ts and sitemap.ts advertise.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Danish Perfumes — Luxury Attars & Fragrances",
    template: "%s | Danish Perfumes",
  },
  description:
    "Hand-curated luxury attars, ouds and perfumes. Discover the art of oriental fragrance with Danish Perfumes.",
  keywords: [
    "attar",
    "oud",
    "perfume",
    "luxury fragrance",
    "musk",
    "Danish Perfumes",
  ],
  // Google Search Console ownership verification (HTML tag method).
  // Code matches the public/googlee2d45e51890ac94d.html file method —
  // either one is enough to verify in GSC.
  verification: {
    google: "e2d45e51890ac94d",
  },
  openGraph: {
    title: "Danish Perfumes — Luxury Attars & Fragrances",
    description:
      "Hand-curated luxury attars, ouds and perfumes. Discover the art of oriental fragrance.",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const title = settings.navbarTitle || settings.storeName;

  return {
    ...metadataDefaults,
    title: { default: title, template: `%s | ${title}` },
    openGraph: { ...metadataDefaults.openGraph, title },
    icons: settings.navbarLogoUrl
      ? { icon: [{ url: settings.navbarLogoUrl }], apple: [{ url: settings.navbarLogoUrl }] }
      : { icon: [] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FCFE] text-[#174A63]">
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
