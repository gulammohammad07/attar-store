"use client";

import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function LuxuryProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wished = isWishlisted(product.id);
  const price = product.salePrice ?? product.price;
  const images = product.gallery.length ? product.gallery : [product.image];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-[24px] bg-white shadow-[0_2px_14px_rgba(23,74,99,0.06)] transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-[0_32px_64px_-28px_rgba(23,74,99,0.35)]",
        className,
      )}
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#F4FAFD] via-[#E3F2F9] to-[#D9EAF3]">
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,201,160,0.35),transparent_70%)]" />

        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-5 top-5 z-10 rounded-full border border-gold/30 bg-white/70 px-3.5 py-1.5 text-[9px] font-bold tracking-[0.16em] text-gold uppercase shadow-sm backdrop-blur-md">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className={cn(
            "absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/75 shadow-[0_6px_18px_-6px_rgba(23,74,99,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-110",
            wished ? "text-red-500" : "text-[#174A63]/45 hover:text-red-500",
          )}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick add — desktop hover */}
        <button
          type="button"
          onClick={handleAdd}
          className="absolute inset-x-5 bottom-5 z-10 hidden translate-y-4 items-center justify-center gap-2 rounded-full bg-[#174A63]/85 px-5 py-3.5 text-xs font-semibold tracking-[0.14em] text-[#F8FCFE] uppercase opacity-0 backdrop-blur-md transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gold lg:flex"
        >
          <Plus size={14} />
          Quick Add
        </button>

        {/* Quick add — mobile */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#174A63] text-[#F8FCFE] shadow-lg transition-all hover:bg-gold lg:hidden"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="px-6 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
            {product.brand}
          </p>
          <span className="flex items-center gap-1.5">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-xs font-medium text-[#174A63]/80">
              {product.rating}
            </span>
            <span className="text-[10px] text-[#174A63]/35">
              ({product.reviewCount})
            </span>
          </span>
        </div>

        <Link href={`/product/${product.slug}`} className="mt-1.5 block">
          <h3 className="font-display text-[22px] font-semibold leading-snug text-[#174A63] transition-colors duration-300 group-hover:text-gold">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-lg font-semibold tracking-tight text-[#174A63]">
            {formatPrice(price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-[#174A63]/35 line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="ml-auto text-[10px] font-medium tracking-[0.14em] text-[#174A63]/35 uppercase">
            {product.volume}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
