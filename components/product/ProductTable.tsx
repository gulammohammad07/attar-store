"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageOff } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/product.actions";
import { cn } from "@/lib/utils";

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

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ImageOff size={16} className="text-gray-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
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
    <div className="overflow-hidden rounded-2xl border border-[#174a63]/10 bg-white shadow-sm">
      <div className="border-b border-[#174a63]/10 p-6">
        <h2 className="text-2xl font-semibold text-[#174a63]">Products</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#f8fcfe]">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Image</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Name</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Category</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Brand</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Notes</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Price</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Stock</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Created</th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-[#174a63]/50">
                  No products found. Add your first product above.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-[#174a63]/10 hover:bg-[#f8fcfe]">
                  <td className="p-4">
                    <div className="h-14 w-14 overflow-hidden rounded-lg border border-[#174a63]/10 bg-[#f8fcfe]">
                      <ProductImage src={product.imageUrl} alt={product.name} />
                    </div>
                  </td>

                  <td className="p-4 font-medium text-[#174a63]">
                    {product.name}
                    {!product.isActive && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-sm text-[#174a63]/70">{product.category.name}</td>

                  <td className="p-4 text-sm text-[#174a63]/70">{product.brand.name}</td>

                  <td className="p-4 text-xs text-[#174a63]/60">
                    {(product.notes ?? []).length > 0
                      ? (product.notes ?? []).join(", ")
                      : "—"}
                  </td>

                  <td className="p-4 text-sm font-medium text-[#174a63]">₹{product.price.toLocaleString("en-IN")}</td>

                  <td className="p-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        product.stock > 0 ? "text-green-700" : "text-red-600",
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-[#174a63]/50">{formatDate(product.createdAt)}</td>

                  <td className="space-x-2 p-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#174a63] px-3 py-2 text-sm text-white transition-colors hover:bg-gold"
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

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden divide-y divide-[#174a63]/10">
        {products.length === 0 ? (
          <div className="p-8 text-center text-[#174a63]/50">
            No products found. Add your first product above.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="p-4 sm:p-5 hover:bg-[#f8fcfe] transition-colors"
            >
              <div className="flex gap-4">
                <div className="hidden sm:flex h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[#174a63]/10 bg-[#f8fcfe]">
                  <ProductImage src={product.imageUrl} alt={product.name} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-[#174a63]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#174a63]/50">
                        {product.brand.name} · {product.category.name}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#174a63] text-white transition-colors hover:bg-gold"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <span className="font-medium text-[#174a63]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <span
                      className={cn(
                        "font-medium",
                        product.stock > 0 ? "text-green-700" : "text-red-600",
                      )}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>

                    <span className="text-[#174a63]/50">
                      {product.volume}
                    </span>

                    {product.sku && (
                      <span className="rounded-full border border-[#174a63]/10 bg-[#f8fcfe] px-2 py-0.5 text-[#174a63]/60">
                        {product.sku}
                      </span>
                    )}

                    {!product.isActive && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        Inactive
                      </span>
                    )}
                  </div>

                  {(product.notes ?? []).length > 0 && (
                    <p className="mt-2 text-xs text-[#174a63]/50">
                      {product.notes.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}