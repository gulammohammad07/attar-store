import { getStoreSettings } from "@/lib/services/settings.service";
import { getAdminUsers } from "@/lib/actions/sub-admin.actions";
import { getCurrentUser } from "@/lib/auth/dal";
import SettingsForm from "@/components/admin/SettingsForm";
import SubAdminManager from "@/components/admin/SubAdminManager";

export default async function SettingsPage() {
  const settings = await getStoreSettings();
  const adminUsers = await getAdminUsers();
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your store details and shipping rules.
        </p>
      </div>

      <SettingsForm settings={settings} />

      <SubAdminManager users={adminUsers} currentUserRole={currentUser?.role} />
    </div>
  );
}
