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

function isMailConfigured(): boolean {
  const missing = [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM_EMAIL",
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `[mail] SMTP is not configured — order notification emails are disabled. ` +
        `Missing .env variables: ${missing.join(", ")}. ` +
        `Fill these in (e.g. for Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=your@gmail.com, SMTP_PASS=app password) and restart the server.`,
    );
    return false;
  }
  return true;
}

function getTransporter(): nodemailer.Transporter {
  const rawPort = process.env.SMTP_PORT;
  const isExplicitSecure = process.env.SMTP_SECURE === "true";
  const port = rawPort ? Number(rawPort) : (isExplicitSecure ? 465 : 587);
  const secure = isExplicitSecure || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      // Strip any whitespace (users often copy Gmail App Passwords with spaces like 'abcd efgh ijkl mnop')
      pass: (process.env.SMTP_PASS ?? "").replace(/\s+/g, ""),
    },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  });
}


function buildOrderEmailHtml(
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

  const occasionLine = order.occasion
    ? `<div style="margin-top:8px;font-size:13px;color:#5f7788;">Occasion: <strong style="color:#174a63;">${escapeHtml(order.occasion)}</strong></div>`
    : "";

  const adminUrl = `${getAppUrl()}/admin/orders`;

  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8fcfe;">
  <div style="margin:0 auto;max-width:640px;font-family:Arial,Helvetica,sans-serif;">
    <div style="background:#0f2838;padding:28px 32px;">
      <div style="font-size:20px;font-weight:bold;color:#ffffff;">${escapeHtml(storeName)}</div>
      <div style="font-size:13px;color:#cfe4f0;margin-top:4px;">New order received — ${escapeHtml(order.orderNumber)}</div>
    </div>

    <div style="background:#ffffff;padding:32px;">
      <p style="margin:0 0 6px;font-size:17px;font-weight:bold;color:#174a63;">
        Order ${escapeHtml(order.orderNumber)}
      </p>
      <p style="margin:0 0 24px;font-size:13px;color:#5f7788;">
        Placed on ${formatDate(order.createdAt)} · ${paymentMethodLabel(order.paymentMethod)} · Payment ${statusLabel(order.paymentStatus)} · Status ${statusLabel(order.status)}
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="width:50%;vertical-align:top;padding:0 16px 20px 0;">
            <div style="font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;margin-bottom:8px;">Customer</div>
            <div style="font-size:14px;color:#174a63;line-height:1.6;">${escapeHtml(order.customerName)}</div>
            <div style="font-size:13px;color:#5f7788;line-height:1.6;">
              <a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#c9a96e;">${escapeHtml(order.customerEmail)}</a><br />
              ${escapeHtml(order.customerPhone)}
            </div>
          </td>
          <td style="width:50%;vertical-align:top;padding:0 0 20px 16px;">
            <div style="font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#5f7788;margin-bottom:8px;">Ship to</div>
            <div style="font-size:13px;color:#174a63;line-height:1.6;">
              ${escapeHtml(order.customerName)}<br />
              ${escapeHtml(order.street)}<br />
              ${escapeHtml(order.city)}, ${escapeHtml(order.state)} — ${escapeHtml(order.pincode)}<br />
              ${escapeHtml(order.country)}
            </div>
            ${occasionLine}
          </td>
        </tr>
      </table>

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
        <a href="${adminUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#174a63;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">View order in admin</a>
      </div>
    </div>

    <div style="padding:20px 32px;text-align:center;font-size:12px;color:#5f7788;">
      ${escapeHtml(storeName)} · This is an automatic order notification sent to the store support email.
    </div>
  </div>
</body>
</html>`;
}

function buildOrderEmailText(order: OrderMailData, storeName: string): string {
  const lines = [
    `${storeName} — New order received`,
    `Order ${order.orderNumber}`,
    `Placed on ${formatDate(order.createdAt)}`,
    `Payment: ${paymentMethodLabel(order.paymentMethod)} (${statusLabel(order.paymentStatus)})`,
    "",
    "Customer:",
    `  ${order.customerName}`,
    `  ${order.customerEmail}`,
    `  ${order.customerPhone}`,
    "",
    "Ship to:",
    `  ${order.street}`,
    `  ${order.city}, ${order.state} — ${order.pincode}`,
    `  ${order.country}`,
  ];

  if (order.occasion) lines.push(`  Occasion: ${order.occasion}`);

  lines.push("", "Items:");
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
  lines.push("", `Open in admin: ${getAppUrl()}/admin/orders`);

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
 * Emails the store's support email and the customer with order details
 * whenever an order is confirmed. Never throws — problems are logged and ignored.
 */
export async function sendNewOrderNotificationMail(
  order: OrderMailData,
): Promise<void> {
  try {
    if (!isMailConfigured()) {
      console.warn(
        `[mail] SMTP not configured; skipping order email for ${order.orderNumber}.`,
      );
      return;
    }

    const settings = await getStoreSettings();
    const adminRecipient = (settings.supportEmail ?? "").trim();
    const customerRecipient = (order.customerEmail ?? "").trim().toLowerCase();
    const fromName = process.env.SMTP_FROM_NAME || settings.storeName;
    const fromEmail = process.env.SMTP_FROM_EMAIL as string;

    const transporter = getTransporter();
    const sendTasks: Promise<unknown>[] = [];

    // 1. Send notification to store admin / support email
    if (adminRecipient) {
      sendTasks.push(
        transporter.sendMail({
          from: { name: fromName, address: fromEmail },
          to: adminRecipient,
          subject: `New order ${order.orderNumber} — ${formatPrice(order.total)} (${settings.storeName})`,
          html: buildOrderEmailHtml(order, settings.storeName),
          text: buildOrderEmailText(order, settings.storeName),
        }).then(() => {
          console.log(`[mail] Admin order notification sent for ${order.orderNumber} → ${adminRecipient}`);
        }).catch((err) => {
          console.error(`[mail] Failed to send admin notification for ${order.orderNumber}:`, err);
        })
      );
    } else {
      console.warn(
        `[mail] No support email set; skipping admin notification for ${order.orderNumber}.`,
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
          console.log(`[mail] Customer order confirmation sent for ${order.orderNumber} → ${customerRecipient}`);
        }).catch((err) => {
          console.error(`[mail] Failed to send customer confirmation for ${order.orderNumber}:`, err);
        })
      );
    }

    await Promise.allSettled(sendTasks);
  } catch (error) {
    console.error("[mail] Failed to process order notification mail:", error);
  }
}

/**
 * Sends a test email to the store's support email. Unlike the order
 * notification, errors propagate so the admin sees exactly why mail failed.
 */
export async function sendTestEmail(): Promise<
  { ok: true; recipient: string } | { ok: false; message: string }
> {
  if (!isMailConfigured()) {
    return {
      ok: false,
      message:
        "SMTP is not configured. Fill SMTP_HOST, SMTP_USER, SMTP_PASS and SMTP_FROM_EMAIL in .env, then restart the server.",
    };
  }

  const settings = await getStoreSettings();
  const recipient = (settings.supportEmail ?? "").trim();
  if (!recipient) {
    return {
      ok: false,
      message:
        "No support email set. Save one under Support Email above, then retry.",
    };
  }

  try {
    await getTransporter().sendMail({
      from: {
        name: process.env.SMTP_FROM_NAME || settings.storeName,
        address: process.env.SMTP_FROM_EMAIL as string,
      },
      to: recipient,
      subject: `Test email — ${settings.storeName} order notifications are working`,
      text: `This is a test email from ${settings.storeName}. If you are reading this, order notification emails will arrive correctly when a customer places an order.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8fcfe;">
  <div style="margin:0 auto;max-width:640px;font-family:Arial,Helvetica,sans-serif;">
    <div style="background:#0f2838;padding:28px 32px;">
      <div style="font-size:20px;font-weight:bold;color:#ffffff;">${escapeHtml(settings.storeName)}</div>
      <div style="font-size:13px;color:#cfe4f0;margin-top:4px;">Test email</div>
    </div>
    <div style="background:#ffffff;padding:32px;">
      <p style="margin:0 0 12px;font-size:17px;font-weight:bold;color:#174a63;">Your email setup works</p>
      <p style="margin:0;font-size:14px;color:#5f7788;line-height:1.7;">
        This is a test email sent from the admin settings page. When a customer
        places an order, a notification like the order emails will arrive at
        <strong style="color:#174a63;">${escapeHtml(recipient)}</strong>.
      </p>
    </div>
    <div style="padding:20px 32px;text-align:center;font-size:12px;color:#5f7788;">
      ${escapeHtml(settings.storeName)} · automatic test email
    </div>
  </div>
</body>
</html>`,
    });

    return { ok: true, recipient };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[mail] Test email failed:", error);
    return { ok: false, message: detail };
  }
}
