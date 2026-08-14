"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/dal";
import { ROLES } from "@/lib/auth/config";
import { getStoreSettings } from "@/lib/services/settings.service";

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  idempotencyKey: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  occasion?: string;
  items: OrderItemInput[];
};

export type CreateOrderResult =
  | { success: true; orderId: string; orderNumber: string }
  | { success: false; error: string; notAuthenticated?: boolean };

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MD-${ts}${rand}`;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      notAuthenticated: true,
      error: "You must be signed in to place an order.",
    };
  }

  if (
    !input ||
    typeof input.idempotencyKey !== "string" ||
    input.idempotencyKey.length < 8
  ) {
    return { success: false, error: "Invalid request. Please try again." };
  }

  const items = Array.isArray(input.items)
    ? input.items.filter(
        (item) =>
          item &&
          typeof item.productId === "string" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      )
    : [];

  if (items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const customerName = (input.customerName ?? "").trim();
  const customerEmail = (input.customerEmail ?? "").trim().toLowerCase();
  const customerPhone = (input.customerPhone ?? "").trim();
  const street = (input.street ?? "").trim();
  const city = (input.city ?? "").trim();
  const state = (input.state ?? "").trim();
  const pincode = (input.pincode ?? "").trim();
  const occasion = (input.occasion ?? "").trim() || null;

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !street ||
    !city ||
    !state ||
    !pincode
  ) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (!/^\d{5,6}$/.test(pincode)) {
    return { success: false, error: "Please provide a valid PIN code." };
  }

  const existing = await prisma.order.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    select: { id: true, orderNumber: true },
  });
  if (existing) {
    return { success: true, orderId: existing.id, orderNumber: existing.orderNumber };
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const resolvedItems: { product: (typeof products)[number]; quantity: number }[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return {
        success: false,
        error:
          "A product in your cart is no longer available. Please refresh and try again.",
      };
    }
    resolvedItems.push({ product, quantity: item.quantity });
  }

  const subtotal = resolvedItems.reduce(
    (sum, { product, quantity }) =>
      sum + (product.salePrice ?? product.price) * quantity,
    0,
  );
  const settings = await getStoreSettings();
  const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const total = subtotal + shippingFee;

  try {
    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          idempotencyKey: input.idempotencyKey,
          userId: user.id,
          customerName,
          customerEmail,
          customerPhone,
          street,
          city,
          state,
          pincode,
          subtotal,
          shippingFee,
          total,
          occasion,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: "pending",
          items: {
            create: resolvedItems.map(({ product, quantity }) => ({
              productId: product.id,
              productName: product.name,
              productImage: product.imageUrl,
              unitPrice: product.salePrice ?? product.price,
              quantity,
              lineTotal: (product.salePrice ?? product.price) * quantity,
            })),
          },
        },
        select: { id: true, orderNumber: true },
      });
    });

    revalidatePath("/account/orders");
    revalidatePath("/admin/orders");

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const duplicate = await prisma.order.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
        select: { id: true, orderNumber: true },
      });
      if (duplicate) {
        return { success: true, orderId: duplicate.id, orderNumber: duplicate.orderNumber };
      }
    }
    console.error("Failed to create order:", error);
    return {
      success: false,
      error: "Something went wrong while placing your order. Please try again.",
    };
  }
}

export type UpdateOrderStatusResult = { success: boolean; error?: string };

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<UpdateOrderStatusResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== ROLES.ADMIN) {
    return { success: false, error: "Unauthorized." };
  }

  const valid = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!valid.includes(status)) {
    return { success: false, error: "Invalid order status." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" },
  });

  revalidatePath("/admin/orders");

  return { success: true };
}

export type DeleteOrdersResult = { success: boolean; error?: string };

export async function deleteOrderAction(
  orderId: string,
): Promise<DeleteOrdersResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== ROLES.ADMIN) {
    return { success: false, error: "Unauthorized." };
  }

  if (typeof orderId !== "string" || !orderId) {
    return { success: false, error: "Invalid order id." };
  }

  await prisma.order.delete({ where: { id: orderId } });

  revalidatePath("/admin/orders");

  return { success: true };
}

export async function deleteOrdersAction(
  orderIds: string[],
): Promise<DeleteOrdersResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== ROLES.ADMIN) {
    return { success: false, error: "Unauthorized." };
  }

  const ids = Array.isArray(orderIds)
    ? orderIds.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];

  if (ids.length === 0) {
    return { success: false, error: "No orders selected." };
  }

  await prisma.$transaction(
    ids.map((id) => prisma.order.delete({ where: { id } })),
  );

  revalidatePath("/admin/orders");

  return { success: true };
}
