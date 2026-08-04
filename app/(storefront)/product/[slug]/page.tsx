import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getStorefrontProductBySlug,
  getStorefrontRelated,
} from "@/lib/services/storefront-data";
import ProductDetails from "@/components/product/ProductDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getStorefrontProductBySlug(params.slug);
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
  params: { slug: string };
}) {
  const product = await getStorefrontProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getStorefrontRelated(product);

  return <ProductDetails product={product} related={related} />;
}
