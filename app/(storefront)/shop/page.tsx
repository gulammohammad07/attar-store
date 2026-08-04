import { Suspense } from "react";
import { getStorefrontProducts } from "@/lib/services/storefront-data";
import ShopContent from "@/components/shop/ShopContent";
import ProductSkeleton from "@/components/shop/ProductSkeleton";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getStorefrontProducts();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F3EC] p-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent products={products} />
    </Suspense>
  );
}
