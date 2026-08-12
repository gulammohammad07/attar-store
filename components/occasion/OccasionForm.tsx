"use client";

import { useActionState } from "react";
import {
  createOccasionAction,
  type CreateOccasionState,
} from "@/app/admin/occasions/actions";

const initialState: CreateOccasionState = {
  success: false,
};

export default function OccasionForm() {
  const [state, formAction, pending] = useActionState(
    createOccasionAction,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold">Add Occasion</h2>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Occasion Name</label>
          <input
            name="name"
            className="w-full rounded-lg border p-3"
            placeholder="Wedding"
          />
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Slug</label>
          <input
            name="slug"
            className="w-full rounded-lg border p-3"
            placeholder="wedding"
          />
          {state.errors?.slug && (
            <p className="mt-1 text-sm text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      {state.message && (
        <p
          className={`mt-4 text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Occasion"}
      </button>
    </form>
  );
}
