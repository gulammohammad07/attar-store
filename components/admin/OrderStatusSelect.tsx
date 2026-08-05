"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/order.actions";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatusValue;
    if (next === status) return;
    setPending(true);
    const result = await updateOrderStatus(orderId, next);
    setPending(false);
    if (result.success) {
      toast.success(`Order marked as ${next}.`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update order status.");
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={handleChange}
        disabled={pending}
        className="h-9 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 pr-8 text-xs font-semibold text-gray-700 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {pending && (
        <Loader2
          size={14}
          className="pointer-events-none absolute right-2 animate-spin text-gold"
        />
      )}
    </div>
  );
}
