import { getAllOrders } from "@/lib/services/order.service";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function OrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customer orders.
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
