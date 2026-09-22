import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/category/category-form";
import CategoryTable from "@/components/category/category-table";
import ResetCategoriesButton from "@/components/category/ResetCategoriesButton";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product categories.
          </p>
        </div>
        <ResetCategoriesButton />
      </div>

      <CategoryForm />

      <CategoryTable categories={categories} />
    </div>
  );
}
