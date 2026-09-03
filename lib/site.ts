/**
 * Canonical public origin for the storefront.
 *
 * Set NEXT_PUBLIC_APP_URL in the deploy environment. The localhost fallback is
 * only here so `next build` and local runs do not crash — if a deployed
 * robots.txt or sitemap.xml ever shows localhost URLs, that env var is missing.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
