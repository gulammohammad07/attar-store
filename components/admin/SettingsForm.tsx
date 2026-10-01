"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  updateStoreSettingsAction,
  sendTestEmailAction,
  sendTestWhatsappAction,
  type UpdateSettingsResult,
} from "@/lib/actions/settings.actions";
import type { StoreSettingsDTO } from "@/lib/services/settings.service";
import ImageUploader, { type ImageValue } from "@/components/admin/ImageUploader";

const initialState: UpdateSettingsResult = { success: false };

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none";

export default function SettingsForm({
  settings,
}: {
  settings: StoreSettingsDTO;
}) {
  const [state, setState] = useState<UpdateSettingsResult>(initialState);
  const [pending, startTransition] = useTransition();
  const [testing, setTesting] = useState(false);
  const [testingWa, setTestingWa] = useState(false);
  const [navbarLogo, setNavbarLogo] = useState<ImageValue>({ url: settings.navbarLogoUrl ?? "", publicId: null });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateStoreSettingsAction(initialState, formData);
      setState(result);
      if (result.success) {
        toast.success(result.message ?? "Settings saved.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
      suppressHydrationWarning
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="navbarTitle" className="mb-2 block font-medium">
            Navbar Title <span className="text-sm font-normal text-gray-500">(optional)</span>
          </label>
          <input id="navbarTitle" name="navbarTitle" defaultValue={settings.navbarTitle} className={inputClass} placeholder="Danish Perfumes" />
          {state.errors?.navbarTitle && <p className="mt-1 text-sm text-red-600">{state.errors.navbarTitle}</p>}
        </div>
        <div>
          <label htmlFor="storeName" className="mb-2 block font-medium">
            Store Name <span className="text-red-500">*</span>
          </label>
          <input
            id="storeName"
            name="storeName"
            required
            defaultValue={settings.storeName}
            className={inputClass}
          />
          {state.errors?.storeName && (
            <p className="mt-1 text-sm text-red-600">{state.errors.storeName}</p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="mb-2 block font-medium">
            Currency <span className="text-red-500">*</span>
          </label>
          <input
            id="currency"
            name="currency"
            required
            defaultValue={settings.currency}
            className={inputClass}
            placeholder="INR"
          />
          {state.errors?.currency && (
            <p className="mt-1 text-sm text-red-600">{state.errors.currency}</p>
          )}
        </div>

        <div>
          <label htmlFor="supportEmail" className="mb-2 block font-medium">
            Support Email <span className="text-red-500">*</span>
          </label>
          <input
            id="supportEmail"
            name="supportEmail"
            type="email"
            required
            defaultValue={settings.supportEmail}
            className={inputClass}
          />
          {state.errors?.supportEmail && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.supportEmail}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="supportPhone" className="mb-2 block font-medium">
            Support Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="supportPhone"
            name="supportPhone"
            type="tel"
            required
            defaultValue={settings.supportPhone}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
          {state.errors?.supportPhone && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.supportPhone}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="mb-2 block font-medium">
            Store Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={settings.address}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="freeShippingThreshold" className="mb-2 block font-medium">
            Free Shipping Threshold <span className="text-red-500">*</span>
          </label>
          <input
            id="freeShippingThreshold"
            name="freeShippingThreshold"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={settings.freeShippingThreshold}
            className={inputClass}
          />
          {state.errors?.freeShippingThreshold && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.freeShippingThreshold}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="shippingFee" className="mb-2 block font-medium">
            Shipping Fee <span className="text-red-500">*</span>
          </label>
          <input
            id="shippingFee"
            name="shippingFee"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={settings.shippingFee}
            className={inputClass}
          />
          {state.errors?.shippingFee && (
            <p className="mt-1 text-sm text-red-600">{state.errors.shippingFee}</p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <ImageUploader value={navbarLogo} onChange={setNavbarLogo} label="Navbar Logo (optional)" />
        <input type="hidden" name="navbarLogoUrl" value={navbarLogo.url} />
        <p className="mt-2 text-xs text-gray-500">Upload a logo, or leave empty to show the navbar title as text.</p>
      </div>

      {state.message && (
        <p
          className={`mt-4 text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-black px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-base font-semibold text-[#174A63]">
          Order Notifications & Alerts
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Whenever a customer places an order successfully (Cash on Delivery or Razorpay), Nodemailer sends an instant email alert containing all customer details and complete order items.
        </p>

        {/* Email Setup Card */}
        <div className="mt-4 rounded-2xl border border-sky-200/80 bg-sky-50/50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span className="font-semibold text-[#174A63]">Email Notifications (Nodemailer)</span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Alerts are delivered to Support Email: <strong className="text-black">{settings.supportEmail}</strong>
              </p>
            </div>
            <button
              type="button"
              disabled={testing}
              onClick={() => {
                setTesting(true);
                startTransition(async () => {
                  try {
                    const result = await sendTestEmailAction();
                    if (result.success) {
                      toast.success(result.message);
                    } else {
                      toast.error(result.message, { duration: 9000 });
                    }
                  } finally {
                    setTesting(false);
                  }
                });
              }}
              className="rounded-xl border border-[#174A63] bg-white px-5 py-2.5 text-xs font-semibold text-[#174A63] shadow-sm transition hover:bg-[#174A63] hover:text-white disabled:opacity-50"
            >
              {testing ? "Testing connection..." : "Send Test Order Alert"}
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3.5 text-xs text-gray-600">
            <p className="font-semibold text-gray-800">💡 Gmail SMTP Quick Setup in <code>.env</code>:</p>
            <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-gray-600">
              <li>
                Turn on <strong>2-Step Verification</strong> on your Google Account:{" "}
                <a
                  href="https://myaccount.google.com/signinoptions/two-step-verification"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-sky-700 underline"
                >
                  Google 2-Step Verification
                </a>
              </li>
              <li>
                Generate a 16-letter App Password at:{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-sky-700 underline"
                >
                  myaccount.google.com/apppasswords
                </a>
              </li>
              <li>
                In your <code>.env</code> file, set:
                <div className="mt-1 rounded bg-gray-900 p-2 font-mono text-[11px] text-gray-200">
                  SMTP_HOST=smtp.gmail.com<br />
                  SMTP_PORT=465<br />
                  SMTP_SECURE=true<br />
                  SMTP_USER={settings.supportEmail || "your-email@gmail.com"}<br />
                  SMTP_PASS=your-16-char-app-password<br />
                  ADMIN_NOTIFICATION_EMAIL={settings.supportEmail || "your-email@gmail.com"}
                </div>
              </li>
              <li>Restart your development server (<code>npm run dev</code>) and click the test button above.</li>
            </ol>
          </div>
        </div>

        {/* WhatsApp Setup Card */}
        <div className="mt-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="font-semibold text-emerald-950">WhatsApp Order Alerts</span>
              </div>
              <p className="mt-1 text-xs text-emerald-800">
                Sends automated WhatsApp messages to your mobile phone via CallMeBot.
              </p>
            </div>
            <button
              type="button"
              disabled={testingWa}
              onClick={() => {
                setTestingWa(true);
                startTransition(async () => {
                  try {
                    const result = await sendTestWhatsappAction();
                    if (result.success) {
                      toast.success(result.message);
                    } else {
                      toast.error(result.message, { duration: 9000 });
                    }
                  } finally {
                    setTestingWa(false);
                  }
                });
              }}
              className="rounded-xl border border-emerald-700 bg-white px-5 py-2.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-700 hover:text-white disabled:opacity-50"
            >
              {testingWa ? "Sending..." : "Send Test WhatsApp"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
