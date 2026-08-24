import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import ProductDetails from "@/components/product/ProductDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getStorefrontProducts();

  const related = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category.toLowerCase() === product.category.toLowerCase() ||
          p.occasions.some((o) => product.occasions.includes(o))),
    )
    .slice(0, 4);

  return (
    <ProductDetails
      product={product}
      related={related}
      allProducts={allProducts}
    />
  );
}
