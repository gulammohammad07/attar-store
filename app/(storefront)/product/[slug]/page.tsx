import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import { getStoreSettings } from "@/lib/services/settings.service";
import { getProductReviewAggregate } from "@/lib/services/review.service";
import ProductDetails from "@/components/product/ProductDetails";

export const dynamic = "force-dynamic";

/** +3-day delivery estimate in IST, formatted once per request. */
function computeDeliveryDate(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
}

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

  const [allProducts, settings, initialReviewAggregate] = await Promise.all([
    getStorefrontProducts(),
    getStoreSettings(),
    getProductReviewAggregate(product.id),
  ]);

  const related = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category.toLowerCase() === product.category.toLowerCase() ||
          p.occasions.some((o) => product.occasions.includes(o))),
    )
    .slice(0, 4);

  // Formatted on the server with a pinned timezone so the SSR HTML and the
  // client hydration always render the same delivery-estimate text.
  const deliveryDate = computeDeliveryDate();

  return (
    <ProductDetails
      key={product.id}
      product={product}
      related={related}
      allProducts={allProducts}
      freeShippingThreshold={settings.freeShippingThreshold}
      initialReviewAggregate={initialReviewAggregate}
      deliveryDate={deliveryDate}
    />
  );
}
