"use client";

import { useState, useTransition } from "react";
import {
  upsertBannerAction,
  type BannerActionState,
} from "@/lib/actions/banner.actions";
import ImageUploader, {
  type ImageValue,
} from "@/components/admin/ImageUploader";

const initialState: BannerActionState = {
  success: false,
};

export type BannerFormInitial = {
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  imagePublicId: string | null;
  linkUrl: string | null;
  isActive: boolean;
};

type BannerFormProps = {
  section: string;
  title: string;
  description: string;
  initial?: BannerFormInitial | null;
};

export default function BannerForm({
  section,
  title,
  description,
  initial,
}: BannerFormProps) {
  const [state, setState] = useState<BannerActionState>(initialState);
  const [pending, startTransition] = useTransition();
  const [image, setImage] = useState<ImageValue>({
    url: initial?.imageUrl ?? "",
    publicId: initial?.imagePublicId ?? null,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertBannerAction(section, initialState, formData);
      setState(result);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
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
          <label className="mb-2 block font-medium">Title</label>
          <input
            name="title"
            defaultValue={initial?.title ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="Signature Attar"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Subtitle</label>
          <input
            name="subtitle"
            defaultValue={initial?.subtitle ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="The Art of Oriental Fragrance"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Link URL</label>
          <input
            name="linkUrl"
            type="url"
            defaultValue={initial?.linkUrl ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="/shop"
          />
        </div>
      </div>

      <div className="mt-6">
        <ImageUploader
          value={image}
          onChange={setImage}
          label="Banner Image (uploaded to Cloudinary)"
        />
        <input type="hidden" name="imageUrl" value={image.url} />
        <input type="hidden" name="imagePublicId" value={image.publicId ?? ""} />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.imageUrl[0]}
          </p>
        )}
      </div>

      <label className="mt-6 flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
          className="h-4 w-4"
        />
        Active (shown on the storefront)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Banner"}
      </button>
    </form>
  );
}
