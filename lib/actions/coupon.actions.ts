"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { quoteCoupon, type CouponQuote } from "@/lib/services/coupon.service";

export async function validateCouponAction(code: string, subtotal: number): Promise<CouponQuote> {
  if (!Number.isFinite(subtotal) || subtotal < 0) return { valid: false, error: "Invalid order total.", discount: 0 as const };
  return quoteCoupon(code, subtotal);
}

export async function getCheckoutCouponsAction() {
  const now = new Date();
  return prisma.coupon.findMany({
    where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
    select: { id: true, code: true, discountType: true, discountValue: true, minOrderValue: true, maxDiscountAmount: true },
    orderBy: { createdAt: "desc" },
  });
}

type CouponInput = { code: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; minOrderValue?: number | null; maxDiscountAmount?: number | null; expiresAt?: string; isActive: boolean };
function clean(input: CouponInput) {
  const code = input.code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{3,40}$/.test(code)) throw new Error("Use 3–40 letters, numbers, or hyphens for the code.");
  if (!Number.isFinite(input.discountValue) || input.discountValue <= 0 || (input.discountType === "PERCENTAGE" && input.discountValue > 100)) throw new Error("Enter a valid discount value.");
  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) throw new Error("Enter a valid expiry date.");
  return { code, discountType: input.discountType, discountValue: input.discountValue, minOrderValue: input.minOrderValue && input.minOrderValue > 0 ? input.minOrderValue : null, maxDiscountAmount: input.discountType === "PERCENTAGE" && input.maxDiscountAmount && input.maxDiscountAmount > 0 ? input.maxDiscountAmount : null, expiresAt, isActive: input.isActive };
}
export async function saveCouponAction(id: string | null, input: CouponInput) {
  await requireAdmin();
  try { const data = clean(input); if (id) await prisma.coupon.update({ where: { id }, data }); else await prisma.coupon.create({ data }); revalidatePath("/admin/coupons"); return { success: true }; }
  catch (error) { return { success: false, error: error instanceof Error ? error.message : "Could not save coupon." }; }
}
export async function deleteCouponAction(id: string) { await requireAdmin(); try { await prisma.coupon.delete({ where: { id } }); revalidatePath("/admin/coupons"); return { success: true }; } catch { return { success: false, error: "Could not delete coupon." }; } }
