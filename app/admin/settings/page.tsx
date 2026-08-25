import { getStoreSettings } from "@/lib/services/settings.service";
import { getAdminUsers } from "@/lib/actions/sub-admin.actions";
import { getCurrentUser } from "@/lib/auth/dal";
import SettingsFormClient from "@/components/admin/SettingsFormClient";
import SubAdminManager from "@/components/admin/SubAdminManager";

export default async function SettingsPage() {
  const settings = await getStoreSettings();
  const adminUsers = await getAdminUsers();
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Configure your store details and shipping rules.
        </p>
      </div>

      <SettingsFormClient settings={settings} />

      <SubAdminManager users={adminUsers} currentUserRole={currentUser?.role} />
    </div>
  );
}
