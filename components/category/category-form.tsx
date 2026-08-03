"use client";

import { createCategory } from "@/app/admin/categories/actions";

export default function CategoryForm() {
  return (
    <form
      action={createCategory}
      className="space-y-5 rounded-xl border p-6 mt-6"
    >
      <div>
        <label className="block mb-2 font-medium">Category Name</label>

        <input
          name="name"
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Attar"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Slug</label>

        <input
          name="slug"
          className="w-full rounded-lg border px-3 py-2"
          placeholder="attar"
          required
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-2 text-white"
      >
        Create Category
      </button>
    </form>
  );
}
