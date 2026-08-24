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
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "Danish Perfumes — Luxury Attars & Fragrances",
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
      <body className="min-h-full flex flex-col bg-[#F8FCFE] text-[#174A63]">
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
