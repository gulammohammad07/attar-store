"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, Package, ShoppingCart, Settings, Store, Image as ImageIcon, Gift, LogOut, X, Tags, Users, Ticket, ExternalLink } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth.actions";
import { useAuth } from "@/lib/store/auth-context";
import { toast } from "sonner";

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
    title: "Brands",
    href: "/admin/brands",
    icon: Tags,
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
  { title: "Coupons", href: "/admin/coupons", icon: Ticket },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

type SidebarProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { user, refresh } = useAuth();

  const handleSignOut = async () => {
    const result = await signOutAction();
    toast.success(result.message);
    await refresh();
    window.location.href = "/";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-72 sm:w-64 transform bg-[#0a0a0a] text-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-fit lg:self-start lg:translate-x-0 max-h-screen overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
              <Store size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Danish Perfumes</h1>
              <p className="text-xs text-zinc-400">Admin Dashboard</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={20} />
            <span className="font-medium">Open Storefront</span>
          </Link>
        </div>

        <div className="border-t border-white/10 p-6">
          <p className="text-xs text-zinc-400">Logged in as</p>

          <h3 className="font-semibold">{user?.name ?? "Admin"}</h3>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
