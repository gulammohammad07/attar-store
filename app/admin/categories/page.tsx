import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/category/category-table";
import { resetCategories } from "./actions";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product categories.
          </p>
        </div>
        <form action={resetCategories}>
          <button
            type="submit"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(201,169,110,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(201,169,110,0.55)]"
          >
            Reset to Men, Women, Unisex
          </button>
        </form>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
