import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/product/EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <EditProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stock,
          volume: product.volume,
          notes: product.notes,
          description: product.description,
          imageUrl: product.imageUrl,
          imagePublicId: product.imagePublicId,
          gallery: product.gallery,
          galleryPublicIds: product.galleryPublicIds,
          categoryId: product.categoryId,
          brandId: product.brandId,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
      />
    </div>
  );
}
