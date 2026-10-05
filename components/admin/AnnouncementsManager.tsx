"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import AnnouncementForm, {
  type AnnouncementFormInitial,
} from "@/components/admin/AnnouncementForm";
import {
  deleteAnnouncementAction,
  toggleAnnouncementAction,
} from "@/lib/actions/announcement.actions";

export default function AnnouncementsManager({
  items,
}: {
  items: AnnouncementFormInitial[];
}) {
  const [creating, setCreating] = useState(items.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const remove = (item: AnnouncementFormInitial) => {
    if (
      !window.confirm(`Delete "${item.title}"? This cannot be undone.`)
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteAnnouncementAction(item.id);
      if (result.success) {
        toast.success(result.message ?? "Deleted");
        if (editingId === item.id) setEditingId(null);
      } else {
        toast.error(result.message ?? "Failed to delete");
      }
    });
  };

  const toggle = (item: AnnouncementFormInitial) => {
    startTransition(async () => {
      const result = await toggleAnnouncementAction(item.id, !item.isActive);
      if (result.success) {
        toast.success(result.message ?? "Updated");
      } else {
        toast.error(result.message ?? "Failed to update");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => setCreating((value) => !value)}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          <Plus size={16} />
          {creating ? "Close form" : "Add New Announcement"}
        </button>

        {creating && (
          <div className="mt-4">
            <AnnouncementForm onSaved={() => setCreating(false)} />
          </div>
        )}
      </div>

      {items.length === 0 && !creating ? (
        <div className="rounded-2xl border border-dashed border-[#d5d5cf] bg-white p-10 text-center">
          <Megaphone size={28} className="mx-auto text-gray-300" />
          <p className="mt-3 font-medium">No announcements yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add an offer, sale or product launch and it will appear in the
            homepage &ldquo;Offers &amp; New Launches&rdquo; section.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-[#e5e5e0] bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.badge && (
                      <span className="rounded-full bg-[#0f2838]/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f2838]">
                        {item.badge}
                      </span>
                    )}
                    <p className="truncate font-semibold">{item.title}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isActive ? "Live" : "Hidden"}
                    </span>
                    <span className="text-xs text-gray-400">
                      order {item.sortOrder}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggle(item)}
                    title={item.isActive ? "Hide from storefront" : "Show on storefront"}
                    className="rounded-lg border border-[#e5e5e0] p-2 text-gray-600 hover:bg-[#f5f5f0] disabled:opacity-50"
                  >
                    {item.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      setEditingId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    title="Edit"
                    className="rounded-lg border border-[#e5e5e0] p-2 text-gray-600 hover:bg-[#f5f5f0] disabled:opacity-50"
                  >
                    <Pencil size={16} />
                    <ChevronDown
                      size={12}
                      className={`inline transition-transform ${
                        editingId === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => remove(item)}
                    title="Delete"
                    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {editingId === item.id && (
                <div className="border-t border-[#e5e5e0] bg-[#fafaf7] p-4 sm:p-5">
                  <AnnouncementForm
                    initial={item}
                    onSaved={() => setEditingId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
