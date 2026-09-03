import type { MetadataRoute } from "next";

import { getStorefrontProducts } from "@/lib/services/storefront-data";
import { siteUrl } from "@/lib/site";

// Regenerate at most once an hour. Matches the storefront's own revalidate
// window, so a newly published product shows up in the sitemap on the same
// cadence it shows up on the shop grid.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getStorefrontProducts();

  // Only the two static routes get a lastModified, because it's the only place
  // "now" is honest — the homepage and shop grid really do change whenever any
  // product does. Stamping every product URL with the current time tells
  // Google the whole catalogue changed every hour, which trains it to ignore
  // the field. Add real per-product dates here only once
  // lib/services/storefront-data.ts exposes Product.updatedAt.
  //
  // Category pages are deliberately absent: /shop?category=<slug> is a query
  // string on a force-dynamic route with no alternates.canonical, so listing
  // them invites duplicate-content grouping against /shop itself.
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteUrl}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
