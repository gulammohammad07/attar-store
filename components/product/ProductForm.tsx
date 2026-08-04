"use client";

import { createProductAction } from "@/lib/actions/product.actions";

interface ProductFormProps {
  categories: {
    id: string;
    name: string;
  }[];

  brands: {
    id: string;
    name: string;
  }[];
}

export default function ProductForm({ categories, brands }: ProductFormProps) {
  return (
    <form
      action={createProductAction}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-semibold">Add Product</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Name */}
        <div>
          <label className="mb-2 block font-medium">Product Name</label>

          <input
            name="name"
            className="w-full rounded-lg border p-3"
            placeholder="Oud Royal"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block font-medium">Slug</label>

          <input
            name="slug"
            className="w-full rounded-lg border p-3"
            placeholder="oud-royal"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="mb-2 block font-medium">SKU</label>

          <input
            name="sku"
            className="w-full rounded-lg border p-3"
            placeholder="SKU001"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-medium">Category</label>

          <select name="categoryId" className="w-full rounded-lg border p-3">
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="mb-2 block font-medium">Brand</label>

          <select name="brandId" className="w-full rounded-lg border p-3">
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block font-medium">Price</label>

          <input
            name="price"
            type="number"
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Sale Price */}
        <div>
          <label className="mb-2 block font-medium">Sale Price</label>

          <input
            name="salePrice"
            type="number"
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block font-medium">Stock</label>

          <input
            name="stock"
            type="number"
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Volume */}
        <div>
          <label className="mb-2 block font-medium">Volume</label>

          <select name="volume" className="w-full rounded-lg border p-3">
            <option value="">Select Volume</option>
            <option value="3ml">3ml</option>
            <option value="6ml">6ml</option>
            <option value="12ml">12ml</option>
            <option value="30ml">30ml</option>
            <option value="50ml">50ml</option>
            <option value="100ml">100ml</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          name="description"
          rows={5}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800"
      >
        Save Product
      </button>
    </form>
  );
}
