import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/store/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MD Perfumes — Luxury Attars & Fragrances",
    template: "%s | MD Perfumes",
  },
  description:
    "Hand-curated luxury attars, ouds and perfumes. Discover the art of oriental fragrance with MD Perfumes.",
  keywords: [
    "attar",
    "oud",
    "perfume",
    "luxury fragrance",
    "musk",
    "MD Perfumes",
  ],
  openGraph: {
    title: "MD Perfumes — Luxury Attars & Fragrances",
    description:
      "Hand-curated luxury attars, ouds and perfumes. Discover the art of oriental fragrance.",
    type: "website",
  },
};

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
      <body className="min-h-full flex flex-col bg-[#F7F3EC] text-[#1C1712]">
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
