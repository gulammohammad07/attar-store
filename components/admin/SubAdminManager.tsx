"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSubAdminAction, updateUserRoleAction, deleteUserAction } from "@/lib/actions/sub-admin.actions";
import type { SubAdminActionState } from "@/lib/actions/sub-admin.actions";
import { Shield, Trash2, UserPlus } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface SubAdminManagerProps {
  users: AdminUser[];
  currentUserRole?: string;
}

const initialState: SubAdminActionState = { success: false };

export default function SubAdminManager({ users, currentUserRole }: SubAdminManagerProps) {
  const [pending, startTransition] = useTransition();
  const [localUsers, setLocalUsers] = useState(users);
  const router = useRouter();
  const isAdmin = currentUserRole === "ADMIN";
  const teamMembers = localUsers.filter((user) => user.role !== "USER");
  const registeredUsers = localUsers.filter((user) => user.role === "USER");

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      const result = await createSubAdminAction(initialState, formData);
      if (result.success) {
        toast.success(result.message ?? "Sub-admin created.");
        if (result.user) {
          setLocalUsers((previousUsers) => [result.user!, ...previousUsers]);
        }
        router.refresh();
      } else {
        toast.error(
          result.message ??
            (Object.values(result.errors ?? {}).filter(Boolean).join(" ") ||
              "Failed to create sub-admin."),
        );
      }
    });
  };

  const handleRoleChange = (userId: string, role: string) => {
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, role);
      if (result.success) {
        toast.success(result.message ?? "Role updated.");
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role } : u)),
        );
      } else {
        toast.error(result.message ?? "Failed to update role.");
      }
    });
  };

  const handleDelete = (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.success) {
        toast.success(result.message ?? "User removed.");
        setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        toast.error(result.message ?? "Failed to remove user.");
      }
    });
  };

  const renderUsersTable = (tableUsers: AdminUser[], emptyMessage: string) => (
    <div className="overflow-hidden rounded-xl border border-[#174a63]/10">
      <table className="w-full">
        <thead className="bg-[#f8fcfe]">
          <tr>
            <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Name</th>
            <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Email</th>
            <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Role</th>
            <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-[#174a63]/60">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tableUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-sm text-[#174a63]/50">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            tableUsers.map((user) => (
              <tr key={user.id} className="border-t border-[#174a63]/10 hover:bg-[#f8fcfe]">
                <td className="p-4 text-sm font-medium text-[#174a63]">{user.name}</td>
                <td className="p-4 text-sm text-[#174a63]/70">{user.email}</td>
                <td className="p-4">
                  {isAdmin ? (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="rounded-lg border border-[#174a63]/15 bg-white px-3 py-2 text-sm text-[#174a63] focus:border-gold focus:outline-none"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUBADMIN">Sub Admin</option>
                      <option value="USER">User</option>
                    </select>
                  ) : (
                    <span className="text-sm text-[#174a63]/70">{user.role}</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="rounded-2xl border border-[#174a63]/10 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="text-gold" size={22} />
        <div>
          <h2 className="text-2xl font-semibold text-[#174a63]">Team Access</h2>
          <p className="text-sm text-[#174a63]/60">
            View users and assign their access level.
          </p>
        </div>
      </div>

      {isAdmin && (
        <form action={handleCreate} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#174a63]">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-[#174a63]/15 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            placeholder="Sub-admin name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#174a63]">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-[#174a63]/15 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#174a63]">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-[#174a63]/15 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            placeholder="Min 6 characters"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#174a63] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold disabled:opacity-50"
          >
            <UserPlus size={16} />
            Add Sub-Admin
          </button>
        </div>
      </form>
      )}

      <div className="space-y-8">
        <section>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-[#174a63]">Admins &amp; Sub-admins</h3>
            <p className="text-sm text-[#174a63]/60">Users who can access the admin panel.</p>
          </div>
          {renderUsersTable(teamMembers, "No admins or sub-admins found.")}
        </section>

        {isAdmin && (
          <section>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-[#174a63]">Registered Users</h3>
              <p className="text-sm text-[#174a63]/60">Change a user’s role here to grant admin access.</p>
            </div>
            {renderUsersTable(registeredUsers, "No registered users found.")}
          </section>
        )}
      </div>
    </div>
  );
}
