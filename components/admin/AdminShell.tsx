"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, Package, ShoppingCart, FolderTree, Settings, Store, Image as ImageIcon, Gift } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth.actions";
import { useAuth } from "@/lib/store/auth-context";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Occasions",
    href: "/admin/occasions",
    icon: Gift,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refresh } = useAuth();

  const handleSignOut = async () => {
    const result = await signOutAction();
    toast.success(result.message);
    await refresh();
    router.push("/");
    router.refresh();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  return (
    <div className="flex min-h-screen bg-[#f8fcfe]">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-[#174a63]/10 bg-[#0f2838] text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
            <Store size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">Danish Perfumes</h1>
            <p className="text-xs text-zinc-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  active
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <p className="text-xs text-zinc-400">Logged in as</p>

          <h3 className="font-semibold">{user?.name ?? "Admin"}</h3>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#174a63]/10 bg-white px-8">
          <h2 className="text-2xl font-bold text-[#174a63]">Admin Panel</h2>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174a63] font-bold text-white">
              {initials}
            </div>

            <div>
              <p className="font-medium text-[#174a63]">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-[#174a63]/55">
                {user?.role === "ADMIN" ? "administrator" : "member"}
              </p>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
