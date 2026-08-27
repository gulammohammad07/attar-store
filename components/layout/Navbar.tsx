"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Heart, Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useAuth } from "@/lib/store/auth-context";
import { signOutAction } from "@/lib/actions/auth.actions";
import { occasions } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import type { StorefrontCategory } from "@/lib/services/storefront-data";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

const SearchOverlay = dynamic(
  () => import("@/components/layout/SearchOverlay"),
  {
    ssr: false,
    loading: () => null,
  },
);

const menuItems = [
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/shop", mega: true },
  { label: "New Arrivals", href: "/shop?sort=newest" },
];

export default function Navbar({
  categories,
  featured,
  branding,
}: {
  categories: StorefrontCategory[];
  featured: Product[];
  branding: { title: string; logoUrl: string | null };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, isOpen: isCartOpen, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAdmin, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    const result = await signOutAction();
    toast.success(result.message);
    await refresh();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div
        className="sticky top-0 z-50"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <header
          className={`transition-all duration-700 ${
            scrolled
              ? "glass-premium shadow-[0_4px_30px_rgba(15,40,56,0.08)]"
              : "bg-white/80 backdrop-blur-xl"
          }`}
        >
          <div className="mx-auto flex h-20 items-center justify-between gap-3 px-4 sm:gap-8 sm:px-8 lg:max-w-7xl">
            <button
              type="button"
              className="text-[#0f2838] lg:hidden transition-colors hover:text-gold"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <Link
              href="/"
              className="shrink-0"
              onClick={() => setActiveMenu(null)}
            >
              {branding.logoUrl ? <Image src={branding.logoUrl} alt={branding.title} width={180} height={48} className="h-10 w-auto object-contain" priority /> : null}
            </Link>

            <nav className="hidden items-center gap-10 lg:flex">
              {menuItems.map((item) => (
                <div key={item.label} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() =>
                      setActiveMenu(item.mega ? item.label : null)
                    }
                    onClick={() => setActiveMenu(null)}
                    className={`relative text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-500 ${
                      activeMenu === item.label
                        ? "text-gold"
                        : "text-[#0f2838]/75 hover:text-gold"
                    }`}
                  >
                    {item.label}
                    {activeMenu === item.label && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-gold to-gold-light"
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2 text-[#0f2838] sm:gap-5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="transition-colors duration-300 hover:text-gold"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                prefetch={false}
                className="relative hidden transition-colors duration-300 hover:text-gold sm:block"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-[9px] font-bold text-[#0a1b26]"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative transition-colors duration-300 hover:text-gold"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-[9px] font-bold text-[#0a1b26]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  prefetch={false}
                  className="hidden transition-colors duration-300 hover:text-gold sm:block"
                  aria-label="Admin panel"
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                    Admin
                  </span>
                </Link>
              )}

              {user ? (
                <Link
                  href="/account"
                  prefetch={false}
                  className="hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-xs font-bold text-[#0a1b26] ring-1 ring-gold/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] sm:flex"
                  aria-label="Account"
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  prefetch={false}
                  className="hidden transition-colors duration-300 hover:text-gold sm:block"
                  aria-label="Sign in"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
          </div>
        </header>

        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden border-t border-gold/10 bg-white/95 shadow-2xl shadow-black/10 backdrop-blur-3xl lg:block"
              onMouseEnter={() => setActiveMenu("Collections")}
            >
              <div className="mx-auto max-w-7xl px-8 py-12">
                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-3">
                    <h3 className="mb-6 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Shop by Category
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop?category=${category.slug}`}
                          className="group"
                        >
                          <div className="relative h-24 overflow-hidden rounded-xl border border-[#e0ecf2] bg-[#f8fcfe] transition-all duration-500 group-hover:border-gold/30">
                            {category.imageUrl ? (
                              <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                sizes="120px"
                                className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-[#f0f7fb]">
                                <span className="font-display text-4xl text-[#0f2838]/20">
                                  {category.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/5 transition-opacity duration-500 group-hover:opacity-0" />
                          </div>
                          <p className="mt-2.5 text-sm font-medium text-[#0f2838]/80 transition-colors duration-300 group-hover:text-gold">
                            {category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <h3 className="mb-6 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Shop by Occasion
                    </h3>
                    <ul className="space-y-3.5">
                      {occasions.map((occasion) => (
                        <li key={occasion}>
                          <Link
                            href={`/shop?occasion=${occasion
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="text-sm text-[#0f2838]/70 transition-colors duration-300 hover:text-gold"
                          >
                            {occasion}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-5">
                    <h3 className="mb-6 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Featured
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {featured
                        .slice(0, 2)
                        .map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group flex items-center gap-4 rounded-2xl border border-[#e0ecf2] bg-white/80 p-3 transition-all duration-500 hover:border-gold/30 hover:bg-white"
                          >
                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f0f7fb]">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                            </div>
                            <div>
                              <p className="font-display text-base font-medium text-[#0f2838]">
                                {product.name}
                              </p>
                              <p className="mt-1.5 text-sm text-gold">
                                ₹{product.salePrice ?? product.price.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>

                    <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#c9a96e] via-[#e2cc9c] to-[#a8843f] p-6 shadow-lg">
                      <p className="font-display text-lg font-semibold text-[#0a1b26]">
                        Festive Edit — up to 30% off
                      </p>
                      <p className="mt-1.5 text-sm text-[#0a1b26]/70">
                        Limited edition ouds, now live.
                      </p>
                      <Link
                        href="/shop"
                        className="mt-4 inline-block rounded-full bg-[#0a1b26] px-5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:shadow-lg"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-white/[0.97] backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-20 items-center justify-between px-6">
                {branding.logoUrl ? <Image src={branding.logoUrl} alt={branding.title} width={160} height={48} className="h-10 w-auto object-contain" /> : null}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-[#0f2838] transition-colors duration-300 hover:text-gold"
                  aria-label="Close menu"
                >
                  <X size={26} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-10">
                <ul className="space-y-7">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-medium text-[#0f2838] transition-colors duration-300 hover:text-gold"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-12">
                  <h4 className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                    Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/shop?category=${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl border border-[#e0ecf2] bg-white p-4 text-center text-sm text-[#0f2838]/80 transition-all duration-300 hover:border-gold/40 hover:text-gold"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-5 text-[15px] text-[#5f7788]/60">
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="transition-colors duration-300 hover:text-gold">
                    Wishlist
                  </Link>

                  {user ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                        className="transition-colors duration-300 hover:text-gold"
                      >
                        Account {user.name ? `(${user.name.split(" ")[0]})` : ""}
                      </Link>
                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="text-gold"
                        >
                          Admin panel
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          void handleSignOut();
                        }}
                        className="flex items-center gap-2.5 text-left text-[#5f7788]/60 transition-colors duration-300 hover:text-gold"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileOpen(false)}
                        className="transition-colors duration-300 hover:text-gold"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileOpen(false)}
                        className="transition-colors duration-300 hover:text-gold"
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCartOpen && <CartDrawer />}
      {searchOpen && (
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
