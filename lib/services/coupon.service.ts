import "server-only";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export type CouponQuote =
  | { valid: true; code: string; discount: number }
  | { valid: false; error: string; discount: 0 };

export async function quoteCoupon(code: string | undefined, subtotal: number): Promise<CouponQuote> {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) return { valid: true, code: "", discount: 0 };
  const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
  if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt <= new Date())) {
    return { valid: false, error: "This coupon is invalid or has expired.", discount: 0 };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { valid: false, error: `This coupon requires an order of ${formatPrice(coupon.minOrderValue)} or more.`, discount: 0 };
  }
  let discount = coupon.discountType === "PERCENTAGE"
    ? subtotal * (coupon.discountValue / 100)
    : coupon.discountValue;
  if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  return { valid: true, code: coupon.code, discount: Math.min(Math.round(discount * 100) / 100, subtotal) };
}
