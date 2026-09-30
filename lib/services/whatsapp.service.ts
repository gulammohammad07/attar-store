import "server-only";

/**
 * Order notifications on the store owner's personal WhatsApp via CallMeBot
 * (https://www.callmebot.com/blog/free-api-whatsapp-messages/).
 *
 * One-time setup (you do this on your phone, once):
 *   1. Save the number +34 684 783 708 in your phone contacts (any name).
 *   2. Send it this exact message on WhatsApp:
 *      "I allow callmebot to send me messages"
 *   3. The bot replies with "API Activated... Your APIKEY is XXXXXX".
 *
 * Then set these three variables in Vercel (Production) AND locally in .env:
 *   WHATSAPP_PHONE   — your number with country code, e.g. 919876543210
 *   WHATSAPP_APIKEY  — the key the bot sent you
 *   (WHATSAPP_ENABLED=true is optional; setting the two above is enough)
 *
 * Never throws — a WhatsApp failure must never break checkout.
 */

export type WhatsappOrderData = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  state: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  firstItemName: string;
};

function isWhatsappConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_PHONE && process.env.WHATSAPP_APIKEY);
}

export function missingWhatsappVars(): string[] {
  return ["WHATSAPP_PHONE", "WHATSAPP_APIKEY"].filter(
    (key) => !process.env[key],
  );
}

export function formatOrderWhatsappMessage(order: WhatsappOrderData): string {
  const payment =
    order.paymentMethod === "COD"
      ? "Cash on Delivery"
      : `Online payment (${order.paymentStatus})`;

  return (
    `🛒 *New Order Received*\n\n` +
    `Order: ${order.orderNumber}\n` +
    `Customer: ${order.customerName}\n` +
    `Phone: ${order.customerPhone}\n` +
    `City: ${order.city}, ${order.state}\n` +
    `Payment: ${payment}\n` +
    `Items: ${order.itemCount} (${order.firstItemName}${order.itemCount > 1 ? " +more" : ""})\n` +
    `Total: ₹${order.total.toLocaleString("en-IN")}\n\n` +
    `Manage: ${process.env.NEXT_PUBLIC_APP_URL ?? ""}/admin/orders`
  );
}

async function sendWhatsappText(message: string): Promise<
  { ok: true } | { ok: false; message: string }
> {
  const phone = (process.env.WHATSAPP_PHONE ?? "").trim();
  const apikey = (process.env.WHATSAPP_APIKEY ?? "").trim();

  if (!phone || !apikey) {
    return {
      ok: false,
      message:
        "WhatsApp not configured. Set WHATSAPP_PHONE and WHATSAPP_APIKEY, then redeploy.",
    };
  }

  try {
    const url = new URL("https://api.callmebot.com/whatsapp.php");
    url.searchParams.set("phone", phone);
    url.searchParams.set("text", message);
    url.searchParams.set("apikey", apikey);

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const body = (await response.text()).slice(0, 300);

    if (!response.ok) {
      return {
        ok: false,
        message: `CallMeBot returned ${response.status}: ${body}`,
      };
    }

    if (/error|not allowed|invalid apikey|quota/i.test(body) && !/message queued/i.test(body)) {
      return { ok: false, message: `CallMeBot: ${body}` };
    }

    return { ok: true };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `WhatsApp request failed: ${detail}` };
  }
}

export async function sendOrderWhatsappNotification(
  order: WhatsappOrderData,
): Promise<void> {
  try {
    if (!isWhatsappConfigured()) {
      console.warn(
        `[whatsapp] Not configured (missing: ${missingWhatsappVars().join(", ")}); ` +
          `skipping notification for ${order.orderNumber}.`,
      );
      return;
    }

    const result = await sendWhatsappText(formatOrderWhatsappMessage(order));
    if (result.ok) {
      console.log(`[whatsapp] Order notification sent for ${order.orderNumber}`);
    } else {
      console.error(
        `[whatsapp] Failed for ${order.orderNumber}: ${result.message}`,
      );
    }
  } catch (error) {
    console.error("[whatsapp] Unexpected error:", error);
  }
}

/** Test message from the admin settings page. Errors propagate to the caller. */
export async function sendTestWhatsapp(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  if (!isWhatsappConfigured()) {
    return {
      ok: false,
      message:
        "WhatsApp not configured — missing: " +
        `${missingWhatsappVars().join(", ")}. ` +
        "Set them in Vercel → Settings → Environment Variables (Production), then redeploy.",
    };
  }

  const message =
    `✅ *Test Successful*\n\n` +
    `${new Date().toLocaleString("en-IN")} — WhatsApp order notifications ` +
    `are working for your store.`;

  return sendWhatsappText(message);
}
