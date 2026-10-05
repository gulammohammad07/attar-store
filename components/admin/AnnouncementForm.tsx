"use client";

import { useState, useTransition, useRef } from "react";
import ImageUploader, {
  type ImageValue,
} from "@/components/admin/ImageUploader";
import {
  upsertAnnouncementAction,
  type AnnouncementActionState,
} from "@/lib/actions/announcement.actions";

const initialState: AnnouncementActionState = { success: false };

export type AnnouncementFormInitial = {
  id: string;
  badge: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

export default function AnnouncementForm({
  initial = null,
  onSaved,
  submitLabel,
}: {
  initial?: AnnouncementFormInitial | null;
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const [state, setState] = useState<AnnouncementActionState>(initialState);
  const [pending, startTransition] = useTransition();
  const [image, setImage] = useState<ImageValue>({
    url: initial?.imageUrl ?? "",
    publicId: initial?.imagePublicId ?? null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertAnnouncementAction(
        initial?.id ?? null,
        initialState,
        formData,
      );
      setState(result);
      if (result.success) {
        if (!initial) {
          formRef.current?.reset();
          setImage({ url: "", publicId: null });
        }
        onSaved?.();
      }
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#e5e5e0] bg-white p-6 shadow-sm"
    >
      {state.message && (
        <p
          className={`mb-4 text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Badge <span className="text-sm text-gray-400">(optional)</span>
          </label>
          <input
            name="badge"
            defaultValue={initial?.badge ?? ""}
            maxLength={40}
            className="w-full rounded-lg border p-3"
            placeholder="NEW LAUNCH / FLAT 40% OFF"
          />
          {state.errors?.badge && (
            <p className="mt-1 text-sm text-red-600">{state.errors.badge[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Title *</label>
          <input
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            maxLength={120}
            className="w-full rounded-lg border p-3"
            placeholder="Daur e Khaas Collection is here!"
          />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Description <span className="text-sm text-gray-400">(optional)</span>
          </label>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            maxLength={500}
            rows={3}
            className="w-full rounded-lg border p-3"
            placeholder="4 luxury attars in one premium combo — launch offer live till Sunday."
          />
          {state.errors?.description && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.description[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Link URL <span className="text-sm text-gray-400">(optional)</span>
          </label>
          <input
            name="linkUrl"
            defaultValue={initial?.linkUrl ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="/product/daur-e-khaas-collection"
          />
          <p className="mt-1 text-xs text-gray-400">
            Where should this card take the customer? Defaults to /shop.
          </p>
          {state.errors?.linkUrl && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.linkUrl[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Display order</label>
          <input
            name="sortOrder"
            type="number"
            min={0}
            max={999}
            defaultValue={initial?.sortOrder ?? 0}
            className="w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-gray-400">
            Lower numbers show first.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Image <span className="text-sm text-gray-400">(optional)</span>
          </label>
          <ImageUploader
            value={image}
            onChange={setImage}
            label="Announcement image"
          />
          <input type="hidden" name="imageUrl" value={image.url} />
          <input
            type="hidden"
            name="imagePublicId"
            value={image.publicId ?? ""}
          />
          {state.errors?.imageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.imageUrl[0]}
            </p>
          )}
        </div>
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm font-medium">
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
        className="mt-6 w-full rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800 disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Saving..." : (submitLabel ?? (initial ? "Save Changes" : "Add Announcement"))}
      </button>
    </form>
  );
}
