import { prisma } from "@/lib/prisma";
import {
  products as mockProducts,
  type FragranceNote,
  type Product,
} from "@/lib/data/products";

function toNote(name: string): FragranceNote {
  return { name, intensity: 70 };
}

function mapDbProduct(db: {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  description: string | null;
  imageUrl: string;
  gallery: string[];
  stock: number;
  volume: string;
  notes: string[];
  bestSeller: boolean;
  newArrival: boolean;
  featured: boolean;
  category: { name: string };
  brand: { name: string };
}): Product {
  const noteNames =
    (db.notes ?? []).length > 0 ? db.notes : [db.category.name];

  let badge: Product["badge"];
  if (db.bestSeller) badge = "Bestseller";
  else if (db.newArrival) badge = "New Arrival";
  else if (db.salePrice != null) badge = "Sale";
  else badge = undefined;

  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    brand: db.brand.name,
    category: db.category.name as Product["category"],
    notes: {
      top: noteNames.slice(0, 1).map(toNote),
      heart: noteNames.slice(1, 3).map(toNote),
      base: noteNames.slice(3, 5).map(toNote),
    },
    occasions: ["Everyday"],
    gender: "Unisex",
    volume: db.volume,
    price: db.price,
    salePrice: db.salePrice ?? undefined,
    image: db.imageUrl,
    gallery: db.gallery.length > 0 ? db.gallery : [db.imageUrl],
    description: db.description ?? "",
    stock: db.stock,
    rating: 4.5,
    reviewCount: 0,
    badge,
    featured: db.featured,
  };
}

export async function getStorefrontProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      brand: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const dbSlugs = new Set(dbProducts.map((p) => p.slug));
  const mocks = mockProducts.filter((p) => !dbSlugs.has(p.slug));

  return [...dbProducts.map(mapDbProduct), ...mocks];
}

export async function getStorefrontProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const dbProduct = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      brand: true,
    },
  });

  if (dbProduct) return mapDbProduct(dbProduct);

  return mockProducts.find((p) => p.slug === slug);
}

export async function getStorefrontRelated(
  product: Product,
  count = 4,
): Promise<Product[]> {
  const all = await getStorefrontProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category.toLowerCase() === product.category.toLowerCase() ||
          p.occasions.some((o) => product.occasions.includes(o))),
    )
    .slice(0, count);
}
