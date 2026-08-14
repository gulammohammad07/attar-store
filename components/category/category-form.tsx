"use client";

import { useState, useTransition } from "react";
import {
  createCategory,
  type CreateCategoryState,
} from "@/app/admin/categories/actions";

const initialState: CreateCategoryState = {
  success: false,
};

export default function CategoryForm() {
  const [state, setState] = useState<CreateCategoryState>(initialState);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCategory(initialState, formData);
      setState(result);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
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

        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">Slug</label>

        <input
          name="slug"
          className="w-full rounded-lg border px-3 py-2"
          placeholder="attar"
          required
        />

        {state.errors?.slug && (
          <p className="mt-1 text-sm text-red-600">{state.errors.slug[0]}</p>
        )}
      </div>

      {state.message && (
        <p
          className={`text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-6 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}
