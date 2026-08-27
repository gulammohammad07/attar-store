"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import {
  Check,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import ProductViewer from "@/components/product/ProductViewer";
import NotesPyramid from "@/components/product/NotesPyramid";
import ProductReviews from "@/components/product/ProductReviews";
import ProductCarousel from "@/components/product/ProductCarousel";

const tabs = ["Description", "Fragrance Notes", "Reviews", "Shipping"] as const;

export default function ProductDetails({
  product,
  related,
  allProducts,
}: {
  product: Product;
  related: Product[];
  allProducts: Product[];
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0]?.size || product.volume || "",
  );
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(
    "Description",
  );
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const wished = isWishlisted(product.id);
  const price = useMemo(() => {
    if (selectedSize && product.sizes) {
      const sizeItem = product.sizes.find((s) => s.size === selectedSize);
      if (sizeItem) return sizeItem.price;
    }
    return product.salePrice ?? product.price;
  }, [selectedSize, product.sizes, product.salePrice, product.price]);

  const displayPrice = selectedSize
    ? price
    : product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const stockPercent = Math.min(100, Math.round((product.stock / 30) * 100));
  const lowStock = product.stock <= 6;

  // Recently viewed (syncs from localStorage — external store)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("md-recent") || "[]");
      const list = [product.id, ...stored.filter((id: string) => id !== product.id)]
        .slice(0, 8);
      localStorage.setItem("md-recent", JSON.stringify(list));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentlyViewed(
        list
          .map((id: string) => allProducts.find((p) => p.id === id))
          .filter(Boolean) as Product[],
      );
    } catch {
      // ignore
    }
  }, [product.id, allProducts]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleAddToCart = () => {
    const size = selectedSize || product.volume;
    addToCart(product, quantity, size);
    toast.success(`${product.name} added to bag`);
  };

  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FCFE] pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-[#174A63]/45">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category.toLowerCase()}`}
            className="capitalize hover:text-gold"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#174A63]">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductViewer product={product} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
              {product.brand}
            </p>

            <h1 className="mt-3 font-display text-4xl font-medium text-[#174A63] sm:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-gold text-gold"
                        : "text-[#174A63]/20"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#174A63]">
                {product.rating}
              </span>
              <span className="text-sm text-[#174A63]/45">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-semibold text-[#174A63]">
                {formatPrice(price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-xl text-[#174A63]/35 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "font-medium",
                    lowStock ? "text-red-600" : "text-green-700",
                  )}
                >
                  {lowStock ? (
                    <>
                      Only {product.stock} left in stock
                    </>
                  ) : (
                    "In stock — ready to ship"
                  )}
                </span>
                <span className="text-[#174A63]/40">{stockPercent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#174A63]/10">
                <div
                  className={cn(
                    "h-full rounded-full",
                    lowStock ? "bg-red-500" : "bg-green-600",
                  )}
                  style={{ width: `${stockPercent}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm leading-relaxed text-[#174A63]/65">
              {product.description}
            </p>

            {/* Meta chips */}
            <div className="mt-5 flex flex-wrap gap-2">
            {[
              product.volume,
              product.gender,
              product.category,
              ...product.occasions,
            ].map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="rounded-full border border-[#174A63]/15 px-3 py-1 text-xs text-[#174A63]/60"
              >
                {tag}
              </span>
            ))}
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="mb-2 block font-medium">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeItem) => (
                    <button
                      key={sizeItem.id}
                      type="button"
                      onClick={() => setSelectedSize(sizeItem.size)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedSize === sizeItem.size
                          ? "border-[#0f2838] bg-[#0f2838] text-white"
                          : "border-[#174A63]/20 bg-white text-[#174A63] hover:border-gold"
                      }`}
                    >
                      {sizeItem.size}
                      <span className="ml-2 text-xs opacity-70">
                        {formatPrice(sizeItem.price)}
                      </span>
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="mt-2 text-xs text-[#174A63]/50">Please select a size</p>
                )}
              </div>
            )}

            {/* Quantity + CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center justify-between rounded-full border border-[#174A63]/20 px-5 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="py-4 text-[#174A63]/60"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-[#174A63]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="py-4 text-[#174A63]/60"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#174A63] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
              >
                <ShoppingBag size={18} />
                Add to Bag — {formatPrice(displayPrice * quantity)}
              </button>
            </div>

            <div className="mt-3 flex gap-3">
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#174A63] py-3.5 text-sm font-semibold text-[#174A63] transition-colors hover:bg-[#174A63] hover:text-white"
              >
                <Zap size={16} />
                Buy Now
              </Link>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                  wished
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-[#174A63]/20 text-[#174A63]/60 hover:border-gold hover:text-gold",
                )}
              >
                <Heart size={18} fill={wished ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={share}
                aria-label="Share product"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#174A63]/20 text-[#174A63]/60 transition-colors hover:border-gold hover:text-gold"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#174A63]/10 bg-white p-4">
                <Truck size={18} className="text-gold" />
                <p className="mt-2 text-xs font-semibold text-[#174A63]">
                  Free Delivery
                </p>
                <p className="mt-0.5 text-[11px] text-[#174A63]/45">
                  Arrives by {deliveryDate}
                </p>
              </div>

              <div className="rounded-2xl border border-[#174A63]/10 bg-white p-4">
                <RefreshCcw size={18} className="text-gold" />
                <p className="mt-2 text-xs font-semibold text-[#174A63]">
                  NO Returns
                </p>
                <p className="mt-0.5 text-[11px] text-[#174A63]/45">
                  {/* 14-day return window */}
                </p>
              </div>

              <div className="rounded-2xl border border-[#174A63]/10 bg-white p-4">
                <Check size={18} className="text-gold" />
                <p className="mt-2 text-xs font-semibold text-[#174A63]">
                  Authentic
                </p>
                <p className="mt-0.5 text-[11px] text-[#174A63]/45">
                  Certified genuine
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex gap-8 overflow-x-auto border-b border-[#174A63]/15 [scrollbar-width:none]">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative whitespace-nowrap pb-4 text-sm font-semibold tracking-wide transition-colors",
                  activeTab === tab
                    ? "text-[#174A63]"
                    : "text-[#174A63]/40 hover:text-[#174A63]/70",
                )}
              >
                {tab}
                {tab === "Reviews" && (
                  <span className="ml-1 text-xs text-gold">
                    ({product.reviewCount})
                  </span>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-gold"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-10">
            {activeTab === "Description" && (
              <div className="max-w-3xl space-y-5">
                <p className="leading-relaxed text-[#174A63]/70">
                  {product.description}
                </p>
                <p className="leading-relaxed text-[#174A63]/70">
                  A{" "}
                  <span className="font-medium text-[#174A63]">
                    {product.category.toLowerCase()}
                  </span>{" "}
                  composition from {product.brand}, crafted for{" "}
                  {product.gender.toLowerCase()} with {product.volume} of
                  concentrated perfume oil. {product.category} attars are
                  alcohol-free and designed to sit close to the skin, revealing
                  new facets throughout the day.
                </p>
              </div>
            )}

            {activeTab === "Fragrance Notes" && (
              <div className="max-w-2xl">
                <NotesPyramid notes={product.notes} />
              </div>
            )}

            {activeTab === "Reviews" && (
              <ProductReviews product={product} />
            )}

            {activeTab === "Shipping" && (
              <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#174A63]/70">
                <p>
                  <span className="font-semibold text-[#174A63]">
                    Delivery:{" "}
                  </span>
                  Dispatched within 24 hours. Free standard shipping on orders
                  over ₹1,500; express delivery available at checkout.
                </p>
                <p>
                  <span className="font-semibold text-[#174A63]">Returns: </span>
                  Unopened items may be returned within 14 days for a full
                  refund.
                </p>
                <p>
                  <span className="font-semibold text-[#174A63]">
                    Gift Packaging:{" "}
                  </span>
                  Complimentary premium gift wrapping with every order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-10">
        <ProductCarousel
          eyebrow="Pairs Perfectly"
          title="You May Also Love"
          products={related}
        />
      </div>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <ProductCarousel
          eyebrow="Continue Browsing"
          title="Recently Viewed"
          products={recentlyViewed.slice(0, 6)}
        />
      )}
    </div>
  );
}
