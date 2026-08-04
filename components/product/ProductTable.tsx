"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProductAction } from "@/lib/actions/product.actions";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
  volume: string;
  isActive: boolean;
  notes: string[];
  imageUrl: string;
  createdAt: Date;

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

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();

  const handleDelete = async (product: Product) => {
    if (
      !window.confirm(
        `Delete "${product.name}"? Its image will also be removed from Cloudinary.`,
      )
    ) {
      return;
    }

    const result = await deleteProductAction(product.id);
    if (result.success) {
      toast.success(result.message ?? "Product deleted successfully.");
      router.refresh();
    } else {
      toast.error(result.message ?? "Failed to delete product.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-2xl font-semibold">Products</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Brand</th>
              <th className="p-4 text-left">Notes</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No products found. Add your first product above.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="h-14 w-14 overflow-hidden rounded-lg border bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </td>

                  <td className="p-4 font-medium">
                    {product.name}
                    {!product.isActive && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4">{product.category.name}</td>

                  <td className="p-4">{product.brand.name}</td>

                  <td className="p-4 text-xs">
                    {(product.notes ?? []).length > 0
                      ? (product.notes ?? []).join(", ")
                      : "—"}
                  </td>

                  <td className="p-4">₹{product.price.toLocaleString("en-IN")}</td>

                  <td className="p-4">
                    <span
                      className={
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(product.createdAt)}
                  </td>

                  <td className="space-x-2 p-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
