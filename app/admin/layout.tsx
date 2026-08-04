"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Settings,
  Store,
  Image as ImageIcon,
} from "lucide-react";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 text-white flex flex-col border-r border-zinc-800">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
            <Store size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">MD Perfumes</h1>
            <p className="text-xs text-zinc-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
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
        <div className="border-t border-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Logged in as</p>

          <h3 className="font-semibold">Admin</h3>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-bold">
              A
            </div>

            <div>
              <p className="font-medium">Admin</p>
              <p className="text-xs text-gray-500">administrator</p>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
