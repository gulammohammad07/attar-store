import { prisma } from "@/lib/prisma";
import OccasionForm from "@/components/occasion/OccasionForm";
import OccasionTable from "@/components/occasion/OccasionTable";

export default async function OccasionsPage() {
  const occasions = await prisma.occasion.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Occasions</h1>
        <p className="text-gray-500">
          Manage the occasions products can be linked to.
        </p>
      </div>

      <OccasionForm />

      <OccasionTable occasions={occasions} />
    </div>
  );
}
