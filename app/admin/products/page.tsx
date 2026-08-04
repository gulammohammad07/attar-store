import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/product/ProductForm";
import ProductTable from "@/components/product/ProductTable";

export default async function ProductsPage() {
  const [categories, brands, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <ProductForm categories={categories} brands={brands} />

      <ProductTable products={products} />
    </div>
  );
}
