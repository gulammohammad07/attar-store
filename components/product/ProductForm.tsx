"use client";

import { useActionState } from "react";
import {
  createProductAction,
  type CreateProductState,
} from "@/lib/actions/product.actions";

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

const initialState: CreateProductState = {
  success: false,
};

export default function ProductForm({ categories, brands }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(
    createProductAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-semibold">Add Product</h2>

      {state.message && (
        <p
          className={`mb-4 text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Name */}
        <div>
          <label className="mb-2 block font-medium">Product Name</label>

          <input
            name="name"
            className="w-full rounded-lg border p-3"
            placeholder="Oud Royal"
          />

          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block font-medium">Slug</label>

          <input
            name="slug"
            className="w-full rounded-lg border p-3"
            placeholder="oud-royal"
          />

          {state.errors?.slug && (
            <p className="mt-1 text-sm text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="mb-2 block font-medium">SKU</label>

          <input
            name="sku"
            className="w-full rounded-lg border p-3"
            placeholder="SKU001"
          />

          {state.errors?.sku && (
            <p className="mt-1 text-sm text-red-600">{state.errors.sku[0]}</p>
          )}
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

          {state.errors?.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.categoryId[0]}
            </p>
          )}
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

          {state.errors?.brandId && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.brandId[0]}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block font-medium">Price</label>

          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full rounded-lg border p-3"
          />

          {state.errors?.price && (
            <p className="mt-1 text-sm text-red-600">{state.errors.price[0]}</p>
          )}
        </div>

        {/* Sale Price */}
        <div>
          <label className="mb-2 block font-medium">Sale Price</label>

          <input
            name="salePrice"
            type="number"
            step="0.01"
            className="w-full rounded-lg border p-3"
          />

          {state.errors?.salePrice && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.salePrice[0]}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block font-medium">Stock</label>

          <input
            name="stock"
            type="number"
            className="w-full rounded-lg border p-3"
          />

          {state.errors?.stock && (
            <p className="mt-1 text-sm text-red-600">{state.errors.stock[0]}</p>
          )}
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

          {state.errors?.volume && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.volume[0]}
            </p>
          )}
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

        {state.errors?.description && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
