import { getAllOrders } from "@/lib/services/order.service";
import OrdersTable from "@/components/admin/OrdersTable";
import { formatPrice } from "@/lib/utils";

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;

  const filters = {
    search: first(params.search),
    from: first(params.from),
    to: first(params.to),
  };

  const orders = await getAllOrders(filters);

  const totalOrders = orders.length;
  const deliveredRevenue = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customer orders.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="mt-3 text-4xl font-bold">{totalOrders}</h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Revenue (Delivered)</p>
          <h2 className="mt-3 text-4xl font-bold">
            {formatPrice(deliveredRevenue)}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pending (Not Delivered)</p>
          <h2 className="mt-3 text-4xl font-bold">
            {formatPrice(
              orders
                .filter((order) => order.status !== "DELIVERED")
                .reduce((sum, order) => sum + order.total, 0),
            )}
          </h2>
        </div>
      </div>

      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}
