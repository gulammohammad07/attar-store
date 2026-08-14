import { getStoreSettings } from "@/lib/services/settings.service";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your store details and shipping rules.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
