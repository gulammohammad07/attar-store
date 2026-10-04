"use client";
/* The compact table actions intentionally use an inline conditional notification. */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCouponAction, saveCouponAction } from "@/lib/actions/coupon.actions";
import { formatPrice } from "@/lib/utils";

type Coupon = { id: string; code: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; minOrderValue: number | null; maxDiscountAmount: number | null; expiresAt: string | null; isActive: boolean };
const blank = { code: "", discountType: "PERCENTAGE" as const, discountValue: 10, minOrderValue: null as number | null, maxDiscountAmount: null as number | null, expiresAt: "", isActive: true };
export default function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const [editing, setEditing] = useState<(Coupon & { expiresAt: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const open = (coupon?: Coupon) => setEditing(coupon ? { ...coupon, expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "" } : { id: "", ...blank });
  const save = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!editing) return; const data = new FormData(event.currentTarget); setSaving(true); const result = await saveCouponAction(editing.id || null, { code: String(data.get("code")), discountType: String(data.get("discountType")) as "PERCENTAGE" | "FIXED", discountValue: Number(data.get("discountValue")), minOrderValue: data.get("minOrderValue") ? Number(data.get("minOrderValue")) : null, maxDiscountAmount: data.get("maxDiscountAmount") ? Number(data.get("maxDiscountAmount")) : null, expiresAt: String(data.get("expiresAt") || ""), isActive: data.get("isActive") === "on" }); setSaving(false); if (!result.success) return toast.error(result.error); toast.success("Coupon saved."); setEditing(null); };
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold text-[#111111] sm:text-3xl">Coupons</h1><p className="mt-1 text-sm text-[#111111]/60">Manage checkout discounts.</p></div><button onClick={() => open()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-sm font-semibold text-white sm:w-auto sm:py-2"><Plus size={16}/>Create coupon</button></div><div className="overflow-hidden rounded-2xl border border-[#111111]/10 bg-white">
      {/* Mobile cards */}
      <ul className="divide-y divide-[#111111]/10 sm:hidden">
        {coupons.map((c) => (
          <li key={c.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-[#111111]">{c.code}</p>
                <p className="mt-1 text-sm text-[#111111]/60">{c.discountType === "PERCENTAGE" ? `${c.discountValue}%${c.maxDiscountAmount ? ` (max ${formatPrice(c.maxDiscountAmount)})` : ""}` : formatPrice(c.discountValue)}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold ${c.isActive ? "text-green-700" : "text-[#111111]/50"}`}>{c.isActive ? "Active" : "Disabled"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#111111]/55">
              <span>Min {c.minOrderValue ? formatPrice(c.minOrderValue) : "—"}</span>
              <span>Expires {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) : "never"}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => open(c)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#111111] px-3 py-2 text-xs font-semibold text-white" aria-label="Edit coupon"><Pencil size={14}/>Edit</button>
              <button onClick={async () => { if (confirm(`Delete ${c.code}?`)) { const r = await deleteCouponAction(c.id); r.success ? toast.success("Coupon deleted.") : toast.error(r.error); } }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600" aria-label="Delete coupon"><Trash2 size={14}/>Delete</button>
            </div>
          </li>
        ))}
        {!coupons.length && <li className="p-8 text-center text-sm text-[#111111]/55">No coupons yet.</li>}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#f5f5f0] text-xs uppercase text-[#111111]/50"><tr><th className="p-4">Code</th><th>Discount</th><th>Minimum</th><th>Expiry</th><th>Status</th><th className="p-4">Actions</th></tr></thead><tbody>{coupons.map(c => <tr key={c.id} className="border-t border-[#111111]/10"><td className="p-4 font-semibold text-[#111111]">{c.code}</td><td>{c.discountType === "PERCENTAGE" ? `${c.discountValue}%${c.maxDiscountAmount ? ` (max ${formatPrice(c.maxDiscountAmount)})` : ""}` : formatPrice(c.discountValue)}</td><td>{c.minOrderValue ? formatPrice(c.minOrderValue) : "—"}</td><td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) : "Never"}</td><td><span className={c.isActive ? "text-green-700" : "text-[#111111]/50"}>{c.isActive ? "Active" : "Disabled"}</span></td><td className="flex gap-2 p-4"><button onClick={() => open(c)} className="rounded-lg p-2 text-[#111111]/60 transition-colors hover:bg-black/5 hover:text-[#111111]" aria-label="Edit coupon"><Pencil size={16}/></button><button onClick={async () => { if (confirm(`Delete ${c.code}?`)) { const r = await deleteCouponAction(c.id); r.success ? toast.success("Coupon deleted.") : toast.error(r.error); } }} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50" aria-label="Delete coupon"><Trash2 size={16}/></button></td></tr>)}</tbody></table>{!coupons.length && <p className="p-8 text-center text-sm text-[#111111]/55">No coupons yet.</p>}</div>
    </div>{editing && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"><form onSubmit={save} className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6"><h2 className="text-xl font-bold text-[#111111]">{editing.id ? "Edit" : "Create"} Coupon</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-sm">Code<input required name="code" defaultValue={editing.code} className="mt-1 w-full rounded-lg border p-2 uppercase" /></label><label className="text-sm">Type<select name="discountType" defaultValue={editing.discountType} className="mt-1 w-full rounded-lg border p-2"><option value="PERCENTAGE">Percentage (%)</option><option value="FIXED">Fixed amount (₹)</option></select></label><label className="text-sm">Value<input required min="0.01" step="0.01" type="number" name="discountValue" defaultValue={editing.discountValue} className="mt-1 w-full rounded-lg border p-2"/></label><label className="text-sm">Minimum order<input min="0" step="0.01" type="number" name="minOrderValue" defaultValue={editing.minOrderValue ?? ""} className="mt-1 w-full rounded-lg border p-2"/></label><label className="text-sm">Max discount (percentage)<input min="0" step="0.01" type="number" name="maxDiscountAmount" defaultValue={editing.maxDiscountAmount ?? ""} className="mt-1 w-full rounded-lg border p-2"/></label><label className="text-sm sm:col-span-2">Expiry date<input type="date" name="expiresAt" defaultValue={editing.expiresAt} className="mt-1 w-full rounded-lg border p-2"/></label><label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="isActive" defaultChecked={editing.isActive}/> Enable coupon</label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-semibold text-white">{saving ? "Saving…" : "Save coupon"}</button></div></form></div>}</div>;
}
