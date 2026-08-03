import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/category/category-form";
import CategoryTable from "@/components/category/category-table";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>

        <p className="text-muted-foreground mt-2">
          Manage your product categories.
        </p>
      </div>

      {/* Category Form */}
      <CategoryForm />

      {/* Category Table */}
      <CategoryTable categories={categories} />
    </div>
  );
}
