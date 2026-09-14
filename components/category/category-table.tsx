"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageOff } from "lucide-react";
import { deleteCategory } from "@/app/admin/categories/actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
}

interface Props {
  categories: Category[];
}

function CategoryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
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

export default function CategoryTable({ categories }: Props) {
  const router = useRouter();

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Delete "${category.name}"? Its image will also be removed from Cloudinary.`,
      )
    ) {
      return;
    }

    const result = await deleteCategory(category.id);
    if (result.success) {
      toast.success(result.message ?? "Category deleted successfully.");
      router.refresh();
    } else {
      toast.error(result.message ?? "Failed to delete category.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#111111]/10 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f0]">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Image</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Name</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Slug</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Status</th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-[#111111]/10 hover:bg-[#f5f5f0]">
                <td className="p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#111111]/10 bg-[#f5f5f0]">
                    <CategoryImage src={category.imageUrl ?? ""} alt={category.name} />
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-[#111111]">{category.name}</td>
                <td className="p-4 text-sm text-[#111111]/60">{category.slug}</td>
                <td className="p-4">
                  {category.isActive ? (
                    <span className="font-medium text-green-700">Active</span>
                  ) : (
                    <span className="font-medium text-red-600">Inactive</span>
                  )}
                </td>

                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-3 py-2 text-sm text-white transition-colors hover:bg-[#1f1f1f]"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(category)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#111111]/50">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#111111]/10">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-[#111111]/50">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="p-4 hover:bg-[#f5f5f0] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#111111]/10 bg-[#f5f5f0]">
                    <CategoryImage src={category.imageUrl ?? ""} alt={category.name} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#111111]">{category.name}</h3>
                    <p className="mt-1 text-xs text-[#111111]/50">{category.slug}</p>
                    <p className="mt-2">
                      {category.isActive ? (
                        <span className="font-medium text-green-700 text-xs">Active</span>
                      ) : (
                        <span className="font-medium text-red-600 text-xs">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] text-white transition-colors hover:bg-[#1f1f1f]"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
