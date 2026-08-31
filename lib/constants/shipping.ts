/**
 * Shipping fallbacks.
 *
 * These are the values used when the admin-configured store settings are not
 * available yet: as the seed defaults in `lib/services/settings.service.ts`,
 * and as initial client state before `getPublicStoreSettings()` resolves.
 *
 * Intentionally NOT `server-only` — client components import these too.
 * The admin panel value (StoreSettings.freeShippingThreshold) always wins.
 */
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500;
export const DEFAULT_SHIPPING_FEE = 99;
