"use client";

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
import { notes, occasions } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import SearchOverlay from "@/components/layout/SearchOverlay";

const menuItems = [
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/shop", mega: true },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Gift Sets", href: "/shop?category=gourmand" },
  { label: "Our Story", href: "/#story" },
];

export default function Navbar({
  categories,
  featured,
}: {
  categories: StorefrontCategory[];
  featured: Product[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
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
          className={`transition-all duration-500 ${
            scrolled
              ? "glass-dark shadow-xl"
              : "bg-charcoal/80 backdrop-blur-md"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="text-[#f0ebe2] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="shrink-0"
              onClick={() => setActiveMenu(null)}
            >
              <span className="font-display text-2xl font-semibold tracking-[0.18em] text-[#f0ebe2]">
                MD<span className="text-gold"> PERFUMES</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 lg:flex">
              {menuItems.map((item) => (
                <div key={item.label} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() =>
                      setActiveMenu(item.mega ? item.label : null)
                    }
                    onClick={() => setActiveMenu(null)}
                    className={`relative text-[12px] font-medium tracking-[0.14em] uppercase transition-colors ${
                      activeMenu === item.label
                        ? "text-gold-light"
                        : "text-[#f0ebe2] hover:text-gold-light"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 text-[#f0ebe2] sm:gap-5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="transition-colors hover:text-gold-light"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <Link
                href="/wishlist"
                prefetch={false}
                className="relative hidden transition-colors hover:text-gold-light sm:block"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative transition-colors hover:text-gold-light"
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  prefetch={false}
                  className="hidden transition-colors hover:text-gold-light sm:block"
                  aria-label="Admin panel"
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    Admin
                  </span>
                </Link>
              )}

              {user ? (
                <Link
                  href="/account"
                  prefetch={false}
                  className="hidden h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold-light ring-1 ring-gold/30 transition-all hover:bg-gold/30 sm:flex"
                  aria-label="Account"
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  prefetch={false}
                  className="hidden transition-colors hover:text-gold-light sm:block"
                  aria-label="Sign in"
                >
                  <User size={19} />
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-x-0 top-full hidden border-t border-white/5 bg-[#0e0c0a] shadow-2xl lg:block"
              onMouseEnter={() => setActiveMenu("Collections")}
            >
              <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid grid-cols-12 gap-10">
                  {/* Categories */}
                  <div className="col-span-3">
                    <h3 className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Shop by Category
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop?category=${category.slug}`}
                          className="group"
                        >
                          <div className="relative h-24 overflow-hidden rounded-xl">
                            {category.imageUrl ? (
                              <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                sizes="120px"
                                className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-white/5">
                                <span className="font-display text-4xl text-[#f0ebe2]/25">
                                  {category.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/10" />
                          </div>
                          <p className="mt-2 text-sm font-medium text-[#f0ebe2] group-hover:text-gold-light">
                            {category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Occasions */}
                  <div className="col-span-2">
                    <h3 className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Shop by Occasion
                    </h3>
                    <ul className="space-y-3">
                      {occasions.map((occasion) => (
                        <li key={occasion}>
                          <Link
                            href={`/shop?occasion=${occasion
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="text-sm text-[#f0ebe2]/80 transition-colors hover:text-gold-light"
                          >
                            {occasion}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  <div className="col-span-2">
                    <h3 className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Shop by Notes
                    </h3>
                    <ul className="space-y-3">
                      {notes.slice(0, 10).map((note) => (
                        <li key={note}>
                          <Link
                            href={`/shop?note=${note.toLowerCase()}`}
                            className="text-sm text-[#f0ebe2]/80 transition-colors hover:text-gold-light"
                          >
                            {note}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Featured products */}
                  <div className="col-span-5">
                    <h3 className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      Featured
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {featured
                        .slice(0, 2)
                        .map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06]"
                          >
                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div>
                              <p className="font-display text-base font-medium text-[#f0ebe2]">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-gold">
                                ₹{product.salePrice ?? product.price.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>

                    {/* Promo banner */}
                    <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#b08d57] to-[#8a6b3d] p-5">
                      <p className="font-display text-lg font-semibold text-white">
                        Festive Edit — up to 30% off
                      </p>
                      <p className="mt-1 text-sm text-white/80">
                        Limited edition ouds, now live.
                      </p>
                      <Link
                        href="/shop"
                        className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#0e0c0a]"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-charcoal/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-display text-xl tracking-[0.18em] text-[#f0ebe2]">
                  MD PERFUMES
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-[#f0ebe2]"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <ul className="space-y-5">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-medium text-[#f0ebe2]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <h4 className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                    Categories
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/shop?category=${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl bg-white/5 p-3 text-center text-sm text-[#f0ebe2]"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 text-sm text-[#f0ebe2]/70">
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
                    Wishlist
                  </Link>

                  {user ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                      >
                        Account {user.name ? `(${user.name.split(" ")[0]})` : ""}
                      </Link>
                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="text-gold-light"
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
                        className="flex items-center gap-2 text-left text-[#f0ebe2]/70"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileOpen(false)}
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

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
