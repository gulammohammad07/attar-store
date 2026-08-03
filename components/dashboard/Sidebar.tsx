import Link from "next/link";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Brands", href: "/admin/brands" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Attar Admin</h2>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 hover:bg-zinc-800 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
