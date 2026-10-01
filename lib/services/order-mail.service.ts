import "server-only";

import nodemailer from "nodemailer";

import { getAppUrl } from "@/lib/auth/config";
import { getStoreSettings } from "@/lib/services/settings.service";
import { formatPrice } from "@/lib/utils";

export type OrderMailItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

/** Plain order snapshot the notification mail needs — no Prisma coupling. */
export type OrderMailData = {
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode: string | null;
  occasion: string | null;
  total: number;
  items: OrderMailItem[];
};

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string | null | undefined): string {
  return (value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status.toLowerCase();
}

function paymentMethodLabel(method: string): string {
  return method === "COD" ? "Cash on Delivery" : "Online payment (Razorpay)";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function cleanPhoneForWhatsapp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function isMailConfigured(): boolean {
  const host = (process.env.SMTP_HOST ?? "").trim();
  const user = (process.env.SMTP_USER ?? "").trim();
  const pass = (process.env.SMTP_PASS ?? "").trim();

  if (!host || !user || !pass) {
    const missing: string[] = [];
    if (!host) missing.push("SMTP_HOST");
    if (!user) missing.push("SMTP_USER");
    if (!pass) missing.push("SMTP_PASS");

    console.warn(
      `[mail] SMTP is not configured — order notification emails are disabled. ` +
        `Missing .env variables: ${missing.join(", ")}. ` +
        `Fill these in (e.g. for Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER=your@gmail.com, SMTP_PASS=16-character-app-password) and restart the server.`,
    );
    return false;
  }
  return true;
}

export function getSmtpDiagnosticInfo(): {
  configured: boolean;
  host: string | null;
  port: number;
  user: string | null;
  fromEmail: string | null;
  adminEmail: string | null;
  missing: string[];
} {
  const host = (process.env.SMTP_HOST ?? "").trim() || null;
  const user = (process.env.SMTP_USER ?? "").trim() || null;
  const pass = (process.env.SMTP_PASS ?? "").trim() || null;
  const rawPort = process.env.SMTP_PORT;
  const isExplicitSecure = process.env.SMTP_SECURE === "true";
  const port = rawPort ? Number(rawPort) : (isExplicitSecure ? 465 : 587);

  const fromEmail = (
    process.env.SMTP_FROM_EMAIL && process.env.SMTP_FROM_EMAIL !== "no-reply@localhost"
      ? process.env.SMTP_FROM_EMAIL
      : user
  ) || null;

  const adminEmail = (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.SMTP_ADMIN_EMAIL ||
    user
  ) || null;

  const missing: string[] = [];
  if (!host) missing.push("SMTP_HOST");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");

  return {
    configured: missing.length === 0,
    host,
    port,
    user,
    fromEmail,
    adminEmail,
    missing,
  };
}

function getTransporter(): nodemailer.Transporter {
  const host = (process.env.SMTP_HOST ?? "").trim();
  const rawPort = process.env.SMTP_PORT;
  const isExplicitSecure = process.env.SMTP_SECURE === "true";
  const port = rawPort ? Number(rawPort) : (isExplicitSecure ? 465 : 587);
  const secure = isExplicitSecure || port === 465;

  const user = (process.env.SMTP_USER ?? "").trim();
  // Strip whitespace from password (users often copy 16-character Gmail App Passwords with spaces like 'abcd efgh ijkl mnop')
  const pass = (process.env.SMTP_PASS ?? "").replace(/\s+/g, "");

  const isGmail = host.toLowerCase().includes("gmail");

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}


function buildOrderEmailHtml(
  order: OrderMailData,
  storeName: string,
): string {
  const isCod = order.paymentMethod === "COD";
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e0ecf2;font-size:14px;color:#174a63;">
            <div style="font-weight:600;color:#174a63;">${escapeHtml(item.productName)}</div>
            <div style="font-size:12px;color:#5f7788;margin-top:3px;">
              Qty: <strong>${item.quantity}</strong> × ${formatPrice(item.unitPrice)}
            </div>
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid #e0ecf2;font-size:14px;font-weight:600;color:#174a63;text-align:right;white-space:nowrap;">
            ${formatPrice(item.lineTotal)}
          </td>
        </tr>`,
    )
    .join("");

  const couponLine = order.couponCode
    ? `
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#5f7788;">Discount (${escapeHtml(order.couponCode)})</td>
        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#0f8a4d;text-align:right;">−${formatPrice(order.discountAmount)}</td>
      </tr>`
    : "";

  const occasionLine = order.occasion
    ? `<div style="margin-top:10px;padding:6px 10px;background:#f0f7fa;border-radius:6px;font-size:13px;color:#5f7788;">Occasion: <strong style="color:#174a63;">${escapeHtml(order.occasion)}</strong></div>`
    : "";

  const adminUrl = `${getAppUrl()}/admin/orders`;
  const waUrl = `https://wa.me/${cleanPhoneForWhatsapp(order.customerPhone)}`;

  const paymentBanner = isCod
    ? `<div style="background:#FFF9E6;border:1px solid #FFE58F;border-radius:10px;padding:14px 18px;margin-bottom:24px;color:#874D00;font-size:14px;line-height:1.5;">
        <strong style="font-size:15px;display:block;margin-bottom:2px;">💵 CASH ON DELIVERY</strong>
        Please collect <strong>${formatPrice(order.total)}</strong> in cash from the customer upon delivery.
       </div>`
    : `<div style="background:#F6FFED;border:1px solid #B7EB8F;border-radius:10px;padding:14px 18px;margin-bottom:24px;color:#135200;font-size:14px;line-height:1.5;">
        <strong style="font-size:15px;display:block;margin-bottom:2px;">✅ PAID ONLINE (Razorpay)</strong>
        Payment of <strong>${formatPrice(order.total)}</strong> is verified and completed.
       </div>`;

  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8fcfe;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="margin:0 auto;max-width:640px;background:#ffffff;border:1px solid #e0ecf2;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:30px;">
    
    <!-- Header -->
    <div style="background:#0f2838;padding:28px 32px;border-bottom:3px solid #c9a96e;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-size:22px;font-weight:bold;color:#c9a96e;letter-spacing:1px;">${escapeHtml(storeName)}</div>
            <div style="font-size:14px;color:#cfe4f0;margin-top:4px;">🎉 New Customer Order Received</div>
          </td>
          <td align="right">
            <div style="display:inline-block;padding:6px 14px;border-radius:20px;background:#174a63;color:#ffffff;font-size:12px;font-weight:bold;letter-spacing:0.5px;">
              ${escapeHtml(order.orderNumber)}
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content -->
    <div style="padding:28px 32px;">
      
      ${paymentBanner}

      <!-- Order Summary Bar -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fcfe;border:1px solid #e0ecf2;border-radius:10px;padding:14px;margin-bottom:24px;">
        <tr>
          <td style="padding:4px 12px;font-size:13px;color:#5f7788;">
            Placed: <strong style="color:#174a63;">${formatDate(order.createdAt)}</strong>
          </td>
          <td style="padding:4px 12px;font-size:13px;color:#5f7788;">
            Payment: <strong style="color:#174a63;">${paymentMethodLabel(order.paymentMethod)}</strong>
          </td>
          <td style="padding:4px 12px;font-size:13px;color:#5f7788;" align="right">
            Status: <strong style="color:#174a63;">${statusLabel(order.status)}</strong>
          </td>
        </tr>
      </table>

      <!-- Customer & Shipping Cards -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <!-- Customer Details -->
          <td style="width:50%;vertical-align:top;padding:0 10px 0 0;">
            <div style="background:#f8fcfe;border:1px solid #e0ecf2;border-radius:12px;padding:18px;height:100%;">
              <div style="font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#c9a96e;margin-bottom:10px;">
                Customer Details
              </div>
              <div style="font-size:16px;font-weight:bold;color:#174a63;margin-bottom:6px;">
                ${escapeHtml(order.customerName)}
              </div>
              <div style="font-size:13px;color:#5f7788;line-height:1.6;margin-bottom:10px;">
                ✉️ <a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#174a63;text-decoration:none;">${escapeHtml(order.customerEmail)}</a><br />
                📞 <a href="tel:${escapeHtml(order.customerPhone)}" style="color:#174a63;font-weight:600;text-decoration:none;">${escapeHtml(order.customerPhone)}</a>
              </div>
              <a href="${waUrl}" target="_blank" style="display:inline-block;padding:6px 12px;background:#25D366;color:#ffffff;border-radius:6px;text-decoration:none;font-size:12px;font-weight:bold;">
                💬 WhatsApp Customer
              </a>
            </div>
          </td>

          <!-- Shipping Address -->
          <td style="width:50%;vertical-align:top;padding:0 0 0 10px;">
            <div style="background:#f8fcfe;border:1px solid #e0ecf2;border-radius:12px;padding:18px;height:100%;">
              <div style="font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#c9a96e;margin-bottom:10px;">
                Delivery Address
              </div>
              <div style="font-size:14px;color:#174a63;line-height:1.6;">
                <strong>${escapeHtml(order.customerName)}</strong><br />
                ${escapeHtml(order.street)}<br />
                ${escapeHtml(order.city)}, ${escapeHtml(order.state)} — <strong>${escapeHtml(order.pincode)}</strong><br />
                ${escapeHtml(order.country)}
              </div>
              ${occasionLine}
            </div>
          </td>
        </tr>
      </table>

      <!-- Items Section -->
      <div style="font-size:13px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;margin-bottom:10px;">
        Order Items (${order.items.reduce((s, i) => s + i.quantity, 0)})
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0ecf2;border-radius:12px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fcfe;">
            <th align="left" style="padding:10px 14px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;border-bottom:1px solid #e0ecf2;">Product</th>
            <th align="right" style="padding:10px 14px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;border-bottom:1px solid #e0ecf2;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <!-- Price Breakdown -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#5f7788;">Items Subtotal</td>
          <td style="padding:6px 0;font-size:14px;color:#174a63;text-align:right;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#5f7788;">Delivery / Shipping</td>
          <td style="padding:6px 0;font-size:14px;color:#174a63;text-align:right;">${order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</td>
        </tr>
        ${couponLine}
        <tr>
          <td style="padding:14px 0 6px;font-size:16px;font-weight:bold;color:#174a63;border-top:1px solid #e0ecf2;">Grand Total</td>
          <td style="padding:14px 0 6px;font-size:22px;font-weight:bold;color:#c9a96e;text-align:right;border-top:1px solid #e0ecf2;">${formatPrice(order.total)}</td>
        </tr>
      </table>

      <!-- Buttons -->
      <div style="margin-top:32px;text-align:center;">
        <a href="${adminUrl}" style="display:inline-block;padding:14px 32px;border-radius:999px;background:#174a63;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;letter-spacing:0.5px;">
          View in Admin Panel →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fcfe;padding:20px 32px;text-align:center;font-size:12px;color:#5f7788;border-top:1px solid #e0ecf2;">
      ${escapeHtml(storeName)} · Automated Admin Order Alert
    </div>
  </div>
</body>
</html>`;
}

function buildOrderEmailText(order: OrderMailData, storeName: string): string {
  const isCod = order.paymentMethod === "COD";
  const lines = [
    `========================================`,
    `${storeName} — NEW ORDER RECEIVED`,
    `========================================`,
    `Order Number: ${order.orderNumber}`,
    `Placed on:    ${formatDate(order.createdAt)}`,
    `Payment:      ${paymentMethodLabel(order.paymentMethod)} (${statusLabel(order.paymentStatus)})`,
    `Status:       ${statusLabel(order.status)}`,
    isCod ? `\n>>> NOTE: Collect ${formatPrice(order.total)} in CASH upon delivery <<<` : `\n>>> PAID ONLINE via Razorpay <<<`,
    "",
    "CUSTOMER DETAILS:",
    `  Name:     ${order.customerName}`,
    `  Email:    ${order.customerEmail}`,
    `  Phone:    ${order.customerPhone}`,
    `  WhatsApp: https://wa.me/${cleanPhoneForWhatsapp(order.customerPhone)}`,
    "",
    "DELIVERY ADDRESS:",
    `  ${order.customerName}`,
    `  ${order.street}`,
    `  ${order.city}, ${order.state} — ${order.pincode}`,
    `  ${order.country}`,
  ];

  if (order.occasion) lines.push(`  Occasion: ${order.occasion}`);

  lines.push("", "ORDER ITEMS:");
  for (const item of order.items) {
    lines.push(`  * ${item.productName} — Qty: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}`);
  }

  lines.push(
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping: ${order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}`,
  );
  if (order.couponCode) {
    lines.push(`Discount (${order.couponCode}): −${formatPrice(order.discountAmount)}`);
  }
  lines.push(`TOTAL:    ${formatPrice(order.total)}`);
  lines.push("", `Manage order: ${getAppUrl()}/admin/orders`);

  return lines.join("\n");
}

function buildCustomerOrderEmailHtml(
  order: OrderMailData,
  storeName: string,
): string {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e0ecf2;font-size:14px;color:#174a63;">
            ${escapeHtml(item.productName)}
            <div style="font-size:12px;color:#5f7788;margin-top:2px;">
              ${item.quantity} × ${formatPrice(item.unitPrice)}
            </div>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0ecf2;font-size:14px;color:#174a63;text-align:right;white-space:nowrap;">
            ${formatPrice(item.lineTotal)}
          </td>
        </tr>`,
    )
    .join("");

  const couponLine = order.couponCode
    ? `
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#5f7788;">Discount (${escapeHtml(order.couponCode)})</td>
        <td style="padding:4px 0;font-size:14px;color:#0f8a4d;text-align:right;">−${formatPrice(order.discountAmount)}</td>
      </tr>`
    : "";

  const ordersUrl = `${getAppUrl()}/account/orders`;

  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8fcfe;">
  <div style="margin:0 auto;max-width:640px;font-family:Arial,Helvetica,sans-serif;">
    <div style="background:#0f2838;padding:28px 32px;text-align:center;">
      <div style="font-size:22px;font-weight:bold;color:#c9a96e;letter-spacing:2px;">${escapeHtml(storeName).toUpperCase()}</div>
      <div style="font-size:14px;color:#cfe4f0;margin-top:6px;">Thank you for your order!</div>
    </div>

    <div style="background:#ffffff;padding:32px;">
      <p style="margin:0 0 8px;font-size:18px;font-weight:bold;color:#174a63;">
        Hello ${escapeHtml(order.customerName)},
      </p>
      <p style="margin:0 0 20px;font-size:14px;color:#5f7788;line-height:1.6;">
        We have received your order <strong style="color:#174a63;">${escapeHtml(order.orderNumber)}</strong> and are preparing it. You can check the status of your order anytime in your account.
      </p>

      <div style="background:#f8fcfe;border:1px solid #e0ecf2;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;margin-bottom:6px;">Delivery Details</div>
        <div style="font-size:14px;color:#174a63;line-height:1.6;">
          ${escapeHtml(order.customerName)}<br />
          ${escapeHtml(order.street)}<br />
          ${escapeHtml(order.city)}, ${escapeHtml(order.state)} — ${escapeHtml(order.pincode)}<br />
          Phone: ${escapeHtml(order.customerPhone)}
        </div>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0ecf2;border-radius:12px;">
        <tr>
          <th align="left" style="padding:10px 12px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;border-bottom:1px solid #e0ecf2;">Item</th>
          <th align="right" style="padding:10px 12px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;border-bottom:1px solid #e0ecf2;">Amount</th>
        </tr>
        ${rows}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
        <tr>
          <td style="padding:4px 0;font-size:14px;color:#5f7788;">Subtotal</td>
          <td style="padding:4px 0;font-size:14px;color:#174a63;text-align:right;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:14px;color:#5f7788;">Shipping</td>
          <td style="padding:4px 0;font-size:14px;color:#174a63;text-align:right;">${order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</td>
        </tr>
        ${couponLine}
        <tr>
          <td style="padding:12px 0 4px;font-size:16px;font-weight:bold;color:#174a63;">Total</td>
          <td style="padding:12px 0 4px;font-size:18px;font-weight:bold;color:#c9a96e;text-align:right;">${formatPrice(order.total)}</td>
        </tr>
      </table>

      <div style="margin-top:28px;text-align:center;">
        <a href="${ordersUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#174a63;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">View Your Order</a>
      </div>
    </div>

    <div style="padding:20px 32px;text-align:center;font-size:12px;color:#5f7788;">
      Thank you for shopping with ${escapeHtml(storeName)}!
    </div>
  </div>
</body>
</html>`;
}

function buildCustomerOrderEmailText(order: OrderMailData, storeName: string): string {
  const lines = [
    `Thank you for your order with ${storeName}!`,
    `Order Number: ${order.orderNumber}`,
    `Placed on: ${formatDate(order.createdAt)}`,
    `Payment: ${paymentMethodLabel(order.paymentMethod)} (${statusLabel(order.paymentStatus)})`,
    "",
    "Delivery Address:",
    `  ${order.customerName}`,
    `  ${order.street}`,
    `  ${order.city}, ${order.state} — ${order.pincode}`,
    `  ${order.customerPhone}`,
    "",
    "Items:",
  ];

  for (const item of order.items) {
    lines.push(`  ${item.productName} — ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}`);
  }

  lines.push(
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping: ${order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}`,
  );
  if (order.couponCode) {
    lines.push(`Discount (${order.couponCode}): −${formatPrice(order.discountAmount)}`);
  }
  lines.push(`Total: ${formatPrice(order.total)}`);
  lines.push("", `View your order: ${getAppUrl()}/account/orders`);

  return lines.join("\n");
}

/**
 * Emails the store admin and the customer with full order details
 * whenever an order is confirmed. Never throws — problems are logged.
 */
export async function sendNewOrderNotificationMail(
  order: OrderMailData,
): Promise<{ success: boolean; adminSent: boolean; customerSent: boolean; error?: string }> {
  try {
    if (!isMailConfigured()) {
      console.warn(
        `[mail] SMTP not configured; skipping order email for ${order.orderNumber}. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.`,
      );
      return { success: false, adminSent: false, customerSent: false, error: "SMTP not configured" };
    }

    const settings = await getStoreSettings();

    // Determine the admin email that should receive new order notifications
    const adminRecipient = (
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.SMTP_ADMIN_EMAIL ||
      (settings.supportEmail && !settings.supportEmail.includes("example.com") && settings.supportEmail !== "support@danishperfumes.com"
        ? settings.supportEmail
        : null) ||
      process.env.SMTP_USER ||
      settings.supportEmail ||
      ""
    ).trim();

    const customerRecipient = (order.customerEmail ?? "").trim().toLowerCase();
    const fromName = process.env.SMTP_FROM_NAME || settings.storeName || "Danish Perfumes";
    const fromEmail = (
      process.env.SMTP_FROM_EMAIL && process.env.SMTP_FROM_EMAIL !== "no-reply@localhost"
        ? process.env.SMTP_FROM_EMAIL
        : (process.env.SMTP_USER || "no-reply@localhost")
    );

    const transporter = getTransporter();
    let adminSent = false;
    let customerSent = false;
    const sendTasks: Promise<unknown>[] = [];

    // 1. Send notification to store admin
    if (adminRecipient) {
      sendTasks.push(
        transporter.sendMail({
          from: { name: fromName, address: fromEmail },
          to: adminRecipient,
          subject: `New Order ${order.orderNumber} — ${formatPrice(order.total)} (${order.paymentMethod === "COD" ? "COD" : "PAID"})`,
          html: buildOrderEmailHtml(order, settings.storeName),
          text: buildOrderEmailText(order, settings.storeName),
        }).then(() => {
          adminSent = true;
          console.log(`[mail] ✅ Admin order notification sent for ${order.orderNumber} → ${adminRecipient}`);
        }).catch((err) => {
          console.error(`[mail] ❌ Failed to send admin notification for ${order.orderNumber}:`, err);
        })
      );
    } else {
      console.warn(
        `[mail] No admin recipient email found; skipping admin notification for ${order.orderNumber}.`,
      );
    }

    // 2. Send confirmation email to customer
    if (customerRecipient && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerRecipient)) {
      sendTasks.push(
        transporter.sendMail({
          from: { name: fromName, address: fromEmail },
          to: customerRecipient,
          subject: `Order Confirmation — ${order.orderNumber} (${settings.storeName})`,
          html: buildCustomerOrderEmailHtml(order, settings.storeName),
          text: buildCustomerOrderEmailText(order, settings.storeName),
        }).then(() => {
          customerSent = true;
          console.log(`[mail] ✅ Customer order confirmation sent for ${order.orderNumber} → ${customerRecipient}`);
        }).catch((err) => {
          console.error(`[mail] ❌ Failed to send customer confirmation for ${order.orderNumber}:`, err);
        })
      );
    }

    await Promise.allSettled(sendTasks);
    return { success: adminSent || customerSent, adminSent, customerSent };
  } catch (error) {
    console.error("[mail] Failed to process order notification mail:", error);
    return { success: false, adminSent: false, customerSent: false, error: String(error) };
  }
}

