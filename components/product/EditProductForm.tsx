"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateProductAction,
  type ProductActionState,
} from "@/lib/actions/product.actions";
import ImageUploader, {
  type ImageValue,
} from "@/components/admin/ImageUploader";
import GalleryUploader from "@/components/admin/GalleryUploader";

const QUICK_NOTES = [
  "Oud",
  "Musk",
  "Rose",
  "Amber",
  "Vanilla",
  "Saffron",
  "Sandalwood",
  "Jasmine",
  "Bergamot",
  "Cardamom",
];

export type EditableProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  volume: string;
  notes: string[];
  description: string | null;
  imageUrl: string;
  imagePublicId: string | null;
  gallery: string[];
  galleryPublicIds: string[];
  categoryId: string;
  brandId: string;
  occasionIds: string[];
};

interface EditProductFormProps {
  product: EditableProduct;
  categories: {
    id: string;
    name: string;
  }[];
  brands: {
    id: string;
    name: string;
  }[];
  occasions: {
    id: string;
    name: string;
  }[];
}

const initialState: ProductActionState = {
  success: false,
};

export default function EditProductForm({
  product,
  categories,
  brands,
  occasions,
}: EditProductFormProps) {
  const router = useRouter();
  const [state, setState] = useState<ProductActionState>(initialState);
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState(product.notes.join(", "));
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    product.occasionIds,
  );
  const [image, setImage] = useState<ImageValue>({
    url: product.imageUrl,
    publicId: product.imagePublicId,
  });
  const [gallery, setGallery] = useState<ImageValue[]>(
    product.gallery.map((url, i) => ({
      url,
      publicId: product.galleryPublicIds[i] ?? null,
    })),
  );

  const toggleOccasion = (id: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(id)
        ? prev.filter((occasionId) => occasionId !== id)
        : [...prev, id],
    );
  };

  const toggleNote = (note: string) => {
    setNotes((prev) => {
      const current = prev
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      const exists = current.some(
        (n) => n.toLowerCase() === note.toLowerCase(),
      );
      const next = exists
        ? current.filter((n) => n.toLowerCase() !== note.toLowerCase())
        : [...current, note];
      return next.join(", ");
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProductAction(
        product.id,
        initialState,
        formData,
      );
      setState(result);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          ← Back to products
        </button>
      </div>

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
        <div>
          <label className="mb-2 block font-medium">Product Name</label>
          <input
            name="name"
            defaultValue={product.name}
            className="w-full rounded-lg border p-3"
          />
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">SKU</label>
          <input
            type="text"
            defaultValue={product.sku ?? ""}
            readOnly
            className="w-full rounded-lg border border-dashed p-3 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Auto-generated from brand + product name
          </p>
          <input type="hidden" name="sku" defaultValue={product.sku ?? ""} />
        </div>

        <div>
          <label className="mb-2 block font-medium">Category</label>
          <select
            name="categoryId"
            defaultValue={product.categoryId}
            className="w-full rounded-lg border p-3"
          >
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

        <div>
          <label className="mb-2 block font-medium">Brand</label>
          <select
            name="brandId"
            defaultValue={product.brandId}
            className="w-full rounded-lg border p-3"
          >
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

        <div>
          <label className="mb-2 block font-medium">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            className="w-full rounded-lg border p-3"
          />
          {state.errors?.price && (
            <p className="mt-1 text-sm text-red-600">{state.errors.price[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Sale Price</label>
          <input
            name="salePrice"
            type="number"
            step="0.01"
            defaultValue={product.salePrice ?? ""}
            className="w-full rounded-lg border p-3"
          />
          {state.errors?.salePrice && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.salePrice[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            defaultValue={product.stock}
            className="w-full rounded-lg border p-3"
          />
          {state.errors?.stock && (
            <p className="mt-1 text-sm text-red-600">{state.errors.stock[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Volume</label>
          <select
            name="volume"
            defaultValue={product.volume}
            className="w-full rounded-lg border p-3"
          >
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

      {/* Notes */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">
          Fragrance Notes{" "}
          <span className="text-sm font-normal text-gray-500">
            (comma separated)
          </span>
        </label>

        <input
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Oud, Rose, Amber, Vanilla"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_NOTES.map((note) => {
            const active = notes
              .toLowerCase()
              .split(",")
              .map((n) => n.trim())
              .includes(note.toLowerCase());

            return (
              <button
                key={note}
                type="button"
                onClick={() => toggleNote(note)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-600 hover:border-black"
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasions */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">
          Occasions{" "}
          <span className="text-sm font-normal text-gray-500">
            (select all that apply)
          </span>
        </label>

        {occasions.length === 0 ? (
          <p className="text-sm text-gray-500">
            No occasions yet. Create them in the{" "}
            <a href="/admin/occasions" className="underline">
              Occasions
            </a>{" "}
            section first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {occasions.map((occasion) => {
              const active = selectedOccasions.includes(occasion.id);

              return (
                <button
                  key={occasion.id}
                  type="button"
                  onClick={() => toggleOccasion(occasion.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-600 hover:border-black"
                  }`}
                >
                  {occasion.name}
                </button>
              );
            })}
          </div>
        )}

        {selectedOccasions.map((id) => (
          <input key={id} type="hidden" name="occasionIds" value={id} />
        ))}
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">Description</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={product.description ?? ""}
          className="w-full rounded-lg border p-3"
        />
        {state.errors?.description && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Product Image */}
      <div className="mt-6">
        <ImageUploader
          value={image}
          onChange={setImage}
          label="Product Image (replace to upload a new one)"
        />
        <input type="hidden" name="imageUrl" value={image.url} />
        <input type="hidden" name="imagePublicId" value={image.publicId ?? ""} />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.imageUrl[0]}
          </p>
        )}
      </div>

      {/* Gallery Images */}
      <div className="mt-6">
        <GalleryUploader
          value={gallery}
          onChange={setGallery}
          label="Gallery Images"
        />
        <input
          type="hidden"
          name="galleryUrls"
          value={gallery.map((g) => g.url).join(",")}
        />
        <input
          type="hidden"
          name="galleryPublicIds"
          value={gallery.map((g) => g.publicId ?? "").join(",")}
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
