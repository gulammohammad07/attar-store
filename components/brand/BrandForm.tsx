"use client";

import { createBrandAction } from "@/lib/actions/brand.actions";

export default function BrandForm() {
  return (
    <form
      action={createBrandAction}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-semibold">Add Brand</h2>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          name="name"
          placeholder="MD Perfumes"
          className="rounded-lg border p-3"
        />

        <input
          name="slug"
          placeholder="md-perfumes"
          className="rounded-lg border p-3"
        />
      </div>

      <textarea
        name="description"
        placeholder="Brand Description"
        className="mt-5 w-full rounded-lg border p-3"
      />

      <button className="mt-5 rounded-xl bg-black px-6 py-3 text-white">
        Save Brand
      </button>
    </form>
  );
}
