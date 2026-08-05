import { NextRequest } from "next/server";
import { getStorefrontProducts } from "@/lib/services/storefront-data";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "")
    .trim()
    .toLowerCase();

  if (!q) return Response.json({ results: [] });

  const all = await getStorefrontProducts();

  const results = all
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        [
          ...p.notes.top,
          ...p.notes.heart,
          ...p.notes.base,
        ].some((n) => n.name.toLowerCase().includes(q)),
    )
    .slice(0, 20);

  return Response.json({ results });
}
