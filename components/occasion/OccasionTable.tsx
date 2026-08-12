"use client";

import { deleteOccasionAction } from "@/app/admin/occasions/actions";

interface Occasion {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function OccasionTable({ occasions }: { occasions: Occasion[] }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Slug</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {occasions.map((occasion) => (
            <tr key={occasion.id} className="border-b">
              <td className="p-4">{occasion.name}</td>
              <td className="p-4">{occasion.slug}</td>
              <td className="p-4">
                {occasion.isActive ? (
                  <span className="font-medium text-green-600">Active</span>
                ) : (
                  <span className="font-medium text-red-600">Inactive</span>
                )}
              </td>

              <td className="p-4 text-right">
                <form action={deleteOccasionAction.bind(null, occasion.id)}>
                  <button
                    type="submit"
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}

          {occasions.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center">
                No occasions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
