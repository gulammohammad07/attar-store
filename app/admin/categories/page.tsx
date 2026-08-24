import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/category/category-table";
import ResetCategoriesButton from "@/components/category/ResetCategoriesButton";

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
        <ResetCategoriesButton />
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
