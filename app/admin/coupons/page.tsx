import { prisma } from "@/lib/prisma";
import CouponsManager from "@/components/admin/CouponsManager";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return <CouponsManager coupons={coupons.map((coupon) => ({ ...coupon, expiresAt: coupon.expiresAt?.toISOString() ?? null }))} />;
}
