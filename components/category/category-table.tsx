type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

interface Props {
  categories: Category[];
}

export default function CategoryTable({ categories }: Props) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Slug</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t">
              <td className="p-4">{category.name}</td>
              <td className="p-4">{category.slug}</td>
              <td className="p-4">
                {category.isActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </td>

              <td className="p-4 text-right space-x-2">
                <button className="rounded bg-blue-600 px-3 py-1 text-white">
                  Edit
                </button>

                <button className="rounded bg-red-600 px-3 py-1 text-white">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
