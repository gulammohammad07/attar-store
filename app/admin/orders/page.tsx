import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customer orders.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-white px-6 py-20 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ShoppingCart className="h-8 w-8 text-gray-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="text-gray-500 mt-1">
            Orders will appear here once customers start shopping.
          </p>
        </div>
      </div>
    </div>
  );
}
