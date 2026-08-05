import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PAYMENT_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-white px-6 py-20 text-center shadow-sm">
        <h2 className="text-xl font-semibold">No orders yet</h2>
        <p className="text-gray-500 mt-1">
          Orders will appear here once customers start shopping.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Items</th>
              <th className="px-5 py-3 font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Payment</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="align-top hover:bg-gray-50/60">
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {order.street}, {order.city}, {order.state} {order.pincode}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {order.customerEmail}
                  </p>
                  <p className="text-xs text-gray-400">{order.customerPhone}</p>
                </td>
                <td className="px-5 py-4">
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-gray-600">
                        {item.productName}{" "}
                        <span className="text-gray-400">
                          × {item.quantity} · {formatPrice(item.lineTotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatPrice(order.subtotal)} + shipping{" "}
                    {order.shippingFee === 0
                      ? "free"
                      : formatPrice(order.shippingFee)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${
                      PAYMENT_BADGE[order.paymentStatus] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
