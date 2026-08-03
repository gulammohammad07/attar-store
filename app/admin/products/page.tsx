import Link from "next/link";

export default function ProductsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>

          <p className="text-gray-500 mt-1">Manage your attars and perfumes</p>
        </div>

        <Link
          href="/admin/products/add"
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-5">Image</th>
              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Price</th>
              <th className="text-left p-5">Category</th>
              <th className="text-left p-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-16 text-gray-400">
                No products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