/**
 * Sends a test email to the store's support/admin email.
 * Unlike the order notification, errors propagate with friendly explanations.
 */
export async function sendTestEmail(): Promise<
  { ok: true; recipient: string } | { ok: false; message: string }
> {
  const diag = getSmtpDiagnosticInfo();
  if (!diag.configured) {
    return {
      ok: false,
      message: `SMTP is not configured in .env. Missing: ${diag.missing.join(", ")}. For Gmail, set SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER=your@gmail.com, and SMTP_PASS=your-16-char-app-password.`,
    };
  }

  const settings = await getStoreSettings();
  const recipient = (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.SMTP_ADMIN_EMAIL ||
    (settings.supportEmail && !settings.supportEmail.includes("example.com") && settings.supportEmail !== "support@danishperfumes.com"
      ? settings.supportEmail
      : null) ||
    process.env.SMTP_USER ||
    settings.supportEmail ||
    ""
  ).trim();

  if (!recipient) {
    return {
      ok: false,
      message:
        "No recipient email found. Set Support Email in settings or ADMIN_NOTIFICATION_EMAIL in .env.",
    };
  }

  const fromName = process.env.SMTP_FROM_NAME || settings.storeName || "Danish Perfumes";
  const fromEmail = (
    process.env.SMTP_FROM_EMAIL && process.env.SMTP_FROM_EMAIL !== "no-reply@localhost"
      ? process.env.SMTP_FROM_EMAIL
      : (process.env.SMTP_USER || "no-reply@localhost")
  );

  try {
    await getTransporter().sendMail({
      from: {
        name: fromName,
        address: fromEmail,
      },
      to: recipient,
      subject: `Test Email — ${settings.storeName} Order Notifications Active`,
      text: `This is a test email from ${settings.storeName}.\n\nIf you are reading this, your Nodemailer SMTP setup is working perfectly!\nYou will now receive an email alert with full customer and order details whenever an order is placed.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8fcfe;font-family:Arial,Helvetica,sans-serif;">
  <div style="margin:0 auto;max-width:600px;background:#ffffff;border:1px solid #e0ecf2;border-radius:16px;overflow:hidden;margin-top:24px;margin-bottom:30px;">
    <div style="background:#0f2838;padding:28px 32px;border-bottom:3px solid #c9a96e;">
      <div style="font-size:22px;font-weight:bold;color:#c9a96e;">${escapeHtml(settings.storeName)}</div>
      <div style="font-size:14px;color:#cfe4f0;margin-top:4px;">Nodemailer Test Email</div>
    </div>
    <div style="padding:32px;">
      <div style="background:#f6ffed;border:1px solid #b7eb8f;border-radius:8px;padding:14px 18px;margin-bottom:20px;color:#135200;font-size:15px;font-weight:bold;">
        ✅ Nodemailer is working successfully!
      </div>
      <p style="margin:0 0 16px;font-size:15px;color:#174a63;line-height:1.6;">
        This test email confirms that your SMTP configuration in <code>.env</code> is active and operational.
      </p>
      <div style="background:#f8fcfe;border:1px solid #e0ecf2;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
        <div style="font-size:13px;color:#5f7788;line-height:1.7;">
          • Notification Recipient: <strong style="color:#174a63;">${escapeHtml(recipient)}</strong><br />
          • Sender: <strong style="color:#174a63;">${escapeHtml(fromEmail)}</strong> (${escapeHtml(fromName)})<br />
          • Host: <strong style="color:#174a63;">${escapeHtml(process.env.SMTP_HOST ?? "")}</strong>
        </div>
      </div>
      <p style="margin:0;font-size:14px;color:#5f7788;line-height:1.6;">
        Whenever a customer places an order (Cash on Delivery or Razorpay), an email containing full customer details (Name, Phone, Delivery Address, Occasion) and complete order details (Items, Quantities, Prices, Total) will arrive at this address.
      </p>
    </div>
    <div style="padding:16px 32px;text-align:center;font-size:12px;color:#5f7788;background:#f8fcfe;border-top:1px solid #e0ecf2;">
      ${escapeHtml(settings.storeName)} · Automated test email
    </div>
  </div>
</body>
</html>`,
    });

    return { ok: true, recipient };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[mail] Test email failed:", error);

    let friendlyMessage = detail;
    if (
      detail.includes("535") ||
      detail.includes("Username and Password not accepted") ||
      detail.includes("BadCredentials") ||
      detail.includes("Invalid login")
    ) {
      friendlyMessage =
        "Gmail authentication failed (535): Gmail rejected the password. You MUST use a 16-character 'Google App Password', NOT your regular account password. Go to https://myaccount.google.com/apppasswords to generate one, then paste it in SMTP_PASS in .env.";
    } else if (detail.includes("ETIMEDOUT") || detail.includes("timeout")) {
      friendlyMessage = `Connection timed out connecting to ${process.env.SMTP_HOST}. If using Gmail, try SMTP_PORT=465 and SMTP_SECURE=true.`;
    }

    return { ok: false, message: friendlyMessage };
  }
}
