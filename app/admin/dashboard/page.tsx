import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/dashboard/StatsCard";

import { Package, FolderTree, ShoppingBag, ShoppingCart } from "lucide-react";

export default async function DashboardPage() {
  const [totalProducts, totalCategories, totalBrands, totalOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      0,
    ]);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground mt-2">
          Welcome back 👋 Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Products"
          value={totalProducts}
          icon={<Package size={26} />}
        />

        <StatsCard
          title="Categories"
          value={totalCategories}
          icon={<FolderTree size={26} />}
        />

        <StatsCard
          title="Brands"
          value={totalBrands}
          icon={<ShoppingBag size={26} />}
        />

        <StatsCard
          title="Orders"
          value={totalOrders}
          icon={<ShoppingCart size={26} />}
        />
      </div>

      {/* Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />

        <LowStockProducts />
      </div>
    </div>
  );
}
