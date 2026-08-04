interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  volume: string;
  isActive: boolean;

  category: {
    name: string;
  };

  brand: {
    name: string;
  };
}

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="border-b p-6">
        <h2 className="text-2xl font-semibold">Products</h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Brand</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Volume</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{product.name}</td>

                <td className="p-4">{product.category.name}</td>

                <td className="p-4">{product.brand.name}</td>

                <td className="p-4">₹{product.price}</td>

                <td className="p-4">{product.stock}</td>

                <td className="p-4">{product.volume}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="space-x-2 p-4 text-right">
                  <button className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                    Edit
                  </button>

                  <button className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
