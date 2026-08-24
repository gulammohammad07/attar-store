"use client";

import dynamic from "next/dynamic";
import type { StoreSettingsDTO } from "@/lib/services/settings.service";

const SettingsForm = dynamic(() => import("./SettingsForm"), {
  ssr: false,
  loading: () => (
    <div
      aria-busy="true"
      className="max-w-3xl rounded-2xl border bg-white p-6 shadow-sm"
    >
      Loading settings form…
    </div>
  ),
});

export default function SettingsFormClient({
  settings,
}: {
  settings: StoreSettingsDTO;
}) {
  return <SettingsForm settings={settings} />;
}
